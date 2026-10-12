-- ==============================================================================
-- SEED DATA: 10 MASTER LOOKUP TABLES (41 STATES, 942 DISTRICTS, EXACTLY 69 FACILITIES)
-- ==============================================================================

-- 1. STATES (41 States & UTs)
INSERT INTO master_states (code, name) VALUES
('ST_01', 'ANDAMAN & NICOBAR'),
('ST_02', 'ANDAMAN & NICOBAR ISLANDS'),
('ST_03', 'ANDHRA PRADESH'),
('ST_04', 'ARUNACHAL PRADESH'),
('ST_05', 'ASSAM'),
('ST_06', 'BIHAR'),
('ST_07', 'CHANDIGARH'),
('ST_08', 'CHATTISGARH'),
('ST_09', 'CHHATTISGARH'),
('ST_10', 'DADAR & NAGAR HAVELI'),
('ST_11', 'DADRA & NAGAR HAVELI AND DAMAN & DIU'),
('ST_12', 'DAMAN & DIU'),
('ST_13', 'DELHI'),
('ST_14', 'FOREIGN SCHOOLS'),
('ST_15', 'GOA'),
('ST_16', 'GUJARAT'),
('ST_17', 'HARYANA'),
('ST_18', 'HIMACHAL PRADESH'),
('ST_19', 'JAMMU & KASHMIR'),
('ST_20', 'JHARKHAND'),
('ST_21', 'KARNATAKA'),
('ST_22', 'KERALA'),
('ST_23', 'LADAKH'),
('ST_24', 'LAKSHADWEEP'),
('ST_25', 'MADHYA PRADESH'),
('ST_26', 'MAHARASHTRA'),
('ST_27', 'MANIPUR'),
('ST_28', 'MEGHALAYA'),
('ST_29', 'MIZORAM'),
('ST_30', 'NAGALAND'),
('ST_31', 'ODISHA'),
('ST_32', 'PUDUCHERRY'),
('ST_33', 'PUNJAB'),
('ST_34', 'RAJASTHAN'),
('ST_35', 'SIKKIM'),
('ST_36', 'TAMILNADU'),
('ST_37', 'TELANGANA'),
('ST_38', 'TRIPURA'),
('ST_39', 'UTTAR PRADESH'),
('ST_40', 'UTTARAKHAND'),
('ST_41', 'WEST BENGAL')
ON CONFLICT (name) DO UPDATE SET code = EXCLUDED.code;

