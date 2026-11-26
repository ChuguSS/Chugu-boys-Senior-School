import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  BOOTSTRAPPED_PRINCIPAL_EMAIL,
  OperationType,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
} from '../firebase';
import {
  DEFAULT_DOCUMENTS,
  DEFAULT_EDITABLE_PAGES,
  DEFAULT_GALLERY_ITEMS,
  DEFAULT_LEARNING_AREAS,
  DEFAULT_NEWS_ITEMS,
  DEFAULT_SCHOOL_PROFILE,
  SCHOOL_IMAGES,
} from '../data/defaultSchoolData';
import {
  EditablePage,
  Enquiry,
  GalleryItem,
  LearningArea,
  NewsItem,
  SchoolDocument,
  SchoolProfile,
  StaffRequest,
  StaffRole,
  StaffRoleType,
} from '../types/school';

interface SchoolContextValue {
  profile: SchoolProfile;
  pages: EditablePage[];
  learningAreas: LearningArea[];
  news: NewsItem[];
  gallery: GalleryItem[];
  documents: SchoolDocument[];
  enquiries: Enquiry[];
  staffRoles: StaffRole[];
  staffRequests: StaffRequest[];
  currentUser: User | null;
  authReady: boolean;
  userRole: StaffRoleType | null;
  isPrincipal: boolean;
  isStaff: boolean;
  hasSeededFirestore: boolean;
  loadingData: boolean;
  myStaffRequest: StaffRequest | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  seedFirestoreDefaults: () => Promise<void>;
  syncRealPhotosToFirestore: () => Promise<void>;
}

const SchoolContext = createContext<SchoolContextValue | null>(null);

const LEGACY_IMAGE_MAP: Record<string, string> = {
  '/src/assets/images/chugu_crest_1795696073422.jpg': SCHOOL_IMAGES.crest,
  '/src/assets/images/hero_campus_grounds_1795696095163.jpg': SCHOOL_IMAGES.campusHero,
  '/src/assets/images/stem_science_lab_1795696073876.jpg': SCHOOL_IMAGES.scienceLab,
  '/src/assets/images/ict_computer_lab_1795696073525.jpg': SCHOOL_IMAGES.ictLab,
  '/src/assets/images/sports_and_athletics_1795696096259.jpg': SCHOOL_IMAGES.sportsField,
};

function normalizeMediaSlot(url: string | undefined, fallback: string): string {
  if (!url) return fallback;
  if (LEGACY_IMAGE_MAP[url]) return LEGACY_IMAGE_MAP[url];
  if (url.startsWith('/src/assets/images/')) return fallback;
  return url;
}

export function isSafeMediaUrl(url?: string): boolean {
  if (!url) return false;
  if (url.startsWith('/src/assets/images/') || url.startsWith('/assets/aistudio/')) return true;
  if (url.startsWith('https://')) return true;
  if (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(url)) return true;
  return false;
}

