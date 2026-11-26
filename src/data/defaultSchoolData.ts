import {
  EditablePage,
  GalleryItem,
  LearningArea,
  NewsItem,
  SchoolDocument,
  SchoolProfile,
} from '../types/school';

export const SCHOOL_IMAGES = {
  crest: '/assets/aistudio/file_0000000052c88211b26c8aca2afbb734_5d5a4e52.png',
  campusHero: '/assets/aistudio/chugu-school-campus-wide-view_71906a9a.jpg',
  scienceLab: '/assets/aistudio/chugu-school-courtyard-wing_b0de8159.jpg',
  ictLab: '/assets/aistudio/IMG_20180627_101253_0_2ccc354e.jpg',
  sportsField: '/assets/aistudio/IMG_20200206_171434_7_448ca97d.jpg',
  adminBlock: '/assets/aistudio/chugu-school-main-entrance_2e1d42ba.jpg',
  mainGate: '/assets/aistudio/FB_IMG_1543228238874_f27238bb.jpg',
  classroomBlock: '/assets/aistudio/chugu-school-classroom-block_92f15886.jpg',
  courtyardWing: '/assets/aistudio/chugu-school-courtyard-wing_b0de8159.jpg',
  hallStudy: '/assets/aistudio/IMG_20180627_101253_0_2ccc354e.jpg',
  studentCohortAdmin: '/assets/aistudio/IMG_20260610_124943_262_5b70efc7.jpg',
  studentLeadership: '/assets/aistudio/IMG_20260610_125100_118_bb470c9d.jpg',
  treePlantingMentorship: '/assets/aistudio/IMG_20240517_145323_890_da8bd252.jpg',
  treePlantingCohort: '/assets/aistudio/IMG_20240517_143851_902_11b3df8c.jpg',
  studentLifeGroup: '/assets/aistudio/IMG_20260211_182808_874_139036205_54be2086.jpg',
} as const;

export const SCHOOL_MAPS_URL = 'https://maps.app.goo.gl/iz7p5fJ7egkSpSiF9?g_st=aw';
export const DEFAULT_MAP_EMBED_QUERY = 'Chugu Boys Secondary School, Meru, Kenya';