-- 2. DISTRICTS (942 Districts linked to state_id)
DO $$
BEGIN
  -- State: ANDAMAN & NICOBAR
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('NICOBAR'),
    ('NORTH AND MIDDLE ANDAMAN'),
    ('SOUTH ANDAMAN')
  ) AS d(name) WHERE s.name = 'ANDAMAN & NICOBAR'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: ANDAMAN & NICOBAR ISLANDS
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('ANDAMANS'),
    ('MIDDLE AND NORTH ANDAMANS'),
    ('NICOBARS')
  ) AS d(name) WHERE s.name = 'ANDAMAN & NICOBAR ISLANDS'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: ANDHRA PRADESH
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('ALLURI SITHARAMA RAJU'),
    ('ANAKAPALLI'),
    ('ANANTAPUR'),
    ('ANANTHAPURAMU'),
    ('ANNAMAYYA'),
    ('ASR'),
    ('BAPATLA'),
    ('CHITTOOR'),
    ('DR. B.R. AMBEDKAR KONASEEMA'),
    ('EAST GODAVARI'),
    ('ELURU'),
    ('GUNTUR'),
    ('KADAPA'),
    ('KAKINADA'),
    ('KONASEEMA'),
    ('KRISHNA'),
    ('KURNOOL'),
    ('MANYAM'),
    ('NANDYAL'),
    ('NELLORE'),
    ('NTR'),
    ('PALNADU'),
    ('PARVATHIPURAM MANYAM'),
    ('PRAKASAM'),
    ('SRI POTTI SRIRAMULU NELLORE'),
    ('SRI SATHYA SAI'),
    ('SRI SATYASAI'),
    ('SRIKAKULAM'),
    ('TIRUPATI'),
    ('VIJAYAWADA'),
    ('VISAKHAPATNAM'),
    ('VIZIANAGARAM'),
    ('WEST GODAVARI'),
    ('Y.S.R.')
  ) AS d(name) WHERE s.name = 'ANDHRA PRADESH'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: ARUNACHAL PRADESH
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('ANJAW'),
    ('CAPITAL COMPLEX ITANAGAR'),
    ('CHANGLANG'),
    ('DIBANG VALLEY'),
    ('EAST KAMENG'),
    ('EAST SIANG'),
    ('KAMLE'),
    ('KEYI PANYOR'),
    ('KRA DAADI'),
    ('KURUNG KUMEY'),
    ('LEPA RADA'),
    ('LEPARADA'),
    ('LOHIT'),
    ('LONGDING'),
    ('LOWER DIBANG VALLEY'),
    ('LOWER SIANG'),
    ('LOWER SUBANSIRI'),
    ('NAMSAI'),
    ('PAKKE KESSANG'),
    ('PAPUM PARE'),
    ('SHI YOMI'),
    ('SIANG'),
    ('TAWANG'),
    ('TIRAP'),
    ('UPPER SIANG'),
    ('UPPER SUBANSIRI'),
    ('WEST KAMENG'),
    ('WEST SIANG')
  ) AS d(name) WHERE s.name = 'ARUNACHAL PRADESH'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: ASSAM
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('BAJALI'),
    ('BAKSA'),
    ('BARPETA'),
    ('BISWANATH'),
    ('BONGAIGAON'),
    ('CACHAR'),
    ('CHARAIDEO'),
    ('CHIRANG'),
    ('DARRANG'),
    ('DHEMAJI'),
    ('DHUBRI'),
    ('DIBRUGARH'),
    ('DIMA HASAO'),
    ('GOALPARA'),
    ('GOLAGHAT'),
    ('HAILAKANDI'),
    ('HOJAI'),
    ('JORHAT'),
    ('KAMRUP'),
    ('KAMRUP METROPOLITAN'),
    ('KAMRUP-METRO'),
    ('KAMRUP-RURAL'),
    ('KARBI ANGLONG'),
    ('KARIMGANJ'),
    ('KOKRAJHAR'),
    ('LAKHIMPUR'),
    ('MAJULI'),
    ('MARIGAON'),
    ('MORIGAON'),
    ('NAGAON'),
    ('NALBARI'),
    ('SIBSAGAR'),
    ('SIVASAGAR'),
    ('SONITPUR'),
    ('SOUTH SALMARA-MANKACHAR'),
    ('SRIBHUMI'),
    ('TAMULPUR'),
    ('TINSUKIA'),
    ('UDALGURI'),
    ('WEST KARBI ANGLONG')
  ) AS d(name) WHERE s.name = 'ASSAM'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: BIHAR
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('ARARIA'),
    ('ARWAL'),
    ('AURANGABAD'),
    ('AURANGABAD (BIHAR)'),
    ('BANKA'),
    ('BEGUSARAI'),
    ('BHAGALPUR'),
    ('BHOJPUR'),
    ('BUXAR'),
    ('CHAMPARAN EAST'),
    ('CHAMPARAN WEST'),
    ('DARBHANGA'),
    ('GAYA'),
    ('GOPALGANJ'),
    ('JAMUI'),
    ('JEHANABAD'),
    ('KAIMUR'),
    ('KAIMUR (BHABUA)'),
    ('KATIHAR'),
    ('KHAGARIA'),
    ('KISHANGANJ'),
    ('LAKHISARAI'),
    ('MADHEPURA'),
    ('MADHUBANI'),
    ('MUNGER'),
    ('MUZAFFARPUR'),
    ('NALANDA'),
    ('NAWADA'),
    ('PASHCHIM CHAMPARAN'),
    ('PATNA'),
    ('PURBA CHAMPARAN'),
    ('PURNIA'),
    ('ROHTAS'),
    ('SAHARSA'),
    ('SAMASTIPUR'),
    ('SARAN'),
    ('SHEIKHPURA'),
    ('SHEOHAR'),
    ('SITAMARHI'),
    ('SIWAN'),
    ('SUPAUL'),
    ('VAISHALI')
  ) AS d(name) WHERE s.name = 'BIHAR'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: CHANDIGARH
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('CHANDIGARH')
  ) AS d(name) WHERE s.name = 'CHANDIGARH'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: CHATTISGARH
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('BALOD'),
    ('BALODA BAZAR'),
    ('BALRAMPUR RAMANUJGANJ'),
    ('BASTAR'),
    ('BEMETARA'),
    ('BIJAPUR'),
    ('BILASPUR'),
    ('DANTEWADA'),
    ('DHAMTARI'),
    ('DURG'),
    ('GARIYABAND'),
    ('JANJGIR-CHAMPA'),
    ('JASHPUR'),
    ('KABEERDHAM'),
    ('KANKER'),
    ('KONDAGAON'),
    ('KORBA'),
    ('KOREA'),
    ('MAHASAMUND'),
    ('MANENDRAGARH CHIRMIRI BHARATPUR MCB'),
    ('MUNGELI'),
    ('NARAYANPUR'),
    ('RAIGARH'),
    ('RAIPUR'),
    ('RAJNANDGAON'),
    ('SAKTI'),
    ('SARANGARH BILAIGARH'),
    ('SUKMA'),
    ('SURAJPUR'),
    ('SURGUJA')
  ) AS d(name) WHERE s.name = 'CHATTISGARH'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: CHHATTISGARH
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('BALOD'),
    ('BALODABAZAR'),
    ('BALRAMPUR'),
    ('BASTER'),
    ('BEMETARA'),
    ('BIJAPUR'),
    ('BILASPUR'),
    ('DANTEWADA'),
    ('DHAMTARI'),
    ('DURG'),
    ('GARIABAND'),
    ('GOURELA PENDRA MARVAHI'),
    ('JANJGIR - CHAMPA'),
    ('JASHPUR'),
    ('KANKER'),
    ('KAWARDHA'),
    ('KHAIRAGARH-CHUIKHADAN-GANDAI'),
    ('KONDAGAON'),
    ('KORBA'),
    ('KORIYA'),
    ('MAHASAMUND'),
    ('MANENDRAGARH-CHIRMIRI-BHARATPUR'),
    ('MOHLA-MANPUR-CHOWKI'),
    ('MUNGELI'),
    ('NARAYANPUR'),
    ('RAIGARH'),
    ('RAIPUR'),
    ('RAJNANDGAON'),
    ('SAKTI'),
    ('SARANGARH-BILAIGARH'),
    ('SUKMA'),
    ('SURAJPUR'),
    ('SURGUJA')
  ) AS d(name) WHERE s.name = 'CHHATTISGARH'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: DADAR & NAGAR HAVELI
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('DADRA AND NAGAR HAVELI')
  ) AS d(name) WHERE s.name = 'DADAR & NAGAR HAVELI'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: DADRA & NAGAR HAVELI AND DAMAN & DIU
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('DADRA AND NAGAR HAVELI'),
    ('DAMAN'),
    ('DIU')
  ) AS d(name) WHERE s.name = 'DADRA & NAGAR HAVELI AND DAMAN & DIU'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: DAMAN & DIU
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('DAMAN'),
    ('DIU')
  ) AS d(name) WHERE s.name = 'DAMAN & DIU'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: DELHI
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('CENTRAL'),
    ('CENTRAL DELHI'),
    ('EAST'),
    ('EAST DELHI'),
    ('NEW DELHI'),
    ('NORTH'),
    ('NORTH DELHI'),
    ('NORTH EAST DELHI'),
    ('NORTH EAST I'),
    ('NORTH EAST II'),
    ('NORTH WEST A'),
    ('NORTH WEST B-I'),
    ('NORTH WEST B-II'),
    ('NORTH WEST DELHI'),
    ('SHAHDARA'),
    ('SOUTH'),
    ('SOUTH DELHI'),
    ('SOUTH EAST'),
    ('SOUTH EAST DELHI'),
    ('SOUTH WEST A'),
    ('SOUTH WEST B-I'),
    ('SOUTH WEST B-II'),
    ('SOUTH WEST DELHI'),
    ('WEST A'),
    ('WEST B'),
    ('WEST DELHI')
  ) AS d(name) WHERE s.name = 'DELHI'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: FOREIGN SCHOOLS
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('ANGOLA'),
    ('BAHRAIN'),
    ('BANGLADESH'),
    ('ETHIOPIA'),
    ('GHANA'),
    ('INDONESIA'),
    ('IRAN'),
    ('JAPAN'),
    ('KENYA'),
    ('KUWAIT'),
    ('LIBYA'),
    ('MALAYSIA'),
    ('MYANMAR'),
    ('NEPAL'),
    ('NIGERIA'),
    ('OMAN'),
    ('QATAR'),
    ('REPUBLIC OF BENIN'),
    ('RUSSIA'),
    ('SAUDI ARABIA'),
    ('SINGAPORE'),
    ('TANZANIA'),
    ('THAILAND'),
    ('UGANDA'),
    ('UNITED ARAB EMIRATES'),
    ('YEMEN')
  ) AS d(name) WHERE s.name = 'FOREIGN SCHOOLS'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: GOA
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('GOA NORTH'),
    ('GOA SOUTH'),
    ('NORTH GOA'),
    ('SOUTH GOA')
  ) AS d(name) WHERE s.name = 'GOA'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: GUJARAT
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('AHMEDABAD'),
    ('AMRELI'),
    ('ANAND'),
    ('ARVALLI'),
    ('BANAS KANTHA'),
    ('BANASKANTHA'),
    ('BHARUCH'),
    ('BHAVNAGAR'),
    ('BOTAD'),
    ('CHHOTAUDEPUR'),
    ('DAHOD'),
    ('DANG'),
    ('DANGS'),
    ('DEVBHUMI DWARKA'),
    ('DOHAD'),
    ('GANDHINAGAR'),
    ('GIR SOMNATH'),
    ('JAMNAGAR'),
    ('JUNAGADH'),
    ('KACHCHH'),
    ('KHEDA'),
    ('MAHESANA'),
    ('MAHISAGAR'),
    ('MORBI'),
    ('NARMADA'),
    ('NAVSARI'),
    ('PANCH MAHALS'),
    ('PATAN'),
    ('PORBANDAR'),
    ('RAJKOT'),
    ('SABAR KANTHA'),
    ('SABARKANTHA'),
    ('SURAT'),
    ('SURENDRANAGAR'),
    ('TAPI'),
    ('VADODARA'),
    ('VALSAD')
  ) AS d(name) WHERE s.name = 'GUJARAT'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: HARYANA
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('AMBALA'),
    ('BHIWANI'),
    ('CHARKHI DADRI'),
    ('FARIDABAD'),
    ('FATEHABAD'),
    ('GURUGRAM'),
    ('HISAR'),
    ('HISSAR'),
    ('JHAJJAR'),
    ('JIND'),
    ('KAITHAL'),
    ('KARNAL'),
    ('KURUKSHETRA'),
    ('MAHENDRAGARH'),
    ('NUH'),
    ('PALWAL'),
    ('PANCHKULA'),
    ('PANIPAT'),
    ('REWARI'),
    ('ROHTAK'),
    ('SIRSA'),
    ('SONIPAT'),
    ('YAMUNANAGAR')
  ) AS d(name) WHERE s.name = 'HARYANA'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: HIMACHAL PRADESH
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('BILASPUR'),
    ('BILASPUR (H.P.)'),
    ('CHAMBA'),
    ('HAMIRPUR'),
    ('HAMIRPUR (H.P.)'),
    ('KANGRA'),
    ('KINNAUR'),
    ('KULLU'),
    ('LAHUL & SPITI'),
    ('LAHUL AND SPITI'),
    ('MANDI'),
    ('SHIMLA'),
    ('SIRMAUR'),
    ('SOLAN'),
    ('UNA')
  ) AS d(name) WHERE s.name = 'HIMACHAL PRADESH'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: JAMMU & KASHMIR
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('ANANTNAG'),
    ('BANDIPORA'),
    ('BARAMULLA'),
    ('BUDGAM'),
    ('DODA'),
    ('GANDERBAL'),
    ('JAMMU'),
    ('KATHUA'),
    ('KISHTWAR'),
    ('KULGAM'),
    ('KUPWARA'),
    ('POONCH'),
    ('PULWAMA'),
    ('RAJOURI'),
    ('RAMBAN'),
    ('REASI'),
    ('SAMBA'),
    ('SHOPIAN'),
    ('SRINAGAR'),
    ('UDHAMPUR')
  ) AS d(name) WHERE s.name = 'JAMMU & KASHMIR'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: JHARKHAND
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('BOKARO'),
    ('CHATRA'),
    ('DEOGHAR'),
    ('DHANBAD'),
    ('DUMKA'),
    ('EAST SINGHBHUM'),
    ('GARHWA'),
    ('GIRIDIH'),
    ('GODDA'),
    ('GUMLA'),
    ('HAZARIBAGH'),
    ('JAMTARA'),
    ('KHUNTI'),
    ('KODERMA'),
    ('LATEHAR'),
    ('LOHARDAGA'),
    ('PAKUR'),
    ('PALAMU'),
    ('RAMGARH'),
    ('RANCHI'),
    ('SAHEBGANJ'),
    ('SARAIKELA KHARSAWAN'),
    ('SIMDEGA'),
    ('WEST SINGHBHUM')
  ) AS d(name) WHERE s.name = 'JHARKHAND'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: KARNATAKA
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('BAGALKOT'),
    ('BAGALKOTE'),
    ('BALLARI'),
    ('BELAGAVI'),
    ('BELAGAVI CHIKKODI'),
    ('BENGALURU RURAL'),
    ('BENGALURU U NORTH'),
    ('BENGALURU U SOUTH'),
    ('BENGALURU URBAN'),
    ('BIDAR'),
    ('CHAMARAJANAGARA'),
    ('CHIKKABALLAPURA'),
    ('CHIKKAMAGALURU'),
    ('CHIKKAMANGALURU'),
    ('CHITRADURGA'),
    ('DAKSHINA KANNADA'),
    ('DAVANAGERE'),
    ('DAVANGERE'),
    ('DHARWAD'),
    ('GADAG'),
    ('HASSAN'),
    ('HAVERI'),
    ('KALABURAGI'),
    ('KALBURGI'),
    ('KODAGU'),
    ('KOLAR'),
    ('KOPPAL'),
    ('MANDYA'),
    ('MYSURU'),
    ('RAICHUR'),
    ('RAMANAGARA'),
    ('SHIVAMOGGA'),
    ('TUMAKURU'),
    ('TUMAKURU MADHUGIRI'),
    ('UDUPI'),
    ('UTTARA KANNADA'),
    ('UTTARA KANNADA SIRSI'),
    ('VIJAYANAGAR'),
    ('VIJAYANAGARA'),
    ('VIJAYAPURA'),
    ('YADAGIRI'),
    ('YADGIR')
  ) AS d(name) WHERE s.name = 'KARNATAKA'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: KERALA
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('ALAPPUZHA'),
    ('ERNAKULAM'),
    ('IDUKKI'),
    ('KANNUR'),
    ('KASARAGOD'),
    ('KOLLAM'),
    ('KOTTAYAM'),
    ('KOZHIKODE'),
    ('MALAPPURAM'),
    ('PALAKKAD'),
    ('PATHANAMTHITTA'),
    ('THIRUVANANTHAPURAM'),
    ('THRISSUR'),
    ('WAYANAD')
  ) AS d(name) WHERE s.name = 'KERALA'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: LADAKH
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('KARGIL'),
    ('LEH'),
    ('LEH LADAKH')
  ) AS d(name) WHERE s.name = 'LADAKH'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: LAKSHADWEEP
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('LAKSHADWEEP')
  ) AS d(name) WHERE s.name = 'LAKSHADWEEP'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: MADHYA PRADESH
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('AGAR MALWA'),
    ('ALIRAJPUR'),
    ('ANUPPUR'),
    ('ASHOKNAGAR'),
    ('BALAGHAT'),
    ('BARWANI'),
    ('BETUL'),
    ('BHIND'),
    ('BHOPAL'),
    ('BURHANPUR'),
    ('CHHATARPUR'),
    ('CHHINDWARA'),
    ('DAMOH'),
    ('DATIA'),
    ('DEWAS'),
    ('DHAR'),
    ('DINDORI'),
    ('GUNA'),
    ('GWALIOR'),
    ('HARDA'),
    ('HOSHANGABAD'),
    ('INDORE'),
    ('JABALPUR'),
    ('JHABUA'),
    ('KATNI'),
    ('KHANDWA'),
    ('KHARGONE'),
    ('MAIHAR'),
    ('MANDLA'),
    ('MANDSAUR'),
    ('MAUGANJ'),
    ('MORENA'),
    ('NARMADAPURAM'),
    ('NARSIMHAPUR'),
    ('NARSINGHPUR'),
    ('NEEMUCH'),
    ('NIWARI'),
    ('PANDHURNA'),
    ('PANNA'),
    ('RAISEN'),
    ('RAJGARH'),
    ('RATLAM'),
    ('REWA'),
    ('SAGAR'),
    ('SATNA'),
    ('SEHORE'),
    ('SEONI'),
    ('SHAHDOL'),
    ('SHAJAPUR'),
    ('SHEOPUR'),
    ('SHIVPURI'),
    ('SIDHI'),
    ('SINGRAULI'),
    ('TIKAMGARH'),
    ('UJJAIN'),
    ('UMARIA'),
    ('VIDISHA')
  ) AS d(name) WHERE s.name = 'MADHYA PRADESH'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: MAHARASHTRA
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('AHILYANAGAR'),
    ('AKOLA'),
    ('AMRAVATI'),
    ('BEED'),
    ('BHANDARA'),
    ('BID'),
    ('BULDANA'),
    ('BULDHANA'),
    ('CHANDRAPUR'),
    ('CHHATRAPATI SAMBHAJINAGAR'),
    ('DHARASHIV'),
    ('DHULE'),
    ('GADCHIROLI'),
    ('GONDIA'),
    ('GONDIYA'),
    ('HINGOLI'),
    ('JALGAON'),
    ('JALNA'),
    ('KOLHAPUR'),
    ('LATUR'),
    ('MUMBAI'),
    ('MUMBAI (SUBURBAN)'),
    ('MUMBAI II'),
    ('MUMBAI SUBURBAN'),
    ('NAGPUR'),
    ('NANDED'),
    ('NANDURBAR'),
    ('NASHIK'),
    ('PALGHAR'),
    ('PARBHANI'),
    ('PUNE'),
    ('RAIGAD'),
    ('RAIGARH (MAHARASHTRA)'),
    ('RATNAGIRI'),
    ('SANGLI'),
    ('SATARA'),
    ('SINDHUDURG'),
    ('SOLAPUR'),
    ('THANE'),
    ('WARDHA'),
    ('WASHIM'),
    ('YAVATMAL')
  ) AS d(name) WHERE s.name = 'MAHARASHTRA'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: MANIPUR
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('BISHNUPUR'),
    ('CHANDEL'),
    ('CHURACHANDPUR'),
    ('IMPHAL EAST'),
    ('IMPHAL WEST'),
    ('IMPHAL-EAST'),
    ('IMPHAL-WEST'),
    ('JIRIBAM'),
    ('KAKCHING'),
    ('KAMJONG'),
    ('KANGPOKPI'),
    ('NONEY'),
    ('PHERZAWL'),
    ('SENAPATI'),
    ('TAMENGLONG'),
    ('TENGNOUPAL'),
    ('THOUBAL'),
    ('UKHRUL')
  ) AS d(name) WHERE s.name = 'MANIPUR'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: MEGHALAYA
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('EAST GARO HILLS'),
    ('EAST JAINTIA HILLS'),
    ('EAST KHASI HILLS'),
    ('EASTERN WEST KHASI HILLS'),
    ('NORTH GARO HILLS'),
    ('RI BHOI'),
    ('SOUTH GARO HILLS'),
    ('SOUTH WEST GARO HILLS'),
    ('SOUTH WEST KHASI HILLS'),
    ('WEST GARO HILLS'),
    ('WEST JAINTIA HILLS'),
    ('WEST KHASI HILLS')
  ) AS d(name) WHERE s.name = 'MEGHALAYA'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: MIZORAM
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('AIZAWL'),
    ('CHAMPHAI'),
    ('HNAHTHIAL'),
    ('KHAWZAWL'),
    ('KOLASIB'),
    ('LAWNGTLAI'),
    ('LUNGLEI'),
    ('MAMIT'),
    ('SAITUAL'),
    ('SERCHHIP'),
    ('SIAHA')
  ) AS d(name) WHERE s.name = 'MIZORAM'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: NAGALAND
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('CHUMOUKEDIMA'),
    ('DIMAPUR'),
    ('KIPHIRE'),
    ('KOHIMA'),
    ('LONGLENG'),
    ('MOKOKCHUNG'),
    ('MON'),
    ('PEREN'),
    ('PHEK'),
    ('TUENSANG'),
    ('WOKHA'),
    ('ZUNHEBOTO')
  ) AS d(name) WHERE s.name = 'NAGALAND'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: ODISHA
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('ANGUL'),
    ('ANUGUL'),
    ('BALANGIR'),
    ('BALASORE'),
    ('BALESHWAR'),
    ('BARGARH'),
    ('BHADRAK'),
    ('BOUDH'),
    ('CUTTACK'),
    ('DEOGARH'),
    ('DHENKANAL'),
    ('GAJAPATI'),
    ('GANJAM'),
    ('JAGATSINGHAPUR'),
    ('JAJPUR'),
    ('JHARSUGUDA'),
    ('KALAHANDI'),
    ('KANDHAMAL'),
    ('KENDRAPARA'),
    ('KEONJHAR'),
    ('KHORDHA'),
    ('KORAPUT'),
    ('MALKANGIRI'),
    ('MAYURBHANJ'),
    ('NABARANGPUR'),
    ('NAYAGARH'),
    ('NUAPADA'),
    ('PURI'),
    ('RAYAGADA'),
    ('SAMBALPUR'),
    ('SONEPUR'),
    ('SUNDARGARH')
  ) AS d(name) WHERE s.name = 'ODISHA'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: PUDUCHERRY
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('KARAIKAL'),
    ('MAHE'),
    ('PONDICHERRY'),
    ('PUDUCHERRY'),
    ('YANAM')
  ) AS d(name) WHERE s.name = 'PUDUCHERRY'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: PUNJAB
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('AMRITSAR'),
    ('BARNALA'),
    ('BATHINDA'),
    ('FARIDKOT'),
    ('FATEHGARH SAHIB'),
    ('FAZILKA'),
    ('FEROZEPUR'),
    ('GURDASPUR'),
    ('HOSHIARPUR'),
    ('JALANDHAR'),
    ('KAPURTHALA'),
    ('LUDHIANA'),
    ('MALERKOTLA'),
    ('MANSA'),
    ('MOGA'),
    ('PATHANKOT'),
    ('PATIALA'),
    ('RUPNAGAR'),
    ('S.A.S NAGAR'),
    ('SANGRUR'),
    ('SAS NAGAR'),
    ('SHAHID BHAGAT SINGH NAGAR'),
    ('SRI MUKTSAR SAHIB'),
    ('TARN TARAN')
  ) AS d(name) WHERE s.name = 'PUNJAB'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: RAJASTHAN
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('AJMER'),
    ('ALWAR'),
    ('ANUPGARH'),
    ('BALOTRA'),
    ('BANSWARA'),
    ('BARAN'),
    ('BARMER'),
    ('BEAWAR'),
    ('BHARATPUR'),
    ('BHILWARA'),
    ('BIKANER'),
    ('BUNDI'),
    ('CHITTORGARH'),
    ('CHURU'),
    ('DAUSA'),
    ('DEEG'),
    ('DHEEG'),
    ('DHOLPUR'),
    ('DIDWANA KUCHAMAN'),
    ('DIDWANA-KUCHAMAN'),
    ('DUNGARPUR'),
    ('GANGANAGAR'),
    ('GANGAPUR CITY'),
    ('HANUMANGARH'),
    ('JAIPUR'),
    ('JAIPUR RURAL'),
    ('JAISALMER'),
    ('JALORE'),
    ('JHALAWAR'),
    ('JHUNJHUNU'),
    ('JODHPUR'),
    ('JODHPUR RURAL'),
    ('KARAULI'),
    ('KHAIRTHAL TIJARA'),
    ('KHAIRTHAL-TIJARA'),
    ('KOTA'),
    ('KOTPUTLI-BEHROR'),
    ('NAGAUR'),
    ('NEEM KA THANA'),
    ('PALI'),
    ('PHALODI'),
    ('PRATAPGARH'),
    ('RAJSAMAND'),
    ('SALUMBAR'),
    ('SAWAI MADHOPUR'),
    ('SHAHPURA'),
    ('SIKAR'),
    ('SIROHI'),
    ('SRI GANGANAGAR'),
    ('TONK'),
    ('UDAIPUR')
  ) AS d(name) WHERE s.name = 'RAJASTHAN'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: SIKKIM
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('EAST SIKKIM'),
    ('GANGTOK'),
    ('GYALSHING'),
    ('MANGAN'),
    ('NAMCHI'),
    ('NORTH SIKKIM'),
    ('PAKYONG'),
    ('SORENG'),
    ('SOUTH SIKKIM'),
    ('WEST SIKKIM')
  ) AS d(name) WHERE s.name = 'SIKKIM'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: TAMILNADU
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('ARIYALUR'),
    ('CHENGALPATTU'),
    ('CHENNAI'),
    ('CHENNAI (EXT. GCC)'),
    ('COIMBATORE'),
    ('CUDDALORE'),
    ('DHARMAPURI'),
    ('DINDIGUL'),
    ('ERODE'),
    ('KALLAKURICHI'),
    ('KANCHEEPURAM'),
    ('KANCHIPURAM'),
    ('KANNIYAKUMARI'),
    ('KANYAKUMARI'),
    ('KARUR'),
    ('KRISHNAGIRI'),
    ('MADURAI'),
    ('MAYILADUTHURAI'),
    ('NAGAPATTINAM'),
    ('NAMAKKAL'),
    ('NILGIRIS'),
    ('PERAMBALUR'),
    ('PUDUKKOTTAI'),
    ('RAMANATHAPURAM'),
    ('RANIPET'),
    ('SALEM'),
    ('SIVAGANGA'),
    ('SIVAGANGAI'),
    ('TENKASI'),
    ('THANJAVUR'),
    ('THE NILGIRIS'),
    ('THENI'),
    ('THIRUVALLUR'),
    ('THIRUVARUR'),
    ('THOOTHUKKUDI'),
    ('TIRUCHIRAPPALLI'),
    ('TIRUNELVELI'),
    ('TIRUPATHUR'),
    ('TIRUPPUR'),
    ('TIRUVALLUR'),
    ('TIRUVANNAMALAI'),
    ('TIRUVARUR'),
    ('VELLORE'),
    ('VILLUPURAM'),
    ('VILUPPURAM'),
    ('VIRUDHUNAGAR')
  ) AS d(name) WHERE s.name = 'TAMILNADU'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: TELANGANA
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('ADILABAD'),
    ('BHADRADRI KOTHAGUDEM'),
    ('HANUMAKONDA'),
    ('HYDERABAD'),
    ('JAGITIAL'),
    ('JANGAON'),
    ('JAYASHANKAR BHUPALAPALLY'),
    ('JOGULAMBA GADWAL'),
    ('KAMAREDDY'),
    ('KARIMNAGAR'),
    ('KHAMMAM'),
    ('KUMURAM BHEEM ASIFABAD'),
    ('MAHABUBABAD'),
    ('MAHABUBNAGAR'),
    ('MANCHERIAL'),
    ('MEDAK'),
    ('MEDCHAL MALKAJGIRI'),
    ('MULUGU'),
    ('NAGARKURNOOL'),
    ('NALGONDA'),
    ('NARAYANPET'),
    ('NIRMAL'),
    ('NIZAMABAD'),
    ('PEDDAPALLI'),
    ('RAJANNA SIRCILLA'),
    ('RANGA REDDY'),
    ('RANGAREDDY'),
    ('SANGAREDDY'),
    ('SIDDIPET'),
    ('SURYAPET'),
    ('VIKARABAD'),
    ('WANAPARTHY'),
    ('WARANGAL'),
    ('YADADRI BHUVANAGIRI')
  ) AS d(name) WHERE s.name = 'TELANGANA'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: TRIPURA
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('DHALAI'),
    ('GOMATI'),
    ('KHOWAI'),
    ('NORTH TRIPURA'),
    ('SEPAHIJALA'),
    ('SOUTH TRIPURA'),
    ('UNAKOTI'),
    ('WEST TRIPURA')
  ) AS d(name) WHERE s.name = 'TRIPURA'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: UTTAR PRADESH
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('AGRA'),
    ('ALIGARH'),
    ('AMBEDKAR NAGAR'),
    ('AMETHI'),
    ('AMROHA'),
    ('AURAIYA'),
    ('AYODHYA'),
    ('AZAMGARH'),
    ('BAGHPAT'),
    ('BAHRAICH'),
    ('BALLIA'),
    ('BALRAMPUR'),
    ('BANDA'),
    ('BARA BANKI'),
    ('BARABANKI'),
    ('BAREILLY'),
    ('BASTI'),
    ('BHADOHI'),
    ('BIJNOR'),
    ('BUDAUN'),
    ('BULANDSHAHAR'),
    ('BULANDSHAHR'),
    ('CHANDAULI'),
    ('CHITRAKOOT'),
    ('DEORIA'),
    ('ETAH'),
    ('ETAWAH'),
    ('FARRUKHABAD'),
    ('FATEHPUR'),
    ('FIROZABAD'),
    ('GAUTAM BUDDHA NAGAR'),
    ('GHAZIABAD'),
    ('GHAZIPUR'),
    ('GONDA'),
    ('GORAKHPUR'),
    ('HAMIRPUR'),
    ('HAPUR'),
    ('HARDOI'),
    ('HATHRAS'),
    ('JALAUN'),
    ('JAUNPUR'),
    ('JHANSI'),
    ('KANNAUJ'),
    ('KANPUR DEHAT'),
    ('KANPUR NAGAR'),
    ('KASGANJ'),
    ('KAUSHAMBI'),
    ('KHERI'),
    ('KUSHINAGAR'),
    ('LAKHIMPUR KHERI'),
    ('LALITPUR'),
    ('LUCKNOW'),
    ('MAHARAJGANJ'),
    ('MAHOBA'),
    ('MAHRAJGANJ'),
    ('MAINPURI'),
    ('MATHURA'),
    ('MAU'),
    ('MEERUT'),
    ('MIRZAPUR'),
    ('MORADABAD'),
    ('MUZAFFARNAGAR'),
    ('PILIBHIT'),
    ('PRATAPGARH'),
    ('PRAYAGRAJ'),
    ('RAE BARELI'),
    ('RAEBARELI'),
    ('RAMPUR'),
    ('SAHARANPUR'),
    ('SAMBHAL'),
    ('SANT KABIR NAGAR'),
    ('SHAHJAHANPUR'),
    ('SHAMLI'),
    ('SHRAWASTI'),
    ('SIDDHARTH NAGAR'),
    ('SIDDHARTHNAGAR'),
    ('SITAPUR'),
    ('SONBHADRA'),
    ('SULTANPUR'),
    ('UNNAO'),
    ('VARANASI')
  ) AS d(name) WHERE s.name = 'UTTAR PRADESH'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: UTTARAKHAND
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('ALMORA'),
    ('BAGESHWAR'),
    ('CHAMOLI'),
    ('CHAMPAWAT'),
    ('DEHRADUN'),
    ('HARIDWAR'),
    ('NAINITAL'),
    ('PAURI GARHWAL'),
    ('PITHORAGARH'),
    ('RUDRAPRAYAG'),
    ('TEHRI GARHWAL'),
    ('TEHRI-GARHWAL'),
    ('UDHAM SINGH NAGAR'),
    ('UTTARKASHI')
  ) AS d(name) WHERE s.name = 'UTTARAKHAND'
  ON CONFLICT (state_id, name) DO NOTHING;

  -- State: WEST BENGAL
  INSERT INTO master_districts (state_id, name)
  SELECT s.id, d.name FROM master_states s, (VALUES
    ('ALIPURDUAR'),
    ('BANKURA'),
    ('BIRBHUM'),
    ('COOCH BEHAR'),
    ('COOCHBEHAR'),
    ('DAKSHIN DINAJPUR'),
    ('DARJEELING'),
    ('DARJILING'),
    ('HOOGHLY'),
    ('HOWRAH'),
    ('JALPAIGURI'),
    ('JHARGRAM'),
    ('KALIMPONG'),
    ('KOLKATA'),
    ('MALDA'),
    ('MALDAH'),
    ('MURSHIDABAD'),
    ('NADIA'),
    ('NORTH 24-PARGANA'),
    ('NORTH TWENTY FOUR PARGANAS'),
    ('PASCHIM BARDHAMAN'),
    ('PASCHIM MEDINIPUR'),
    ('PURBA BARDHAMAN'),
    ('PURBA MEDINIPUR'),
    ('PURULIA'),
    ('PURULIYA'),
    ('SILIGURI'),
    ('SOUTH 24-PARGANA'),
    ('SOUTH TWENTY FOUR PARGANAS'),
    ('UTTAR DINAJPUR')
  ) AS d(name) WHERE s.name = 'WEST BENGAL'
  ON CONFLICT (state_id, name) DO NOTHING;

