-- ============================================================================
-- CSEEL PLATFORM: SUPABASE INITIAL SEED DATA
-- ============================================================================
-- Optional: Run this in Supabase SQL Editor after running schema.sql to populate tables.

-- 1. Insert Initial Organisations / Schools
INSERT INTO public.organisations (name, slug, city, state, address, pincode, affiliation, stem_labs_count, rating, reviews_count)
VALUES 
('Delhi Public School, R.K. Puram', 'delhi-public-school-rk-puram-new-delhi', 'New Delhi', 'Delhi', 'Sector XII, R.K. Puram', '110022', 'CBSE / STEM Certified', 4, 4.9, 128),
('National Public School, Indiranagar', 'national-public-school-indiranagar-bengaluru', 'Bengaluru', 'Karnataka', '12th Main Road, HAL 2nd Stage', '560008', 'CBSE / Atal Tinkering Lab', 3, 4.8, 94),
('The Cathedral & John Connon School', 'the-cathedral-john-connon-school-mumbai', 'Mumbai', 'Maharashtra', '6, Purshottamdas Thakurdas Marg, Fort', '400001', 'ICSE / Robotics Hub', 5, 4.9, 156),
('SAI International School', 'sai-international-school-bhubaneswar', 'Bhubaneswar', 'Odisha', 'Plot-5A, Infocity Avenue, Chandrasekharpur', '751024', 'CBSE / NEP STEM Center', 4, 4.9, 112)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Initial Teachers / Faculty
INSERT INTO public.teachers (name, slug, subject, qualification, experience_years, current_institute, city, state, pincode, expected_salary, rating, reviews_count)
VALUES 
('Dr. Ramesh Chandra Panda', 'dr-ramesh-chandra-panda-physics-delhi', 'Physics & Electronics', 'Ph.D. in Applied Physics (IIT Delhi)', 14, 'Delhi Public School', 'New Delhi', 'Delhi', '110022', '₹75,000 - ₹95,000/mo', 4.9, 87),
('Mrs. Sunita Patnaik', 'mrs-sunita-patnaik-biology-hyderabad', 'Biology & Biotechnology', 'M.Sc. Life Sciences (Utkal University)', 11, 'SAI International School', 'Bhubaneswar', 'Odisha', '751024', '₹60,000 - ₹80,000/mo', 4.8, 64),
('Mr. Vipin Sharma', 'mr-vipin-sharma-robotics-bengaluru', 'Robotics & Embedded Systems', 'M.Tech Embedded Systems (BITS Pilani)', 8, 'National Public School', 'Bengaluru', 'Karnataka', '560008', '₹85,000 - ₹1,10,000/mo', 4.9, 92),
('Dr. Priyanka Sengupta', 'dr-priyanka-sengupta-chemistry-kolkata', 'Chemistry & Material Science', 'Ph.D. Chemistry (Jadavpur University)', 12, 'The Cathedral School', 'Mumbai', 'Maharashtra', '400001', '₹70,000 - ₹90,000/mo', 4.7, 53)
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Initial Students
INSERT INTO public.students (name, slug, grade, school, city, state, projects_count, badges, rank)
VALUES 
('Aarav Sharma', 'aarav-sharma-noida', 'Grade 11 (PCM)', 'Delhi Public School, R.K. Puram', 'Noida', 'Uttar Pradesh', 8, ARRAY['Smart Irrigation IoT', 'Autonomous Rover', 'Clean Water Sensor'], 1),
('Ananya Mohapatra', 'ananya-mohapatra-hyderabad', 'Grade 12 (PCB)', 'SAI International School', 'Bhubaneswar', 'Odisha', 6, ARRAY['Plant Disease AI Detector', 'Bio-Plastic Synthesizer'], 2),
('Rohan Gupta', 'rohan-gupta-dehradun', 'Grade 10', 'National Public School', 'Bengaluru', 'Karnataka', 5, ARRAY['Solar Tracking Drone', 'Home Automation'], 3),
('Diya Mukherjee', 'diya-mukherjee-bhubaneswar', 'Grade 11 (Robotics)', 'The Cathedral & John Connon School', 'Mumbai', 'Maharashtra', 7, ARRAY['Bionic Prosthetic Hand', 'Obstacle Avoidance Robot'], 4)
ON CONFLICT (slug) DO NOTHING;

-- 4. Insert Initial Science Materials & Hardware
INSERT INTO public.materials (name, slug, category, sku, description, unit_price, stock_quantity, min_order_qty)
VALUES 
('Microcontroller Development Board V4', 'microcontroller-development-board-v4', 'Electronics', 'EL-DEV-001', '32-bit dual-core Wi-Fi & Bluetooth IoT development board for student projects', 650.00, 240, 1),
('Complete Digital Science Lab Starter Kit', 'complete-digital-science-lab-starter-kit', 'Kits', 'LAB-KIT-101', '50+ sensor modules, breadboards, jumper wires and experiment guide for classes 6-12', 2499.00, 85, 1),
('Precision Digital Optical Sensor Pack', 'precision-digital-optical-sensor-pack', 'Sensors', 'SEN-OPT-042', 'Light intensity, IR obstacle and color sensors calibrated for science experiments', 450.00, 310, 2),
('Robotics Chassis & Geared Motor Set', 'robotics-chassis-geared-motor-set', 'Hardware', 'ROB-MTR-009', 'Dual DC motor drive with 4-wheel acrylic chassis and wheels for rover projects', 850.00, 160, 1)
ON CONFLICT (slug) DO NOTHING;