export function getSchoolMapUrl(mapEmbedQuery?: string): string {
  const trimmed = mapEmbedQuery?.trim();
  if (!trimmed || trimmed === DEFAULT_MAP_EMBED_QUERY) {
    return SCHOOL_MAPS_URL;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

export const CORE_VALUES: readonly string[] = [
  'Hardwork',
  'Discipline',
  'Teamwork',
  'Honesty',
  'Professionalism',
  'Compassion',
  'Accountability',
  'Transparency',
];

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  schoolName: 'CHUGU BOYS SENIOR SCHOOL',
  motto: 'STRIVE TO EXCEL',
  established: '1972',
  location:
    '5 km East of Meru Town · Imenti East Subcounty, North Imenti Constituency, Meru County, Kenya',
  postalAddress: 'P.O. Box 565-60200, Meru',
  telephone: '0716 467 080',
  email: 'chuguboys@gmail.com',
  principalName: 'George Gitiye',
  schoolType: "Public Boys' Senior School",
  cluster: 'C3',
  educationSystem: 'Competency-Based Education (CBE)',
  vision: 'To be a school of choice that adds value to life.',
  mission:
    'To provide quality and relevant education that molds an all-round child academically, spiritually, and socially to become a productive citizen who will be fluid enough to change and mold our great nation through teaching and mentoring resources.',
  principalWelcomeHeading:
    'Welcome to Chugu Boys Senior School — Shaping Confident Young Men for Tomorrow!',
  principalWelcomeBody: `Karibu!

On behalf of the Board of Management, teaching staff, non-teaching personnel, and our entire student fraternity, I warmly welcome parents, guardians, prospective Grade 10 learners, alumni, and members of the wider community to the official digital home of Chugu Boys Senior School.

Founded in 1972 and situated five kilometres east of Meru Town in Imenti East Subcounty, North Imenti Constituency in Meru County, our institution stands as a disciplined, forward-looking C3 public boys' senior school dedicated to nurturing young men of integrity, intellectual curiosity, and purposeful leadership. Guided by our enduring motto, "Strive to Excel," we commit ourselves to holistic education that develops the mind, strengthens moral character, and prepares every learner for responsible citizenship.

As Kenya transitions fully into Competency-Based Education (CBE) at Senior School level, Chugu Boys Senior School is focused on delivering structured, practical, and learner-centred instruction across both the STEM and Social Sciences pathways. Through dedicated laboratory learning, critical thinking, innovation, technology engagement, humanities, business education, and mentorship, we equip our boys to solve real-world challenges with confidence and resilience.

I invite you to explore our academic programmes, school facilities, student life, and admissions guidance, and to engage closely with our administration as we partner in shaping confident young men for tomorrow.`,
  admissionsOpen: true,
  admissionsBannerTitle: 'Senior School & Grade 10 Admissions Portal',
  admissionsBannerText:
    'Prospective parents and learners seeking placement under the Competency-Based Education (CBE) STEM and Social Sciences pathways can review requirements, download admission forms, or submit an official enquiry below.',
  historySummary:
    'Established in 1972 in the highland outskirts 5 km East of Meru Town within Imenti East Subcounty, North Imenti Constituency, Meru County, Chugu Boys Senior School has served Meru County and Kenya for over five decades as a public boys’ secondary and senior learning institution. Transitioning from its foundational heritage into a modern Cluster C3 Senior School under Kenya’s Competency-Based Education (CBE) framework, the school continues to uphold discipline, hardwork, academic diligence, and holistic character formation.',
  mapEmbedQuery: DEFAULT_MAP_EMBED_QUERY,
  facebookUrl: '',
  youtubeUrl: '',
  xUrl: '',
  crestUrl: SCHOOL_IMAGES.crest,
  heroImageUrl: SCHOOL_IMAGES.campusHero,
  scienceLabImageUrl: SCHOOL_IMAGES.scienceLab,
  ictLabImageUrl: SCHOOL_IMAGES.ictLab,
  sportsImageUrl: SCHOOL_IMAGES.sportsField,
  updatedBy: 'School Administration',
};

export const DEFAULT_EDITABLE_PAGES: EditablePage[] = [
  {
    id: 'about_leadership',
    slug: 'about_leadership',
    title: 'Leadership & Institutional Administration',
    subtitle: 'Governance structure and administrative offices',
    body: 'Chugu Boys Senior School is led by Principal George Gitiye in collaboration with the Board of Management, Parents Association, Senior Administration, and Heads of Academic and Co-curricular Departments. Specific departmental head names and Board membership rosters can be updated directly by the Principal in the Admin Portal once officially verified.',
    verificationNote:
      'Editable section: Departmental heads, Deputy Principal, and Board of Management member names await school administrative verification.',
    updatedBy: 'School Administration',
  },
  {
    id: 'about_achievements',
    slug: 'about_achievements',
    title: 'Institutional Development & Verified Milestones',
    subtitle: 'Over five decades of serving learners in Meru County',
    body: 'Since its establishment in 1972, Chugu Boys Senior School has steadily strengthened its classroom blocks, practical science spaces, and learner mentorship programmes while transitioning into a C3 public senior school implementing Competency-Based Education. Verified annual national assessment statistics, alumni milestones, and county championship records can be published here by authorized school administrators.',
    verificationNote:
      'Editable section: Verified examination performance records and historical milestones can be entered by authorized staff without fabricated figures.',
    updatedBy: 'School Administration',
  },
  {
    id: 'academics_cbe',
    slug: 'academics_cbe',
    title: 'CBE Implementation, Assessment & Learner Support',
    subtitle: 'Competency-Based Education at Senior School (Grades 10–12)',
    body: 'Instruction at Chugu Boys Senior School aligns with the Kenya Institute of Curriculum Development (KICD) Senior School framework. Teaching emphasises practical inquiry, laboratory experimentation, collaborative problem solving, digital literacy, and continuous formative assessment alongside national summative evaluations. Learners receive structured academic mentorship, career pathway counselling, and targeted remedial support.',
    verificationNote:
      'Subject offerings below clearly distinguish confirmed Senior School core/pathway subjects from specialized technical options pending official school verification.',
    updatedBy: 'Academic Office',
  },
  {
    id: 'admissions_guide',
    slug: 'admissions_guide',
    title: 'Grade 10 & Senior School Admissions Guidance',
    subtitle: 'Requirements, pathways, and reporting instructions',
    body: 'Placement into Chugu Boys Senior School follows Ministry of Education Senior School placement guidelines for Cluster C3 public boys’ schools. Prospective Grade 10 learners select or confirm their preferred CBE pathway (STEM or Social Sciences) during placement and reporting. Parents and guardians should prepare official placement letters, birth certificate copies, Junior School assessment records, and completed medical and admission forms. Exact term reporting dates and official fee schedules are issued directly by the Principal’s office.',
    verificationNote:
      'Editable section: Exact reporting dates, uniform specifications, and MoE-approved fee structure breakdowns should be uploaded by the school bursar/Principal.',
    updatedBy: 'Admissions Office',
  },
  {
    id: 'facilities_overview',
    slug: 'facilities_overview',
    title: 'School Learning Environment & Infrastructure',
    subtitle: 'Supporting practical CBE instruction and student welfare',
    body: 'Located in a serene, accessible setting 5 km East of Meru Town in Imenti East Subcounty, North Imenti Constituency, Meru County, the school supports classroom instruction, practical science experiments, digital studies, library study, boarding welfare, and outdoor athletics. Infrastructure capacities, recent laboratory equipment inventories, and dormitory allocations are maintained by the administration for accuracy.',
    verificationNote:
      'Verification policy: Only verified school facilities are presented; specialized workshop capacities await formal administrative sign-off.',
    updatedBy: 'School Administration',
  },
  {
    id: 'student_life_overview',
    slug: 'student_life_overview',
    title: 'Student Life, Character & Co-Curricular Formation',
    subtitle: 'Developing disciplined, balanced young men',
    body: 'Beyond classroom instruction, boys participate in ball games, athletics, indoor board games, music and drama festivals, academic clubs, student council leadership, guidance and counselling, and pastoral mentorship. Every activity reinforces our core values of hardwork, discipline, teamwork, honesty, professionalism, compassion, accountability, and transparency.',
    verificationNote:
      'Editable section: Active club rosters, sports fixture calendars, and patron assignments can be updated by designated teachers.',
    updatedBy: 'Dean of Students',
  },
];

export const DEFAULT_LEARNING_AREAS: LearningArea[] = [
  {
    id: 'la_math',
    name: 'Mathematics',
    pathway: 'Core',
    status: 'confirmed',
    description: 'Core Senior School numeracy, algebra, geometry, calculus foundations, and applied problem solving across pathways.',
    sortOrder: 1,
    authorUid: 'system',
  },
  {
    id: 'la_english',
    name: 'English',
    pathway: 'Core',
    status: 'confirmed',
    description: 'Academic communication, grammar, composition, comprehension, and oral presentation skills.',
    sortOrder: 2,
    authorUid: 'system',
  },
  {
    id: 'la_kiswahili',
    name: 'Kiswahili',
    pathway: 'Core',
    status: 'confirmed',
    description: 'National and official language fluency, Fasihi, and written composition.',
    sortOrder: 3,
    authorUid: 'system',
  },
  {
    id: 'la_ict',
    name: 'ICT (Digital Literacy)',
    pathway: 'Core',
    status: 'confirmed',
    description: 'Foundational digital productivity, responsible computing, and technology-assisted learning.',
    sortOrder: 4,
    authorUid: 'system',
  },
  {
    id: 'la_biology',
    name: 'Biology',
    pathway: 'STEM',
    status: 'confirmed',
    description: 'Pure sciences track covering cellular biology, genetics, ecology, and practical laboratory investigation.',
    sortOrder: 10,
    authorUid: 'system',
  },
  {
    id: 'la_chemistry',
    name: 'Chemistry',
    pathway: 'STEM',
    status: 'confirmed',
    description: 'Pure sciences track focusing on chemical reactions, analytical titration, and laboratory safety.',
    sortOrder: 11,
    authorUid: 'system',
  },
  {
    id: 'la_physics',
    name: 'Physics',
    pathway: 'STEM',
    status: 'confirmed',
    description: 'Mechanics, electricity, optics, waves, and experimental scientific measurement.',
    sortOrder: 12,
    authorUid: 'system',
  },
  {
    id: 'la_general_science',
    name: 'General Science',
    pathway: 'STEM',
    status: 'verification_required',
    description: 'Integrated applied science option under the STEM pathway; subject to school timetable confirmation.',
    sortOrder: 13,
    authorUid: 'system',
  },
  {
    id: 'la_computer_studies',
    name: 'Computer Studies',
    pathway: 'STEM',
    status: 'confirmed',
    description: 'Programming concepts, systems architecture, databases, and applied software engineering skills.',
    sortOrder: 14,
    authorUid: 'system',
  },
  {
    id: 'la_agriculture',
    name: 'Agriculture',
    pathway: 'STEM',
    status: 'confirmed',
    description: 'Sustainable crop production, livestock management, and agribusiness principles tailored to Meru County.',
    sortOrder: 15,
    authorUid: 'system',
  },
  {
    id: 'la_literature',
    name: 'Literature in English',
    pathway: 'Social Sciences',
    status: 'confirmed',
    description: 'Critical literary analysis, poetry, drama, prose, and expressive writing.',
    sortOrder: 20,
    authorUid: 'system',
  },
  {
    id: 'la_business_studies',
    name: 'Business Studies',
    pathway: 'Social Sciences',
    status: 'confirmed',
    description: 'Entrepreneurship, accounting principles, commerce, and organizational leadership.',
    sortOrder: 21,
    authorUid: 'system',
  },
  {
    id: 'la_geography',
    name: 'Geography',
    pathway: 'Social Sciences',
    status: 'confirmed',
    description: 'Physical landscapes, human settlement, environmental conservation, and map interpretation.',
    sortOrder: 22,
    authorUid: 'system',
  },
  {
    id: 'la_history',
    name: 'History and Citizenship',
    pathway: 'Social Sciences',
    status: 'confirmed',
    description: 'Kenyan, African, and world heritage, civic responsibility, governance, and constitutional literacy.',
    sortOrder: 23,
    authorUid: 'system',
  },
  {
    id: 'la_cre',
    name: 'Christian Religious Education (CRE)',
    pathway: 'Social Sciences',
    status: 'confirmed',
    description: 'Moral formation, ethical reasoning, spiritual development, and community values.',
    sortOrder: 24,
    authorUid: 'system',
  },
  {
    id: 'la_building',
    name: 'Building and Construction',
    pathway: 'Technical & Applied',
    status: 'verification_required',
    description: 'Applied technical specialization in masonry, technical drawing, and structural craft; requires school workshop verification.',
    sortOrder: 30,
    authorUid: 'system',
  },
  {
    id: 'la_electricity',
    name: 'Electricity',
    pathway: 'Technical & Applied',
    status: 'verification_required',
    description: 'Applied electrical installation, circuit theory, and safety practice; requires school lab verification.',
    sortOrder: 31,
    authorUid: 'system',
  },
  {
    id: 'la_power_mechanics',
    name: 'Power Mechanics',
    pathway: 'Technical & Applied',
    status: 'verification_required',
    description: 'Mechanical systems, engine maintenance, and technical diagnostics; requires school workshop verification.',
    sortOrder: 32,
    authorUid: 'system',
  },
  {
    id: 'la_home_science',
    name: 'Home Science',
    pathway: 'Technical & Applied',
    status: 'verification_required',
    description: 'Nutrition, textile design, and household resource management; requires school offering verification.',
    sortOrder: 33,
    authorUid: 'system',
  },
];

export const DEFAULT_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news_cbe_pathways',
    title: 'Senior School CBE Transition: STEM & Social Sciences Pathways Ready',
    category: 'Academic Update',
    summary:
      'Chugu Boys Senior School aligns Senior School instruction with Kenya’s Competency-Based Education framework across STEM and Social Sciences.',
    body: 'Chugu Boys Senior School has structured its academic departments to support learners entering Senior School under Competency-Based Education (CBE). Prospective Grade 10 learners and parents can review both confirmed core/pathway learning areas and practical academic study priorities on the Academics page or enquire with the Dean of Curriculum.',
    eventDate: 'Term I Academic Briefing',
    imageUrl: SCHOOL_IMAGES.hallStudy,
    published: true,
    authorUid: 'system',
    authorName: 'Office of the Principal',
  },
  {
    id: 'news_admissions_guidance',
    title: 'Grade 10 Admissions & Parent Enquiry Desk Open',
    category: 'Admissions Notice',
    summary:
      'Parents and guardians seeking Grade 10 placement information can access downloadable forms and submit enquiries online or via 0716 467 080.',
    body: 'Our Admissions Desk welcomes inquiries from parents, guardians, and prospective students across Meru County and beyond. Please visit the Admissions section to review required documents, pathway choices, and contact the school office during working hours.',
    eventDate: 'Admissions Desk',
    imageUrl: SCHOOL_IMAGES.adminBlock,
    published: true,
    authorUid: 'system',
    authorName: 'Admissions Office',
  },
  {
    id: 'news_ict_practical',
    title: 'Environmental Stewardship & Holistic Student Formation',
    category: 'School Announcement',
    summary:
      'Students and staff unite in school greening, tree planting, and co-curricular mentorship programmes across the term.',
    body: 'Character formation at Chugu Boys Senior School extends beyond the classroom. Through guided tree-planting initiatives, athletics, sports competitions, and active student leadership, boys cultivate teamwork, environmental responsibility, and institutional pride.',
    eventDate: 'Student Life Notice',
    imageUrl: SCHOOL_IMAGES.treePlantingMentorship,
    published: true,
    authorUid: 'system',
    authorName: 'Student Welfare & Co-Curricular Office',
  },
];

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal_campus_overview',
    title: 'Main School & Two-Storey Academic Complex',
    category: 'School Environment',
    caption:
      'Wide view of the main two-storey tuition block featuring the "Strive to Excel" motto, notice board, and green highland grounds.',
    imageUrl: SCHOOL_IMAGES.campusHero,
    authorUid: 'system',
  },
  {
    id: 'gal_main_gate',
    title: 'Main School Entrance Gate',
    category: 'School Environment',
    caption:
      'The stone and steel perimeter gatehouse welcoming learners, parents, and visitors 5 km East of Meru Town in Imenti East Subcounty, North Imenti Constituency.',
    imageUrl: SCHOOL_IMAGES.mainGate,
    authorUid: 'system',
  },
  {
    id: 'gal_admin_block',
    title: 'Administration Block & Main Entrance',
    category: 'School Environment',
    caption:
      'The two-storey stone Administration Block housing the Principal’s Office, staff administration, and upper balcony.',
    imageUrl: SCHOOL_IMAGES.adminBlock,
    authorUid: 'system',
  },
  {
    id: 'gal_tuition_block',
    title: 'Senior School Tuition & Classroom Block',
    category: 'Classrooms & Laboratories',
    caption:
      'Single-storey classroom wing with tiled veranda walkways supporting daily teaching and Senior School learning areas.',
    imageUrl: SCHOOL_IMAGES.classroomBlock,
    authorUid: 'system',
  },
  {
    id: 'gal_courtyard_wing',
    title: 'Tuition Courtyard Wing & Upper Classrooms',
    category: 'Classrooms & Laboratories',
    caption:
      'Inner courtyard view of the upper-level tuition classrooms and landscaped gardens.',
    imageUrl: SCHOOL_IMAGES.courtyardWing,
    authorUid: 'system',
  },
  {
    id: 'gal_study_hall',
    title: 'Supervised Study & Examination Hall Session',
    category: 'Academic Activities',
    caption:
      'Uniformed learners seated inside the spacious multi-purpose dining and examination hall during focused academic preparation.',
    imageUrl: SCHOOL_IMAGES.hallStudy,
    authorUid: 'system',
  },
  {
    id: 'gal_sports_football',
    title: 'Co-Curricular Sports & Field Briefing',
    category: 'Sports',
    caption:
      'Chugu Boys teams dressed in blue and yellow school kits receiving coaching guidance on the main grass playing field.',
    imageUrl: SCHOOL_IMAGES.sportsField,
    authorUid: 'system',
  },
  {
    id: 'gal_student_leadership',
    title: 'Student Leaders & Administration',
    category: 'School Leadership & Visitors',
    caption:
      'Student leadership representatives alongside school staff outside the stone Administration Block.',
    imageUrl: SCHOOL_IMAGES.studentLeadership,
    authorUid: 'system',
  },
  {
    id: 'gal_student_cohort',
    title: 'Students & School Staff at the Administration Block',
    category: 'School Leadership & Visitors',
    caption:
      'A cohort of Chugu Boys learners photographed with teachers beneath the Strive to Excel entrance balcony.',
    imageUrl: SCHOOL_IMAGES.studentCohortAdmin,
    authorUid: 'system',
  },
  {
    id: 'gal_tree_planting',
    title: 'Tree Planting & Mentorship With Leadership',
    category: 'Student Activities',
    caption:
      'Hands-on environmental conservation as school leadership and learners plant and water young tree seedlings.',
    imageUrl: SCHOOL_IMAGES.treePlantingMentorship,
    authorUid: 'system',
  },
  {
    id: 'gal_green_campus_day',
    title: 'Whole-School Environmental Conservation Day',
    category: 'Student Activities',
    caption:
      'Learners holding tree seedlings during a school-wide environmental stewardship and greening activity.',
    imageUrl: SCHOOL_IMAGES.treePlantingCohort,
    authorUid: 'system',
  },
  {
    id: 'gal_student_fellowship',
    title: 'Student Life & Co-Curricular Fellowship',
    category: 'Student Activities',
    caption:
      'Uniformed students gathered on the green lawn during an inter-school co-curricular and mentorship outing.',
    imageUrl: SCHOOL_IMAGES.studentLifeGroup,
    authorUid: 'system',
  },
];

