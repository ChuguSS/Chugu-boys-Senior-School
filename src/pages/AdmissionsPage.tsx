import React, { useState } from 'react';
import { ChevronDown, Download, ExternalLink, FileText } from 'lucide-react';
import { isSafeExternalUrl, useSchool } from '../context/SchoolContext';
import { getSchoolMapUrl } from '../data/defaultSchoolData';
import { SchoolDocument } from '../types/school';
import { EnquiryForm } from '../components/EnquiryForm';

const FAQS = [
  {
    q: 'How are Grade 10 learners admitted to Chugu Boys Senior School?',
    a: 'Admissions follow Ministry of Education Senior School placement procedures for Cluster C3 public boys’ schools. Parents and learners may also submit an enquiry or visit the school office with official placement documentation for guidance.',
  },
  {
    q: 'Which CBE pathways are offered at the school?',
    a: 'Chugu Boys Senior School implements the STEM pathway (Pure Sciences, Computer Studies, Agriculture) and the Social Sciences pathway (Humanities, Languages, and Business Studies), alongside core Senior School subjects.',
  },
  {
    q: 'What documents are required on reporting day?',
    a: 'Incoming learners require the official MoE placement letter, copy of birth certificate, Junior School assessment report, recent passport photographs, completed admission & medical forms, and guardian identification.',
  },
  {
    q: 'Where can parents verify the current fee structure and reporting dates?',
    a: 'Official fee circulars and term reporting dates are issued directly by the Principal’s Office. Download available circulars below or contact the school on 0716 467 080 / chuguboys@gmail.com.',
  },
];

