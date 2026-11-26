import React from 'react';
import { ExternalLink } from 'lucide-react';
import { isSafeExternalUrl, useSchool } from '../context/SchoolContext';
import { SCHOOL_IMAGES, getSchoolMapUrl } from '../data/defaultSchoolData';
import { PageRoute } from '../types/school';
import { SchoolImage } from './SchoolImage';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { profile } = useSchool();
  const mapUrl = getSchoolMapUrl(profile.mapEmbedQuery);

  const handleGo = (page: PageRoute) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#081326] text-slate-300 border-t-2 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Institutional Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white p-1 shrink-0 overflow-hidden border border-white/20">
                <SchoolImage
                  src={profile.crestUrl || SCHOOL_IMAGES.crest}
                  alt="Chugu Boys Senior School Crest"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-white tracking-tight">
                  {profile.schoolName}
                </h2>
                <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold mt-0.5">
                  {profile.motto}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              {profile.schoolType} (Cluster {profile.cluster}) established in{' '}
              <span className="tabular-nums">{profile.established}</span>. Implementing Kenya’s{' '}
              {profile.educationSystem} with STEM and Social Sciences pathways in Imenti East
              Subcounty, North Imenti Constituency, Meru County.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold mb-4">
                Institution
              </h3>
              <ul className="space-y-1.5 text-sm">
                {(
                  [
                    ['home', 'Home'],
                    ['about', 'About Us'],
                    ['academics', 'Academics'],
                    ['admissions', 'Admissions'],
                    ['facilities', 'Facilities'],
                  ] as [PageRoute, string][]
                ).map(([route, label]) => (
                  <li key={route}>
                    <button
                      type="button"
                      onClick={() => handleGo(route)}
                      className="py-1.5 inline-block hover:text-[#F0C95A] transition-colors cursor-pointer text-left"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold mb-4">
                Community & Portal
              </h3>
              <ul className="space-y-1.5 text-sm">
                {(
                  [
                    ['student-life', 'Student Life'],
                    ['news', 'News & Events'],
                    ['gallery', 'Gallery'],
                    ['contact', 'Contact Us'],
                    ['admin', 'Staff Admin Portal'],
                  ] as [PageRoute, string][]
                ).map(([route, label]) => (
                  <li key={route}>
                    <button
                      type="button"
                      onClick={() => handleGo(route)}
                      className="py-1.5 inline-block hover:text-[#F0C95A] transition-colors cursor-pointer text-left"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold mb-4">
              Contact & Location
            </h3>
            <dl className="space-y-2.5 text-sm">
              <div>
                <dt className="text-xs text-slate-400">Physical Location</dt>
                <dd className="text-slate-100 mt-0.5">
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 hover:text-[#F0C95A] underline decoration-slate-500 underline-offset-2 transition-colors"
                    title="View Chugu Boys Senior School on Google Maps"
                  >
                    <span>{profile.location}</span>
                    <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Postal Address</dt>
                <dd className="text-slate-100 mt-0.5">{profile.postalAddress}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Telephone</dt>
                <dd className="text-slate-100 tabular-nums mt-0.5">
                  <a
                    href={`tel:${profile.telephone.replace(/\s+/g, '')}`}
                    className="hover:text-[#F0C95A] transition-colors inline-block py-0.5"
                  >
                    {profile.telephone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Official Email</dt>
                <dd className="text-slate-100 mt-0.5">
                  <a
                    href={`mailto:${profile.email}`}
                    className="hover:text-[#F0C95A] transition-colors inline-block py-0.5 break-all"
                  >
                    {profile.email}
                  </a>
                </dd>
              </div>
            </dl>

            {(isSafeExternalUrl(profile.facebookUrl) ||
              isSafeExternalUrl(profile.youtubeUrl) ||
              isSafeExternalUrl(profile.xUrl)) && (
              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs">
                {isSafeExternalUrl(profile.facebookUrl) && (
                  <a
                    href={profile.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-200 hover:text-[#F0C95A] underline py-1"
                  >
                    Facebook
                  </a>
                )}
                {isSafeExternalUrl(profile.youtubeUrl) && (
                  <a
                    href={profile.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-200 hover:text-[#F0C95A] underline py-1"
                  >
                    YouTube
                  </a>
                )}
                {isSafeExternalUrl(profile.xUrl) && (
                  <a
                    href={profile.xUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-200 hover:text-[#F0C95A] underline py-1"
                  >
                    X (Twitter)
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p className="tabular-nums">
            © {year} {profile.schoolName}. All rights reserved.
          </p>
          <p>
            Principal: {profile.principalName} · Imenti East Subcounty, North Imenti Constituency,
            Meru County
          </p>
        </div>
      </div>
    </footer>
  );
};
