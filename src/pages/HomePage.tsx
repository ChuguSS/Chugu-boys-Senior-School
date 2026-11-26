import React from 'react';
import { ArrowRight, BookOpen, Calendar, Compass, ExternalLink, FlaskConical, MapPin, Phone } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { CORE_VALUES, SCHOOL_IMAGES, getSchoolMapUrl } from '../data/defaultSchoolData';
import { PageRoute } from '../types/school';
import { SchoolImage } from '../components/SchoolImage';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { profile, news, gallery } = useSchool();
  const mapUrl = getSchoolMapUrl(profile.mapEmbedQuery);

  const go = (page: PageRoute) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const welcomeParagraphs = profile.principalWelcomeBody
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const latestNews = news.slice(0, 3);
  const previewGallery = gallery.slice(0, 8);

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative bg-[#081326] text-white overflow-hidden">
        <div className="absolute inset-0">
          <SchoolImage
            src={profile.heroImageUrl || SCHOOL_IMAGES.campusHero}
            alt="Chugu Boys Senior School grounds 5 km East of Meru Town"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#081326]/95 via-[#0B234A]/82 to-[#081326]/45"
            aria-hidden="true"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-5 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white p-1.5 shadow-lg border border-white/25 shrink-0">
                <SchoolImage
                  src={profile.crestUrl || SCHOOL_IMAGES.crest}
                  alt="Official Crest of Chugu Boys Senior School"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-xs sm:text-sm tracking-widest uppercase text-[#F0C95A] font-semibold">
                <span>Est. {profile.established}</span>
                <span className="mx-2 text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span>Cluster {profile.cluster}</span>
                <span className="mx-2 text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span>Meru County, Kenya</span>
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance leading-[1.1]">
              {profile.schoolName}
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-[#F0C95A] font-semibold tracking-widest uppercase">
              Motto: {profile.motto}
            </p>

            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-100 leading-relaxed max-w-2xl">
              {profile.schoolType} implementing Kenya’s {profile.educationSystem} through dedicated
              STEM and Social Sciences pathways — shaping disciplined, confident young men since{' '}
              <span className="tabular-nums">{profile.established}</span>.
            </p>

            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => go('admissions')}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold bg-[#D4AF37] text-[#081326] hover:bg-[#E5C158] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
              >
                <span>Explore Grade 10 Admissions</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go('academics')}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold border border-white/50 bg-[#081326]/40 text-white hover:bg-white/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>CBE Academic Pathways</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Institutional Key Facts Strip */}
      <section
        aria-label="Institutional Summary"
        className="bg-gradient-to-r from-[#081C3E] via-[#0E3168] to-[#081C3E] text-white border-b-2 border-[#D4AF37]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-0 lg:divide-x lg:divide-white/15">
          <div className="pb-4 sm:pb-0 lg:pr-5 border-b sm:border-b-0 border-white/15">
            <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold">
              Established
            </p>
            <p className="mt-1 font-display text-xl font-semibold tabular-nums text-white">
              {profile.established} — Over 50 Years
            </p>
          </div>
          <div className="pb-4 sm:pb-0 lg:px-5 border-b sm:border-b-0 border-white/15">
            <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold">
              Classification
            </p>
            <p className="mt-1 font-display text-xl font-semibold text-white">
              Cluster {profile.cluster} Public Boys’ Senior School
            </p>
          </div>
          <div className="pb-4 sm:pb-0 lg:px-5 border-b sm:border-b-0 border-white/15">
            <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold">
              Curriculum
            </p>
            <p className="mt-1 font-display text-xl font-semibold text-white">
              CBE · STEM & Social Sciences
            </p>
          </div>
          <div className="lg:pl-5">
            <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold">
              Location & Office
            </p>
            <p className="mt-1 text-sm text-slate-100 leading-snug">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/40 underline-offset-2 hover:text-[#F0C95A] hover:decoration-[#F0C95A] transition-colors inline-flex items-baseline gap-1"
                title="View Chugu Boys Senior School on Google Maps"
              >
                <span>{profile.location}</span>
                <ExternalLink className="w-3 h-3 inline shrink-0 self-center" aria-hidden="true" />
              </a>
              <br />
              <a
                href={`tel:${profile.telephone.replace(/\s+/g, '')}`}
                className="inline-block mt-1 tabular-nums text-[#F0C95A] font-semibold hover:underline"
              >
                {profile.telephone}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* 3. Admissions Announcement Band */}
      <section className="bg-[#F4F7FB] border-b border-[#DCE5F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest font-semibold text-[#8E6307]">
              {profile.admissionsOpen ? 'Admissions Notice · Active' : 'Admissions Information'}
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-[#0E3168]">
              {profile.admissionsBannerTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              {profile.admissionsBannerText}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => go('admissions')}
              className="min-h-[44px] px-5 py-3 text-sm font-semibold bg-[#0E3168] text-white hover:bg-[#16468F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Apply / Enquire About Admission
            </button>
            <button
              type="button"
              onClick={() => go('contact')}
              className="min-h-[44px] px-5 py-3 text-sm font-semibold border border-[#0E3168]/30 bg-white text-[#0E3168] hover:bg-[#EAF0F8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Contact Office
            </button>
          </div>
        </div>
      </section>

      {/* 4. Principal's Welcome Message */}
      <section className="py-14 sm:py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-[#D5E0EE] bg-[#F4F7FB] p-6 shadow-xs">
              <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                Office of the Principal
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-[#0E3168]">
                {profile.principalName}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Principal, Chugu Boys Senior School
              </p>
              <div className="mt-6 pt-5 border-t border-[#D5E0EE] space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#0E3168] mt-0.5 shrink-0" aria-hidden="true" />
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-[#0E3168]/30 underline-offset-2 hover:text-[#0E3168] hover:decoration-[#0E3168] transition-colors"
                    title="Open school location in Google Maps"
                  >
                    {profile.location}
                  </a>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#0E3168] mt-0.5 shrink-0" aria-hidden="true" />
                  <a
                    href={`tel:${profile.telephone.replace(/\s+/g, '')}`}
                    className="tabular-nums font-medium hover:text-[#0E3168] hover:underline transition-colors"
                  >
                    {profile.telephone}
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => go('about')}
                className="mt-6 w-full min-h-[44px] py-2.5 px-4 text-sm font-semibold border border-[#0E3168] text-[#0E3168] bg-white hover:bg-[#0E3168] hover:text-white transition-colors cursor-pointer"
              >
                Read School Profile & History
              </button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
              Principal’s Welcome Message
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0E3168] text-balance leading-tight">
              {profile.principalWelcomeHeading}
            </h2>
            <div className="mt-6 space-y-4 text-base text-slate-700 leading-[1.75] max-w-prose">
              {welcomeParagraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 1
                      ? 'first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-[#0E3168] first-letter:float-left first-letter:mr-3 first-letter:mt-1'
                      : idx === 0
                      ? 'font-display text-2xl italic font-semibold text-[#0E3168]'
                      : ''
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="font-display text-lg font-bold text-[#0B0F17]">
                {profile.principalName}
              </p>
              <p className="text-sm text-slate-600">Principal, Chugu Boys Senior School.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Heritage, Vision, Mission & Core Values */}
      <section className="py-14 sm:py-16 lg:py-24 bg-[#F4F7FB] border-b border-[#DCE5F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-5">
              <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                Institutional Identity · Est. {profile.established}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-[#0E3168] text-balance">
                Over Five Decades of Discipline & Learning
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed">
                {profile.historySummary}
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 p-7 shadow-xs">
                <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                  School Vision
                </p>
                <p className="mt-3 font-display text-xl italic text-[#0B0F17] leading-relaxed">
                  “{profile.vision}”
                </p>
              </div>
              <div className="bg-white border border-slate-200 p-7 shadow-xs">
                <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                  School Mission
                </p>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                  {profile.mission}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-200">
              <h3 className="font-display text-2xl font-semibold text-[#0E3168]">
                Our Eight Core Values
              </h3>
              <span className="text-xs uppercase tracking-widest text-slate-600 font-medium">
                Character · Integrity · Service
              </span>
            </div>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
              {CORE_VALUES.map((val, idx) => (
                <div key={val} className="border-t border-[#D5E0EE] pt-3">
                  <span className="text-xs font-semibold text-[#8E6307] tabular-nums">
                    0{idx + 1}.
                  </span>
                  <p className="mt-1 font-display text-lg font-semibold text-[#0B0F17]">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Academic Pathways (CBE) & Facilities Highlights */}
      <section className="py-14 sm:py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                Competency-Based Education (CBE)
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0E3168] text-balance">
                Senior School Academic Pathways
              </h2>
            </div>
            <button
              type="button"
              onClick={() => go('academics')}
              className="min-h-[40px] inline-flex items-center gap-2 text-sm font-semibold text-[#0E3168] hover:text-[#16468F] hover:underline cursor-pointer whitespace-nowrap self-start md:self-auto"
            >
              <span>View Full CBE Curriculum & Subjects</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <article className="border border-[#D5E0EE] bg-[#F4F7FB] flex flex-col transition-all duration-200 hover:border-[#0E3168]/40 hover:shadow-md">
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-[#D5E0EE]">
                <SchoolImage
                  src={profile.scienceLabImageUrl || SCHOOL_IMAGES.scienceLab}
                  alt="Senior School tuition courtyard wing and academic block at Chugu Boys Senior School"
                />
              </div>
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <FlaskConical className="w-4 h-4 text-[#0E3168]" aria-hidden="true" />
                    <span className="font-medium text-[#0E3168]">Pathway 01</span>
                    <span aria-hidden="true">·</span>
                    <span>Pure Sciences, Computing & Agriculture</span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-bold text-[#0E3168]">
                    STEM Pathway
                  </h3>
                  <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                    Developing scientific inquiry, analytical problem solving, and digital skills
                    across Mathematics, Biology, Chemistry, Physics, Computer Studies, and
                    Agriculture, supported by practical laboratory sessions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => go('academics')}
                  className="mt-6 self-start min-h-[40px] text-sm font-semibold text-[#0E3168] hover:text-[#16468F] hover:underline cursor-pointer"
                >
                  Explore STEM Learning Areas →
                </button>
              </div>
            </article>

            <article className="border border-[#D5E0EE] bg-[#F4F7FB] flex flex-col transition-all duration-200 hover:border-[#0E3168]/40 hover:shadow-md">
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-[#D5E0EE]">
                <SchoolImage
                  src={profile.ictLabImageUrl || SCHOOL_IMAGES.ictLab}
                  alt="Chugu Boys students seated inside the main study and examination hall"
                />
              </div>
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <BookOpen className="w-4 h-4 text-[#0E3168]" aria-hidden="true" />
                    <span className="font-medium text-[#0E3168]">Pathway 02</span>
                    <span aria-hidden="true">·</span>
                    <span>Humanities, Languages & Business</span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-bold text-[#0E3168]">
                    Social Sciences Pathway
                  </h3>
                  <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                    Cultivating civic leadership, ethical judgment, communication mastery, and
                    enterprise literacy through Literature in English, Business Studies, Geography,
                    History & Citizenship, and Christian Religious Education.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => go('academics')}
                  className="mt-6 self-start min-h-[40px] text-sm font-semibold text-[#0E3168] hover:text-[#16468F] hover:underline cursor-pointer"
                >
                  Explore Social Sciences Offerings →
                </button>
              </div>
            </article>
          </div>

          {/* Facilities & Student Life Dual Feature */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
            <div className="lg:col-span-7 border border-slate-200 p-6 sm:p-8 flex flex-col justify-between bg-white shadow-xs">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                  School & Co-Curriculars
                </p>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#0E3168]">
                  Facilities & Holistic Student Life
                </h3>
                <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                  From classrooms, science laboratories, ICT workspaces, library study rooms, and
                  boarding facilities to football, athletics, music, clubs, and student leadership —
                  every learner has space to grow academically and personally.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => go('facilities')}
                  className="min-h-[44px] px-5 py-2.5 text-sm font-semibold bg-[#0E3168] text-white hover:bg-[#16468F] transition-colors cursor-pointer"
                >
                  Explore School Facilities
                </button>
                <button
                  type="button"
                  onClick={() => go('student-life')}
                  className="min-h-[44px] px-5 py-2.5 text-sm font-semibold border border-[#0E3168]/30 text-[#0E3168] hover:bg-[#F4F7FB] transition-colors cursor-pointer"
                >
                  Student Life & Sports
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 border border-slate-200 overflow-hidden bg-slate-100 min-h-[260px]">
              <SchoolImage
                src={profile.sportsImageUrl || SCHOOL_IMAGES.sportsField}
                alt="Chugu Boys students in yellow and blue sports kits on the main playing field"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Latest News & Announcements */}
      <section className="py-14 sm:py-16 lg:py-24 bg-[#F4F7FB] border-b border-[#DCE5F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                Official Communications
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-[#0E3168]">
                Latest News & Announcements
              </h2>
            </div>
            <button
              type="button"
              onClick={() => go('news')}
              className="min-h-[40px] inline-flex items-center gap-2 text-sm font-semibold text-[#0E3168] hover:text-[#16468F] hover:underline cursor-pointer self-start md:self-auto"
            >
              <span>All News & Events</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-slate-200 flex flex-col justify-between transition-all duration-200 hover:border-[#0E3168]/40 hover:shadow-md"
              >
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                    <SchoolImage
                      src={item.imageUrl || profile.heroImageUrl || SCHOOL_IMAGES.campusHero}
                      alt={item.title}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-[#0E3168]">{item.category}</span>
                      {item.eventDate && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{item.eventDate}</span>
                        </>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-xl font-bold text-[#0B0F17] leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <button
                    type="button"
                    onClick={() => go('news')}
                    className="min-h-[36px] text-sm font-semibold text-[#0E3168] hover:text-[#16468F] hover:underline cursor-pointer"
                  >
                    Read Notice →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Photo Gallery Preview & Quick Contact */}
      <section className="py-14 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14">
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                  School in Pictures
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-[#0E3168]">
                  School Photo Gallery
                </h2>
              </div>
              <button
                type="button"
                onClick={() => go('gallery')}
                className="min-h-[40px] inline-flex items-center gap-2 text-sm font-semibold text-[#0E3168] hover:text-[#16468F] hover:underline cursor-pointer self-start md:self-auto"
              >
                <span>Open Full Gallery</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {previewGallery.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => go('gallery')}
                  className="group text-left border border-slate-200 bg-white overflow-hidden cursor-pointer transition-all duration-200 hover:border-[#0E3168]/40 hover:shadow-md"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <SchoolImage
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-[#8E6307] font-medium">{photo.category}</p>
                    <p className="mt-1 font-display text-base font-semibold text-[#0B0F17] truncate">
                      {photo.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Strip */}
          <div className="bg-gradient-to-br from-[#081C3E] via-[#0E3168] to-[#134287] text-white border-t-2 border-[#D4AF37] p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold">
                Visit or Reach Our Administration
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
                Partnering with Parents & Stakeholders in Meru County
              </h2>
              <p className="mt-2 text-sm text-slate-100 leading-relaxed max-w-2xl">
                Located{' '}
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/40 underline-offset-2 hover:text-[#F0C95A] hover:decoration-[#F0C95A] transition-colors"
                >
                  {profile.location}
                </a>
                . Postal Address: {profile.postalAddress}. Telephone:{' '}
                <a
                  href={`tel:${profile.telephone.replace(/\s+/g, '')}`}
                  className="tabular-nums underline decoration-white/30 hover:text-[#F0C95A]"
                >
                  {profile.telephone}
                </a>{' '}
                · Email:{' '}
                <a
                  href={`mailto:${profile.email}`}
                  className="underline decoration-white/30 hover:text-[#F0C95A]"
                >
                  {profile.email}
                </a>
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row flex-wrap lg:justify-end gap-3">
              <button
                type="button"
                onClick={() => go('contact')}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-[#D4AF37] text-[#081326] hover:bg-[#E5C158] transition-colors cursor-pointer"
              >
                <Compass className="w-4 h-4" aria-hidden="true" />
                <span>Directions & Contact</span>
              </button>
              <button
                type="button"
                onClick={() => go('admissions')}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold border border-white/50 text-white hover:bg-white/15 transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>Admissions</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