export const AdmissionsPage: React.FC = () => {
  const { profile, pages, documents } = useSchool();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const admissionsPage = pages.find((p) => p.slug === 'admissions_guide');
  const mapUrl = getSchoolMapUrl(profile.mapEmbedQuery);

  const handleDownloadDocument = (docItem: SchoolDocument) => {
    if (isSafeExternalUrl(docItem.externalUrl)) {
      window.open(docItem.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const blob = new Blob([docItem.contentSummary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = docItem.fileName || 'Chugu_Boys_Document.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const scrollToEnquiry = () => {
    const el = document.getElementById('admission-enquiry-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#081C3E] via-[#0E3168] to-[#134287] text-white py-14 lg:py-20 border-b-2 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold">
              {profile.admissionsOpen ? 'Admissions Portal · Open for Enquiries' : 'Admissions Desk'}
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-5xl font-bold text-white text-balance">
              Grade 10 & Senior School Admissions
            </h1>
            <p className="mt-4 text-base text-slate-100 max-w-2xl leading-relaxed">
              {profile.admissionsBannerText}
            </p>
          </div>
          <button
            type="button"
            onClick={scrollToEnquiry}
            className="self-start lg:self-auto min-h-[44px] px-6 py-3.5 text-sm font-semibold bg-[#D4AF37] text-[#081326] hover:bg-[#E5C158] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            Apply / Enquire About Admission
          </button>
        </div>
      </section>

      {/* Guidance & Requirements */}
      <section className="py-14 sm:py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                Placement & Reporting Instructions
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-[#0E3168]">
                {admissionsPage?.title || 'Grade 10 & Senior School Admissions Guidance'}
              </h2>
            </div>
            <p className="text-base text-slate-700 leading-[1.75] whitespace-pre-line">
              {admissionsPage?.body}
            </p>

            <div className="border border-[#D5E0EE] bg-[#F4F7FB] p-6 sm:p-7">
              <h3 className="font-display text-xl font-bold text-[#0E3168]">
                Step-by-Step Admission Procedure
              </h3>
              <ol className="mt-4 space-y-3 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="font-bold text-[#8E6307] tabular-nums">01.</span>
                  <span>
                    Verify Senior School placement under Ministry of Education guidelines and
                    confirm your learner’s CBE pathway (STEM or Social Sciences).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#8E6307] tabular-nums">02.</span>
                  <span>
                    Download the Grade 10 Admission & Joining Instruction Form and CBE Pathway Guide
                    from the documents section below.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#8E6307] tabular-nums">03.</span>
                  <span>
                    Prepare original and photocopied documents: Placement Letter, Birth Certificate,
                    Junior School Assessment Record, Medical Form, and Guardian ID.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#8E6307] tabular-nums">04.</span>
                  <span>
                    Submit an online admission enquiry or contact the Principal’s Office on{' '}
                    <a
                      href={`tel:${profile.telephone.replace(/\s+/g, '')}`}
                      className="font-semibold text-[#0E3168] underline tabular-nums"
                    >
                      {profile.telephone}
                    </a>{' '}
                    for official reporting confirmation.
                  </span>
                </li>
              </ol>
            </div>
          </div>

          {/* Admissions Contact Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-[#081C3E] to-[#0E3168] text-white border-t-2 border-[#D4AF37] p-7 shadow-xs">
              <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold">
                Admissions Office Direct Contact
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold">Speak With Our Office</h3>
              <dl className="mt-5 space-y-3.5 text-sm">
                <div>
                  <dt className="text-xs text-slate-300">Principal</dt>
                  <dd className="font-semibold text-white">{profile.principalName}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-300">Telephone</dt>
                  <dd className="font-semibold text-[#F0C95A] tabular-nums">
                    <a
                      href={`tel:${profile.telephone.replace(/\s+/g, '')}`}
                      className="hover:underline inline-block py-0.5"
                    >
                      {profile.telephone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-300">Official Email</dt>
                  <dd className="font-semibold text-white break-all">
                    <a
                      href={`mailto:${profile.email}`}
                      className="hover:text-[#F0C95A] hover:underline inline-block py-0.5"
                    >
                      {profile.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-300">Location & Postal Address</dt>
                  <dd className="text-slate-100">
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 underline decoration-white/40 underline-offset-2 hover:text-[#F0C95A] hover:decoration-[#F0C95A] transition-colors"
                      title="Open school location in Google Maps"
                    >
                      <span>{profile.location}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </a>
                    <br />
                    {profile.postalAddress}
                  </dd>
                </div>
              </dl>
            </div>

            {admissionsPage?.verificationNote && (
              <div className="border border-slate-200 bg-[#F4F7FB] p-5 text-xs text-slate-700 leading-relaxed">
                {admissionsPage.verificationNote}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Downloadable Admission Forms & Documents */}
      <section className="py-14 sm:py-16 bg-[#F4F7FB] border-b border-[#DCE5F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
              Official Downloads
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#0E3168]">
              Admission Forms & Circulars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.map((docItem) => (
              <article
                key={docItem.id}
                className="bg-white border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:border-[#0E3168]/40 hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FileText className="w-4 h-4 text-[#0E3168]" aria-hidden="true" />
                    <span className="font-semibold text-[#0E3168]">{docItem.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{docItem.academicYear}</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold text-[#0B0F17]">
                    {docItem.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {docItem.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadDocument(docItem)}
                  className="mt-6 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#0E3168] text-white hover:bg-[#16468F] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Download Document</span>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs & Online Admission Enquiry Form */}
      <section id="admission-enquiry-form" className="py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
              Common Questions
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#0E3168]">
              Admissions FAQs
            </h2>
            <div className="mt-6 border-t border-slate-200 divide-y divide-slate-200">
              {FAQS.map((faq, idx) => (
                <div key={faq.q} className="py-2">
                  <button
                    type="button"
                    aria-expanded={openFaq === idx}
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full min-h-[44px] py-2 flex items-center justify-between gap-4 text-left font-semibold text-sm text-[#0B0F17] hover:text-[#0E3168] cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-[#0E3168] transition-transform ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {openFaq === idx && (
                    <p className="pb-3 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <EnquiryForm
              defaultType="Grade 10 Admission"
              heading="Apply / Enquire About Admission"
              subheading="Submit your learner details or admission question directly to the Chugu Boys Senior School administration."
            />
          </div>
        </div>
      </section>
    </div>
  );
};
