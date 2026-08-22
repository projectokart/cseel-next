import { NextResponse } from 'next/server';

const CSV_DATA = `"Category","Account Name","Designation / Department","Portal Login URL","Login Email / Username","Password","Private Dashboard URL","Access Level / Scope"
"Admin Governance","Dr. Vikram Sharma","Super Administrator (Executive Board)","https://www.cseel.org/admin","superadmin@cseel.org","SuperAdmin@2026#CSEEL","https://www.cseel.org/admin","Full 10 Admin Modules + Audit Logs + User Management"
"Admin Governance","Pooja Kashyap","HR & Talent Acquisition Lead","https://www.cseel.org/admin","hr.careers@cseel.org","HrCareers@2026#CSEEL","https://www.cseel.org/admin","Careers CMS, Job Vacancies, Candidate Applications Pipeline"
"Admin Governance","Col. Rajesh Menon (Retd.)","Institutional Network Administrator","https://www.cseel.org/admin","schools.admin@cseel.org","SchoolAdmin@2026#CSEEL","https://www.cseel.org/admin","School Directory Verification, STEM Lab Audits, KYC Approval"
"Admin Governance","Dr. Anita Roy","Faculty Recruitment Specialist","https://www.cseel.org/admin","recruitment.jobs@cseel.org","RecruitAdmin@2026#CSEEL","https://www.cseel.org/admin","Teacher Recruitment, Degree Verification, 72h Flash Job Seekers"
"Admin Governance","Prof. S. N. Bose","Virtual Lab & Simulation Lead","https://www.cseel.org/admin","science.labs@cseel.org","ScienceLab@2026#CSEEL","https://www.cseel.org/admin","Physics/Chemistry/Biology Simulations & Experiment Practical Manuals"
"Admin Governance","Karan Mehra","Projectokart Inventions Manager","https://www.cseel.org/admin","projectokart@cseel.org","ProjectoKart@2026#CSEEL","https://www.cseel.org/admin","Science Fair Hardware Kits, CAD Schematics, Student Awards"
"Admin Governance","Sunil Aggarwal","Lab Materials & Supply Chain Lead","https://www.cseel.org/admin","inventory.stock@cseel.org","InventoryStock@2026#CSEEL","https://www.cseel.org/admin","STEM Lab Inventory, Equipment Pricing, Bulk School Order Fulfillment"
"Admin Governance","Dr. Meenakshi Sundaram","Conclaves, Seminars & Events Head","https://www.cseel.org/admin","programs.events@cseel.org","Programs@2026#CSEEL","https://www.cseel.org/admin","National Science Conclaves, Live Webinars, Teacher Training Bootcamps"
"Admin Governance","Dr. A. P. J. Vardhan","R&D & Research Director","https://www.cseel.org/admin","rnd.research@cseel.org","RndResearch@2026#CSEEL","https://www.cseel.org/admin","Experimental Pedagogical Whitepapers, Patent-Pending Prototypes"
"Admin Governance","Rohit Singhal","Web Platform & Content Editor","https://www.cseel.org/admin","content.cms@cseel.org","ContentCMS@2026#CSEEL","https://www.cseel.org/admin","Homepage Announcements, Promotional Banners, Blog Publishing"
"School Organisation","Delhi Public School, R.K. Puram","School Principal & Academic Admin","https://www.cseel.org/login","principal@dpsrkp.cseel.org","School@DpsRkp2026","https://www.cseel.org/org","104 Verified STEM Labs, Student Classes & School Management"
"School Organisation","National Public School, Indiranagar","Head of Institution & Lab Director","https://www.cseel.org/login","admin@npsindiranagar.cseel.org","School@NpsBlr2026","https://www.cseel.org/org","Composite Labs Verified, Faculty Postings & Institutional Reports"
"School Organisation","The Cathedral and John Connon School","Dean of Academics & STEM Centre","https://www.cseel.org/login","director@cathedral.cseel.org","School@Cathedral2026","https://www.cseel.org/org","Verified ATL Tinkering Hub & Curriculum Governance"
"School Organisation","SAI International School, Bhubaneswar","Vice Chairman & Administration","https://www.cseel.org/login","admin@saiinternational.cseel.org","School@SaiOdisha2026","https://www.cseel.org/org","Top Day-Cum-Boarding STEM Infrastructure & Student Monitoring"
"Teacher Faculty","Dr. Ramesh K. Mukherjee","Senior Physics PGT Faculty (NPS Bengaluru)","https://www.cseel.org/login","ramesh.mukherjee@faculty.cseel.org","Faculty@Ramesh2026","https://www.cseel.org/teacher","Teacher Assignment Tracker, Virtual Lab Grading, 72h Flash Seeker"
"Teacher Faculty","Sunita Deshmukh","Chemistry HOD & ATL Lead (Cathedral Mumbai)","https://www.cseel.org/login","sunita.deshmukh@faculty.cseel.org","Faculty@Sunita2026","https://www.cseel.org/teacher","Chemistry Lab Creator, Class Progress & NEP 2020 Certification"
"Teacher Faculty","Vipin Narang","Robotics & CS PGT (DPS R.K. Puram)","https://www.cseel.org/login","vipin.narang@faculty.cseel.org","Faculty@Vipin2026","https://www.cseel.org/teacher","AI & Microcontroller Modules, Student Robotics Mentorship"
"Teacher Faculty","Priyanka Sen","Biology TGT Specialist (SAI International)","https://www.cseel.org/login","priyanka.sen@faculty.cseel.org","Faculty@Priyanka2026","https://www.cseel.org/teacher","Bio Lab Practical Sessions, Student Cytology & Microscopy Tasks"
"Student Innovator","Aarav Sharma","Student Innovator (Class 10 - DPS R.K. Puram)","https://www.cseel.org/login","aarav.sharma@student.cseel.org","Student@Aarav2026","https://www.cseel.org/student","Interactive Virtual Labs, Physics Simulations, Class Assignments"
"Student Innovator","Ananya Iyer","Student Innovator (Class 11 PCB - Mother's Intl)","https://www.cseel.org/login","ananya.iyer@student.cseel.org","Student@Ananya2026","https://www.cseel.org/student","24 Virtual Labs Completed, Biotechnology & Chemistry Experiments"
"Student Innovator","Rohan Patel","Student Innovator (Class 12 PCM - NPS Bengaluru)","https://www.cseel.org/login","rohan.patel@student.cseel.org","Student@Rohan2026","https://www.cseel.org/student","Solar IoT Dual-Axis Prototype, Advanced Electromagnetism Simulations"
"Student Innovator","Diya Mukherjee","Student Innovator (Class 9 - Bombay Scottish)","https://www.cseel.org/login","diya.mukherjee@student.cseel.org","Student@Diya2026","https://www.cseel.org/student","Smart Hydroponics Science Fair Projects, Biology Observations"
"General Learner","Rahul Verma","Independent Science Learner & Maker","https://www.cseel.org/login","rahul.learner@cseel.org","User@Rahul2026","https://www.cseel.org/user","Projectokart Maker Projects, Public Simulations, Portfolio"
"Projectokart Platform","Projectokart Admin","Hardware Leads & Quotations Manager","https://projectokart.com/login","admin@projectokart.com","ProjectoKart@2026#CSEEL","https://projectokart.com/admin","Institutional Leads Pipeline, ATL Quotations & Hardware Orders"
"Projectokart Platform","School Partner","School Partner Lab Consultation","https://projectokart.com/login","principal@school.edu.in","School@Partner2026","https://projectokart.com/dashboard","Custom Kit Customizer, Order Status & Track Delivery"
`;

export async function GET() {
  return new NextResponse(CSV_DATA, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="CSEEL_and_Projectokart_Credentials.csv"',
    },
  });
}
