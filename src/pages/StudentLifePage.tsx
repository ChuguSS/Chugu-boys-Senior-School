import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { SCHOOL_IMAGES } from '../data/defaultSchoolData';
import { SchoolImage } from '../components/SchoolImage';

const STUDENT_LIFE_PILLARS = [
  {
    index: '01',
    title: 'Sports & Ball Games',
    description:
      'Team sports including football and court ball games foster sportsmanship, physical fitness, resilience, and healthy inter-school competition.',
  },
  {
    index: '02',
    title: 'Athletics',
    description:
      'Track and field training programmes help learners develop stamina, personal discipline, and athletic achievement at sub-county and county meets.',
  },
  {
    index: '03',
    title: 'Indoor Games',
    description:
      'Structured indoor recreation such as chess and table games sharpen strategic thinking, patience, and analytical concentration.',
  },
  {
    index: '04',
    title: 'Music & Performing Arts',
    description:
      'Choral music, drama, public speaking, and cultural expression nurture creativity, confidence, and teamwork among learners.',
  },
  {
    index: '05',
    title: 'Clubs & Societies',
    description:
      'Subject-based and interest clubs (Science & Innovation, ICT, Debate, Environmental, Journalism) extend classroom learning into practical projects.',
  },
  {
    index: '06',
    title: 'Student Leadership',
    description:
      'An active Student Council empowers prefects and class representatives to practice accountable peer leadership and service.',
  },
  {
    index: '07',
    title: 'Guidance & Counselling',
    description:
      'Dedicated teacher-counsellors walk alongside learners to support academic goal setting, emotional wellbeing, and career pathway decisions.',
  },
  {
    index: '08',
    title: 'Spiritual & Character Development',
    description:
      'Pastoral mentorship and worship fellowships uphold moral integrity, compassion, and respect across the student body.',
  },
  {
    index: '09',
    title: 'School Discipline & Personal Development',
    description:
      'Consistent standards of punctuality, tidy dress, self-respect, and accountability prepare every boy for responsible adulthood.',
  },
];

export const StudentLifePage: React.FC = () => {
  const { pages, profile } = useSchool();
  const studentLifePage = pages.find((p) => p.slug === 'student_life_overview');

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#081C3E] via-[#0E3168] to-[#134287] text-white py-14 lg:py-20 border-b-2 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold">
            Holistic Formation · Strive to Excel
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-bold text-white text-balance">
            Student Life & Co-Curriculars
          </h1>
          <p className="mt-4 text-base text-slate-100 max-w-2xl leading-relaxed">
            Shaping balanced young men through athletics, clubs, student leadership, spiritual
            growth, and strong personal discipline.
          </p>
        </div>
      </section>

      {/* Feature Split */}
      <section className="py-14 sm:py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
              Beyond the Classroom
            </p>
            <h2 className="font-display text-3xl font-bold text-[#0E3168]">
              {studentLifePage?.title || 'Student Life, Character & Co-Curricular Formation'}
            </h2>
            <p className="text-base text-slate-700 leading-[1.75] whitespace-pre-line">
              {studentLifePage?.body}
            </p>
            {studentLifePage?.verificationNote && (
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                {studentLifePage.verificationNote}
              </p>
            )}
          </div>
          <div className="lg:col-span-6 border border-slate-200 overflow-hidden bg-slate-100">
            <SchoolImage
              src={profile.sportsImageUrl || SCHOOL_IMAGES.sportsField}
              alt="Chugu Boys students in blue and yellow sports kits gathered on the playing field"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Real Student Life & Co-Curricular Highlights */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
              School Community
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold text-[#0E3168]">
              Student Life & Co-Curricular Activities in Pictures
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <figure className="border border-[#D5E0EE] bg-[#F4F7FB] overflow-hidden shadow-xs">
              <div className="aspect-[4/3] w-full bg-slate-100 border-b border-[#D5E0EE]">
                <SchoolImage
                  src={SCHOOL_IMAGES.studentLeadership}
                  alt="Chugu Boys student leaders and school staff outside the Administration Block"
                />
              </div>
              <figcaption className="p-5">
                <p className="text-xs font-semibold text-[#8E6307] uppercase tracking-wider">
                  Student Leadership
                </p>
                <p className="mt-1.5 text-sm text-slate-700">
                  Prefects and student leaders partnering with administration outside the Strive to Excel entrance.
                </p>
              </figcaption>
            </figure>
            <figure className="border border-[#D5E0EE] bg-[#F4F7FB] overflow-hidden shadow-xs">
              <div className="aspect-[4/3] w-full bg-slate-100 border-b border-[#D5E0EE]">
                <SchoolImage
                  src={SCHOOL_IMAGES.treePlantingMentorship}
                  alt="Environmental club tree planting and mentorship at Chugu Boys"
                />
              </div>
              <figcaption className="p-5">
                <p className="text-xs font-semibold text-[#8E6307] uppercase tracking-wider">
                  Environmental Stewardship
                </p>
                <p className="mt-1.5 text-sm text-slate-700">
                  Hands-on tree planting and school conservation mentorship alongside school leadership.
                </p>
              </figcaption>
            </figure>
            <figure className="border border-[#D5E0EE] bg-[#F4F7FB] overflow-hidden shadow-xs">
              <div className="aspect-[4/3] w-full bg-slate-100 border-b border-[#D5E0EE]">
                <SchoolImage
                  src={SCHOOL_IMAGES.studentLifeGroup}
                  alt="Chugu Boys students gathered on the green lawn during co-curricular fellowship"
                />
              </div>
              <figcaption className="p-5">
                <p className="text-xs font-semibold text-[#8E6307] uppercase tracking-wider">
                  Brotherhood & Outings
                </p>
                <p className="mt-1.5 text-sm text-slate-700">
                  Students sharing camaraderie during co-curricular outings, clubs, and mentorship events.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 9 Pillars Grid */}
      <section className="py-14 sm:py-16 bg-[#F4F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="font-display text-3xl font-bold text-[#0E3168]">
              Co-Curricular & Pastoral Programmes
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Every learner participates in structured sports, clubs, mentorship, and leadership
              activities throughout the academic term.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STUDENT_LIFE_PILLARS.map((item) => (
              <article
                key={item.index}
                className="bg-white border border-slate-200 p-6 sm:p-7 transition-all duration-200 hover:border-[#0E3168]/40 hover:shadow-sm"
              >
                <span className="text-xs font-semibold text-[#8E6307] tabular-nums">
                  {item.index}.
                </span>
                <h3 className="mt-2 font-display text-xl font-bold text-[#0E3168]">{item.title}</h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