export function isSafeExternalUrl(url?: string): boolean {
  if (!url) return false;
  return url.startsWith('https://');
}

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<SchoolProfile>(DEFAULT_SCHOOL_PROFILE);
  const [hasSeededFirestore, setHasSeededFirestore] = useState(false);
  const [pages, setPages] = useState<EditablePage[]>(DEFAULT_EDITABLE_PAGES);
  const [learningAreas, setLearningAreas] = useState<LearningArea[]>(DEFAULT_LEARNING_AREAS);
  const [news, setNews] = useState<NewsItem[]>(DEFAULT_NEWS_ITEMS);
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const [documents, setDocuments] = useState<SchoolDocument[]>(DEFAULT_DOCUMENTS);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [staffRoles, setStaffRoles] = useState<StaffRole[]>([]);
  const [staffRequests, setStaffRequests] = useState<StaffRequest[]>([]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [ownRoleDoc, setOwnRoleDoc] = useState<StaffRole | null>(null);
  const [myStaffRequest, setMyStaffRequest] = useState<StaffRequest | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthReady(true);
    });
    return () => unsubAuth();
  }, []);

  // Public institutional listeners
  useEffect(() => {
    const unsubProfile = onSnapshot(
      doc(db, 'settings', 'school_profile'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as SchoolProfile;
          const legacyLocation = '5 km East of Meru Town, Meru County, Kenya';
          const normalizedLocation =
            !data.location || data.location.trim() === legacyLocation
              ? DEFAULT_SCHOOL_PROFILE.location
              : data.location;
          const normalizedMapQuery =
            data.mapEmbedQuery && data.mapEmbedQuery.trim().length > 2
              ? data.mapEmbedQuery
              : DEFAULT_SCHOOL_PROFILE.mapEmbedQuery;

          setProfile({
            ...DEFAULT_SCHOOL_PROFILE,
            ...data,
            location: normalizedLocation,
            mapEmbedQuery: normalizedMapQuery,
            crestUrl: normalizeMediaSlot(data.crestUrl, SCHOOL_IMAGES.crest),
            heroImageUrl: normalizeMediaSlot(data.heroImageUrl, SCHOOL_IMAGES.campusHero),
            scienceLabImageUrl: normalizeMediaSlot(data.scienceLabImageUrl, SCHOOL_IMAGES.scienceLab),
            ictLabImageUrl: normalizeMediaSlot(data.ictLabImageUrl, SCHOOL_IMAGES.ictLab),
            sportsImageUrl: normalizeMediaSlot(data.sportsImageUrl, SCHOOL_IMAGES.sportsField),
          });
          setHasSeededFirestore(true);
        } else {
          setProfile(DEFAULT_SCHOOL_PROFILE);
          setHasSeededFirestore(false);
        }
        setLoadingData(false);
      },
      (err) => {
        console.warn('Settings read error:', err.message);
        setLoadingData(false);
      }
    );

    const unsubPages = onSnapshot(
      collection(db, 'pages'),
      (snap) => {
        if (!snap.empty) {
          setPages(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EditablePage, 'id'>) })));
        } else {
          setPages(DEFAULT_EDITABLE_PAGES);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'pages')
    );

    const unsubLearning = onSnapshot(
      query(collection(db, 'learning_areas'), orderBy('sortOrder', 'asc')),
      (snap) => {
        if (!snap.empty) {
          setLearningAreas(
            snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<LearningArea, 'id'>) }))
          );
        } else {
          setLearningAreas(DEFAULT_LEARNING_AREAS);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'learning_areas')
    );

    const unsubGallery = onSnapshot(
      collection(db, 'gallery'),
      (snap) => {
        if (!snap.empty) {
          const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, 'id'>) }));
          const legacyIds = new Set([
            'gal_campus_overview',
            'gal_science_lab',
            'gal_ict_lab',
            'gal_sports_football',
          ]);
          const onlyLegacyPlaceholders =
            docs.length <= 4 &&
            docs.every((d) => legacyIds.has(d.id) && d.imageUrl.startsWith('/src/assets/images/'));
          if (onlyLegacyPlaceholders) {
            setGallery(DEFAULT_GALLERY_ITEMS);
          } else {
            setGallery(
              docs.map((item) => ({
                ...item,
                imageUrl: normalizeMediaSlot(item.imageUrl, SCHOOL_IMAGES.campusHero),
              }))
            );
          }
        } else {
          setGallery(DEFAULT_GALLERY_ITEMS);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'gallery')
    );

    const unsubDocs = onSnapshot(
      collection(db, 'documents'),
      (snap) => {
        if (!snap.empty) {
          setDocuments(
            snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SchoolDocument, 'id'>) }))
          );
        } else {
          setDocuments(DEFAULT_DOCUMENTS);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'documents')
    );

    return () => {
      unsubProfile();
      unsubPages();
      unsubLearning();
      unsubGallery();
      unsubDocs();
    };
  }, []);

  // Signed-in user's own role & request lookup
  useEffect(() => {
    if (!authReady || !currentUser || !currentUser.emailVerified) {
      setOwnRoleDoc(null);
      setMyStaffRequest(null);
      return;
    }

    const unsubOwnRole = onSnapshot(
      doc(db, 'staff_roles', currentUser.uid),
      (snap) => {
        if (snap.exists()) {
          setOwnRoleDoc({ id: snap.id, ...(snap.data() as Omit<StaffRole, 'id'>) });
        } else {
          setOwnRoleDoc(null);
        }
      },
      () => setOwnRoleDoc(null)
    );

    const unsubOwnReq = onSnapshot(
      doc(db, 'staff_requests', currentUser.uid),
      (snap) => {
        if (snap.exists()) {
          setMyStaffRequest({ id: snap.id, ...(snap.data() as Omit<StaffRequest, 'id'>) });
        } else {
          setMyStaffRequest(null);
        }
      },
      () => setMyStaffRequest(null)
    );

    return () => {
      unsubOwnRole();
      unsubOwnReq();
    };
  }, [authReady, currentUser]);

  const isBootstrappedPrincipal = Boolean(
    currentUser?.emailVerified && currentUser?.email === BOOTSTRAPPED_PRINCIPAL_EMAIL
  );

  const userRole: StaffRoleType | null = useMemo(() => {
    if (isBootstrappedPrincipal) return 'principal';
    if (ownRoleDoc && ownRoleDoc.active) return ownRoleDoc.role;
    return null;
  }, [isBootstrappedPrincipal, ownRoleDoc]);

  const isPrincipal = userRole === 'principal';
  const isStaff = userRole === 'principal' || userRole === 'teacher' || userRole === 'editor';

  // News listener: published only for public/regular teachers; all for bootstrapped principal
  useEffect(() => {
    const newsQuery = isBootstrappedPrincipal
      ? collection(db, 'news')
      : query(collection(db, 'news'), where('published', '==', true));

    const unsubNews = onSnapshot(
      newsQuery,
      (snap) => {
        if (!snap.empty) {
          setNews(
            snap.docs.map((d) => {
              const data = d.data() as Omit<NewsItem, 'id'>;
              const defaultMatch = DEFAULT_NEWS_ITEMS.find((n) => n.id === d.id);
              return {
                id: d.id,
                ...data,
                imageUrl: normalizeMediaSlot(
                  data.imageUrl,
                  defaultMatch?.imageUrl || SCHOOL_IMAGES.campusHero
                ),
              };
            })
          );
        } else if (!hasSeededFirestore) {
          setNews(DEFAULT_NEWS_ITEMS);
        } else {
          setNews([]);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'news')
    );

    return () => unsubNews();
  }, [isBootstrappedPrincipal, hasSeededFirestore]);

  // Principal-only private collections (enquiries PII, staff_roles, staff_requests)
  useEffect(() => {
    if (!authReady || !isBootstrappedPrincipal) {
      setEnquiries([]);
      setStaffRoles([]);
      setStaffRequests([]);
      return;
    }

    const unsubEnquiries = onSnapshot(
      collection(db, 'enquiries'),
      (snap) => {
        setEnquiries(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Enquiry, 'id'>) })));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'enquiries')
    );

    const unsubRoles = onSnapshot(
      collection(db, 'staff_roles'),
      (snap) => {
        setStaffRoles(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<StaffRole, 'id'>) })));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'staff_roles')
    );

    const unsubRequests = onSnapshot(
      collection(db, 'staff_requests'),
      (snap) => {
        setStaffRequests(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<StaffRequest, 'id'>) }))
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'staff_requests')
    );

    return () => {
      unsubEnquiries();
      unsubRoles();
      unsubRequests();
    };
  }, [authReady, isBootstrappedPrincipal]);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const seedFirestoreDefaults = async () => {
    if (!currentUser || !isPrincipal) return;
    const batch = writeBatch(db);
    const uid = currentUser.uid;
    const editorLabel = currentUser.email || 'Principal';

    batch.set(doc(db, 'settings', 'school_profile'), {
      ...DEFAULT_SCHOOL_PROFILE,
      updatedAt: serverTimestamp(),
      updatedBy: editorLabel,
    });

    for (const p of DEFAULT_EDITABLE_PAGES) {
      batch.set(doc(db, 'pages', p.id), {
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle || '',
        body: p.body,
        verificationNote: p.verificationNote || '',
        updatedAt: serverTimestamp(),
        updatedBy: editorLabel,
      });
    }

    for (const la of DEFAULT_LEARNING_AREAS) {
      batch.set(doc(db, 'learning_areas', la.id), {
        name: la.name,
        pathway: la.pathway,
        status: la.status,
        description: la.description,
        sortOrder: la.sortOrder,
        authorUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    for (const item of DEFAULT_NEWS_ITEMS) {
      batch.set(doc(db, 'news', item.id), {
        title: item.title,
        category: item.category,
        summary: item.summary,
        body: item.body,
        eventDate: item.eventDate || '',
        imageUrl: item.imageUrl || '',
        published: item.published,
        authorUid: uid,
        authorName: item.authorName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    for (const g of DEFAULT_GALLERY_ITEMS) {
      batch.set(doc(db, 'gallery', g.id), {
        title: g.title,
        category: g.category,
        caption: g.caption,
        imageUrl: g.imageUrl,
        authorUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    for (const d of DEFAULT_DOCUMENTS) {
      batch.set(doc(db, 'documents', d.id), {
        title: d.title,
        category: d.category,
        academicYear: d.academicYear,
        description: d.description,
        fileName: d.fileName,
        contentSummary: d.contentSummary,
        authorUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    try {
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'seed_defaults');
    }
  };

  const syncRealPhotosToFirestore = async () => {
    if (!currentUser || !isPrincipal) return;
    const uid = currentUser.uid;
    const editorLabel = currentUser.email || 'Principal';

    try {
      const profileRef = doc(db, 'settings', 'school_profile');
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        await updateDoc(profileRef, {
          crestUrl: SCHOOL_IMAGES.crest,
          heroImageUrl: SCHOOL_IMAGES.campusHero,
          scienceLabImageUrl: SCHOOL_IMAGES.scienceLab,
          ictLabImageUrl: SCHOOL_IMAGES.ictLab,
          sportsImageUrl: SCHOOL_IMAGES.sportsField,
          updatedAt: serverTimestamp(),
          updatedBy: editorLabel,
        });
      }

      for (const g of DEFAULT_GALLERY_ITEMS) {
        const ref = doc(db, 'gallery', g.id);
        const existingSnap = await getDoc(ref);
        if (existingSnap.exists()) {
          await updateDoc(ref, {
            title: g.title,
            category: g.category,
            caption: g.caption,
            imageUrl: g.imageUrl,
            updatedAt: serverTimestamp(),
          });
        } else {
          const batch = writeBatch(db);
          batch.set(ref, {
            title: g.title,
            category: g.category,
            caption: g.caption,
            imageUrl: g.imageUrl,
            authorUid: uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          await batch.commit();
        }
      }

      for (const item of DEFAULT_NEWS_ITEMS) {
        const ref = doc(db, 'news', item.id);
        const existingSnap = await getDoc(ref);
        if (existingSnap.exists()) {
          const data = existingSnap.data() as { imageUrl?: string };
          if (!data.imageUrl || data.imageUrl.startsWith('/src/assets/images/')) {
            await updateDoc(ref, {
              imageUrl: item.imageUrl,
              updatedAt: serverTimestamp(),
            });
          }
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'sync_real_photos');
    }
  };

  // Auto-seed once if the bootstrapped Principal logs in and Firestore has not been seeded yet
  useEffect(() => {
    if (authReady && isPrincipal && !loadingData && !hasSeededFirestore) {
      void seedFirestoreDefaults();
    }
  }, [authReady, isPrincipal, loadingData, hasSeededFirestore]);

  const value: SchoolContextValue = {
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
    loadingData,
    myStaffRequest,
    signInWithGoogle,
    logout,
    seedFirestoreDefaults,
    syncRealPhotosToFirestore,
  };

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
};

export function useSchool() {
  const ctx = useContext(SchoolContext);
  if (!ctx) throw new Error('useSchool must be used inside SchoolProvider');
  return ctx;
}
