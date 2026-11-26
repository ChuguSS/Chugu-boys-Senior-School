export type PageRoute =
  | 'home'
  | 'about'
  | 'academics'
  | 'admissions'
  | 'facilities'
  | 'student-life'
  | 'news'
  | 'gallery'
  | 'contact'
  | 'admin';

export interface SchoolProfile {
  schoolName: string;
  motto: string;
  established: string;
  location: string;
  postalAddress: string;
  telephone: string;
  email: string;
  principalName: string;
  schoolType: string;
  cluster: string;
  educationSystem: string;
  vision: string;
  mission: string;
  principalWelcomeHeading: string;
  principalWelcomeBody: string;
  admissionsOpen: boolean;
  admissionsBannerTitle: string;
  admissionsBannerText: string;
  historySummary: string;
  mapEmbedQuery?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  xUrl?: string;
  crestUrl?: string;
  heroImageUrl?: string;
  scienceLabImageUrl?: string;
  ictLabImageUrl?: string;
  sportsImageUrl?: string;
  updatedAt?: unknown;
  updatedBy?: string;
}

export interface EditablePage {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  body: string;
  verificationNote?: string;
  updatedAt?: unknown;
  updatedBy?: string;
}

export type LearningPathway = 'Core' | 'STEM' | 'Social Sciences' | 'Technical & Applied';
export type OfferingStatus = 'confirmed' | 'verification_required';

export interface LearningArea {
  id: string;
  name: string;
  pathway: LearningPathway;
  status: OfferingStatus;
  description: string;
  sortOrder: number;
  authorUid: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type NewsCategory =
  | 'School Announcement'
  | 'Academic Update'
  | 'Admissions Notice'
  | 'Events & Calendar'
  | 'Examination Notice'
  | 'Student Achievement';

export interface NewsItem {
  id: string;
  title: string;
  category: NewsCategory;
  summary: string;
  body: string;
  eventDate?: string;
  imageUrl?: string;
  published: boolean;
  authorUid: string;
  authorName: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type GalleryCategory =
  | 'School Environment'
  | 'Classrooms & Laboratories'
  | 'Academic Activities'
  | 'Student Activities'
  | 'Sports'
  | 'Events & Celebrations'
  | 'School Leadership & Visitors';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  caption: string;
  imageUrl: string;
  authorUid: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type DocumentCategory =
  | 'Admission Form'
  | 'Fee Structure'
  | 'Academic Circular'
  | 'CBE Guide';

export interface SchoolDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  academicYear: string;
  description: string;
  fileName: string;
  contentSummary: string;
  externalUrl?: string;
  authorUid: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type EnquiryType =
  | 'Grade 10 Admission'
  | 'Academic Enquiry'
  | 'General Contact'
  | 'Campus Visit';

export type EnquiryStatus = 'new' | 'reviewed' | 'responded';

export interface Enquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  enquiryType: EnquiryType;
  pathwayInterest?: string;
  message: string;
  status: EnquiryStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type StaffRoleType = 'principal' | 'teacher' | 'editor';

export interface StaffRole {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  role: StaffRoleType;
  department?: string;
  active: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface StaffRequest {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  department?: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt?: unknown;
  updatedAt?: unknown;
}
