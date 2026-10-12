# 🏫 CSEEL School Profile Section API — Complete Specification & Reference Manual

> **Document Version:** 3.2.0  
> **Environment:** Next.js 14 App Router / TypeScript  
> **Last Updated:** October 2026  
> **Base URLs:**  
> - **Localhost:** `http://localhost:3000`  
> - **Production:** `https://cseel.org`  

---

## 📌 Executive Summary

The **CSEEL School Profile Section API** is a modular RESTful interface designed to manage, read, and mutate institutional school profiles across India. Each school profile is broken into **14 independent, decoupled sections** (Hero, Stats, Academics, Facilities, Fees, Gallery, etc.).

This architecture enables:
1. **Granular Retrieval**: Fetch only the data needed for a specific section or tab.
2. **Partial Updates (CRUD)**: Update individual sections without overwriting the entire profile.
3. **Strict Validation & Character Limits**: Each field enforces specific `max_chars`, `min_chars`, `max_items`, and `allowed_types` to prevent UI layout breakage.
4. **Multi-Channel Access**: Works seamlessly with React client components, Admin Visual Editors, Magic Token edit links, and external AI agent webhooks.

---

## 🔐 1. Authentication & Access Levels

| Access Tier | Header / Param | Allowed Operations | Typical Consumer |
|---|---|---|---|
| **Public Read** | None | `GET` (All 14 sections) | Website visitors, public search, search engines |
| **Visual Magic Token** | `?token=csl_ai_magic_{udise}` | `GET`, `PUT`, `PATCH` | Verified School Principals & Admins via one-click link |
| **AI Webhook Token** | `?token=sync_{udise}` | `GET`, `POST` (Schema Sync) | AI Automation pipelines, Government sync crawlers |
| **Platform Master** | `x-api-key: <MASTER_KEY>` | All HTTP Verbs | CSEEL Superadmin & Platform Backend |

---

## 🌐 2. Core API Endpoints

### 2.1 Read Operations (`GET`)

| Operation | Endpoint | Description |
|---|---|---|
| **Read Entire School (All 14 Sections)** | `GET /api/school-section/{udiseCode}` | Returns metadata, summary, and all 14 sections with their field rules. |
| **Read Single Specific Section** | `GET /api/school-section/{udiseCode}/{sectionId}` | Returns rules and data for one targeted section. |
| **Verify UDISE / Claim Status** | `GET /api/school/verification-status?udise={udiseCode}` | Returns whether a school profile has been claimed or verified. |
| **AI Sync Schema Endpoint** | `GET /api/school-ai-sync?token={sync_token}` | Returns interactive HTML dashboard or JSON schema blueprint. |

### 2.2 Write / Mutate Operations (`POST`, `PUT`, `PATCH`, `DELETE`)

| Operation | Method | Endpoint | Description |
|---|---|---|---|
| **Replace Single Section** | `PUT` or `POST` | `/api/school-section/{udiseCode}/{sectionId}` | Full overwrite of a single section's data. |
| **Patch Single Section** | `PATCH` | `/api/school-section/{udiseCode}/{sectionId}` | Merges fields into existing section data without resetting others. |
| **Bulk Update Multiple Sections** | `POST` or `PUT` | `/api/school-section/{udiseCode}` | Updates multiple sections in a single request payload. |
| **Reset Section to Defaults** | `DELETE` | `/api/school-section/{udiseCode}/{sectionId}` | Removes custom overrides and restores UDISE government defaults. |

---

## 📐 3. Master Section Catalog (All 14 Canonical Sections)

