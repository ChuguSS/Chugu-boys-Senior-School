import React, { useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  BookOpen,
  Check,
  Database,
  Download,
  FileText,
  Image as ImageIcon,
  Inbox,
  LogIn,
  LogOut,
  Newspaper,
  Plus,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { SCHOOL_IMAGES } from '../data/defaultSchoolData';
import { OperationType, db, handleFirestoreError } from '../firebase';
import {
  DocumentCategory,
  EnquiryStatus,
  GalleryCategory,
  LearningArea,
  LearningPathway,
  NewsCategory,
  NewsItem,
  OfferingStatus,
  SchoolDocument,
  SchoolProfile,
  StaffRoleType,
} from '../types/school';
import { SchoolImage } from '../components/SchoolImage';

type AdminTab =
  | 'overview'
  | 'media'
  | 'profile'
  | 'news'
  | 'gallery'
  | 'academics'
  | 'documents'
  | 'enquiries'
  | 'staff'
  | 'deployment';

async function compressImageToDataUrl(
  file: File,
  maxCharLen = 500000,
  maxWidth = 1200,
  preferPng = false
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image format.'));
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        if (preferPng) {
          const pngUrl = canvas.toDataURL('image/png');
          if (pngUrl.length <= maxCharLen) {
            resolve(pngUrl);
            return;
          }
          // Fall back to white-backed JPEG if PNG exceeds size cap
          ctx.globalCompositeOperation = 'destination-over';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        let quality = 0.78;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > maxCharLen && quality > 0.35) {
          quality -= 0.12;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        if (dataUrl.length > maxCharLen) {
          reject(new Error('Image is still too large after compression.'));
          return;
        }
        resolve(dataUrl);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export const AdminPortalPage: React.FC = () => {
  const {
    profile,
    pages,
    learningAreas,
    news,
    gallery,
    documents,
    enquiries,
    staffRoles,
    staffRequests,
    currentUser,
    authReady,
    userRole,
    isPrincipal,
    isStaff,
    hasSeededFirestore,
    myStaffRequest,
    signInWithGoogle,
    logout,
    seedFirestoreDefaults,
    syncRealPhotosToFirestore,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [statusBanner, setStatusBanner] = useState<string>('');
  const [errorBanner, setErrorBanner] = useState<string>('');
  const [busy, setBusy] = useState(false);

  // Staff Request State
  const [reqDepartment, setReqDepartment] = useState('');

  // Profile Form State
  const [profileForm, setProfileForm] = useState<SchoolProfile>(profile);
  React.useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  // News Form State
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState<NewsCategory>('School Announcement');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsBody, setNewsBody] = useState('');
  const [newsEventDate, setNewsEventDate] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState<string>(SCHOOL_IMAGES.campusHero);
  const [newsPublished, setNewsPublished] = useState(true);

  // Gallery Form State
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState<GalleryCategory>('School Environment');
  const [galCaption, setGalCaption] = useState('');
  const [galImageUrl, setGalImageUrl] = useState('');

  // Document Form State
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('Admission Form');
  const [docYear, setDocYear] = useState('2026 / 2027');
  const [docDescription, setDocDescription] = useState('');
  const [docFileName, setDocFileName] = useState('');
  const [docContentSummary, setDocContentSummary] = useState('');
  const [docExternalUrl, setDocExternalUrl] = useState('');

  // Learning Area Form State
  const [laName, setLaName] = useState('');
  const [laPathway, setLaPathway] = useState<LearningPathway>('STEM');
  const [laStatus, setLaStatus] = useState<OfferingStatus>('confirmed');
  const [laDesc, setLaDesc] = useState('');

  // Page Editor State
  const [selectedPageId, setSelectedPageId] = useState<string>(pages[0]?.id || 'about_leadership');
  const currentEditablePage = pages.find((p) => p.id === selectedPageId) || pages[0];
  const [pageTitle, setPageTitle] = useState(currentEditablePage?.title || '');
  const [pageSubtitle, setPageSubtitle] = useState(currentEditablePage?.subtitle || '');
  const [pageBody, setPageBody] = useState(currentEditablePage?.body || '');
  const [pageNote, setPageNote] = useState(currentEditablePage?.verificationNote || '');

  React.useEffect(() => {
    const found = pages.find((p) => p.id === selectedPageId);
    if (found) {
      setPageTitle(found.title);
      setPageSubtitle(found.subtitle || '');
      setPageBody(found.body);
      setPageNote(found.verificationNote || '');
    }
  }, [selectedPageId, pages]);

  const notify = (msg: string) => {
    setErrorBanner('');
    setStatusBanner(msg);
  };

  const fail = (msg: string) => {
    setStatusBanner('');
    setErrorBanner(msg);
  };

  const handleDownloadBackup = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      institution: profile.schoolName,
      profile,
      pages,
      learningAreas,
      news,
      gallery,
      documents,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chugu_boys_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify('Complete website content backup downloaded as JSON.');
  };

  // Sign-In Screen
  if (!authReady) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F4F7FB]">
        <p className="text-sm text-slate-600">Checking authentication status...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-[75vh] bg-[#F4F7FB] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-5 bg-white border border-slate-200 p-1">
            <SchoolImage
              src={profile.crestUrl || SCHOOL_IMAGES.crest}
              alt="Chugu Boys Senior School Crest"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
            Authorized Personnel Only
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-[#0E3168]">
            Staff & Principal Admin Portal
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Sign in with your verified Google account to manage news announcements, gallery photos,
            admissions documents, CBE academics, and school profile details.
          </p>
          <button
            type="button"
            onClick={() => void signInWithGoogle()}
            className="mt-7 w-full min-h-[44px] inline-flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-semibold bg-[#0E3168] text-white hover:bg-[#16468F] transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4" aria-hidden="true" />
            <span>Sign In with Google</span>
          </button>
        </div>
      </div>
    );
  }

  // Signed in, but not yet authorized in staff_roles
  if (!isStaff) {
    const handleRequestAccess = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser.emailVerified) {
        fail('Your Google email address must be verified before requesting staff access.');
        return;
      }
      setBusy(true);
      try {
        await setDoc(doc(db, 'staff_requests', currentUser.uid), {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || 'School Staff Member',
          department: reqDepartment.trim().slice(0, 100) || 'General Teaching Staff',
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        notify('Staff access request sent to the Principal for approval.');
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `staff_requests/${currentUser.uid}`);
      } finally {
        setBusy(false);
      }
    };

    return (
      <div className="min-h-[75vh] bg-[#F4F7FB] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full bg-white border border-slate-200 p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
                Account Verification
              </p>
              <h1 className="font-display text-2xl font-bold text-[#0E3168]">
                Staff Authorization Required
              </h1>
            </div>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0B0F17] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="text-sm text-slate-700 space-y-1 bg-[#F4F7FB] border border-slate-200 p-4">
            <p>
              <span className="font-semibold">Signed in as:</span> {currentUser.displayName} (
              {currentUser.email})
            </p>
            <p className="text-xs text-slate-500">User ID: {currentUser.uid}</p>
          </div>

          {statusBanner && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              {statusBanner}
            </div>
          )}
          {errorBanner && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-900">
              {errorBanner}
            </div>
          )}

          {myStaffRequest ? (
            <div className="border border-slate-200 p-5 text-sm text-slate-700">
              <p className="font-semibold text-[#0E3168]">
                Access Request Status: {myStaffRequest.status.toUpperCase()}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                The Principal can approve your teacher/editor role from the Staff & Roles tab.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRequestAccess} className="space-y-4">
              <p className="text-sm text-slate-600">
                If you are a designated teacher or administrator at Chugu Boys Senior School,
                submit a request below for the Principal to grant CMS editing permissions.
              </p>
              <div>
                <label className="block text-xs font-semibold text-[#0B0F17] mb-1">
                  Department / Office
                </label>
                <input
                  type="text"
                  maxLength={100}
                  value={reqDepartment}
                  onChange={(e) => setReqDepartment(e.target.value)}
                  placeholder="e.g. Sciences / Humanities / Admissions"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 px-5 text-sm font-semibold bg-[#0E3168] text-white hover:bg-[#16468F] cursor-pointer"
              >
                {busy ? 'Sending Request...' : 'Request Staff CMS Access'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Authorized Handlers
  const saveProfileToFirestore = async (next: SchoolProfile, successMessage: string) => {
    if (!isPrincipal) return;
    setBusy(true);
    try {
      await setDoc(doc(db, 'settings', 'school_profile'), {
        schoolName: next.schoolName.trim(),
        motto: next.motto.trim(),
        established: next.established.trim(),
        location: next.location.trim(),
        postalAddress: next.postalAddress.trim(),
        telephone: next.telephone.trim(),
        email: next.email.trim(),
        principalName: next.principalName.trim(),
        schoolType: next.schoolType.trim(),
        cluster: next.cluster.trim(),
        educationSystem: next.educationSystem.trim(),
        vision: next.vision.trim(),
        mission: next.mission.trim(),
        principalWelcomeHeading: next.principalWelcomeHeading.trim(),
        principalWelcomeBody: next.principalWelcomeBody.trim(),
        admissionsOpen: Boolean(next.admissionsOpen),
        admissionsBannerTitle: next.admissionsBannerTitle.trim(),
        admissionsBannerText: next.admissionsBannerText.trim(),
        historySummary: next.historySummary.trim(),
        mapEmbedQuery: (next.mapEmbedQuery || '').trim(),
        facebookUrl: (next.facebookUrl || '').trim(),
        youtubeUrl: (next.youtubeUrl || '').trim(),
        xUrl: (next.xUrl || '').trim(),
        crestUrl: (next.crestUrl || SCHOOL_IMAGES.crest).trim(),
        heroImageUrl: (next.heroImageUrl || SCHOOL_IMAGES.campusHero).trim(),
        scienceLabImageUrl: (next.scienceLabImageUrl || SCHOOL_IMAGES.scienceLab).trim(),
        ictLabImageUrl: (next.ictLabImageUrl || SCHOOL_IMAGES.ictLab).trim(),
        sportsImageUrl: (next.sportsImageUrl || SCHOOL_IMAGES.sportsField).trim(),
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.email || 'Principal',
      });
      notify(successMessage);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/school_profile');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfileToFirestore(
      profileForm,
      'School profile, welcome message, and contact settings saved.'
    );
  };

  type ProfileImageField =
    | 'crestUrl'
    | 'heroImageUrl'
    | 'scienceLabImageUrl'
    | 'ictLabImageUrl'
    | 'sportsImageUrl';

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ProfileImageField
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const isLogo = field === 'crestUrl';
      const compressed = await compressImageToDataUrl(
        file,
        150000,
        isLogo ? 480 : 960,
        isLogo && file.type === 'image/png'
      );
      setProfileForm((prev) => ({ ...prev, [field]: compressed }));
      notify('Image prepared. Click "Save School Logo & Photos" to publish it live.');
    } catch {
      fail('Could not process image. Please choose a JPG, PNG, or WebP photograph.');
    }
  };

  const resetNewsForm = () => {
    setEditingNewsId(null);
    setNewsTitle('');
    setNewsCategory('School Announcement');
    setNewsSummary('');
    setNewsBody('');
    setNewsEventDate('');
    setNewsImageUrl(SCHOOL_IMAGES.campusHero);
    setNewsPublished(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSeededFirestore && isPrincipal) {
      await seedFirestoreDefaults();
    }
    setBusy(true);
    try {
      if (editingNewsId) {
        await updateDoc(doc(db, 'news', editingNewsId), {
          title: newsTitle.trim(),
          category: newsCategory,
          summary: newsSummary.trim(),
          body: newsBody.trim(),
          eventDate: newsEventDate.trim(),
          imageUrl: newsImageUrl.trim(),
          published: newsPublished,
          authorName: currentUser.displayName || profile.principalName,
          updatedAt: serverTimestamp(),
        });
        notify('News notice updated.');
      } else {
        await addDoc(collection(db, 'news'), {
          title: newsTitle.trim(),
          category: newsCategory,
          summary: newsSummary.trim(),
          body: newsBody.trim(),
          eventDate: newsEventDate.trim(),
          imageUrl: newsImageUrl.trim(),
          published: newsPublished,
          authorUid: currentUser.uid,
          authorName: currentUser.displayName || profile.principalName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        notify('New announcement published.');
      }
      resetNewsForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'news');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    setBusy(true);
    try {
      await deleteDoc(doc(db, 'news', id));
      notify('News notice removed.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `news/${id}`);
    } finally {
      setBusy(false);
    }
  };

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'gallery' | 'news'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageToDataUrl(file);
      if (target === 'gallery') setGalImageUrl(compressed);
      else setNewsImageUrl(compressed);
      notify('Photograph prepared and optimized for web display.');
    } catch {
      fail('Could not process image. Please upload a valid JPG, PNG, or WebP photograph.');
    }
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galImageUrl.trim()) {
      fail('Please upload a photograph or provide a valid HTTPS image URL.');
      return;
    }
    setBusy(true);
    try {
      await addDoc(collection(db, 'gallery'), {
        title: galTitle.trim(),
        category: galCategory,
        caption: galCaption.trim(),
        imageUrl: galImageUrl.trim(),
        authorUid: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setGalTitle('');
      setGalCaption('');
      setGalImageUrl('');
      notify('Photograph added to the school gallery.');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'gallery');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    setBusy(true);
    try {
      await deleteDoc(doc(db, 'gallery', id));
      notify('Photograph removed from gallery.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
    } finally {
      setBusy(false);
    }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEditablePage) return;
    setBusy(true);
    try {
      await setDoc(doc(db, 'pages', currentEditablePage.id), {
        slug: currentEditablePage.slug,
        title: pageTitle.trim(),
        subtitle: pageSubtitle.trim(),
        body: pageBody.trim(),
        verificationNote: pageNote.trim(),
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.email || 'Staff',
      });
      notify(`Updated "${pageTitle.trim()}" page content.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `pages/${currentEditablePage.id}`);
    } finally {
      setBusy(false);
    }
  };

  const handleToggleLearningAreaStatus = async (area: LearningArea) => {
    setBusy(true);
    const nextStatus: OfferingStatus =
      area.status === 'confirmed' ? 'verification_required' : 'confirmed';
    try {
      await updateDoc(doc(db, 'learning_areas', area.id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
      notify(`Updated ${area.name} status to ${nextStatus.replace('_', ' ')}.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `learning_areas/${area.id}`);
    } finally {
      setBusy(false);
    }
  };

  const handleAddLearningArea = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await addDoc(collection(db, 'learning_areas'), {
        name: laName.trim(),
        pathway: laPathway,
        status: laStatus,
        description: laDesc.trim(),
        sortOrder: learningAreas.length + 10,
        authorUid: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setLaName('');
      setLaDesc('');
      notify('Learning area added to CBE curriculum.');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'learning_areas');
    } finally {
      setBusy(false);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await addDoc(collection(db, 'documents'), {
        title: docTitle.trim(),
        category: docCategory,
        academicYear: docYear.trim(),
        description: docDescription.trim(),
        fileName: docFileName.trim() || 'Chugu_Boys_Document.txt',
        contentSummary: docContentSummary.trim(),
        ...(docExternalUrl.trim() ? { externalUrl: docExternalUrl.trim() } : {}),
        authorUid: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setDocTitle('');
      setDocDescription('');
      setDocFileName('');
      setDocContentSummary('');
      setDocExternalUrl('');
      notify('Official document added to Admissions Downloads.');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'documents');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    setBusy(true);
    try {
      await deleteDoc(doc(db, 'documents', id));
      notify('Document removed.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `documents/${id}`);
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateEnquiryStatus = async (id: string, status: EnquiryStatus) => {
    setBusy(true);
    try {
      await updateDoc(doc(db, 'enquiries', id), {
        status,
        updatedAt: serverTimestamp(),
      });
      notify(`Enquiry marked as ${status}.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `enquiries/${id}`);
    } finally {
      setBusy(false);
    }
  };

  const handleApproveStaff = async (
    uid: string,
    email: string,
    displayName: string,
    department: string,
    role: StaffRoleType
  ) => {
    setBusy(true);
    try {
      await setDoc(doc(db, 'staff_roles', uid), {
        uid,
        email,
        displayName,
        role,
        department,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'staff_requests', uid), {
        status: 'approved',
        updatedAt: serverTimestamp(),
      });
      notify(`Approved ${displayName} as ${role}.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `staff_roles/${uid}`);
    } finally {
      setBusy(false);
    }
  };

  const handleToggleStaffActive = async (uid: string, currentActive: boolean) => {
    setBusy(true);
    try {
      await updateDoc(doc(db, 'staff_roles', uid), {
        active: !currentActive,
        updatedAt: serverTimestamp(),
      });
      notify(`Updated staff access.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `staff_roles/${uid}`);
    } finally {
      setBusy(false);
    }
  };

  const navTabs: { id: AdminTab; label: string; icon: React.ReactNode; principalOnly?: boolean }[] = [
    { id: 'overview', label: 'Overview & Backups', icon: <Database className="w-4 h-4" /> },
    {
      id: 'media',
      label: 'Logo & Key Photos',
      icon: <ImageIcon className="w-4 h-4" />,
      principalOnly: true,
    },
    {
      id: 'profile',
      label: 'School Profile & Welcome',
      icon: <Settings className="w-4 h-4" />,
      principalOnly: true,
    },
    { id: 'news', label: 'News & Announcements', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'gallery', label: 'Photo Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'academics', label: 'Academics & Pages', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'documents', label: 'Admission Forms', icon: <FileText className="w-4 h-4" /> },
    {
      id: 'enquiries',
      label: 'Enquiries Inbox',
      icon: <Inbox className="w-4 h-4" />,
      principalOnly: true,
    },
    {
      id: 'staff',
      label: 'Staff & Roles',
      icon: <Users className="w-4 h-4" />,
      principalOnly: true,
    },
    { id: 'deployment', label: 'Hosting & SEO Guide', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const visibleTabs = navTabs.filter((t) => !t.principalOnly || isPrincipal);

  return (
    <div className="bg-[#F4F7FB] min-h-[82vh]">
      {/* Top CMS Bar */}
      <div className="bg-gradient-to-br from-[#081C3E] via-[#0E3168] to-[#134287] text-white border-b-2 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#F0C95A] font-semibold">
              School Content Management System
            </p>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
              Chugu Boys Senior School — Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
            <div className="sm:text-right">
              <p className="font-semibold text-white">{currentUser.displayName || currentUser.email}</p>
              <p className="text-[#F0C95A] capitalize">Role: {userRole}</p>
            </div>
            <button
              type="button"
              onClick={() => void logout()}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 border border-white/40 text-white hover:bg-white/15 cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation (Grid on mobile/tablet, vertical list on desktop) */}
        <aside
          aria-label="Admin Portal Sections"
          className="lg:col-span-3 bg-white border border-slate-200 p-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1 shadow-xs"
        >
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-current={activeTab === tab.id ? 'page' : undefined}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full min-h-[44px] flex items-center gap-2.5 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-left transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0E3168] text-white font-semibold'
                  : 'text-slate-700 hover:bg-[#F4F7FB] hover:text-[#0E3168]'
              }`}
            >
              <span className="shrink-0">{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Active Panel */}
        <div className="lg:col-span-9 space-y-6">
          {statusBanner && (
            <div className="bg-white border border-emerald-300 px-5 py-3.5 text-sm text-emerald-900 flex items-center justify-between">
              <span>{statusBanner}</span>
              <button
                type="button"
                onClick={() => setStatusBanner('')}
                className="text-xs font-semibold underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
          {errorBanner && (
            <div className="bg-white border border-red-300 px-5 py-3.5 text-sm text-red-900 flex items-center justify-between">
              <span>{errorBanner}</span>
              <button
                type="button"
                onClick={() => setErrorBanner('')}
                className="text-xs font-semibold underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  ['News Notices', news.length],
                  ['Gallery Photos', gallery.length],
                  ['Learning Areas', learningAreas.length],
                  ['Admission Docs', documents.length],
                ].map(([label, count]) => (
                  <div key={String(label)} className="bg-white border border-slate-200 p-5">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 font-display text-3xl font-bold text-[#0E3168] tabular-nums">
                      {count}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-200 p-7 space-y-4">
                <h2 className="font-display text-2xl font-bold text-[#0E3168]">
                  Backup & Database Sync
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Download a complete JSON snapshot of your institutional profile, pages, learning
                  areas, news, gallery items, and documents at any time for safe off-site archiving.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#0E3168] text-white hover:bg-[#16468F] cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Full JSON Backup</span>
                  </button>
                  {isPrincipal && !hasSeededFirestore && (
                    <button
                      type="button"
                      onClick={() => void seedFirestoreDefaults()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border border-[#0E3168] text-[#0E3168] hover:bg-slate-50 cursor-pointer"
                    >
                      <Database className="w-4 h-4" />
                      <span>Initialize School Database</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: LOGO & KEY PHOTOS */}
          {activeTab === 'media' && isPrincipal && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void saveProfileToFirestore(
                  profileForm,
                  'Official school logo and photographs updated across the website.'
                );
              }}
              className="bg-white border border-slate-200 p-7 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#0E3168]">
                    School Crest / Logo & Authentic School Photos
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Upload your official school crest and real school photographs. Images are
                    automatically optimized and applied immediately across Home, About, Academics,
                    Facilities, Student Life, and Footer.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {hasSeededFirestore && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={async () => {
                        setBusy(true);
                        setErrorBanner('');
                        setStatusBanner('');
                        try {
                          await syncRealPhotosToFirestore();
                          setStatusBanner(
                            'All 12 real school photographs and key media slots have been synced to Firestore.'
                          );
                        } catch (err) {
                          setErrorBanner(
                            err instanceof Error ? err.message : 'Failed to sync school photos.'
                          );
                        } finally {
                          setBusy(false);
                        }
                      }}
                      className="px-3 py-1.5 text-xs font-semibold border border-[#0E3168] text-[#0E3168] hover:bg-[#0E3168] hover:text-white transition-colors cursor-pointer disabled:opacity-60"
                    >
                      Sync 12 Real Photos to Database
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab('gallery')}
                    className="text-xs font-semibold text-[#0E3168] underline shrink-0 cursor-pointer"
                  >
                    Open Photo Gallery →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(
                  [
                    {
                      field: 'crestUrl',
                      label: 'Official School Crest / Logo',
                      hint: 'Appears on the Hero Banner, Footer, and Staff Portal.',
                      defaultUrl: SCHOOL_IMAGES.crest,
                      contain: true,
                    },
                    {
                      field: 'heroImageUrl',
                      label: 'Main School Hero Photograph',
                      hint: 'Full-width backdrop on Home, About Heritage, and Facilities.',
                      defaultUrl: SCHOOL_IMAGES.campusHero,
                      contain: false,
                    },
                    {
                      field: 'scienceLabImageUrl',
                      label: 'Tuition Wing / STEM Academic Photo',
                      hint: 'Featured on Home STEM Pathway, Academics, and Facilities.',
                      defaultUrl: SCHOOL_IMAGES.scienceLab,
                      contain: false,
                    },
                    {
                      field: 'ictLabImageUrl',
                      label: 'Study & Examination Hall / Pathways Photo',
                      hint: 'Featured on Home Pathways and Facilities.',
                      defaultUrl: SCHOOL_IMAGES.ictLab,
                      contain: false,
                    },
                    {
                      field: 'sportsImageUrl',
                      label: 'Sports & Co-Curricular Field Photo',
                      hint: 'Featured on Home School Highlight, Facilities, and Student Life.',
                      defaultUrl: SCHOOL_IMAGES.sportsField,
                      contain: false,
                    },
                  ] as const
                ).map((slot) => {
                  const currentVal = profileForm[slot.field] || slot.defaultUrl;
                  return (
                    <div
                      key={slot.field}
                      className="border border-slate-200 bg-[#F4F7FB] p-4 space-y-3"
                    >
                      <div>
                        <p className="font-semibold text-sm text-[#0B0F17]">{slot.label}</p>
                        <p className="text-xs text-slate-500">{slot.hint}</p>
                      </div>
                      <div className="aspect-[16/10] w-full bg-white border border-slate-200 overflow-hidden">
                        <SchoolImage
                          src={currentVal}
                          alt={slot.label}
                          className={
                            slot.contain
                              ? 'w-full h-full object-contain p-3'
                              : 'w-full h-full object-cover'
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#0B0F17] mb-1">
                          Upload File from Device
                        </label>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => void handleProfileImageUpload(e, slot.field)}
                          className="w-full text-xs bg-white border border-slate-300 p-1.5"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          placeholder="Or paste https:// image URL"
                          value={
                            currentVal.startsWith('data:') ? '' : currentVal
                          }
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              [slot.field]: e.target.value,
                            }))
                          }
                          className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setProfileForm((prev) => ({
                              ...prev,
                              [slot.field]: slot.defaultUrl,
                            }))
                          }
                          className="px-2.5 py-1.5 text-xs font-medium border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="px-6 py-3 text-sm font-semibold bg-[#0E3168] text-white hover:bg-[#16468F] cursor-pointer"
              >
                {busy ? 'Saving Media...' : 'Save School Logo & Photos'}
              </button>
            </form>
          )}

          {/* TAB: SCHOOL PROFILE */}
          {activeTab === 'profile' && isPrincipal && (
            <form
              onSubmit={handleSaveProfile}
              className="bg-white border border-slate-200 p-7 space-y-5"
            >
              <h2 className="font-display text-2xl font-bold text-[#0E3168]">
                Institutional Identity, Welcome & Announcements
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Official School Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.schoolName}
                    onChange={(e) => setProfileForm({ ...profileForm, schoolName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">School Motto</label>
                  <input
                    type="text"
                    required
                    value={profileForm.motto}
                    onChange={(e) => setProfileForm({ ...profileForm, motto: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Principal Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.principalName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, principalName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Telephone</label>
                  <input
                    type="text"
                    required
                    value={profileForm.telephone}
                    onChange={(e) => setProfileForm({ ...profileForm, telephone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Postal Address</label>
                  <input
                    type="text"
                    required
                    value={profileForm.postalAddress}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, postalAddress: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Physical Location</label>
                <input
                  type="text"
                  required
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300"
                />
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    id="admissions-open-toggle"
                    type="checkbox"
                    checked={profileForm.admissionsOpen}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, admissionsOpen: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <label htmlFor="admissions-open-toggle" className="text-sm font-semibold">
                    Display Active Admissions Notice on Homepage
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Homepage Admissions Announcement Title
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.admissionsBannerTitle}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, admissionsBannerTitle: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Homepage Admissions Announcement Text
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={profileForm.admissionsBannerText}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, admissionsBannerText: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Principal’s Welcome Heading
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.principalWelcomeHeading}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, principalWelcomeHeading: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Principal’s Welcome Message
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={profileForm.principalWelcomeBody}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, principalWelcomeBody: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Verified Google Maps Query / Coordinates (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chugu Boys Secondary School, Meru, Kenya"
                    value={profileForm.mapEmbedQuery || ''}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, mapEmbedQuery: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="px-6 py-2.5 text-sm font-semibold bg-[#0E3168] text-white hover:bg-[#16468F] cursor-pointer"
              >
                {busy ? 'Saving...' : 'Save School Settings'}
              </button>
            </form>
          )}

          {/* TAB: NEWS & ANNOUNCEMENTS */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              <form
                onSubmit={handleSaveNews}
                className="bg-white border border-slate-200 p-7 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold text-[#0E3168]">
                    {editingNewsId ? 'Edit Notice' : 'Publish News or Announcement'}
                  </h2>
                  {editingNewsId && (
                    <button
                      type="button"
                      onClick={resetNewsForm}
                      className="text-xs font-semibold text-slate-600 underline cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Headline *</label>
                    <input
                      type="text"
                      required
                      maxLength={180}
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Category *</label>
                    <select
                      value={newsCategory}
                      onChange={(e) => setNewsCategory(e.target.value as NewsCategory)}
                      className="w-full px-3 py-2 text-sm border border-slate-300"
                    >
                      <option value="School Announcement">School Announcement</option>
                      <option value="Academic Update">Academic Update</option>
                      <option value="Admissions Notice">Admissions Notice</option>
                      <option value="Events & Calendar">Events & Calendar</option>
                      <option value="Examination Notice">Examination Notice</option>
                      <option value="Student Achievement">Student Achievement</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Publication / Event Date Label
                    </label>
                    <input
                      type="text"
                      maxLength={40}
                      placeholder="e.g. Term I · March 2026"
                      value={newsEventDate}
                      onChange={(e) => setNewsEventDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Upload Featured Photo (or keep default)
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => void handlePhotoUpload(e, 'news')}
                      className="w-full text-xs border border-slate-300 p-1.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Summary *</label>
                  <input
                    type="text"
                    required
                    maxLength={400}
                    value={newsSummary}
                    onChange={(e) => setNewsSummary(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Full Body *</label>
                  <textarea
                    rows={5}
                    required
                    maxLength={8000}
                    value={newsBody}
                    onChange={(e) => setNewsBody(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="news-pub-toggle"
                    type="checkbox"
                    checked={newsPublished}
                    onChange={(e) => setNewsPublished(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="news-pub-toggle" className="text-sm font-medium">
                    Publish immediately to public website
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#0E3168] text-white hover:bg-[#16468F] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingNewsId ? 'Update Notice' : 'Publish Notice'}</span>
                </button>
              </form>

              <div className="bg-white border border-slate-200 p-6 space-y-3">
                <h3 className="font-display text-xl font-bold text-[#0E3168]">
                  Existing Notices ({news.length})
                </h3>
                <div className="divide-y divide-slate-200">
                  {news.map((item: NewsItem) => (
                    <div
                      key={item.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs text-slate-500">
                          {item.category} · {item.published ? 'Published' : 'Draft'}
                        </p>
                        <p className="font-semibold text-sm text-[#0B0F17]">{item.title}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNewsId(item.id);
                            setNewsTitle(item.title);
                            setNewsCategory(item.category);
                            setNewsSummary(item.summary);
                            setNewsBody(item.body);
                            setNewsEventDate(item.eventDate || '');
                            setNewsImageUrl(item.imageUrl || SCHOOL_IMAGES.campusHero);
                            setNewsPublished(item.published);
                          }}
                          className="text-xs font-semibold text-[#0E3168] underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteNews(item.id)}
                          className="text-xs font-semibold text-red-700 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PHOTO GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <form
                onSubmit={handleAddGallery}
                className="bg-white border border-slate-200 p-7 space-y-4"
              >
                <h2 className="font-display text-2xl font-bold text-[#0E3168]">
                  Upload School Photograph
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Photo Title *</label>
                    <input
                      type="text"
                      required
                      maxLength={140}
                      value={galTitle}
                      onChange={(e) => setGalTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Category *</label>
                    <select
                      value={galCategory}
                      onChange={(e) => setGalCategory(e.target.value as GalleryCategory)}
                      className="w-full px-3 py-2 text-sm border border-slate-300"
                    >
                      <option value="School Environment">School Environment</option>
                      <option value="Classrooms & Laboratories">Classrooms & Laboratories</option>
                      <option value="Academic Activities">Academic Activities</option>
                      <option value="Student Activities">Student Activities</option>
                      <option value="Sports">Sports</option>
                      <option value="Events & Celebrations">Events & Celebrations</option>
                      <option value="School Leadership & Visitors">
                        School Leadership & Visitors
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Select Photo File (automatically optimized) *
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => void handlePhotoUpload(e, 'gallery')}
                    className="w-full text-xs border border-slate-300 p-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Or Paste Verified HTTPS Image URL
                  </label>
                  <input
                    type="text"
                    value={galImageUrl}
                    onChange={(e) => setGalImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Caption *</label>
                  <input
                    type="text"
                    required
                    maxLength={400}
                    value={galCaption}
                    onChange={(e) => setGalCaption(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="px-5 py-2.5 text-sm font-semibold bg-[#0E3168] text-white hover:bg-[#16468F] cursor-pointer"
                >
                  Add to Gallery
                </button>
              </form>

              <div className="bg-white border border-slate-200 p-6">
                <h3 className="font-display text-xl font-bold text-[#0E3168] mb-4">
                  Gallery Photos ({gallery.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gallery.map((photo) => (
                    <div key={photo.id} className="border border-slate-200 p-3 space-y-2">
                      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                        <SchoolImage src={photo.imageUrl} alt={photo.title} />
                      </div>
                      <p className="text-xs text-slate-500">{photo.category}</p>
                      <p className="text-sm font-semibold text-[#0B0F17] truncate">{photo.title}</p>
                      <button
                        type="button"
                        onClick={() => void handleDeleteGallery(photo.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ACADEMICS & PAGES */}
          {activeTab === 'academics' && (
            <div className="space-y-6">
              {/* Page Editor */}
              <form
                onSubmit={handleSavePage}
                className="bg-white border border-slate-200 p-7 space-y-4"
              >
                <h2 className="font-display text-2xl font-bold text-[#0E3168]">
                  Edit Website Page Sections
                </h2>
                <div>
                  <label className="block text-xs font-semibold mb-1">Select Page Section</label>
                  <select
                    value={selectedPageId}
                    onChange={(e) => setSelectedPageId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  >
                    {pages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.slug})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Section Title</label>
                  <input
                    type="text"
                    required
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Section Body</label>
                  <textarea
                    rows={5}
                    required
                    value={pageBody}
                    onChange={(e) => setPageBody(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Verification / Editorial Note
                  </label>
                  <input
                    type="text"
                    value={pageNote}
                    onChange={(e) => setPageNote(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-5 py-2.5 text-sm font-semibold bg-[#0E3168] text-white hover:bg-[#16468F] cursor-pointer"
                >
                  Save Page Section
                </button>
              </form>

              {/* CBE Learning Areas Manager */}
              <div className="bg-white border border-slate-200 p-7 space-y-5">
                <h2 className="font-display text-2xl font-bold text-[#0E3168]">
                  CBE Learning Areas & Confirmation Status
                </h2>

                <form onSubmit={handleAddLearningArea} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-5 border-b border-slate-200">
                  <input
                    type="text"
                    required
                    placeholder="Subject name"
                    value={laName}
                    onChange={(e) => setLaName(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-300"
                  />
                  <select
                    value={laPathway}
                    onChange={(e) => setLaPathway(e.target.value as LearningPathway)}
                    className="px-3 py-2 text-sm border border-slate-300"
                  >
                    <option value="Core">Core</option>
                    <option value="STEM">STEM</option>
                    <option value="Social Sciences">Social Sciences</option>
                    <option value="Technical & Applied">Technical & Applied</option>
                  </select>
                  <select
                    value={laStatus}
                    onChange={(e) => setLaStatus(e.target.value as OfferingStatus)}
                    className="px-3 py-2 text-sm border border-slate-300"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="verification_required">Requires Verification</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Short subject description"
                    value={laDesc}
                    onChange={(e) => setLaDesc(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 text-sm border border-slate-300"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="px-4 py-2 text-sm font-semibold bg-[#0E3168] text-white cursor-pointer"
                  >
                    Add Subject
                  </button>
                </form>

                <div className="divide-y divide-slate-200">
                  {learningAreas.map((area) => (
                    <div
                      key={area.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <p className="font-semibold text-sm text-[#0B0F17]">{area.name}</p>
                        <p className="text-xs text-slate-500">
                          {area.pathway} ·{' '}
                          {area.status === 'confirmed' ? 'Confirmed Offering' : 'Requires Verification'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleToggleLearningAreaStatus(area)}
                        className="text-xs font-semibold text-[#0E3168] underline cursor-pointer self-start sm:self-auto"
                      >
                        Toggle Confirmed / Verification
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ADMISSIONS DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <form
                onSubmit={handleAddDocument}
                className="bg-white border border-slate-200 p-7 space-y-4"
              >
                <h2 className="font-display text-2xl font-bold text-[#0E3168]">
                  Add Downloadable Admission Form or Circular
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Category *</label>
                    <select
                      value={docCategory}
                      onChange={(e) => setDocCategory(e.target.value as DocumentCategory)}
                      className="w-full px-3 py-2 text-sm border border-slate-300"
                    >
                      <option value="Admission Form">Admission Form</option>
                      <option value="Fee Structure">Fee Structure</option>
                      <option value="Academic Circular">Academic Circular</option>
                      <option value="CBE Guide">CBE Guide</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Academic Year *</label>
                    <input
                      type="text"
                      required
                      value={docYear}
                      onChange={(e) => setDocYear(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Download File Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chugu_Boys_Fee_Structure_2026.txt"
                      value={docFileName}
                      onChange={(e) => setDocFileName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      External PDF Link (Optional HTTPS URL)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={docExternalUrl}
                      onChange={(e) => setDocExternalUrl(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Short Description *</label>
                  <input
                    type="text"
                    required
                    value={docDescription}
                    onChange={(e) => setDocDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Document Text / Joining Instructions *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={docContentSummary}
                    onChange={(e) => setDocContentSummary(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-5 py-2.5 text-sm font-semibold bg-[#0E3168] text-white cursor-pointer"
                >
                  Save Document
                </button>
              </form>

              <div className="bg-white border border-slate-200 p-6 divide-y divide-slate-200">
                {documents.map((d: SchoolDocument) => (
                  <div
                    key={d.id}
                    className="py-3.5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-xs text-slate-500">
                        {d.category} · {d.academicYear}
                      </p>
                      <p className="font-semibold text-sm text-[#0B0F17]">{d.title}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleDeleteDocument(d.id)}
                      className="text-xs font-semibold text-red-700 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ENQUIRIES INBOX */}
          {activeTab === 'enquiries' && isPrincipal && (
            <div className="bg-white border border-slate-200 p-7 space-y-4">
              <h2 className="font-display text-2xl font-bold text-[#0E3168]">
                Parent & Prospective Learner Enquiries ({enquiries.length})
              </h2>
              {enquiries.length === 0 ? (
                <p className="text-sm text-slate-600">No enquiries submitted yet.</p>
              ) : (
                <div className="divide-y divide-slate-200">
                  {enquiries.map((enq) => (
                    <div key={enq.id} className="py-4 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm text-[#0B0F17]">
                            {enq.fullName} · <span className="tabular-nums">{enq.phone}</span> ·{' '}
                            {enq.email}
                          </p>
                          <p className="text-xs text-slate-500">
                            {enq.enquiryType}
                            {enq.pathwayInterest ? ` · ${enq.pathwayInterest}` : ''} · Status:{' '}
                            <span className="font-semibold text-[#0E3168] uppercase">
                              {enq.status}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {(['new', 'reviewed', 'responded'] as EnquiryStatus[]).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => void handleUpdateEnquiryStatus(enq.id, st)}
                              className={`px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                                enq.status === st
                                  ? 'bg-[#0E3168] text-white'
                                  : 'border border-slate-200 text-slate-700'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-700">{enq.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: STAFF & ROLES */}
          {activeTab === 'staff' && isPrincipal && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 p-7 space-y-4">
                <h2 className="font-display text-2xl font-bold text-[#0E3168]">
                  Pending Teacher Access Requests ({staffRequests.filter((r) => r.status === 'pending').length})
                </h2>
                {staffRequests.filter((r) => r.status === 'pending').length === 0 ? (
                  <p className="text-sm text-slate-600">
                    No pending requests. Designated teachers can sign into the Staff Admin Portal
                    with Google and click “Request Staff CMS Access” to appear here.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {staffRequests
                      .filter((r) => r.status === 'pending')
                      .map((req) => (
                        <div
                          key={req.id}
                          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <p className="font-semibold text-sm text-[#0B0F17]">
                              {req.displayName} ({req.email})
                            </p>
                            <p className="text-xs text-slate-500">
                              Department: {req.department || 'General'} · UID: {req.uid}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                void handleApproveStaff(
                                  req.uid,
                                  req.email,
                                  req.displayName,
                                  req.department || 'Teaching Staff',
                                  'teacher'
                                )
                              }
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#0E3168] text-white cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve Teacher</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                void handleApproveStaff(
                                  req.uid,
                                  req.email,
                                  req.displayName,
                                  req.department || 'Editorial',
                                  'editor'
                                )
                              }
                              className="px-3 py-1.5 text-xs font-semibold border border-slate-300 text-slate-700 cursor-pointer"
                            >
                              Approve Editor
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-slate-200 p-7 space-y-4">
                <h3 className="font-display text-xl font-bold text-[#0E3168]">
                  Authorized Staff Accounts ({staffRoles.length})
                </h3>
                <div className="divide-y divide-slate-200">
                  {staffRoles.map((sr) => (
                    <div
                      key={sr.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-semibold text-sm text-[#0B0F17]">
                          {sr.displayName} ({sr.email})
                        </p>
                        <p className="text-xs text-slate-500">
                          Role: {sr.role} · {sr.department || 'School'} ·{' '}
                          {sr.active ? 'Active' : 'Suspended'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleToggleStaffActive(sr.uid, sr.active)}
                        className="text-xs font-semibold text-[#0E3168] underline cursor-pointer self-start sm:self-auto"
                      >
                        {sr.active ? 'Suspend Access' : 'Restore Access'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: DEPLOYMENT & SEO GUIDE */}
          {activeTab === 'deployment' && (
            <div className="bg-white border border-slate-200 p-7 space-y-5 text-sm text-slate-700 leading-relaxed">
              <h2 className="font-display text-2xl font-bold text-[#0E3168]">
                Deployment, SSL, SEO & Maintenance Checklist
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>1. Free SSL/HTTPS Hosting & Custom Domain:</strong> Deploy the
                  production build (<code>npm run build</code> → <code>dist/</code>) on Firebase
                  Hosting, Cloudflare Pages, Vercel, or Netlify, then connect{' '}
                  <code>www.chuguss.sc.ke</code> and <code>chuguss.sc.ke</code> via DNS CNAME /
                  A records with automatic SSL enabled.
                </p>
                <p>
                  <strong>2. Firebase Authorized Domains (Staff Login):</strong> Before signing
                  into the Staff Admin Portal on the live site, add <code>www.chuguss.sc.ke</code>{' '}
                  and <code>chuguss.sc.ke</code> under Firebase Console → Authentication → Settings
                  → Authorized domains.
                </p>
                <p>
                  <strong>3. Google Search Console & Google Business Profile:</strong> Verify{' '}
                  <code>https://www.chuguss.sc.ke</code> in Google Search Console, submit{' '}
                  <code>https://www.chuguss.sc.ke/sitemap.xml</code>, and link{' '}
                  <code>https://www.chuguss.sc.ke</code> on your Google Business Profile / Google
                  Maps listing.
                </p>
                <p>
                  <strong>4. Role-Based Security & Backups:</strong> Only verified accounts approved
                  by the Principal can publish news, upload photos, or edit academic information.
                  Use the “Download Full JSON Backup” button in Overview monthly to archive all
                  institutional records.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
