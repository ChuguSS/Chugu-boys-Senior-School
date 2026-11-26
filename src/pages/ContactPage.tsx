import React from 'react';
import { ExternalLink, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { SCHOOL_IMAGES, getSchoolMapUrl } from '../data/defaultSchoolData';
import { EnquiryForm } from '../components/EnquiryForm';
import { SchoolImage } from '../components/SchoolImage';

export const ContactPage: React.FC = () => {
  const { profile } = useSchool();
  const hasVerifiedMap = Boolean(profile.mapEmbedQuery && profile.mapEmbedQuery.trim().length > 2);
  const safeMapQuery = encodeURIComponent(
    hasVerifiedMap ? profile.mapEmbedQuery!.trim() : 'Chugu Boys Secondary School, Meru, Kenya'
  );
  const mapUrl = getSchoolMapUrl(profile.mapEmbedQuery);

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#081C3E] via-[#0E3168] to-[#134287] text-white py-14 lg:py-20 border-b-2 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold">
            Stakeholder Communication
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-bold text-white text-balance">
            Contact Chugu Boys Senior School
          </h1>
          <p className="mt-4 text-base text-slate-100 max-w-2xl leading-relaxed">
            Reach the Principal’s Office, Admissions Desk, or Academic Administration for learner
            enquiries, school visits, and official communication.
          </p>
        </div>
      </section>

      {/* Contact Grid & Form */}
      <section className="py-14 sm:py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-[#D5E0EE] bg-[#F4F7FB] p-6 sm:p-7 space-y-5 shadow-xs">
              <h2 className="font-display text-2xl font-bold text-[#0E3168]">
                Official Contact Details
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#0E3168] mt-1 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                      Telephone
                    </p>
                    <a
                      href={`tel:${profile.telephone.replace(/\s+/g, '')}`}
                      className="inline-block py-0.5 font-semibold text-[#0B0F17] text-base tabular-nums hover:text-[#0E3168] hover:underline"
                    >
                      {profile.telephone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#0E3168] mt-1 shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                      Official Email
                    </p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-block py-0.5 font-semibold text-[#0B0F17] text-base hover:text-[#0E3168] hover:underline break-all"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#0E3168] mt-1 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                      Physical Location & Postal Address
                    </p>
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-[#0E3168] underline decoration-[#0E3168]/40 underline-offset-2 hover:text-[#16468F] transition-colors"
                      title="Open Chugu Boys Senior School in Google Maps"
                    >
                      <span>{profile.location}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </a>
                    <p className="text-slate-600 mt-0.5">{profile.postalAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 bg-white overflow-hidden shadow-xs">
              <div className="aspect-[16/9] w-full bg-slate-100 border-b border-slate-200">
                <SchoolImage
                  src={SCHOOL_IMAGES.mainGate}
                  alt="Main school entrance gate at Chugu Boys Senior School"
                />
              </div>
              <div className="p-6 sm:p-7 space-y-3">
                <div className="flex items-center gap-2 text-[#0E3168]">
                  <Navigation className="w-4 h-4" aria-hidden="true" />
                  <h3 className="font-display text-xl font-bold">Directions to the School Gate</h3>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Chugu Boys Senior School is situated approximately 5 kilometres East of Meru Town
                  in Imenti East Subcounty, North Imenti Constituency, Meru County, Kenya. Visitors
                  travelling from Meru Town head eastward towards the Chugu area, or follow the{' '}
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#0E3168] underline hover:text-[#16468F]"
                  >
                    verified Google Maps school location
                  </a>{' '}
                  directly to the main gate.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <EnquiryForm
              defaultType="General Contact"
              heading="Send a Message to the School Office"
              subheading="Parents, prospective learners, alumni, and education partners can contact us securely using the form below."
            />
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="py-14 sm:py-16 bg-[#F4F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                Location Map
              </p>
              <h2 className="mt-1 font-display text-3xl font-bold text-[#0E3168]">
                School Location — Imenti East Subcounty, Meru County
              </h2>
            </div>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[40px] inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold border border-[#0E3168] text-[#0E3168] bg-white hover:bg-[#0E3168] hover:text-white transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          {hasVerifiedMap ? (
            <div className="border border-[#D5E0EE] bg-white overflow-hidden shadow-xs">
              <iframe
                title="Chugu Boys Senior School Verified Location Map"
                src={`https://maps.google.com/maps?q=${safeMapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-[320px] sm:h-[400px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="border border-slate-200 bg-white p-8 sm:p-10">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                Verified Coordinates Pending
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-[#0E3168]">
                5 km East of Meru Town · Imenti East Subcounty, North Imenti Constituency, Meru County
              </h3>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
                Per institutional accuracy policy, an interactive embedded Google Map activates here
                automatically as soon as the Principal enters the school’s verified Google Maps
                place name or GPS coordinates in the Staff Admin Portal.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
