import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { PageRoute } from '../types/school';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleGo = (page: PageRoute) => {
    onNavigate(page);
    setOpenDropdown(null);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isGroupActive = (pages: PageRoute[]) => pages.includes(currentPage);

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6 lg:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleGo('home')}
          className="text-left font-display text-base sm:text-xl font-bold tracking-tight text-[#0E3168] hover:text-[#16468F] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1"
        >
          Chugu Boys Senior School
        </button>

        {/* Zone 2: 5 concise single-line navigation links with clean institutional dropdowns */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700"
        >
          <button
            type="button"
            aria-current={currentPage === 'home' ? 'page' : undefined}
            onClick={() => handleGo('home')}
            className={`py-1.5 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              currentPage === 'home'
                ? 'text-[#0E3168] border-[#D4AF37] font-semibold'
                : 'border-transparent hover:text-[#0E3168] hover:border-slate-300'
            }`}
          >
            Home
          </button>

          <div className="relative">
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={openDropdown === 'about'}
              onClick={() => setOpenDropdown(openDropdown === 'about' ? null : 'about')}
              className={`py-1.5 inline-flex items-center gap-1 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                isGroupActive(['about', 'facilities', 'student-life'])
                  ? 'text-[#0E3168] border-[#D4AF37] font-semibold'
                  : 'border-transparent hover:text-[#0E3168] hover:border-slate-300'
              }`}
            >
              <span>About</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  openDropdown === 'about' ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
            {openDropdown === 'about' && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-slate-200 shadow-lg py-1.5 z-50">
                {(
                  [
                    ['about', 'About Us & Heritage'],
                    ['facilities', 'School Facilities'],
                    ['student-life', 'Student Life'],
                  ] as [PageRoute, string][]
                ).map(([route, label]) => (
                  <button
                    key={route}
                    type="button"
                    aria-current={currentPage === route ? 'page' : undefined}
                    onClick={() => handleGo(route)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                      currentPage === route
                        ? 'bg-[#F4F7FB] text-[#0E3168] font-semibold'
                        : 'text-slate-700 hover:bg-[#F4F7FB] hover:text-[#0E3168]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            aria-current={currentPage === 'academics' ? 'page' : undefined}
            onClick={() => handleGo('academics')}
            className={`py-1.5 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              currentPage === 'academics'
                ? 'text-[#0E3168] border-[#D4AF37] font-semibold'
                : 'border-transparent hover:text-[#0E3168] hover:border-slate-300'
            }`}
          >
            Academics
          </button>

          <div className="relative">
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={openDropdown === 'campus'}
              onClick={() => setOpenDropdown(openDropdown === 'campus' ? null : 'campus')}
              className={`py-1.5 inline-flex items-center gap-1 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                isGroupActive(['news', 'gallery', 'contact', 'admin'])
                  ? 'text-[#0E3168] border-[#D4AF37] font-semibold'
                  : 'border-transparent hover:text-[#0E3168] hover:border-slate-300'
              }`}
            >
              <span>Community</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  openDropdown === 'campus' ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
            {openDropdown === 'campus' && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-slate-200 shadow-lg py-1.5 z-50">
                {(
                  [
                    ['news', 'News & Events'],
                    ['gallery', 'Photo Gallery'],
                    ['contact', 'Contact Us'],
                  ] as [PageRoute, string][]
                ).map(([route, label]) => (
                  <button
                    key={route}
                    type="button"
                    aria-current={currentPage === route ? 'page' : undefined}
                    onClick={() => handleGo(route)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                      currentPage === route
                        ? 'bg-[#F4F7FB] text-[#0E3168] font-semibold'
                        : 'text-slate-700 hover:bg-[#F4F7FB] hover:text-[#0E3168]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <div className="my-1 border-t border-slate-100" />
                <button
                  type="button"
                  aria-current={currentPage === 'admin' ? 'page' : undefined}
                  onClick={() => handleGo('admin')}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                    currentPage === 'admin'
                      ? 'bg-[#F4F7FB] text-[#0E3168] font-semibold'
                      : 'text-[#0E3168] hover:bg-[#F4F7FB]'
                  }`}
                >
                  Staff Admin Portal
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            aria-current={currentPage === 'contact' ? 'page' : undefined}
            onClick={() => handleGo('contact')}
            className={`py-1.5 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              currentPage === 'contact'
                ? 'text-[#0E3168] border-[#D4AF37] font-semibold'
                : 'border-transparent hover:text-[#0E3168] hover:border-slate-300'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleGo('admissions')}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 min-h-[40px] text-sm font-semibold bg-[#0E3168] text-white hover:bg-[#16468F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Admissions
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 text-[#0E3168] border border-slate-200 hover:bg-[#F4F7FB] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden border-t border-slate-200 bg-white max-h-[80vh] overflow-y-auto shadow-lg"
        >
          <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {(
              [
                ['home', 'Home'],
                ['about', 'About Us'],
                ['academics', 'Academics (CBE)'],
                ['admissions', 'Admissions'],
                ['facilities', 'Facilities'],
                ['student-life', 'Student Life'],
                ['news', 'News & Events'],
                ['gallery', 'Gallery'],
                ['contact', 'Contact Us'],
                ['admin', 'Staff Admin Portal'],
              ] as [PageRoute, string][]
            ).map(([route, label]) => (
              <button
                key={route}
                type="button"
                aria-current={currentPage === route ? 'page' : undefined}
                onClick={() => handleGo(route)}
                className={`w-full min-h-[44px] flex items-center justify-between text-left px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === route
                    ? 'bg-[#0E3168] text-white font-semibold'
                    : 'text-slate-700 hover:bg-[#F4F7FB] hover:text-[#0E3168]'
                }`}
              >
                <span>{label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
