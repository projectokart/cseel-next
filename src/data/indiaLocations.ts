// Indian States & Districts Master Database
export const INDIAN_STATES_DISTRICTS: Record<string, string[]> = {
  'Haryana': [
    'Gurugram', 'Faridabad', 'Rewari', 'Rohtak', 'Panipat', 'Sonipat', 'Ambala', 'Karnal',
    'Hisar', 'Panchkula', 'Yamunanagar', 'Kurukshetra', 'Jhajjar', 'Bhiwani', 'Sirsa',
    'Palwal', 'Jind', 'Mahendragarh', 'Kaithal', 'Fatehabad', 'Charkhi Dadri', 'Nuh'
  ],
  'Delhi NCR': [
    'New Delhi', 'South Delhi', 'North Delhi', 'West Delhi', 'East Delhi', 'Central Delhi',
    'North West Delhi', 'South West Delhi', 'South East Delhi', 'Shahdara', 'North East Delhi'
  ],
  'Uttar Pradesh': [
    'Gautam Buddha Nagar (Noida)', 'Greater Noida', 'Ghaziabad', 'Lucknow', 'Kanpur Nagar',
    'Agra', 'Meerut', 'Varanasi', 'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad',
    'Saharanpur', 'Mathura', 'Ayodhya', 'Jhansi', 'Gorakhpur', 'Muzaffarnagar'
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Bikaner', 'Ajmer', 'Alwar', 'Bhilwara',
    'Sikar', 'Bharatpur', 'Pali', 'Sri Ganganagar', 'Jhunjhunu', 'Chittorgarh'
  ],
  'Punjab': [
    'Mohali (SAS Nagar)', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda',
    'Hoshiarpur', 'Pathankot', 'Moga', 'Firozpur'
  ],
  'Chandigarh': [
    'Chandigarh'
  ],
  'Maharashtra': [
    'Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Navi Mumbai',
    'Chhatrapati Sambhaji Nagar', 'Solapur', 'Kolhapur', 'Amravati'
  ],
  'Karnataka': [
    'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru',
    'Belagavi', 'Kalaburagi', 'Shivamogga', 'Tumakuru'
  ],
  'Telangana': [
    'Hyderabad', 'Secunderabad', 'Medchal-Malkajgiri', 'Rangareddy', 'Warangal', 'Sangareddy'
  ],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Gandhinagar', 'Jamnagar', 'Anand'
  ],
  'West Bengal': [
    'Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 'Hooghly', 'Darjeeling', 'Siliguri'
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar'
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia'
  ],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'
  ],
  'Kerala': [
    'Thiruvananthapuram', 'Kochi (Ernakulam)', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur'
  ],
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati', 'Kurnool'
  ],
  'Odisha': [
    'Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Puri', 'Balasore'
  ],
  'Assam': [
    'Guwahati (Kamrup)', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tezpur'
  ],
  'Jharkhand': [
    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh'
  ],
  'Chhattisgarh': [
    'Raipur', 'Bhilai / Durg', 'Bilaspur', 'Korba', 'Rajnandgaon'
  ],
  'Uttarakhand': [
    'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Nainital', 'Rishikesh'
  ],
  'Himachal Pradesh': [
    'Shimla', 'Dharamshala (Kangra)', 'Mandi', 'Solan', 'Kullu', 'Baddi'
  ],
  'Goa': [
    'North Goa (Panaji)', 'South Goa (Margao)'
  ],
  'Jammu and Kashmir': [
    'Jammu', 'Srinagar', 'Anantnag', 'Baramulla', 'Udhampur'
  ],
  'Ladakh': [
    'Leh', 'Kargil'
  ],
  'Tripura': [
    'Agartala'
  ],
  'Meghalaya': [
    'Shillong'
  ],
  'Manipur': [
    'Imphal'
  ],
  'Nagaland': [
    'Kohima', 'Dimapur'
  ],
  'Mizoram': [
    'Aizawl'
  ],
  'Arunachal Pradesh': [
    'Itanagar'
  ],
  'Sikkim': [
    'Gangtok'
  ],
  'Puducherry': [
    'Puducherry'
  ],
  'Andaman and Nicobar Islands': [
    'Port Blair'
  ]
};

export const INDIA_STATES_LIST: string[] = Object.keys(INDIAN_STATES_DISTRICTS);

export const CORE_TEACHING_SUBJECTS = [
  'Physics',
  'Chemistry',
  'Biology',
  'Mathematics',
  'Robotics & AI',
  'Computer Science',
  'General Science',
  'English',
  'Social Studies (SST)',
  'Hindi',
  'Commerce / Accountancy',
  'Economics',
  'Composite Lab / Hands-on STEM',
  'Other'
];
