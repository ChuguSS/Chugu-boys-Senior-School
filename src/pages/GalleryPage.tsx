import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { GalleryCategory } from '../types/school';
import { SchoolImage } from '../components/SchoolImage';

const GALLERY_CATEGORIES: ('All' | GalleryCategory)[] = [
  'All',
  'School Environment',
  'Classrooms & Laboratories',
  'Academic Activities',
  'Student Activities',
  'Sports',
  'Events & Celebrations',
  'School Leadership & Visitors',
];

export const GalleryPage: React.FC = () => {
  const { gallery } = useSchool();
  const [selectedCategory, setSelectedCategory] = useState<'All' | GalleryCategory>('All');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filteredPhotos = useMemo(() => {
    return gallery.filter(
      (item) => selectedCategory === 'All' || item.category === selectedCategory
    );
  }, [gallery, selectedCategory]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') {
        setLightboxIdx((prev) =>
          prev === null ? null : (prev + 1) % filteredPhotos.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIdx((prev) =>
          prev === null ? null : (prev - 1 + filteredPhotos.length) % filteredPhotos.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIdx, filteredPhotos.length]);

  const activePhoto = lightboxIdx !== null ? filteredPhotos[lightboxIdx] : null;

  return (
    <div className="bg-white min-h-[75vh]">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#081C3E] via-[#0E3168] to-[#134287] text-white py-14 lg:py-20 border-b-2 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold">
            Visual Archive
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-bold text-white text-balance">
            Chugu Boys Photo Gallery
          </h1>
          <p className="mt-4 text-base text-slate-100 max-w-2xl leading-relaxed">
            Explore school life, practical laboratory sessions, digital learning, sports, and
            school milestones. Click any photograph to inspect in full screen.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-7 sm:py-8 bg-[#F4F7FB] border-b border-[#DCE5F1]">
        <div
          role="group"
          aria-label="Filter gallery by category"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-2"
        >
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={selectedCategory === cat}
              onClick={() => {
                setSelectedCategory(cat);
                setLightboxIdx(null);
              }}
              className={`px-3.5 py-2 min-h-[40px] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0E3168] text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-[#EAF0F8] hover:text-[#0E3168]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-12 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPhotos.length === 0 ? (
            <div className="border border-slate-200 bg-[#F4F7FB] p-12 text-center">
              <p className="font-display text-xl font-semibold text-[#0E3168]">
                No photographs in this category yet
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Authorized school administrators can upload photographs to any category from the
                Staff Admin Portal.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setLightboxIdx(index)}
                  className="group text-left border border-slate-200 bg-white overflow-hidden cursor-pointer transition-all duration-200 hover:border-[#0E3168]/40 hover:shadow-md"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                    <SchoolImage
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold text-[#8E6307]">{photo.category}</p>
                    <h2 className="mt-1 font-display text-lg font-bold text-[#0B0F17]">
                      {photo.title}
                    </h2>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{photo.caption}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Accessible Lightbox */}
      {activePhoto && lightboxIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          onClick={() => setLightboxIdx(null)}
          className="fixed inset-0 z-50 bg-[#081326]/92 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        >
          <button
            type="button"
            aria-label="Close lightbox"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx(null);
            }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-11 h-11 inline-flex items-center justify-center bg-white/15 hover:bg-white/25 text-white cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {filteredPhotos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photograph"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(
                    (lightboxIdx - 1 + filteredPhotos.length) % filteredPhotos.length
                  );
                }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 inline-flex items-center justify-center bg-black/50 hover:bg-black/75 text-white cursor-pointer z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                aria-label="Next photograph"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx((lightboxIdx + 1) % filteredPhotos.length);
                }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 inline-flex items-center justify-center bg-black/50 hover:bg-black/75 text-white cursor-pointer z-20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-[#081326] border border-white/15 overflow-hidden shadow-2xl"
          >
            <div className="aspect-[16/10] w-full bg-black flex items-center justify-center">
              <SchoolImage
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-5 sm:p-6 bg-[#081326] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[#F0C95A] font-semibold">
                  {activePhoto.category} ·{' '}
                  <span className="tabular-nums">
                    {lightboxIdx + 1} / {filteredPhotos.length}
                  </span>
                </p>
                <h3 className="mt-1 font-display text-xl font-bold">{activePhoto.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{activePhoto.caption}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
