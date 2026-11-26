import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Search, X } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { SCHOOL_IMAGES } from '../data/defaultSchoolData';
import { NewsCategory, NewsItem } from '../types/school';
import { SchoolImage } from '../components/SchoolImage';

const CATEGORIES: ('All' | NewsCategory)[] = [
  'All',
  'School Announcement',
  'Academic Update',
  'Admissions Notice',
  'Events & Calendar',
  'Examination Notice',
  'Student Achievement',
];

export const NewsPage: React.FC = () => {
  const { news } = useSchool();
  const [selectedCategory, setSelectedCategory] = useState<'All' | NewsCategory>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  useEffect(() => {
    if (!activeArticle) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveArticle(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeArticle]);

  const filteredNews = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return news.filter((item) => {
      if (!item.published) return false;
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesQ =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.body.toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
  }, [news, selectedCategory, searchTerm]);

  return (
    <div className="bg-white min-h-[75vh]">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#081C3E] via-[#0E3168] to-[#134287] text-white py-14 lg:py-20 border-b-2 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold">
            Stakeholder Communications
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-bold text-white text-balance">
            News, Announcements & Events
          </h1>
          <p className="mt-4 text-base text-slate-100 max-w-2xl leading-relaxed">
            Official school updates, term calendars, admissions notices, examination briefings, and
            student achievements published by school administration.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-7 sm:py-8 bg-[#F4F7FB] border-b border-[#DCE5F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div role="group" aria-label="Filter notices by category" className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
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

          <div className="relative w-full lg:w-72">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notices..."
              aria-label="Search school news and notices"
              className="w-full min-h-[42px] pl-9 pr-3.5 py-2 text-sm border border-slate-300 bg-white text-[#0B0F17] focus:outline-none focus:border-[#0E3168]"
            />
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="py-12 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredNews.length === 0 ? (
            <div className="border border-slate-200 bg-[#F4F7FB] p-12 text-center">
              <p className="font-display text-xl font-semibold text-[#0E3168]">
                No notices match your filter
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Try clearing the search box or selecting “All” categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredNews.map((item) => (
                <article
                  key={item.id}
                  className="border border-slate-200 bg-white flex flex-col justify-between transition-all duration-200 hover:border-[#0E3168]/40 hover:shadow-md"
                >
                  <div>
                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                      <SchoolImage
                        src={item.imageUrl || SCHOOL_IMAGES.campusHero}
                        alt={item.title}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-[#0E3168]">{item.category}</span>
                        {item.eventDate && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 tabular-nums">
                              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                              {item.eventDate}
                            </span>
                          </>
                        )}
                      </div>
                      <h2 className="mt-2 font-display text-xl font-bold text-[#0B0F17] leading-snug">
                        {item.title}
                      </h2>
                      <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>By {item.authorName}</span>
                    <button
                      type="button"
                      onClick={() => setActiveArticle(item)}
                      className="min-h-[36px] font-semibold text-[#0E3168] hover:text-[#16468F] hover:underline cursor-pointer"
                    >
                      Read Full Notice →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-modal-title"
          onClick={() => setActiveArticle(null)}
          className="fixed inset-0 z-50 bg-[#081326]/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-[#0E3168]">{activeArticle.category}</span>
                {activeArticle.eventDate && (
                  <>
                    <span className="mx-1.5" aria-hidden="true">
                      ·
                    </span>
                    <span className="tabular-nums">{activeArticle.eventDate}</span>
                  </>
                )}
              </div>
              <button
                type="button"
                aria-label="Close notice reader"
                onClick={() => setActiveArticle(null)}
                className="w-11 h-11 inline-flex items-center justify-center border border-slate-200 text-slate-700 hover:bg-[#F4F7FB] hover:text-[#0E3168] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {activeArticle.imageUrl && (
              <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <SchoolImage src={activeArticle.imageUrl} alt={activeArticle.title} />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <h2
                id="news-modal-title"
                className="font-display text-2xl sm:text-3xl font-bold text-[#0E3168]"
              >
                {activeArticle.title}
              </h2>
              <p className="mt-2 text-xs text-slate-500">Published by {activeArticle.authorName}</p>
              <div className="mt-5 text-base text-slate-700 leading-[1.75] whitespace-pre-line">
                {activeArticle.body}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