| # | Canonical ID | Aliases | UI Component / Tab | Description |
|---|---|---|---|---|
| 1 | `basic_info` | `section_1_basic_info`, `identity`, `general` | Header / Quick Profile | Official school identity, UDISE, board, logo, established year. |
| 2 | `hero` | `section_2_hero_prestige_metrics`, `home`, `banner` | Home Hero Section | Double-line headlines, tagline, CTA buttons, helpline, rotating media. |
| 3 | `stats` | `section_4_statistics`, `metrics`, `key_metrics` | Home Metrics Strip | 8 Key statistical cards (Board, Nature, Management, STR, Students). |
| 4 | `about` | `section_5_about_and_vision`, `vision`, `heritage` | Home About Section | Heritage narrative, vision, mission, and campus architecture photo. |
| 5 | `principal` | `section_6_principal_desk`, `leadership` | Home Principal Section | Principal portrait, headline quote, official desk welcome message. |
| 6 | `management` | `section_management_desk`, `governing_body` | Home Management Section | Governing society trust, chairperson message, and official seal. |
| 7 | `academics` | `section_7_academics`, `curriculum`, `streams` | Academics Tab | Class span, NEP 2020 highlights, stream categories & subject lists. |
| 8 | `results` | `board_results`, `exam_results` | Academics / Results Tab | 10th & 12th Board exam performance history, toppers, pass rates. |
| 9 | `facilities` | `section_8_facilities`, `infrastructure`, `amenities` | Facilities Tab | Standardized catalog of 62+ verified campus labs, amenities & grounds. |
| 10 | `gallery` | `section_9_campus_gallery`, `photos`, `videos` | Campus Gallery Tab | Categorized photo albums (Labs, Sports, Events) & video walkthrough. |
| 11 | `fees` | `section_10_fee_structure`, `tuition` | Admissions & Fees Tab | Class-wise tuition fee grid, extra charges, and fee policies. |
| 12 | `admissions` | `section_11_admissions_guidelines`, `process` | Admissions & Fees Tab | Active academic session, mandatory documents, eligibility, process cards. |
| 13 | `faqs` | `section_12_faqs`, `faq` | FAQ Section / Tab | Authentic categorized Q&A for prospective parent inquiries. |
| 14 | `contact` | `section_13_contact_details`, `location` | Contact Us Tab | Postal address, GPS coordinates, social links, and 4 specialized contact desks. |

---

## 🔍 4. Section-by-Section Deep Technical Analysis

---

### Section 1: `basic_info` (Basic Institutional Identity)
- **Primary Endpoint:** `GET /api/school-section/{udiseCode}/basic_info`
- **Frontend Target:** Header badge, Quick Profile drawer, SEO OpenGraph metadata.

#### Field Rules & Constraints:
| Field Name | Type | Max Chars | Min Chars | Required | Business Rule & Description |
|---|---|---|---|:---:|---|
| `school_name` | `string` | 65 | 3 | Yes | Full official school name as registered in UDISE+ records. |
| `udise_code` | `string` | 11 | 11 | Yes | Exactly 11 alphanumeric digits. Primary institutional key. |
| `board` | `string` | 50 | 2 | Yes | Primary board affiliation (e.g., `CBSE`, `ICSE`, `State Board`). |
| `medium` | `string` | 35 | - | No | Primary instruction medium (e.g., `English`, `Hindi & English`). |
| `established_year` | `string` | 10 | 4 | No | Year founded (e.g., `1998`). |
| `campus_area` | `string` | 25 | - | No | Land size (e.g., `5.5 Acres`, `12,000 Sq. Mtrs`). |
| `school_type` | `string` | 40 | - | No | Management category (e.g., `Independent Private`, `Government`). |
| `school_category` | `string` | 45 | - | No | Class category (e.g., `Senior Secondary with Grades 1 to 12`). |
| `gender_type` | `enum` | - | - | No | Allowed: `Co-Educational`, `Boys`, `Girls`. |
| `affiliation_number`| `string` | 30 | - | No | Official board affiliation code (e.g., `2130456`). |
| `branding.logo_image_url` | `image_url` | 500 | - | No | School crest / emblem URL. Square 1:1 recommended. |
| `branding.hero_banner_image` | `image_url` | 500 | - | No | Wide panoramic campus cover photo. 16:9 ratio recommended. |

---

### Section 2: `hero` (Hero Banner, Headlines & Media Showcase)
- **Primary Endpoint:** `GET /api/school-section/{udiseCode}/hero`
- **Frontend Target:** `SchoolHeroSection.tsx` (Critical Above-the-fold component).

