import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { CORE_VALUES, SCHOOL_IMAGES, getSchoolMapUrl } from '../data/defaultSchoolData';
import { SchoolImage } from '../components/SchoolImage';

export const AboutPage: React.FC = () => {
  const { profile, pages } = useSchool();
  const mapUrl = getSchoolMapUrl(profile.mapEmbedQuery);
  const leadershipPage = pages.find((p) => p.slug === 'about_leadership');
  const achievementsPage = pages.find((p) => p.slug === 'about_achievements');

  const welcomeParagraphs = profile.principalWelcomeBody
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-[#081C3E] via-[#0E3168] to-[#134287] text-white py-14 lg:py-20 border-b-2 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold">
            Established {profile.established} · Imenti East Subcounty, Meru County, Kenya
          </p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold text-white text-balance">
            About Chugu Boys Senior School
          </h1>
          <p className="mt-4 text-base text-slate-200 max-w-2xl leading-relaxed">
            A public boys’ senior school (Cluster {profile.cluster}) committed to academic rigour,
            moral discipline, and Competency-Based Education.
          </p>
        </div>
      </section>

      {/* Heritage & Institutional Profile */}
      <section className="py-14 sm:py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-display text-3xl font-bold text-[#0E3168]">
              Our Heritage Since {profile.established}
            </h2>
            <p className="text-base text-slate-700 leading-[1.75]">{profile.historySummary}</p>
            <div className="aspect-[16/9] w-full overflow-hidden border border-slate-200 bg-slate-100">
              <SchoolImage
                src={profile.heroImageUrl || SCHOOL_IMAGES.campusHero}
                alt="Chugu Boys Senior School grounds in Meru County"
              />
            </div>
            <p className="text-xs font-display italic text-slate-500">
              Fig. 1 — Main academic grounds located{' '}
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#0E3168] transition-colors"
              >
                {profile.location}
              </a>
              .
            </p>
          </div>

          {/* Institutional Profile Definition List */}
          <div className="lg:col-span-5 bg-[#F4F7FB] border border-[#D5E0EE] p-6 sm:p-7 shadow-xs">
            <h3 className="font-display text-2xl font-bold text-[#0E3168] pb-4 border-b border-[#D5E0EE]">
              Official School Profile
            </h3>
            <dl className="mt-4 divide-y divide-[#DCE5F1] text-sm">
              {[
                ['Official Name', profile.schoolName],
                ['School Motto', profile.motto],
                ['Year Established', profile.established],
                ['School Type', profile.schoolType],
                ['School Cluster', `Cluster ${profile.cluster}`],
                ['Education System', profile.educationSystem],
                ['Principal', profile.principalName],
                ['Subcounty & Constituency', 'Imenti East Subcounty · North Imenti Constituency'],
              ].map(([label, val]) => (
                <div key={label} className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <dt className="text-slate-600 font-medium">{label}</dt>
                  <dd className="text-[#0B0F17] font-semibold sm:text-right tabular-nums break-words">
                    {val}
                  </dd>
                </div>
              ))}
              <div className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <dt className="text-slate-600 font-medium shrink-0">Physical Location</dt>
                <dd className="text-[#0B0F17] font-semibold sm:text-right break-words">
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#0E3168] underline decoration-[#0E3168]/40 underline-offset-2 hover:text-[#16468F] transition-colors"
                    title="Open verified Google Maps position"
                  >
                    <span>{profile.location}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </a>
                </dd>
              </div>
              <div className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <dt className="text-slate-600 font-medium">Postal Address</dt>
                <dd className="text-[#0B0F17] font-semibold sm:text-right">{profile.postalAddress}</dd>
              </div>
              <div className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <dt className="text-slate-600 font-medium">Telephone</dt>
                <dd className="text-[#0B0F17] font-semibold sm:text-right tabular-nums">
                  <a
                    href={`tel:${profile.telephone.replace(/\s+/g, '')}`}
                    className="text-[#0E3168] hover:underline"
                  >
                    {profile.telephone}
                  </a>
                </dd>
              </div>
              <div className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <dt className="text-slate-600 font-medium">Official Email</dt>
                <dd className="text-[#0B0F17] font-semibold sm:text-right break-all">
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-[#0E3168] hover:underline"
                  >
                    {profile.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Vision, Mission & Core Values */}
      <section className="py-14 sm:py-16 bg-[#F4F7FB] border-b border-[#DCE5F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 p-7 sm:p-8 shadow-xs">
              <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                Institutional Vision
              </p>
              <blockquote className="mt-3 font-display text-2xl italic text-[#0E3168] leading-relaxed">
                “{profile.vision}”
              </blockquote>
            </div>
            <div className="bg-white border border-slate-200 p-7 sm:p-8 shadow-xs">
              <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                Institutional Mission
              </p>
              <p className="mt-3 text-base text-slate-700 leading-relaxed">{profile.mission}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-7 sm:p-8 shadow-xs">
            <h2 className="font-display text-2xl font-bold text-[#0E3168]">Core Values</h2>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {CORE_VALUES.map((value, idx) => (
                <div key={value} className="border-t border-[#D5E0EE] pt-3">
                  <span className="text-xs font-semibold text-[#8E6307] tabular-nums">
                    0{idx + 1}.
                  </span>
                  <p className="mt-1 font-display text-lg font-semibold text-[#0B0F17]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principal's Profile & Message */}
      <section className="py-14 sm:py-16 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
            Principal’s Office
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-[#0E3168] text-balance">
            {profile.principalWelcomeHeading}
          </h2>
          <div className="mt-6 space-y-4 text-base text-slate-700 leading-[1.75]">
            {welcomeParagraphs.map((para, i) => (
              <p
                key={i}
                className={i === 0 ? 'font-display text-xl italic font-semibold text-[#0E3168]' : ''}
              >
                {para}
              </p>
            ))}
          </div>
          <p className="mt-6 font-display text-lg font-bold text-[#0B0F17]">
            {profile.principalName}
          </p>
          <p className="text-sm text-slate-600">Principal, Chugu Boys Senior School.</p>
        </div>
      </section>

      {/* Editable Governance & Achievements Sections */}
      <section className="py-14 sm:py-16 bg-[#F4F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <figure className="bg-white border border-slate-200 overflow-hidden">
              <div className="aspect-[16/10] w-full bg-slate-100">
                <SchoolImage
                  src={SCHOOL_IMAGES.adminBlock}
                  alt="Chugu Boys Senior School Administration Block and main entrance balcony"
                />
              </div>
              <figcaption className="p-4 text-xs font-display italic text-slate-600">
                Fig. 2 — Administration Block & Main Academic Entrance bearing the Strive to Excel motto.
              </figcaption>
            </figure>
            <figure className="bg-white border border-slate-200 overflow-hidden">
              <div className="aspect-[16/10] w-full bg-slate-100">
                <SchoolImage
                  src={SCHOOL_IMAGES.mainGate}
                  alt="Main school entrance gatehouse at Chugu Boys Senior School"
                />
              </div>
              <figcaption className="p-4 text-xs font-display italic text-slate-600">
                Fig. 3 — Main perimeter entrance gate welcoming students, parents, and stakeholders.
              </figcaption>
            </figure>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 p-7 sm:p-8 shadow-xs">
              <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                Governance
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#0E3168]">
                {leadershipPage?.title || 'Leadership & Institutional Administration'}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {leadershipPage?.body}
              </p>
              {leadershipPage?.verificationNote && (
                <p className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                  {leadershipPage.verificationNote}
                </p>
              )}
            </div>

            <div className="bg-white border border-slate-200 p-7 sm:p-8 shadow-xs">
              <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                Growth & Records
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#0E3168]">
                {achievementsPage?.title || 'Institutional Development & Verified Milestones'}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {achievementsPage?.body}
              </p>
              {achievementsPage?.verificationNote && (
                <p className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                  {achievementsPage.verificationNote}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
