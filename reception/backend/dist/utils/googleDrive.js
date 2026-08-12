"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToDrive = void 0;
const googleapis_1 = require("googleapis");
const stream_1 = require("stream");
function formatPrivateKey(key) {
    if (!key)
        return '';
    let formatted = key.replace(/^"|^'|"$|'$/g, '').trim();
    const beginPattern = '-----BEGIN PRIVATE KEY-----';
    const endPattern = '-----END PRIVATE KEY-----';
    if (formatted.includes(beginPattern) && formatted.includes(endPattern)) {
        let coreKey = formatted.substring(formatted.indexOf(beginPattern) + beginPattern.length, formatted.indexOf(endPattern));
        // Strip everything that isn't a base64 character
        coreKey = coreKey.replace(/\\n/g, '');
        coreKey = coreKey.replace(/\\r/g, '');
        coreKey = coreKey.replace(/\\/g, '');
        coreKey = coreKey.replace(/\s+/g, '');
        return `${beginPattern}\n${coreKey}\n${endPattern}\n`;
    }
    return formatted.replace(/\\n/g, '\n');
}
const crypto_1 = __importDefault(require("crypto"));
function validateKeySync() {
    try {
        const pk = formatPrivateKey(process.env.GOOGLE_PRIVATE_KEY);
        if (!pk)
            return;
        // This will throw if the key is structurally invalid
        crypto_1.default.createPrivateKey(pk);
    }
    catch (err) {
        const raw = process.env.GOOGLE_PRIVATE_KEY || '';
        const formatted = formatPrivateKey(raw);
        console.error('CRITICAL: Private Key is invalid! Length:', formatted.length, 'Starts with:', formatted.substring(0, 30), 'Ends with:', formatted.substring(formatted.length - 30));
    }
}
validateKeySync();
if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    console.warn('Google Drive credentials missing. Uploads will fail.');
}
// Configure Google Auth
const auth = new googleapis_1.google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim(),
        private_key: formatPrivateKey(process.env.GOOGLE_PRIVATE_KEY),
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
});
const drive = googleapis_1.google.drive({ version: 'v3', auth });
/**
 * Ensures a folder exists inside a specific parent folder.
 * If it doesn't exist, it creates it.
 */
const ensureFolder = async (folderName, parentFolderId) => {
    // Check if folder exists
    const query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed=false`;
    try {
        const res = await drive.files.list({
            q: query,
            fields: 'files(id, name)',
            spaces: 'drive',
            corpora: 'allDrives',
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        });
        if (res.data.files && res.data.files.length > 0) {
            return res.data.files[0].id;
        }
        // Create the folder
        const folderMetadata = {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId],
        };
        const folder = await drive.files.create({
            requestBody: folderMetadata,
            fields: 'id',
            supportsAllDrives: true,
        });
        return folder.data.id;
    }
    catch (error) {
        console.error(`Error ensuring folder ${folderName}:`, error);
        throw error;
    }
};
/**
 * Uploads a file to Google Drive under the structure:
 * Root Folder -> Hotel Name -> Year -> Month -> Date
 * The file is renamed to the bookingId.
 */
const uploadToDrive = async (fileBuffer, mimeType, extension, bookingId, hotelName) => {
    try {
        if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            throw new Error('Google Drive credentials (EMAIL or PRIVATE_KEY) are missing in the server environment.');
        }
        // Test key validity at runtime to throw a descriptive error to frontend
        try {
            crypto_1.default.createPrivateKey(formatPrivateKey(process.env.GOOGLE_PRIVATE_KEY));
        }
        catch (keyError) {
            const raw = process.env.GOOGLE_PRIVATE_KEY || '';
            const formatted = formatPrivateKey(raw);
            throw new Error(`Google Private Key is malformed. Length: ${formatted.length}. Starts with: ${formatted.substring(0, 35)}... Please check Hostinger .env panel for typos or missing characters.`);
        }
        const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID?.trim();
        if (!rootFolderId) {
            throw new Error('GOOGLE_DRIVE_ROOT_FOLDER_ID is not set in environment variables');
        }
        const now = new Date();
        const yearStr = now.getFullYear().toString();
        const monthStr = now.toLocaleString('default', { month: 'long' }); // e.g., "August"
        const dateStr = now.getDate().toString();
        // Traverse and create folders
        const hotelFolderId = await ensureFolder(hotelName, rootFolderId);
        const yearFolderId = await ensureFolder(yearStr, hotelFolderId);
        const monthFolderId = await ensureFolder(monthStr, yearFolderId);
        const targetFolderId = await ensureFolder(dateStr, monthFolderId);
        // Prepare File
        const stream = new stream_1.Readable();
        stream.push(fileBuffer);
        stream.push(null);
        const fileName = `${bookingId}.${extension}`;
        const fileMetadata = {
            name: fileName,
            parents: [targetFolderId],
        };
        const media = {
            mimeType,
            body: stream,
        };
        const res = await drive.files.create({
            requestBody: fileMetadata,
            media,
            fields: 'id, webViewLink',
            supportsAllDrives: true,
        });
        // Make the file publicly readable
        await drive.permissions.create({
            fileId: res.data.id,
            supportsAllDrives: true,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });
        return res.data.webViewLink;
    }
    catch (error) {
        console.error('Error uploading to Google Drive:', error);
        throw error;
    }
};
exports.uploadToDrive = uploadToDrive;