#### Field Rules & Constraints:
| Field Name | Type | Max Limit | Min Limit | Description & Business Rules |
|---|---|---|---|---|
| `heading_line1` | `string` | 45 chars | 2 chars | Top line of dominant hero headline (Default: *"Play, Learn and"*). |
| `heading_line2` | `string` | 45 chars | 2 chars | Highlight colored line of headline (Default: *"Grow, Together.."*). |
| `tagline` | `string` | 90 chars | - | Eyebrow punchline or slogan. |
| `description` | `string` | 350 chars | 40 chars | Personalized narrative highlighting school's STEM & pedagogical vision. |
| `admissions_open` | `boolean` | - | - | Toggles glowing green *"Admissions Open"* badge vs inactive state. |
| `boarding_status` | `enum` | - | - | Allowed: `Day School`, `Residential School`, `Day Boarding`. |
| `helpline_phone` | `string` | 20 chars | 8 chars | Phone number displayed on top-right quick call pill. |
| `cta_enroll_text` | `string` | 25 chars | 2 chars | Primary filled pill action button text (Default: *"Enroll Now"*). |
| `cta_video_text` | `string` | 25 chars | 2 chars | Secondary outlined pill action button text (Default: *"Watch Video"*). |
| `hero_media_items` | `array` | **Max 5 items** | 0 items | Media items rotating inside circular frame. |
| `hero_media_items[].type` | `enum` | - | - | Allowed: `image`, `video`, `gif`. Supports YouTube embeds and direct MP4s. |
| `hero_media_items[].url` | `url` | 500 chars | 5 chars | Media asset URL. |
| `hero_media_items[].title` | `string` | 50 chars | - | Caption badge shown at the bottom of the circular frame. |
| `prestige_metrics` | `object` | 4 cards | - | 4 floating highlight cards (Board, STR Ratio, Classrooms, Class Range). |
| `prestige_metrics.*.value` | `string` | 14 chars | - | Highlight value (e.g. `CBSE`, `1:18`, `24+`, `Class 1-12`). |
| `prestige_metrics.*.label` | `string` | 25 chars | - | Highlight label (e.g. `Affiliated Board`, `Student-Teacher Ratio`). |

---

### Section 3: `stats` (Physical Campus Statistics & 8 Metric Cards)
- **Primary Endpoint:** `GET /api/school-section/{udiseCode}/stats`
- **Frontend Target:** `SchoolStatsSection.tsx` (8 Elevated Metric Cards).

#### Field Rules & Constraints:
| Field Name | Type | Limit / Range | Description |
|---|---|---|---|
| `total_students` | `number` | 0 – 50,000 | Verified total student enrollment. |
| `total_boys` / `total_girls` | `number` | 0 – 25,000 | Gender-wise breakdown. |
| `total_teachers` | `number` | 0 – 2,500 | Total employed faculty members. |
| `male_teachers` / `female_teachers` | `number` | 0 – 1,500 | Gender-wise faculty breakdown. |
| `student_teacher_ratio` | `string` | Max 10 chars | Formatted ratio (e.g. `1:18`, `1:20`). |
| `classrooms_count` | `number` | 0 – 500 | Functional instructional classrooms. |
| `working_smart_boards` | `number` | 0 – 500 | Functional digital smart display boards. |
| `campus_area` | `string` | Max 25 chars | Campus land acreage. |
| `board` | `string` | Max 25 chars | Card 1 value: Affiliation Board. |
| `school_nature` | `string` | Max 25 chars | Card 2 value: School Nature (Day / Residential). |
| `management_type` | `string` | Max 30 chars | Card 3 value: Management Type. |
| `medium` | `string` | Max 25 chars | Card 4 value: Instruction Medium. |
| `gender_type` | `string` | Max 25 chars | Card 5 value: Student Gender (Co-ed). |

---

### Section 4: `about` (Pedagogy, Philosophy & Legacy)
- **Primary Endpoint:** `GET /api/school-section/{udiseCode}/about`
- **Frontend Target:** `SchoolAboutSection.tsx` & `SchoolAboutCardsSection.tsx`.

#### Field Rules & Constraints:
| Field Name | Type | Max Chars | Min Chars | Description |
|---|---|---|---|---|
| `about_eyebrow` | `string` | 35 | 3 | Eyebrow pill text (*"ABOUT OUR INSTITUTION"*). |
| `about_heading_l1` | `string` | 35 | 2 | Headline line 1 (*"More Than Just"*). |
| `about_heading_l2` | `string` | 35 | 2 | Headline line 2 (*"An Education.."*). |
| `about_text` | `string` | 1200 | 50 | Comprehensive narrative on school heritage & pedagogy. |
| `vision_text` | `string` | 400 | 20 | Long-term institutional vision statement. |
| `mission_text` | `string` | 400 | 20 | Actionable educational mission statement. |
| `about_badge_text` | `string` | 30 | - | Floating badge on campus image (*"Excellence in Action"*). |
| `about_campus_photo`| `image_url` | 500 | - | Arched architecture photo URL. |
| `cta_text` | `string` | 30 | - | Button label (*"Discover Our Story"*). |
| `heritage_years` | `string` | 30 | - | Legacy badge string (*"25+ Years Legacy"*). |

