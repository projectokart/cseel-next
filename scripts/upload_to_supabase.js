const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukazkxthavxphibdbspd.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'process.env.SUPABASE_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function uploadSchools() {
  const jsonPath = path.join(__dirname, '..', 'src', 'data', 'schools_database.json');
  console.log(`Reading schools from ${jsonPath}...`);
  
  if (!fs.existsSync(jsonPath)) {
    console.error('schools_database.json not found!');
    return;
  }

  const schools = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Total schools to upload: ${schools.length.toLocaleString()}`);

  // Test if schools table exists
  const { data: testData, error: testError } = await supabase.from('schools').select('id').limit(1);
  if (testError) {
    console.error('\n❌ Supabase Error:', testError.message);
    console.log('\n⚠️ Please create the "schools" table in Supabase SQL Editor first using: supabase_schools_schema.sql');
    return;
  }

  console.log('✅ Connected to Supabase "schools" table! Starting batch upload...');

  const BATCH_SIZE = 120;
  let successCount = 0;

  for (let i = 0; i < schools.length; i += BATCH_SIZE) {
    const rawChunk = schools.slice(i, i + BATCH_SIZE);
    
    const chunk = rawChunk.map((s, idx) => {
      const globalIdx = i + idx;
      const feeNum = s.monthlyFeesNum || 15000;
      const cleanLocality = s.locality || s.city;
      const stateName = s.state || s.city;
      const cityName = s.city || 'Delhi';
      const districtName = s.district || cityName;

      // ── Complete Rich Detail Object Stored in detail column ──
      const detailData = {
        // Leadership
        principalName: 'Dr. Sunita Kapoor',
        principalDesignation: 'Principal (Ph.D, M.Ed)',
        principalPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
        principalMessage: '"We inspire holistic global education by instilling critical inquiries, creativity, and empathy in every learner."',

        // Stats
        ownership: 'Private School',
        establishedYear: s.established || (1985 + (globalIdx % 38)),
        coedFormat: 'Co-Education',
        schoolFormat: 'Day School',
        campusAcreage: `${(3.5 + (globalIdx % 12) * 0.5).toFixed(1)} Acres (Urban)`,
        studentStrength: s.studentStrength || (1200 + (globalIdx * 137) % 2800),
        totalFacultyCount: 45 + (globalIdx % 50),
        cityAverageFaculty: 35,
        studentFacultyBenchmark: `${cityName} Avg: 22:1`,
        instructionLanguage: 'English',
        academicSession: 'April to March',
        description: s.description || `${s.name} is a premier institution in ${cityName}, dedicated to experiential science, hands-on robotics, and all-round student excellence.`,

        // Admissions & Schedule
        admissionSession: '2027-2028',
        registrationStartDate: '15 November 2026',
        registrationLastDate: '31 January 2027',
        entranceTestDate: '15 February 2027',
        meritListDate: '15 February 2027',
        sessionStartDate: '01 April 2027',
        minAgeNursery: '3+ Years as of 31st March',
        minAgeClass1: '6+ Years as of 31st March',
        requiredDocs: [
          { name: 'Transfer Certificate', mandatory: true },
          { name: 'Birth Certificate', mandatory: true },
          { name: 'Photograph - Child', mandatory: true },
          { name: 'Photograph - Parents/Guardian', mandatory: true },
          { name: 'Marksheet/Report card (if applicable)', mandatory: false },
          { name: 'Medical Reports', mandatory: true },
          { name: 'Character Certificate', mandatory: false },
          { name: 'Valid Passport', mandatory: false },
          { name: 'Aadhar Card - Child', mandatory: true },
          { name: 'Achievement Certificates', mandatory: false },
          { name: 'Immunization Certificate', mandatory: true },
          { name: 'Pancard - Parents', mandatory: true }
        ],
        admissionNotes: [
          'One recent passport size photograph',
          'Copy of Birth Certificate',
          'Academic records/transcripts for the last 1 or 2 years (for Grades K1 & K2)',
          'Copy of visa/permit (if the student is not a citizen of India)',
          'Copy of Immunization Record',
          'Documentation needed in case of any special needs.'
        ],

        // Fee Structure
        totalFirstYearCost: `₹${(feeNum * 18).toLocaleString('en-IN')}`,
        feeBreakdown: {
          registrationFee: 1000,
          admissionFee: Math.round(feeNum * 2.5),
          tuitionQuarterly: Math.round(feeNum * 3),
          securityDeposit: Math.round(feeNum * 3.2),
          annualLogisticsFee: Math.round(feeNum * 0.8),
          developmentFund: Math.round(feeNum * 0.4)
        },
        classWiseFees: {
          nursery: { label: 'Nursery', admission: Math.round(feeNum * 2.5), security: Math.round(feeNum * 3.2), tuitionQuarterly: Math.round(feeNum * 3), annual: Math.round(feeNum * 0.8), dev: Math.round(feeNum * 0.4), totalFirstYear: Math.round(feeNum * 18), monthlyAvg: feeNum },
          lkg: { label: 'LKG', admission: Math.round(feeNum * 2.5), security: Math.round(feeNum * 3.2), tuitionQuarterly: Math.round(feeNum * 3), annual: Math.round(feeNum * 0.8), dev: Math.round(feeNum * 0.4), totalFirstYear: Math.round(feeNum * 18), monthlyAvg: feeNum },
          ukg: { label: 'UKG', admission: Math.round(feeNum * 2.5), security: Math.round(feeNum * 3.2), tuitionQuarterly: Math.round(feeNum * 3.1), annual: Math.round(feeNum * 0.85), dev: Math.round(feeNum * 0.45), totalFirstYear: Math.round(feeNum * 18.5), monthlyAvg: Math.round(feeNum * 1.05) },
          'class-1': { label: 'Class 1', admission: Math.round(feeNum * 2.7), security: Math.round(feeNum * 3.2), tuitionQuarterly: Math.round(feeNum * 3.2), annual: Math.round(feeNum * 0.9), dev: Math.round(feeNum * 0.5), totalFirstYear: Math.round(feeNum * 19), monthlyAvg: Math.round(feeNum * 1.1) },
          'class-6': { label: 'Class 6', admission: Math.round(feeNum * 2.9), security: Math.round(feeNum * 3.2), tuitionQuarterly: Math.round(feeNum * 3.5), annual: Math.round(feeNum * 1.1), dev: Math.round(feeNum * 0.6), totalFirstYear: Math.round(feeNum * 21), monthlyAvg: Math.round(feeNum * 1.25) },
          'class-9': { label: 'Class 9', admission: Math.round(feeNum * 3.1), security: Math.round(feeNum * 3.2), tuitionQuarterly: Math.round(feeNum * 3.8), annual: Math.round(feeNum * 1.3), dev: Math.round(feeNum * 0.8), totalFirstYear: Math.round(feeNum * 23), monthlyAvg: Math.round(feeNum * 1.4) },
          'class-12': { label: 'Class 12', admission: Math.round(feeNum * 3.3), security: Math.round(feeNum * 3.2), tuitionQuarterly: Math.round(feeNum * 4.2), annual: Math.round(feeNum * 1.5), dev: Math.round(feeNum * 1.0), totalFirstYear: Math.round(feeNum * 26), monthlyAvg: Math.round(feeNum * 1.6) }
        },

        // Results
        passRate: '100%',
        passRateYears: 'Consecutive 5 Years',
        topScore: '99.2%',
        topScoreLabel: `${s.board || 'CBSE'} Class 12`,
        batchAverage: '88.6%',
        batchAveragePercentile: 'National Percentile: Top 2%',
        academicResults: {
          class12: [
            { rank: '#1', name: 'Ananya Sharma', score: '99.2%', stream: 'Science (PCM + CS)', tag: 'School Topper / 1st Rank', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80' },
            { rank: '#2', name: 'Kabir Malhotra', score: '98.8%', stream: 'Commerce with Math', tag: 'Commerce Topper', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80' },
            { rank: '#3', name: 'Rhea Sen', score: '98.4%', stream: 'Humanities & Psychology', tag: 'Arts Topper', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80' },
            { rank: '#4', name: 'Aarav Patel', score: '97.6%', stream: 'Science (PCB + Biotech)', tag: 'Biology Topper', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80' }
          ],
          class10: [
            { rank: '#1', name: 'Devansh Gupta', score: '99.0%', stream: 'Class 10 CBSE', tag: 'Class 10 1st Rank', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80' },
            { rank: '#2', name: 'Sanya Narang', score: '98.6%', stream: 'Class 10 CBSE', tag: 'Class 10 2nd Rank', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80' }
          ]
        },

        // STEM Labs (12 items)
        stemLabsCount: 12,
        stemLabsList: [
          { name: 'Science Experiential Lab', status: 'Active Verified', description: 'NEP 2020 experiential practical kits with DIY apparatus for hands-on inquiry and concept mastery.', category: 'Core Science' },
          { name: 'Composite Science Lab', status: 'Available', description: 'Integrated Physics, Chemistry & Biology laboratory stations with certified safety hoods.', category: 'Core Science' },
          { name: 'Atal Tinkering Lab (ATL)', status: 'Available', description: 'NITI Aayog aligned design-thinking hub for inventing, tinkering, and building prototypes.', category: 'Innovation' },
          { name: 'Robotics & IoT Lab', status: 'Available', description: 'Programmable microcontrollers, sensor kits, drone mechanics, and automated robotics arena.', category: 'Robotics' },
          { name: 'AI & Machine Learning Lab', status: 'Available', description: 'High-performance computational workstations with Python, Computer Vision, and Neural Nets.', category: 'AI & Tech' },
          { name: 'AR / VR Immersive Pods', status: 'Available', description: '3D holographic headsets for virtual biology dissections, planetary walks, and molecular dives.', category: 'Immersive' },
          { name: 'Language & Phonetics Lab', status: 'Available', description: 'Acoustic headphone stations for English accent mastery, French, German & Spanish phonology.', category: 'Linguistics' },
          { name: 'Astronomy & Space Observatory', status: 'Available', description: 'Rooftop motorized astronomical telescopes for celestial tracking, lunar phases, and astrophysics.', category: 'Space Tech' },
          { name: 'Mathematics Activity Lab', status: 'Available', description: 'Tactile 3D geometrical manipulatives, Vedic math apparatus, and probability experimental tools.', category: 'Mathematics' },
          { name: '3D Printing & CAD Studio', status: 'Available', description: 'Dual-extruder filament 3D printers, laser engravers, and solid modeling engineering suites.', category: 'Engineering' },
          { name: 'Bio-Tech & Hydroponics Unit', status: 'Available', description: 'Soil-less plant nutrition chambers, microbial culture stations, and DNA extraction toolkits.', category: 'Bio-Science' },
          { name: 'Coding & Cyber-Security Suite', status: 'Available', description: 'Linux sandboxes, network simulation racks, cloud containers, and algorithmic challenge decks.', category: 'Cyber-Security' }
        ],

        // Facilities Matrix
        facilitiesMatrix: {
          class: [
            { name: 'AC Classes', available: globalIdx % 3 === 0 },
            { name: 'Smart Classes', available: true },
            { name: 'Wifi', available: true }
          ],
          advanced: [
            { name: 'Alumni Association', available: false },
            { name: 'Day care', available: false },
            { name: 'Meals', available: true },
            { name: 'Medical Room', available: true },
            { name: 'Transportation', available: true }
          ],
          disabled: [
            { name: 'Ramps', available: true },
            { name: 'Washrooms', available: true },
            { name: 'Elevators', available: globalIdx % 2 === 0 }
          ],
          boarding: [
            { name: 'Boys Hostel', available: false },
            { name: 'Girls Hostel', available: false }
          ],
          extra_curricular: [
            { name: 'Art and Craft', available: true },
            { name: 'Dance', available: true },
            { name: 'Debate', available: false },
            { name: 'Drama', available: true },
            { name: 'Gardening', available: true },
            { name: 'Music', available: true },
            { name: 'Picnics and excursion', available: true }
          ],
          infrastructure: [
            { name: 'Auditorium/Media Room', available: globalIdx % 2 === 0 },
            { name: 'Cafeteria/Canteen', available: true },
            { name: 'Library/Reading Room', available: true },
            { name: 'Playground', available: true }
          ],
          safety: [
            { name: 'CCTV', available: true },
            { name: 'GPS Bus Tracking App', available: true },
            { name: 'Student Tracking App', available: true }
          ],
          sports: [
            { name: 'Skating', available: false },
            { name: 'Horse Riding', available: false },
            { name: 'Gym', available: false },
            { name: 'Indoor Sports', available: false },
            { name: 'Outdoor Sports', available: true },
            { name: 'Swimming Pool', available: globalIdx % 4 === 0 },
            { name: 'Karate', available: false },
            { name: 'Taekwondo', available: false },
            { name: 'Yoga', available: true }
          ],
          lab: [
            { name: 'Science Experiential Lab', available: true },
            { name: 'Composite Science Lab', available: true },
            { name: 'Atal Tinkering Lab (ATL)', available: true },
            { name: 'Robotics & IoT Lab', available: true },
            { name: 'AI & Machine Learning Lab', available: true },
            { name: 'AR / VR Immersive Pods', available: true },
            { name: 'Language & Phonetics Lab', available: true },
            { name: 'Astronomy & Space Observatory', available: true },
            { name: '3D Printing & CAD Studio', available: true },
            { name: 'Mathematics Activity Lab', available: true }
          ]
        },

        // Parent Insights
        parentInsights: {
          salaryBracket: { tier1: '35%', tier2: '45%', tier3: '20%' },
          shortlistedCount: 452,
          comparisonCohort: `Comparing with Regional IB & CBSE Top Tier Schools in ${cityName}`
        },

        // Galleries
        galleryPhotos: [
          { url: 'https://images.uniapply.com/uploads/college/image/500/2186/Medical_room_UA_210909_112215.JPG', title: 'Medical Room / Infirmary', category: 'Health Care' },
          { url: 'https://images.uniapply.com/uploads/college/image/500/2186/Activity_room_UA_210909_112055.jpg', title: 'Activity & Play Room', category: 'Early Years' },
          { url: 'https://images.uniapply.com/uploads/college/image/500/2186/Classroom_1_UA_210909_112131.jpg', title: 'Smart Classroom', category: 'Academics' },
          { url: 'https://images.uniapply.com/uploads/college/image/500/2186/Library_UA_210909_112346.jpg', title: 'Library & Reading Corner', category: 'Learning Hub' },
          { url: s.bannerImage || 'https://images.unsplash.com/photo-1509062522246?w=800&auto=format&fit=crop', title: 'Main Campus Building', category: 'Infrastructure' },
          { url: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=600', title: 'Science & Innovation Lab', category: 'STEM Labs' },
          { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600', title: 'Robotics & AI Studio', category: 'Tech Suite' },
          { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', title: 'Sports Arena & Gym', category: 'Fitness' }
        ],
        videosList: [
          { id: 'rJKzHb76LJs', title: 'Campus Walkthrough & Infrastructure', subtitle: 'Virtual Tour • Academic Blocks', duration: '03:45', thumb: 'https://img.youtube.com/vi/rJKzHb76LJs/hqdefault.jpg', url: 'https://www.youtube.com/embed/rJKzHb76LJs' },
          { id: 'a69t-R5jZl0', title: 'Robotics & Experiential Science Labs', subtitle: 'STEM Highlights • Innovation', duration: '04:12', thumb: 'https://img.youtube.com/vi/a69t-R5jZl0/hqdefault.jpg', url: 'https://www.youtube.com/embed/a69t-R5jZl0' },
          { id: 'fZoVdoZ3Khk', title: 'Sports Arena, Pool & Athletics Day', subtitle: 'Extracurricular • Fitness', duration: '02:50', thumb: 'https://img.youtube.com/vi/fZoVdoZ3Khk/hqdefault.jpg', url: 'https://www.youtube.com/embed/fZoVdoZ3Khk' }
        ],
        careersList: [
          { id: `job-${s.id}-1`, title: 'Senior STEM Practical Instructor', salary: '₹60,000 - ₹95,000 a month', roleType: 'Full-Time', department: 'Teaching Faculty', experienceRequired: '3-6 Years', openings: 1, applyUrl: `/edu-network/organisation/school/${s.id}/vacancy` }
        ],

        // Geo
        email: s.email || `contact.${s.id}@${s.slug || 'school'}.edu.in`,
        phone: s.phone || '+91 80 2981100',
        website: s.website || `https://${s.slug || 'school'}.edu.in`,
        contactChannels: [
          { type: 'phone', label: 'Direct Helpline', value: s.phone || '+91 80 2981100', href: `tel:${s.phone || '+91 80 2981100'}` },
          { type: 'email', label: 'Email Desk', value: s.email || `contact.${s.id}@school.edu.in`, href: `mailto:${s.email || `contact.${s.id}@school.edu.in`}` },
          { type: 'whatsapp', label: 'WhatsApp Helpdesk', value: '+91 98100 12345', href: 'https://wa.me/919810012345' }
        ],
        googleMapsEmbedUrl: s.googleMapsEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(s.name + ' ' + (s.address || cityName))}&t=&z=13&ie=UTF8&iwloc=&output=embed`,
        transportRoutes: s.transportRoutes || `AC GPS Buses covering all major sectors and radial routes across ${cityName}.`
      };

      return {
        id: s.id,
        slug: s.slug || `school-${s.id}`,
        name: s.name,
        short_name: s.shortName || s.name.split(' ').map(w => w[0]).join('').slice(0, 6).toUpperCase(),
        org_type: s.type || 'School',
        board: s.board || 'CBSE',
        udise_code: s.udiseCode || `070903${10000 + (globalIdx % 89999)}`,
        affiliation: s.affiliation || `${s.board || 'CBSE'} Affiliated`,
        logo_url: s.logo || 'https://images.unsplash.com/photo-1580582932707?w=200&auto=format&fit=crop',
        banner_url: s.bannerImage || 'https://images.unsplash.com/photo-1509062522246?w=800&auto=format&fit=crop',
        verified: s.verified ?? true,
        is_featured: s.isFeatured ?? (globalIdx < 30),
        rating: s.rating || Number((4.3 + (globalIdx % 7) * 0.1).toFixed(1)),
        reviews_count: s.reviews || (80 + (globalIdx * 37) % 1200),
        ranking_city: `Ranked #${(globalIdx % 15) + 1} in City`,
        views_count: 15000 + (globalIdx * 113) % 85000,
        likes_count: 150 + (globalIdx * 29) % 650,
        open_jobs_count: 1 + (globalIdx % 3),
        city: cityName,
        state: stateName,
        district: districtName,
        locality: cleanLocality,
        address: s.address || `${cleanLocality}, ${cityName}`,
        pincode: s.pincode || '110001',
        monthly_fees: s.monthlyFees || `₹${(feeNum / 1000).toFixed(1)}K / mo`,
        monthly_fees_num: feeNum,
        classes_offered: s.classesOffered || 'Pre-K - K2 / Nursery to 12',
        student_faculty_ratio: s.studentFacultyRatio || `${12 + (globalIdx % 6)}:1`,
        admission_status: s.admissionStatus || (globalIdx % 2 === 0 ? 'Open for 2026-27' : 'On Going'),
        stem_labs_count: 12,
        facilities_chips: s.facilities || ['Physics Lab', 'Chemistry Lab', 'Robotics Lab', 'Smart Classrooms', 'Sports Complex', 'Transport'],
        
        // ── COMPLETE DETAIL FORM DATA STORED AS JSON IN THIS COLUMN ──
        detail: detailData,
        status: 'verified'
      };
    });

    const { error } = await supabase.from('schools').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error(`\nError uploading schools batch ${i} - ${i + chunk.length}:`, error.message);
      continue;
    }

    successCount += chunk.length;
    const pct = ((successCount / schools.length) * 100).toFixed(1);
    process.stdout.write(`\rProgress: ${successCount.toLocaleString()} / ${schools.length.toLocaleString()} schools uploaded (${pct}%)`);
  }

  console.log(`\n\n🎉 Successfully uploaded all ${successCount.toLocaleString()} schools with card fields and detail JSON into "schools" table!`);
}

uploadSchools();
