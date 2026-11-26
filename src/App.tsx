/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { SchoolProvider } from './context/SchoolContext';
import { AboutPage } from './pages/AboutPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { ContactPage } from './pages/ContactPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { StudentLifePage } from './pages/StudentLifePage';
import { PageRoute } from './types/school';

const VALID_ROUTES: PageRoute[] = [
  'home',
  'about',
  'academics',
  'admissions',
  'facilities',
  'student-life',
  'news',
  'gallery',
  'contact',
  'admin',
];

const PAGE_TITLES: Record<PageRoute, string> = {
  home: 'Chugu Boys Senior School | Meru County, Kenya',
  about: 'About Us | Chugu Boys Senior School',
  academics: 'CBE Academics & Pathways | Chugu Boys Senior School',
  admissions: 'Grade 10 Admissions & Fees | Chugu Boys Senior School',
  facilities: 'School Facilities | Chugu Boys Senior School',
  'student-life': 'Student Life & Leadership | Chugu Boys Senior School',
  news: 'News & Notices | Chugu Boys Senior School',
  gallery: 'Photo Gallery | Chugu Boys Senior School',
  contact: 'Contact & Directions | Chugu Boys Senior School',
  admin: 'Staff Admin Portal | Chugu Boys Senior School',
};

function getInitialRoute(): PageRoute {
  const hash = window.location.hash.replace(/^#/, '') as PageRoute;
  if (VALID_ROUTES.includes(hash)) return hash;
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '') as PageRoute;
  return VALID_ROUTES.includes(path) ? path : 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>(getInitialRoute);

  const navigate = (page: PageRoute) => {
    setCurrentPage(page);
    if (window.location.hash !== `#${page}`) {
      window.history.pushState(null, '', `#${page}`);
    }
  };

  useEffect(() => {
    document.title = PAGE_TITLES[currentPage] || PAGE_TITLES.home;
  }, [currentPage]);

  useEffect(() => {
    const onHashChange = () => {
      setCurrentPage(getInitialRoute());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'academics':
        return <AcademicsPage />;
      case 'admissions':
        return <AdmissionsPage />;
      case 'facilities':
        return <FacilitiesPage />;
      case 'student-life':
        return <StudentLifePage />;
      case 'news':
        return <NewsPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPortalPage />;
      case 'home':
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <ErrorBoundary>
      <SchoolProvider>
        <div className="min-h-screen flex flex-col bg-white text-[#0B0F17]">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:bg-[#081C3E] focus:text-white focus:border-2 focus:border-[#D4AF37] focus:shadow-lg"
          >
            Skip to main content
          </a>
          <Navbar currentPage={currentPage} onNavigate={navigate} />
          <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
            {renderPage()}
          </main>
          <Footer onNavigate={navigate} />
        </div>
      </SchoolProvider>
    </ErrorBoundary>
  );
}
