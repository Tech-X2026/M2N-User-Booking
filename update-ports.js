const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'reception', 'frontend', 'src');

function walk(directory) {
  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('http://localhost:6000')) {
        content = content.replace(/http:\/\/localhost:6000/g, 'http://localhost:6001');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated: ' + fullPath);
      }
    }
  });
}

walk(dir);
console.log('Done.');