---

### Section 5: `principal` (Principal's Desk & Leadership Message)
- **Primary Endpoint:** `GET /api/school-section/{udiseCode}/principal`
- **Frontend Target:** `SchoolPrincipalMessageSection.tsx`.

#### Field Rules & Constraints:
| Field Name | Type | Max Chars | Min Chars | Description |
|---|---|---|---|---|
| `principal_eyebrow` | `string` | 35 | - | Eyebrow badge (*"FROM THE PRINCIPAL'S DESK"*). |
| `principal_heading_l1`| `string` | 35 | - | Header line 1 (*"Inspiring Leadership,"*). |
| `principal_heading_l2`| `string` | 35 | - | Header line 2 (*"Nurturing Excellence.."*). |
| `principal_name` | `string` | 60 | 3 | Full name of Principal / Head of School. |
| `principal_designation`| `string` | 50 | - | Title (e.g. `Principal & Academic Director`). |
| `principal_quote` | `string` | 250 | 20 | Featured pull-quote in large italic serif font. |
| `principal_body_1` | `string` | 600 | 40 | Welcome address paragraph 1. |
| `principal_body_2` | `string` | 600 | 40 | Welcome address paragraph 2. |
| `principal_tagline` | `string` | 40 | - | Short closing sign-off commitment. |
| `principal_image_url`| `image_url` | 500 | - | Circular portrait photo URL (Square aspect ratio). |
| `principal_phone` | `string` | 20 | - | Direct office extension or contact telephone. |
| `principal_email` | `string` | 60 | - | Official correspondence email. |

---

### Section 6: `management` (Governing Body & Trust Message)
- **Primary Endpoint:** `GET /api/school-section/{udiseCode}/management`
- **Frontend Target:** `SchoolManagementMessageSection.tsx`.

#### Field Rules & Constraints:
| Field Name | Type | Max Chars | Description |
|---|---|---|---|
| `mgmt_eyebrow` | `string` | 35 | Section eyebrow (*"GOVERNING BODY & MANAGEMENT"*). |
| `mgmt_heading_prefix` | `string` | 25 | Prefix (*"Message from"*). |
| `mgmt_heading` | `string` | 60 | Title (*"School Management & Governing Trust"*). |
| `management_name` | `string` | 70 | Chairperson / President full name. |
| `management_society` | `string` | 90 | Registered Society or Trust name. |
| `management_designation` | `string` | 60 | Official designation title. |
| `management_quote` | `string` | 250 | Featured governing vision quote. |
| `management_message_p1` | `string` | 600 | Management vision paragraph 1. |
| `management_message_p2` | `string` | 600 | Management vision paragraph 2. |
| `management_logo` | `image_url` | 500 | Registered Trust seal / official emblem URL. |

---

### Section 7: `academics` (Curriculum & Streams)
- **Primary Endpoint:** `GET /api/school-section/{udiseCode}/academics`
- **Frontend Target:** `SchoolAcademicsTab.tsx`.

#### Field Rules & Constraints:
| Field Name | Type | Limits | Description |
|---|---|---|---|
| `class_from` | `string` | Max 10 chars | Starting grade (e.g. `Nursery`, `1`). |
| `class_to` | `string` | Max 10 chars | Ending grade (e.g. `10`, `12`). |
| `class_range` | `string` | Max 35 chars | Formatted span (e.g. `Class 1 to Class 12`). |
| `curriculum_features` | `array` | **Max 8 items** | NEP 2020 pedagogical points (Max 100 chars each). |
| `stream_categories` | `array` | **Max 6 streams** | Sr. Secondary streams with categorized subjects. |
| `stream.name` | `string` | Max 40 chars | Stream title (e.g. `Science (Medical)`, `Commerce`). |
| `stream.subjects` | `array` | **Max 10 subjects** | Individual subject names (Max 35 chars each). |

---

