export interface City {
  id: string;
  name: string;
  state: string;
  isPopular?: boolean;
}

export const popularCities: City[] = [
  { id: 'c1', name: 'Abu Dhabi', state: 'Abu Dhabi', isPopular: true },
  { id: 'c2', name: 'Ahmedabad', state: 'Gujarat', isPopular: true },
  { id: 'c3', name: 'Bengaluru', state: 'Karnataka', isPopular: true },
  { id: 'c4', name: 'Chandigarh', state: 'Chandigarh', isPopular: true },
  { id: 'c5', name: 'Chennai', state: 'Tamil Nadu', isPopular: true },
  { id: 'c6', name: 'Delhi NCR', state: 'Delhi', isPopular: true },
  { id: 'c7', name: 'Dubai', state: 'Dubai', isPopular: true },
  { id: 'c8', name: 'Goa', state: 'Goa', isPopular: true },
  { id: 'c9', name: 'Hyderabad', state: 'Telangana', isPopular: true },
  { id: 'c10', name: 'Kolkata', state: 'West Bengal', isPopular: true },
  { id: 'c11', name: 'Mumbai', state: 'Maharashtra', isPopular: true },
  { id: 'c12', name: 'Pune', state: 'Maharashtra', isPopular: true },
];

export const allCities: City[] = [
  ...popularCities,
  { id: 'a1', name: 'Abohar', state: 'Punjab' },
  { id: 'a2', name: 'Abu Road', state: 'Rajasthan' },
  { id: 'a3', name: 'Achampet', state: 'Telangana' },
  { id: 'a4', name: 'Acharapakkam', state: 'Tamil Nadu' },
  { id: 'a5', name: 'Addanki', state: 'Andhra Pradesh' },
  { id: 'a6', name: 'Adilabad', state: 'Telangana' },
  { id: 'a7', name: 'Adipur', state: 'Gujarat' },
  { id: 'b1', name: 'Bhopal', state: 'Madhya Pradesh' },
  { id: 'b2', name: 'Bhubaneswar', state: 'Odisha' },
  { id: 'c13', name: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 'd1', name: 'Dehradun', state: 'Uttarakhand' },
  { id: 'e1', name: 'Ernakulam', state: 'Kerala' },
  { id: 'f1', name: 'Faridabad', state: 'Haryana' },
  { id: 'g1', name: 'Gurgaon', state: 'Haryana' },
  { id: 'g2', name: 'Guwahati', state: 'Assam' },
  { id: 'h1', name: 'Hubli', state: 'Karnataka' },
  { id: 'i1', name: 'Indore', state: 'Madhya Pradesh' },
  { id: 'j1', name: 'Jaipur', state: 'Rajasthan' },
  { id: 'k1', name: 'Kanpur', state: 'Uttar Pradesh' },
  { id: 'k2', name: 'Kochi', state: 'Kerala' },
  { id: 'l1', name: 'Lucknow', state: 'Uttar Pradesh' },
  { id: 'm1', name: 'Madurai', state: 'Tamil Nadu' },
  { id: 'n1', name: 'Nagpur', state: 'Maharashtra' },
  { id: 'n2', name: 'Noida', state: 'Uttar Pradesh' },
  { id: 'p1', name: 'Patna', state: 'Bihar' },
  { id: 'r1', name: 'Rajkot', state: 'Gujarat' },
  { id: 's1', name: 'Surat', state: 'Gujarat' },
  { id: 't1', name: 'Trivandrum', state: 'Kerala' },
  { id: 'u1', name: 'Udaipur', state: 'Rajasthan' },
  { id: 'v1', name: 'Vadodara', state: 'Gujarat' },
  { id: 'v2', name: 'Varanasi', state: 'Uttar Pradesh' },
  { id: 'v3', name: 'Visakhapatnam', state: 'Andhra Pradesh' }
].sort((a, b) => a.name.localeCompare(b.name));