END $$;

-- 3. SCHOOL TYPES / MANAGING BODIES
INSERT INTO master_school_types (code, name) VALUES
('INDEPENDENT', 'Private Unaided Independent School'),
('GOVT', 'State Government School'),
('KV', 'Kendriya Vidyalaya (KVS)'),
('JNV', 'Jawahar Navodaya Vidyalaya (NVS)'),
('EMRS', 'Eklavya Model Residential School (Tribal Affairs)'),
('GOVT_AIDED', 'Government Aided School'),
('SAINIK', 'Sainik School Society'),
('RAILWAY', 'Railway School'),
('STSS', 'Special Tibetan / Autonomous School')
ON CONFLICT (code) DO NOTHING;

-- 4. CATEGORIES / CLASS RANGES
INSERT INTO master_categories (code, class_from, class_to, label) VALUES
('CAT_1_12', '1st', '12th', 'Primary with Upper Primary, Secondary and Higher Secondary (1st-12th)'),
('CAT_1_10', '1st', '10th', 'Primary, Upper Primary and Secondary Only (1st-10th)'),
('CAT_1_8', '1st', '8th', 'Primary with Upper Primary (1st-8th)'),
('CAT_1_5', '1st', '5th', 'Primary Only (1st-5th)'),
('CAT_6_8', '6th', '8th', 'Upper Primary Only (6th-8th)'),
('CAT_6_10', '6th', '10th', 'Upper Primary and Secondary (6th-10th)'),
('CAT_6_12', '6th', '12th', 'Upper Primary, Secondary and Higher Secondary (6th-12th)'),
('CAT_9_10', '9th', '10th', 'Secondary Only (9th-10th)'),
('CAT_9_12', '9th', '12th', 'Secondary with Higher Secondary (9th-12th)'),
('CAT_11_12', '11th', '12th', 'Higher Secondary only / Junior College (11th-12th)'),
('CAT_PRE_PRI', 'Nursery', 'KG', 'Pre-Primary Only (Nursery-KG)')
ON CONFLICT (code) DO NOTHING;