### Section 8: `results` (Board Examination Results)
- **Primary Endpoint:** `GET /api/school-section/{udiseCode}/results`
- **Frontend Target:** `SchoolBoardResultsSection.tsx`.

#### Field Rules & Constraints:
| Field Name | Type | Limits | Description |
|---|---|---|---|
| `class10Results` | `array` | **Max 5 years** | Class 10th board result records. |
| `class12Results` | `array` | **Max 5 years** | Class 12th board result records. |
| `year` | `string` | Max 10 chars | Academic session (e.g. `2024-25`). |
| `totalStudents` | `number` | 1 – 1,000 | Number of candidates appeared. |
| `passedStudents` | `number` | 0 – 1,000 | Number of candidates passed. |
| `passPercentage` | `number` | 0.0 – 100.0 | Calculated pass percentage. |
| `maxScorePercent` | `number` | 0.0 – 100.0 | School topper score percentage. |
| `above90PercentCount`| `number` | 0 – 500 | Students scoring 90%+ distinctions. |

---

### Section 9: `facilities` (Campus Labs & Amenities)
- **Primary Endpoint:** `GET /api/school-section/{udiseCode}/facilities`
- **Frontend Target:** `SchoolFacilitiesSection.tsx` & `SchoolFacilitiesTab.tsx`.

#### Field Rules & Constraints:
| Field Name | Type | Limits | Description |
|---|---|---|---|
| `facilities_eyebrow` | `string` | Max 35 chars | Eyebrow title (*"OUR CAMPUS INFRASTRUCTURE"*). |
| `facilities_heading` | `string` | Max 50 chars | Main header (*"Campus Facilities & Learning Infrastructure"*). |
| `all_facilities_count` | `number` | 62 | Fixed count of standardized facilities supported. |
| `facilities_list` | `array` | **Max 62 items** | Facilities with `key`, `name`, `category`, and `selected` boolean. |
| `selected_facility_names`| `array` | Variable | Array of names of facilities verified on campus. |

---

### Section 10: `gallery` (Visual Campus Tour & Walkthrough)
- **Primary Endpoint:** `GET /api/school-section/{udiseCode}/gallery`
- **Frontend Target:** `SchoolGalleryTab.tsx` & `SchoolCampusSection.tsx`.

#### Field Rules & Constraints:
| Field Name | Type | Limits | Description |
|---|---|---|---|
| `gallery_eyebrow` | `string` | Max 35 chars | Header eyebrow (*"VISUAL CAMPUS TOUR"*). |
| `gallery_heading` | `string` | Max 60 chars | Section title. |
| `gallery_items` | `array` | **Max 30 items** | Catalog of campus media items. |
| `gallery_items[].type` | `enum` | - | Allowed: `image`, `video`. |
| `gallery_items[].title`| `string` | Max 50 chars | Media title / caption. |
| `gallery_items[].category`| `enum` | - | Allowed: `Campus`, `Labs`, `Sports`, `Events`, `Classrooms`. |
| `gallery_items[].url` | `url` | Max 500 chars | CDN image URL or YouTube video link. |
| `categories` | `array` | 6 categories | Valid filtering tabs: `['All', 'Campus', 'Labs', 'Sports', 'Events', 'Classrooms']`. |
| `campus_video_url` | `url` | Max 500 chars | Featured full-length campus walkthrough video URL. |

---

### Section 11: `fees` (Tuition Fees & Policy Terms)
- **Primary Endpoint:** `GET /api/school-section/{udiseCode}/fees`
- **Frontend Target:** `SchoolFeeSection.tsx`.

#### Field Rules & Constraints:
| Field Name | Type | Limits | Description |
|---|---|---|---|
| `annual_fee` | `string` / `number`| Max 30 chars | Summary fee range (e.g. `₹25,000 - ₹50,000/yr`). |
| `fee_table` | `object` | Max 15 rows | Grade-wise tuition fee breakdown grid (columns & rows). |
| `extra_charges_table` | `object` | Max 10 rows | Admission fees, security deposit & annual charges. |
| `fee_terms_list` | `array` | **Max 10 items** | Policy cards (Due date, Payment modes, Refund, Sibling concession). |
| `fee_terms_list[].title`| `string` | Max 60 chars | Policy card title. |
| `fee_terms_list[].description`| `string` | Max 300 chars | Detailed explanation of fee rule. |
| `admission_phone` | `string` | Max 20 chars | Accounts / fee desk phone number. |
| `admission_email` | `string` | Max 60 chars | Accounts / fee desk email address. |