export const DEFAULT_DOCUMENTS: SchoolDocument[] = [
  {
    id: 'doc_admission_form',
    title: 'Grade 10 Senior School Admission & Joining Instruction Form',
    category: 'Admission Form',
    academicYear: '2026 / 2027',
    description:
      'Official student bio-data, parent/guardian declaration, pathway selection, and medical clearance checklist for incoming learners.',
    fileName: 'Chugu_Boys_Grade10_Admission_Form.txt',
    contentSummary: `CHUGU BOYS SENIOR SCHOOL
Motto: STRIVE TO EXCEL | Established: 1972
Location: 5 km East of Meru Town · Imenti East Subcounty, North Imenti Constituency, Meru County, Kenya
Postal Address: P.O. Box 565-60200, Meru | Tel: 0716 467 080 | Email: chuguboys@gmail.com
Principal: George Gitiye | Cluster: C3 | Education System: CBE

GRADE 10 SENIOR SCHOOL ADMISSION & JOINING CHECKLIST
=====================================================
Section A: Learner Details
- Full Official Name (as per Birth Certificate): _____________________________
- Assessment / Placement Number: ___________________________________________
- Preferred CBE Pathway: [ ] STEM   [ ] Social Sciences
- Date of Birth: ____________________   Home County: _______________________

Section B: Parent / Guardian Contact Details
- Parent / Guardian Full Name: _____________________________________________
- Telephone Number: ____________________   Email: __________________________
- Postal / Residential Address: ____________________________________________

Section C: Required Reporting Documents
1. Official Ministry of Education Senior School Placement Letter
2. Original & Copy of Learner's Birth Certificate
3. Junior School Assessment Report / Leaving Certificate
4. Two (2) Recent Coloured Passport-Size Photographs
5. Completed Medical Examination Form signed by a recognized medical officer
6. Parent/Guardian National ID Copy

Note: Reporting dates, boarding requirements, and official MoE-approved fee schedules are confirmed directly by the Principal's Office (0716 467 080).`,
    authorUid: 'system',
  },
  {
    id: 'doc_cbe_pathway_guide',
    title: 'Parent & Learner Guide to CBE Senior School Pathways',
    category: 'CBE Guide',
    academicYear: '2026 / 2027',
    description:
      'Overview of Core subjects, STEM, and Social Sciences pathways offered at Chugu Boys Senior School.',
    fileName: 'Chugu_Boys_CBE_Pathway_Guide.txt',
    contentSummary: `CHUGU BOYS SENIOR SCHOOL — CBE SENIOR SCHOOL PATHWAY GUIDE
Motto: STRIVE TO EXCEL | P.O. Box 565-60200, Meru | Tel: 0716 467 080

1. CORE LEARNING AREAS (ALL LEARNERS)
- Mathematics
- English
- Kiswahili
- ICT (Digital Literacy)

2. STEM PATHWAY (CONFIRMED OFFERINGS)
- Pure Sciences: Biology, Chemistry, Physics
- Applied & Computing: Computer Studies, Agriculture
- Additional Options Pending School Verification: General Science, Building & Construction, Electricity, Power Mechanics, Home Science

3. SOCIAL SCIENCES PATHWAY (CONFIRMED OFFERINGS)
- Humanities & Languages: Literature in English, History and Citizenship, Geography, Christian Religious Education (CRE)
- Business Studies

For pathway selection guidance, contact the Academic Office via chuguboys@gmail.com or 0716 467 080.`,
    authorUid: 'system',
  },
  {
    id: 'doc_fee_circular_placeholder',
    title: 'Official Fee Structure & Boarding Circular (Admin Editable)',
    category: 'Fee Structure',
    academicYear: 'Pending Bursar Upload',
    description:
      'Placeholder circular template to be updated with the Ministry of Education approved term fee structure by the Principal or School Bursar.',
    fileName: 'Chugu_Boys_Fee_Circular_Notice.txt',
    contentSummary: `CHUGU BOYS SENIOR SCHOOL — OFFICIAL FEE CIRCULAR NOTICE
P.O. Box 565-60200, Meru | Tel: 0716 467 080 | Email: chuguboys@gmail.com

NOTICE TO PARENTS AND GUARDIANS:
Official termly fee breakdowns and bank account details are issued strictly by the School Administration and Bursar's Office in accordance with Ministry of Education C3 Public Senior School guidelines.

Authorized administrators can update this document directly in the Staff Admin Portal with verified fee schedules and circular PDF links.`,
    authorUid: 'system',
  },
];
