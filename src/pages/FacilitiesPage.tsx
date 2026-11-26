import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { SCHOOL_IMAGES } from '../data/defaultSchoolData';
import { SchoolImage } from '../components/SchoolImage';

interface FacilityCard {
  title: string;
  category: string;
  description: string;
  statusNote: string;
  image?: string;
  imageAlt?: string;
}

const FACILITIES_LIST: FacilityCard[] = [
  {
    title: 'Main School & Two-Storey Academic Complex',
    category: 'General Instruction',
    description:
      'Structured two-storey and single-storey tuition blocks situated across well-kept highland grounds designed for focused Senior School teaching and mentorship.',
    statusNote: 'Core school infrastructure · Stream capacity editable by administration',
    image: SCHOOL_IMAGES.campusHero,
    imageAlt: 'Wide view of the main two-storey tuition complex and grounds at Chugu Boys Senior School',
  },
  {
    title: 'Tuition Area & Senior School Classroom Blocks',
    category: 'Tuition & Classrooms',
    description:
      'Dedicated classroom wings with covered veranda walkways supporting CBE learning areas across STEM and Social Sciences pathways.',
    statusNote: 'Core tuition wing · Classroom allocation maintained by Academic Office',
    image: SCHOOL_IMAGES.classroomBlock,
    imageAlt: 'Single-storey tuition and classroom block at Chugu Boys Senior School',
  },
  {
    title: 'Two-Storey Tuition Courtyard Wing',
    category: 'STEM & Senior Studies',
    description:
      'Upper and ground-floor learning rooms enclosing the landscaped courtyard, supporting focused class lessons, practical sciences, and academic consultation.',
    statusNote: 'Core tuition facility · Laboratory & room inventory editable in Admin Portal',
    image: SCHOOL_IMAGES.courtyardWing,
    imageAlt: 'Two-storey stone tuition courtyard wing at Chugu Boys Senior School',
  },
  {
    title: 'Administration Block & Academic Offices',
    category: 'School Governance',
    description:
      'The stone Administration Block housing the Principal’s Office, Deputy Principal, Bursar, and staff coordination offices welcoming parents and visitors.',
    statusNote: 'Central administration · Open weekdays during school hours',
    image: SCHOOL_IMAGES.adminBlock,
    imageAlt: 'Administration Block entrance bearing Strive to Excel motto at Chugu Boys Senior School',
  },
  {
    title: 'Assembly, Dining & Examination Study Hall',
    category: 'Academic & Boarding Welfare',
    description:
      'Spacious ventilated hall used for communal dining, morning assemblies, supervised evening study sessions, and formal Senior School examinations.',
    statusNote: 'Multi-purpose hall · Seating and timetable details managed by administration',
    image: SCHOOL_IMAGES.hallStudy,
    imageAlt: 'Chugu Boys students seated inside the main assembly and study hall',
  },
  {
    title: 'Sports & Outdoor Recreation Grounds',
    category: 'Co-Curriculars & Athletics',
    description:
      'Expansive highland playing fields supporting football, athletics, and physical education programmes that build teamwork, stamina, and school spirit.',
    statusNote: 'Active sports grounds · Track and pitch fixtures updated by Games Department',
    image: SCHOOL_IMAGES.sportsField,
    imageAlt: 'Chugu Boys students in sports kits gathered on the school playing field',
  },
  {
    title: 'Main Entrance Gate & School Security',
    category: 'Perimeter & Access',
    description:
      'Manned stone-and-steel perimeter gatehouse regulating visitor sign-in, student safety, and parent access 5 km East of Meru Town in Imenti East Subcounty, North Imenti Constituency.',
    statusNote: 'Controlled school access · Visitor verification managed at the main gate',
    image: SCHOOL_IMAGES.mainGate,
    imageAlt: 'Main entrance gatehouse of Chugu Boys Senior School',
  },
];

export const FacilitiesPage: React.FC = () => {
  const { pages, profile } = useSchool();
  const facilitiesPage = pages.find((p) => p.slug === 'facilities_overview');

  const facilitiesWithImages: FacilityCard[] = [
    {
      ...FACILITIES_LIST[0],
      image: profile.heroImageUrl || SCHOOL_IMAGES.campusHero,
    },
    FACILITIES_LIST[1],
    {
      ...FACILITIES_LIST[2],
      image: profile.scienceLabImageUrl || SCHOOL_IMAGES.courtyardWing,
    },
    FACILITIES_LIST[3],
    {
      ...FACILITIES_LIST[4],
      image: profile.ictLabImageUrl || SCHOOL_IMAGES.hallStudy,
    },
    {
      ...FACILITIES_LIST[5],
      image: profile.sportsImageUrl || SCHOOL_IMAGES.sportsField,
    },
    FACILITIES_LIST[6],
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#081C3E] via-[#0E3168] to-[#134287] text-white py-14 lg:py-20 border-b-2 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold">
            School Infrastructure
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-bold text-white text-balance">
            School Facilities & Learning Environment
          </h1>
          <p className="mt-4 text-base text-slate-100 max-w-2xl leading-relaxed">
            Supporting practical Competency-Based Education, holistic boarding welfare, and
            co-curricular development in Meru County.
          </p>
        </div>
      </section>

      {/* Editable Overview */}
      <section className="py-14 bg-[#F4F7FB] border-b border-[#DCE5F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0E3168]">
              {facilitiesPage?.title || 'School Learning Environment & Infrastructure'}
            </h2>
            <p className="mt-3 text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {facilitiesPage?.body}
            </p>
          </div>
          <div className="lg:col-span-4 bg-white border border-slate-200 p-6 shadow-xs">
            <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
              Accuracy Notice
            </p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              {facilitiesPage?.verificationNote ||
                'Only verified school facilities are showcased here; detailed capacities await school confirmation.'}
            </p>
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {facilitiesWithImages.map((facility) => (
            <article
              key={facility.title}
              className="border border-slate-200 bg-white flex flex-col justify-between transition-all duration-200 hover:border-[#0E3168]/40 hover:shadow-md"
            >
              <div>
                {facility.image && (
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                    <SchoolImage
                      src={facility.image}
                      alt={facility.imageAlt || facility.title}
                    />
                  </div>
                )}
                <div className="p-6 sm:p-7">
                  <p className="text-xs text-[#8E6307] font-semibold uppercase tracking-wider">
                    {facility.category}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl font-bold text-[#0E3168]">
                    {facility.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                    {facility.description}
                  </p>
                </div>
              </div>
              <div className="px-6 sm:px-7 pb-6 pt-3 border-t border-slate-100 text-xs text-slate-500">
                {facility.statusNote}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