---

### Section 12: `admissions` (Criteria, Documents & Process)
- **Primary Endpoint:** `GET /api/school-section/{udiseCode}/admissions`
- **Frontend Target:** `SchoolAdmissionsTab.tsx`.

#### Field Rules & Constraints:
| Field Name | Type | Limits | Description |
|---|---|---|---|
| `session` | `string` | Max 15 chars | Target academic year (e.g. `2026-27`). |
| `admissions_open` | `boolean` | - | True if online portal or campus counter is accepting forms. |
| `admission_status` | `string` | Max 35 chars | Human-readable status badge (e.g. `Admissions Open`). |
| `required_documents` | `array` | **Max 10 items** | Mandatory documents checklist (Max 80 chars each). |
| `age_criteria` | `string` | Max 120 chars | NEP 2020 age eligibility guideline rule. |
| `admissions_cards` | `array` | **Max 6 cards** | Stage-wise admission process cards. |
| `admission_card.title`| `string` | Max 40 chars | Card heading (e.g. *"Primary Fresh Admissions"*). |
| `admission_card.criteria`| `string` | Max 140 chars | Age and interaction requirements. |

---

### Section 13: `faqs` (Frequently Asked Questions)
- **Primary Endpoint:** `GET /api/school-section/{udiseCode}/faqs`
- **Frontend Target:** `SchoolFaqSection.tsx`.

#### Field Rules & Constraints:
| Field Name | Type | Limits | Description |
|---|---|---|---|
| `faq_items` | `array` | **Max 25 items** | Collection of authenticated Q&A cards. |
| `faq_item.id` | `string` | Max 30 chars | Unique FAQ key. |
| `faq_item.question` | `string` | Max 150 chars | Parent inquiry question text. |
| `faq_item.answer` | `string` | Max 600 chars | Official school answer response. |
| `faq_item.category` | `string` | Max 30 chars | Category tag (e.g. `Admissions`, `Transport`, `Fees`, `Facilities`). |

---

### Section 14: `contact` (Locations & Multi-Desk Directory)
- **Primary Endpoint:** `GET /api/school-section/{udiseCode}/contact`
- **Frontend Target:** `SchoolContactDetailSection.tsx` & `SchoolAddressMapSection.tsx`.

#### Field Rules & Constraints:
| Field Name | Type | Limits | Description |
|---|---|---|---|
| `address` | `string` | Max 200 chars | Complete postal street address. |
| `pincode` | `string` | 6 chars | 6-digit Indian Postal PIN code (e.g. `110091`). |
| `district` / `state` | `string` | Max 40 chars | Administrative district and state. |
| `latitude` / `longitude`| `number` | Float | Decimal coordinates for Leaflet / Google Maps rendering. |
| `website` | `url` | Max 150 chars | Official school portal URL. |
| `campus_video_url` | `url` | Max 500 chars | Video walkthrough link. |
| `social_links` | `object` | Max 200 chars | Links to Facebook, Instagram, YouTube, LinkedIn. |
| `desks` | `object` | 4 Desks | 4 Dedicated campus enquiry channels: |
| `desks.general_enquiry` | `object` | Phone & Email | General reception desk. |
| `desks.admissions_office`| `object` | Phone & Email | Admissions helpline. |
| `desks.principal_office` | `object` | Phone & Email | Principal's secretariat. |
| `desks.careers_desk` | `object` | Phone & Email | HR / Teacher recruitment desk. |

---

## 💻 5. Complete JSON Response Examples