-- 5. GENDER TYPES
INSERT INTO master_gender_types (code, label) VALUES
('CO_ED', 'Co-educational'),
('GIRLS', 'Girls Only'),
('BOYS', 'Boys Only')
ON CONFLICT (code) DO NOTHING;

-- 6. MANAGEMENTS
INSERT INTO master_managements (code, label) VALUES
('PVT_UNAIDED', 'Private Unaided (Recognized)'),
('MADRASA', 'Madrasa Private Unaided (Recognized)'),
('UNRECOGNIZED', 'Unrecognized School'),
('GOVT', 'Department of Education, Government'),
('GOVT_AIDED', 'Government Aided')
ON CONFLICT (code) DO NOTHING;

-- 7. MEDIUMS (22 Languages)
INSERT INTO master_mediums (code, name) VALUES
('ENG', 'English'),
('HIN', 'Hindi'),
('PUN', 'Punjabi'),
('URD', 'Urdu'),
('SAN', 'Sanskrit'),
('BEN', 'Bengali'),
('GUJ', 'Gujarati'),
('MAR', 'Marathi'),
('TAM', 'Tamil'),
('TEL', 'Telugu'),
('KAN', 'Kannada'),
('MAL', 'Malayalam'),
('ASM', 'Assamese'),
('ORI', 'Oriya'),
('NEP', 'Nepali'),
('BOD', 'Bodo'),
('KON', 'Konkani'),
('BHU', 'Bhutia'),
('GAR', 'Garo'),
('MIZ', 'Mizo'),
('HAM', 'Hamr'),
('OTHER', 'Other / Regional Medium')
ON CONFLICT (code) DO NOTHING;

