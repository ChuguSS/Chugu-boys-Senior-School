import React, { useMemo, useState } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { SCHOOL_IMAGES } from '../data/defaultSchoolData';
import { LearningPathway, OfferingStatus } from '../types/school';
import { SchoolImage } from '../components/SchoolImage';

export const AcademicsPage: React.FC = () => {
  const { learningAreas, pages, profile } = useSchool();
  const [pathwayFilter, setPathwayFilter] = useState<'All' | LearningPathway>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | OfferingStatus>('All');

  const cbePage = pages.find((p) => p.slug === 'academics_cbe');

  const filteredAreas = useMemo(() => {
    return learningAreas.filter((area) => {
      const matchesPathway = pathwayFilter === 'All' || area.pathway === pathwayFilter;
      const matchesStatus = statusFilter === 'All' || area.status === statusFilter;
      return matchesPathway && matchesStatus;
    });
  }, [learningAreas, pathwayFilter, statusFilter]);

  const confirmedCount = learningAreas.filter((a) => a.status === 'confirmed').length;
  const verificationCount = learningAreas.filter((a) => a.status === 'verification_required').length;

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#081C3E] via-[#0E3168] to-[#134287] text-white py-14 lg:py-20 border-b-2 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold">
            {profile.educationSystem} · Cluster {profile.cluster}
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-bold text-white text-balance">
            Senior School Academics & CBE Pathways
          </h1>
          <p className="mt-4 text-base text-slate-100 max-w-2xl leading-relaxed">
            Delivering learner-centred instruction across STEM and Social Sciences pathways while
            maintaining transparent distinction between confirmed offerings and specialized options
            undergoing school verification.
          </p>
        </div>
      </section>

      {/* Pathways Breakdown */}
      <section className="py-14 sm:py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                Curriculum Architecture
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-[#0E3168]">
                {cbePage?.title || 'CBE Implementation, Assessment & Learner Support'}
              </h2>
            </div>
            <p className="text-base text-slate-700 leading-[1.75] whitespace-pre-line">
              {cbePage?.body}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="border border-[#D5E0EE] bg-[#F4F7FB] p-5">
                <h3 className="font-display text-xl font-bold text-[#0E3168]">STEM Pathway</h3>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  Prepares learners for engineering, medicine, ICT, agriculture, and scientific
                  research through Biology, Chemistry, Physics, Computer Studies, and Agriculture.
                </p>
              </div>
              <div className="border border-[#D5E0EE] bg-[#F4F7FB] p-5">
                <h3 className="font-display text-xl font-bold text-[#0E3168]">
                  Social Sciences Pathway
                </h3>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  Prepares learners for law, commerce, governance, education, and media through
                  Literature, Business Studies, Geography, History & Citizenship, and CRE.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="aspect-[4/3] w-full overflow-hidden border border-slate-200 bg-slate-100">
              <SchoolImage
                src={profile.scienceLabImageUrl || SCHOOL_IMAGES.scienceLab}
                alt="Senior School tuition wing and academic facilities at Chugu Boys Senior School"
              />
            </div>
            <div className="border border-[#D5E0EE] bg-[#F4F7FB] p-5">
              <p className="text-xs uppercase tracking-widest text-[#0E3168] font-semibold">
                Offering Transparency
              </p>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-2xl font-display font-bold text-[#0E3168] tabular-nums">
                    {confirmedCount}
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5">Confirmed Learning Areas</p>
                </div>
                <div>
                  <span className="text-2xl font-display font-bold text-[#8E6307] tabular-nums">
                    {verificationCount}
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5">Requiring School Verification</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filterable Learning Areas Catalog */}
      <section className="py-14 sm:py-16 bg-[#F4F7FB] border-b border-[#DCE5F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-[#0E3168]">
                Learning Areas & Subject Options
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Filter by CBE pathway or verification status. Authorized academic staff can update
                subject confirmations in the Staff Admin Portal.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Pathway Filter */}
              <div
                role="group"
                aria-label="Filter by pathway"
                className="flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200"
              >
                {(['All', 'Core', 'STEM', 'Social Sciences', 'Technical & Applied'] as const).map(
                  (pathway) => (
                    <button
                      key={pathway}
                      type="button"
                      aria-pressed={pathwayFilter === pathway}
                      onClick={() => setPathwayFilter(pathway)}
                      className={`px-3.5 py-2 min-h-[40px] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        pathwayFilter === pathway
                          ? 'bg-[#0E3168] text-white'
                          : 'text-slate-700 hover:bg-[#F4F7FB] hover:text-[#0E3168]'
                      }`}
                    >
                      {pathway}
                    </button>
                  )
                )}
              </div>

              {/* Status Filter */}
              <div
                role="group"
                aria-label="Filter by confirmation status"
                className="flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200"
              >
                {(
                  [
                    ['All', 'All Statuses'],
                    ['confirmed', 'Confirmed'],
                    ['verification_required', 'Pending Verification'],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    aria-pressed={statusFilter === val}
                    onClick={() => setStatusFilter(val)}
                    className={`px-3.5 py-2 min-h-[40px] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      statusFilter === val
                        ? 'bg-[#081326] text-white'
                        : 'text-slate-700 hover:bg-[#F4F7FB] hover:text-[#0E3168]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredAreas.length === 0 ? (
            <div className="bg-white border border-slate-200 p-10 text-center text-sm text-slate-600">
              No learning areas match the selected filter combination.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAreas.map((area) => (
                <article
                  key={area.id}
                  className="bg-white border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:border-[#0E3168]/40 hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-600">
                      <span className="font-semibold text-[#0E3168]">{area.pathway}</span>
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        {area.status === 'confirmed' ? (
                          <>
                            <CheckCircle2
                              className="w-3.5 h-3.5 text-[#0E3168]"
                              aria-hidden="true"
                            />
                            <span className="text-[#0E3168]">Confirmed Offering</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-[#8E6307]" aria-hidden="true" />
                            <span className="text-[#8E6307]">Requires School Verification</span>
                          </>
                        )}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-xl font-bold text-[#0B0F17]">
                      {area.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Assessment & Academic Performance Notice */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-slate-200 p-7 sm:p-8 shadow-xs">
            <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
              Learner Support
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-[#0E3168]">
              Teaching Approaches & Formative Assessment
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed">
              Teachers integrate laboratory experiments, project work, guided group research, ICT
              simulations, and continuous formative assessments to track every boy’s mastery of
              competencies and provide timely academic mentorship.
            </p>
          </div>
          <div className="border border-[#D5E0EE] bg-[#F4F7FB] p-7 sm:p-8 shadow-xs">
            <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
              Verified Records Policy
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-[#0E3168]">
              Academic Performance & Examination Results
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed">
              Verified national examination analyses, subject mean scores, and university transition
              statistics are published exclusively after official certification by the Principal’s
              Office. {cbePage?.verificationNote}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