### 5.1 Single Section Read Example (`hero` section):
```http
GET /api/school-section/07040320905/hero HTTP/1.1
Host: localhost:3000
Accept: application/json
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "udiseCode": "07040320905",
  "schoolName": "Ahlcon International School",
  "section": {
    "id": "hero",
    "name": "Hero Banner & Prestige Metrics",
    "description": "Hero cover image, admissions status, boarding/nature status, and floating attraction metrics.",
    "field_rules": {
      "heading_line1": {
        "type": "string",
        "max_chars": 45,
        "description": "Primary headline first line (e.g. Play, Learn and)"
      },
      "heading_line2": {
        "type": "string",
        "max_chars": 45,
        "description": "Primary headline colored line (e.g. Grow, Together..)"
      },
      "tagline": {
        "type": "string",
        "max_chars": 90,
        "description": "Eyebrow punchline or slogan"
      },
      "description": {
        "type": "string",
        "max_chars": 350,
        "min_chars": 40,
        "description": "Introductory campus narrative paragraph"
      },
      "hero_media_items": {
        "type": "array",
        "max_items": 5,
        "allowed_types": ["image", "video", "gif"],
        "description": "Rotating circular showcase media items (Max 5 photos/videos)"
      }
    },
    "data": {
      "isVisible": true,
      "school_name": "Ahlcon International School",
      "udise_code": "07040320905",
      "affiliated_board": "CBSE",
      "heading_line1": "Play, Learn and",
      "heading_line2": "Grow, Together..",
      "tagline": "Excellence in Education & Holistic Development",
      "description": "Empowering young minds at Ahlcon International School through experiential inquiry, modern STEM laboratories, foundational values, and holistic character building.",
      "admissions_open": true,
      "boarding_status": "Day School",
      "residential_school": "Day School",
      "helpline_phone": "Admission Helpline",
      "cta_enroll_text": "Enroll Now",
      "cta_video_text": "Watch Video",
      "banner_image": "/images/default-school-campus.jpg",
      "prestige_metrics": {
        "metric_1_board_results": { "value": "CBSE", "label": "Affiliated Board" },
        "metric_2_student_teacher_ratio": { "value": "1:18", "label": "Student-Teacher Ratio" },
        "metric_3_classrooms_labs": { "value": "24+", "label": "Classrooms & Labs" },
        "metric_4_class_range": { "value": "Class 1-12", "label": "Class Range" }
      },
      "hero_media_items": [
        {
          "id": "media-1",
          "type": "image",
          "url": "/images/default-school-campus.jpg",
          "title": "Campus Overview"
        }
      ]
    }
  }
}
```

---

## 🛠️ 6. Mutation Request Examples (`PUT` & `PATCH`)

### 6.1 Update Hero Section (`PUT /api/school-section/07040320905/hero`):
```http
PUT /api/school-section/07040320905/hero HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer <MAGIC_TOKEN_OR_SESSION>

{
  "heading_line1": "Innovate, Explore and",
  "heading_line2": "Excel Every Day..",
  "tagline": "Empowering Global STEAM Leaders",
  "admissions_open": true,
  "hero_media_items": [
    {
      "id": "media-1",
      "type": "image",
      "url": "https://cdn.example.com/school-campus-lawn.jpg",
      "title": "Main Academic Block"
    },
    {
      "id": "media-2",
      "type": "video",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "title": "Campus Drone Tour"
    }
  ]
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "udiseCode": "07040320905",
  "sectionId": "hero",
  "action": "updated",
  "message": "Hero section updated successfully.",
  "timestamp": 1791645000000
}
```

---

## 🚨 7. Error Handling & HTTP Status Codes

| HTTP Status | Error Code | Cause | Resolution |
|---|---|---|---|
| `400 Bad Request` | `INVALID_SECTION_ID` | Requested section name does not exist. | Refer to Canonical Section Catalog (e.g. `hero`, `fees`). |
| `404 Not Found` | `SCHOOL_NOT_FOUND` | Provided UDISE code does not match any registered school. | Verify 11-digit UDISE number. |
| `413 Payload Too Large`| `MAX_ITEMS_EXCEEDED` | Media array exceeded limit (e.g. > 5 items in hero). | Reduce array length to meet `max_items`. |
| `422 Unprocessable`| `LENGTH_EXCEEDED` | Text field exceeded `max_chars`. | Truncate string to meet maximum character limit. |
| `500 Server Error` | `SERVER_ERROR` | Internal database or file write failure. | Check server logs or inspect permissions. |

---

## 💡 8. Integration Best Practices

1. **Check `field_rules` Before Submission**:  
   Client applications should inspect the `field_rules` metadata in the `GET` response to configure client-side form validations and character counters dynamically.
2. **Normalized UDISE Numbers**:  
   Always strip whitespace, hyphens, and non-alphanumeric characters before dispatching requests.
3. **Use PATCH for Incremental Edits**:  
   When updating only a single attribute (like toggling `admissions_open`), prefer `PATCH` over `PUT` to prevent accidental overwrites of existing media arrays.