-- 8. SCHOOL FORMATS / NATURE OF SCHOOL
INSERT INTO master_school_formats (code, label) VALUES
('DAY', 'Day School'),
('BOARDING', 'Boarding School'),
('DAY_BOARDING', 'Day-cum-Boarding School'),
('RESIDENTIAL', 'Residential School')
ON CONFLICT (code) DO NOTHING;

-- 9. BOARDS (National, International & State)
INSERT INTO master_boards (code, name) VALUES
('CBSE', 'Central Board of Secondary Education'),
('ICSE', 'Council for the Indian School Certificate Examinations'),
('IB', 'International Baccalaureate'),
('CAMBRIDGE', 'Cambridge Assessment International Education'),
('STATE_BOARD', 'State Board of Education'),
('MADARSA_BOARD', 'State Madarsa Education Board'),
('SANSKRIT_BOARD', 'Sanskrit Education Board'),
('OTHER', 'Other Recognized Board')
ON CONFLICT (code) DO NOTHING;

-- 10. ALL EXACT 69 FACILITIES & LABS (MATCHING FACILITYDATA.TS)
INSERT INTO master_facilities (code, name, category, icon_url) VALUES
('smart_classes', 'Smart Classes', 'Academic', 'https://img.icons8.com/?size=128&id=13203&format=png'),
('library', 'Library', 'Academic', 'https://img.icons8.com/?size=128&id=12300&format=png'),
('e_library', 'E-Library', 'Academic', 'https://img.icons8.com/?size=128&id=12300&format=png'),
('vr_ar_learning', 'VR/AR Learning', 'Academic', 'https://img.icons8.com/?size=128&id=sNWdMwQV8CkV&format=png'),
('av_media_room', 'AV / Media Room', 'Academic', 'https://img.icons8.com/?size=128&id=13563&format=png'),
('competitive_exam_coaching', 'Competitive Exam Coaching', 'Academic', 'https://img.icons8.com/?size=128&id=16951&format=png'),
('student_exchange_program', 'Student Exchange Program', 'Academic', 'https://img.icons8.com/?size=128&id=47mzmdimP9JU&format=png'),
('career_counseling_pastoral_care', 'Career Counseling / Pastoral Care', 'Academic', 'https://img.icons8.com/?size=128&id=14798&format=png'),
('physics_lab', 'Physics Lab', 'Lab Facility', 'https://img.icons8.com/?size=128&id=71261&format=png'),
('chemistry_lab', 'Chemistry Lab', 'Lab Facility', 'https://img.icons8.com/?size=128&id=13884&format=png'),
('biology_lab', 'Biology Lab', 'Lab Facility', 'https://img.icons8.com/?size=128&id=13917&format=png'),
('composite_lab', 'Composite Lab', 'Lab Facility', 'https://img.icons8.com/?size=128&id=117206&format=png'),
('composite_skill_lab', 'Composite Skill Lab', 'Lab Facility', 'https://img.icons8.com/?size=128&id=102707&format=png'),
('science_lab', 'Science Lab', 'Lab Facility', 'https://img.icons8.com/?size=128&id=71261&format=png'),
('experiential_science_lab', 'Experiential Science Lab', 'Lab Facility', 'https://img.icons8.com/?size=128&id=13843&format=png'),
('computer_lab', 'Computer Lab', 'Lab Facility', 'https://img.icons8.com/?size=128&id=20420&format=png'),
('robotics_lab', 'Robotics Lab', 'Lab Facility', 'https://img.icons8.com/?size=128&id=JB5lRIhzKC0y&format=png'),
('atl_tinkering_lab', 'ATL Tinkering Lab', 'Lab Facility', 'https://img.icons8.com/?size=128&id=102707&format=png'),
('language_lab', 'Language Lab', 'Lab Facility', 'https://img.icons8.com/?size=128&id=13495&format=png'),
('math_lab', 'Math Lab', 'Lab Facility', 'https://img.icons8.com/?size=128&id=qrOXrfUDKkOX&format=png'),
('playground_outdoor_sports', 'Playground / Outdoor Sports', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=12012&format=png'),
('indoor_games', 'Indoor Games', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=C5LTcmsc3cr0&format=png'),
('swimming_pool', 'Swimming Pool', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=19873&format=png'),
('basketball_court', 'Basketball Court', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=33583&format=png'),
('football_ground', 'Football Ground', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=84301&format=png'),
('cricket_pitch', 'Cricket Pitch', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=12982&format=png'),
('tennis_court', 'Tennis Court', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=16953&format=png'),
('badminton_court', 'Badminton Court', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=24314&format=png'),
('volleyball_court', 'Volleyball Court', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=24314&format=png'),
('table_tennis', 'Table Tennis', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=16927&format=png'),
('squash', 'Squash', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=16927&format=png'),
('gymnasium', 'Gymnasium', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=jjlVFSkHPQH5&format=png'),
('skating_rink', 'Skating Rink', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=G7GoqQo-BKAO&format=png'),
('yoga_center', 'Yoga Center', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=wMEcFgxogS2g&format=png'),
('martial_arts_karate_taekwondo', 'Martial Arts (Karate / Taekwondo)', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=20808&format=png'),
('running_track_athletics', 'Running Track / Athletics', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=16936&format=png'),
('horse_riding_equestrian', 'Horse Riding / Equestrian', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=26090&format=png'),
('shooting_archery_golf', 'Shooting & Archery / Golf', 'Sports & Fitness', 'https://img.icons8.com/?size=128&id=16024&format=png'),
('cctv_surveillance', 'CCTV Surveillance', 'Safety & Security', 'https://img.icons8.com/?size=128&id=15881&format=png'),
('gps_enabled_transport', 'GPS Enabled Transport', 'Safety & Security', 'https://img.icons8.com/?size=128&id=3514&format=png'),
('student_tracking_app', 'Student Tracking App', 'Safety & Security', 'https://img.icons8.com/?size=128&id=11200&format=png'),
('medical_room_clinic', 'Medical Room / Clinic', 'Safety & Security', 'https://img.icons8.com/?size=128&id=12461&format=png'),
('fire_safety_setup', 'Fire Safety Setup', 'Safety & Security', 'https://img.icons8.com/?size=128&id=25381&format=png'),
('disabled_friendly_ramps', 'Disabled Friendly / Ramps', 'Safety & Security', 'https://img.icons8.com/?size=128&id=14188&format=png'),
('ro_drinking_water', 'RO Drinking Water', 'Safety & Security', 'https://img.icons8.com/?size=128&id=11500&format=png'),
('air_conditioned_classrooms', 'Air Conditioned Classrooms', 'Infrastructure & Boarding', 'https://img.icons8.com/?size=128&id=23348&format=png'),
('wi_fi_campus', 'Wi-Fi Campus', 'Infrastructure & Boarding', 'https://img.icons8.com/?size=128&id=13348&format=png'),
('hostel_boarding', 'Hostel / Boarding', 'Infrastructure & Boarding', 'https://img.icons8.com/?size=128&id=12151&format=png'),
('boys_hostel', 'Boys Hostel', 'Infrastructure & Boarding', 'https://img.icons8.com/?size=128&id=12151&format=png'),
('girls_hostel', 'Girls Hostel', 'Infrastructure & Boarding', 'https://img.icons8.com/?size=128&id=12151&format=png'),
('day_care_creche', 'Day Care / Creche', 'Infrastructure & Boarding', 'https://img.icons8.com/?size=128&id=20803&format=png'),
('cafeteria_canteen', 'Cafeteria / Canteen', 'Infrastructure & Boarding', 'https://img.icons8.com/?size=128&id=11905&format=png'),
('mid_day_meals_dining', 'Mid-Day Meals / Dining', 'Infrastructure & Boarding', 'https://img.icons8.com/?size=128&id=11905&format=png'),
('auditorium', 'Auditorium', 'Infrastructure & Boarding', 'https://img.icons8.com/?size=128&id=12140&format=png'),
('activity_rooms', 'Activity Rooms', 'Infrastructure & Boarding', 'https://img.icons8.com/?size=128&id=24151&format=png'),
('elevators_lifts', 'Elevators / Lifts', 'Infrastructure & Boarding', 'https://img.icons8.com/?size=128&id=25381&format=png'),
('solar_power_green_campus', 'Solar Power / Green Campus', 'Infrastructure & Boarding', 'https://img.icons8.com/?size=128&id=11484&format=png'),
('art_craft_studio', 'Art & Craft Studio', 'Extracurricular', 'https://img.icons8.com/?size=128&id=24151&format=png'),
('dance_room', 'Dance Room', 'Extracurricular', 'https://img.icons8.com/?size=128&id=s66aTXXH2E1N&format=png'),
('music_room', 'Music Room', 'Extracurricular', 'https://img.icons8.com/?size=128&id=3220&format=png'),
('theatre_drama', 'Theatre / Drama', 'Extracurricular', 'https://img.icons8.com/?size=128&id=12140&format=png'),
('debate_public_speaking_club', 'Debate & Public Speaking Club', 'Extracurricular', 'https://img.icons8.com/?size=128&id=16951&format=png'),
('eco_club_gardening', 'Eco Club & Gardening', 'Extracurricular', 'https://img.icons8.com/?size=128&id=11484&format=png'),
('educational_tours_excursions', 'Educational Tours & Excursions', 'Extracurricular', 'https://img.icons8.com/?size=128&id=12012&format=png'),
('photography_media_club', 'Photography & Media Club', 'Extracurricular', 'https://img.icons8.com/?size=128&id=13563&format=png'),
('ncc', 'NCC', 'Extracurricular', 'https://img.icons8.com/?size=128&id=12140&format=png'),
('scouts_guides', 'Scouts & Guides', 'Extracurricular', 'https://img.icons8.com/?size=128&id=12140&format=png'),
('student_council_hobby_clubs', 'Student Council & Hobby Clubs', 'Extracurricular', 'https://img.icons8.com/?size=128&id=14798&format=png'),
('alumni_association', 'Alumni Association', 'Extracurricular', 'https://img.icons8.com/?size=128&id=14798&format=png')
ON CONFLICT (code) DO NOTHING;

-- 11. ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC READ ACCESS
ALTER TABLE master_states ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read master_states" ON master_states;
CREATE POLICY "Public Read master_states" ON master_states FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service All master_states" ON master_states;
CREATE POLICY "Service All master_states" ON master_states FOR ALL USING (true);

ALTER TABLE master_districts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read master_districts" ON master_districts;
CREATE POLICY "Public Read master_districts" ON master_districts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service All master_districts" ON master_districts;
CREATE POLICY "Service All master_districts" ON master_districts FOR ALL USING (true);

ALTER TABLE master_boards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read master_boards" ON master_boards;
CREATE POLICY "Public Read master_boards" ON master_boards FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service All master_boards" ON master_boards;
CREATE POLICY "Service All master_boards" ON master_boards FOR ALL USING (true);

ALTER TABLE master_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read master_categories" ON master_categories;
CREATE POLICY "Public Read master_categories" ON master_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service All master_categories" ON master_categories;
CREATE POLICY "Service All master_categories" ON master_categories FOR ALL USING (true);

ALTER TABLE master_school_formats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read master_school_formats" ON master_school_formats;
CREATE POLICY "Public Read master_school_formats" ON master_school_formats FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service All master_school_formats" ON master_school_formats;
CREATE POLICY "Service All master_school_formats" ON master_school_formats FOR ALL USING (true);

ALTER TABLE master_managements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read master_managements" ON master_managements;
CREATE POLICY "Public Read master_managements" ON master_managements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service All master_managements" ON master_managements;
CREATE POLICY "Service All master_managements" ON master_managements FOR ALL USING (true);

ALTER TABLE master_school_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read master_school_types" ON master_school_types;
CREATE POLICY "Public Read master_school_types" ON master_school_types FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service All master_school_types" ON master_school_types;
CREATE POLICY "Service All master_school_types" ON master_school_types FOR ALL USING (true);

ALTER TABLE master_gender_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read master_gender_types" ON master_gender_types;
CREATE POLICY "Public Read master_gender_types" ON master_gender_types FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service All master_gender_types" ON master_gender_types;
CREATE POLICY "Service All master_gender_types" ON master_gender_types FOR ALL USING (true);

ALTER TABLE master_mediums ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read master_mediums" ON master_mediums;
CREATE POLICY "Public Read master_mediums" ON master_mediums FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service All master_mediums" ON master_mediums;
CREATE POLICY "Service All master_mediums" ON master_mediums FOR ALL USING (true);

ALTER TABLE master_facilities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read master_facilities" ON master_facilities;
CREATE POLICY "Public Read master_facilities" ON master_facilities FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service All master_facilities" ON master_facilities;
CREATE POLICY "Service All master_facilities" ON master_facilities FOR ALL USING (true);

ALTER TABLE udise_private_schools ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read udise_private_schools" ON udise_private_schools;
CREATE POLICY "Public Read udise_private_schools" ON udise_private_schools FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service All udise_private_schools" ON udise_private_schools;
CREATE POLICY "Service All udise_private_schools" ON udise_private_schools FOR ALL USING (true);

ALTER TABLE school_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read school_profiles" ON school_profiles;
CREATE POLICY "Public Read school_profiles" ON school_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service All school_profiles" ON school_profiles;
CREATE POLICY "Service All school_profiles" ON school_profiles FOR ALL USING (true);

