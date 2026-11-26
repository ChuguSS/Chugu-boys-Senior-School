import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, Send } from 'lucide-react';
import { OperationType, db, handleFirestoreError } from '../firebase';
import { EnquiryType } from '../types/school';

interface EnquiryFormProps {
  defaultType?: EnquiryType;
  heading?: string;
  subheading?: string;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  defaultType = 'General Contact',
  heading = 'Send an Official Enquiry',
  subheading = 'Parents, prospective learners, and partners can write directly to the school office.',
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [enquiryType, setEnquiryType] = useState<EnquiryType>(defaultType);
  const [pathwayInterest, setPathwayInterest] = useState('Not Sure Yet');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Spam protection honeypot
    if (honeypot.trim().length > 0) {
      setSubmitted(true);
      return;
    }

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanMsg = message.trim();

    if (cleanName.length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (cleanPhone.length < 5) {
      setErrorMsg('Please provide a valid telephone number.');
      return;
    }
    if (cleanMsg.length < 10) {
      setErrorMsg('Please write at least 10 characters in your message.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'enquiries'), {
        fullName: cleanName.slice(0, 120),
        email: cleanEmail.slice(0, 140),
        phone: cleanPhone.slice(0, 40),
        enquiryType,
        pathwayInterest: pathwayInterest.slice(0, 80),
        message: cleanMsg.slice(0, 2000),
        status: 'new',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSubmitted(true);
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.CREATE, 'enquiries');
      } catch {
        setErrorMsg(
          'Unable to submit right now. Please try again or call the school office on 0716 467 080.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#F4F7FB] border border-[#D5E0EE] p-7 sm:p-8">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#0E3168] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-display text-xl font-semibold text-[#0E3168]">
              Enquiry Received by School Office
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              Thank you for contacting Chugu Boys Senior School. Your message has been recorded for
              the administration and admissions team. For urgent matters, please call{' '}
              <a
                href="tel:0716467080"
                className="font-semibold text-[#0E3168] underline tabular-nums"
              >
                0716 467 080
              </a>
              .
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-5 px-5 py-2.5 min-h-[44px] text-xs font-semibold bg-[#0E3168] text-white hover:bg-[#16468F] transition-colors cursor-pointer"
            >
              Send Another Enquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 shadow-xs p-6 sm:p-8 space-y-5"
    >
      <div>
        <h3 className="font-display text-2xl font-semibold text-[#0E3168]">{heading}</h3>
        <p className="mt-1.5 text-sm text-slate-600">{subheading}</p>
      </div>

      {/* Honeypot field for spam protection */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_url_hp">Leave blank</label>
        <input
          id="website_url_hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="p-3 bg-red-50 border border-red-200 text-xs font-medium text-red-800"
        >
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="enq-name" className="block text-xs font-semibold text-[#0B0F17] mb-1.5">
            Full Name *
          </label>
          <input
            id="enq-name"
            type="text"
            required
            maxLength={120}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Parent / Guardian or Learner Name"
            className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-slate-300 bg-white text-[#0B0F17] focus:outline-none focus:border-[#0E3168]"
          />
        </div>
        <div>
          <label htmlFor="enq-phone" className="block text-xs font-semibold text-[#0B0F17] mb-1.5">
            Telephone Number *
          </label>
          <input
            id="enq-phone"
            type="tel"
            required
            maxLength={40}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0712 345 678"
            className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-slate-300 bg-white text-[#0B0F17] focus:outline-none focus:border-[#0E3168]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="enq-email" className="block text-xs font-semibold text-[#0B0F17] mb-1.5">
            Email Address *
          </label>
          <input
            id="enq-email"
            type="email"
            required
            maxLength={140}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-slate-300 bg-white text-[#0B0F17] focus:outline-none focus:border-[#0E3168]"
          />
        </div>
        <div>
          <label htmlFor="enq-type" className="block text-xs font-semibold text-[#0B0F17] mb-1.5">
            Enquiry Category
          </label>
          <select
            id="enq-type"
            value={enquiryType}
            onChange={(e) => setEnquiryType(e.target.value as EnquiryType)}
            className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-slate-300 bg-white text-[#0B0F17] focus:outline-none focus:border-[#0E3168]"
          >
            <option value="Grade 10 Admission">Grade 10 Admission</option>
            <option value="Academic Enquiry">Academic Enquiry</option>
            <option value="Campus Visit">School Visit</option>
            <option value="General Contact">General Contact</option>
          </select>
        </div>
      </div>

      {enquiryType === 'Grade 10 Admission' && (
        <div>
          <label htmlFor="enq-pathway" className="block text-xs font-semibold text-[#0B0F17] mb-1.5">
            Preferred CBE Senior School Pathway
          </label>
          <select
            id="enq-pathway"
            value={pathwayInterest}
            onChange={(e) => setPathwayInterest(e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-slate-300 bg-white text-[#0B0F17] focus:outline-none focus:border-[#0E3168]"
          >
            <option value="STEM Pathway">STEM Pathway (Sciences, Computing & Agriculture)</option>
            <option value="Social Sciences Pathway">
              Social Sciences Pathway (Humanities, Languages & Business)
            </option>
            <option value="Not Sure Yet">Not Sure Yet — Need Guidance</option>
          </select>
        </div>
      )}

      <div>
        <label htmlFor="enq-message" className="block text-xs font-semibold text-[#0B0F17] mb-1.5">
          Message / Enquiry Details *
        </label>
        <textarea
          id="enq-message"
          rows={4}
          required
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your question regarding Grade 10 admissions, CBE learning areas, school visits, or general enquiries..."
          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 bg-white text-[#0B0F17] focus:outline-none focus:border-[#0E3168]"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-[#0E3168] text-white hover:bg-[#16468F] disabled:opacity-60 transition-colors cursor-pointer"
      >
        <Send className="w-4 h-4" aria-hidden="true" />
        <span>{submitting ? 'Submitting...' : 'Submit Enquiry'}</span>
      </button>
    </form>
  );
};
