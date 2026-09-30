import React, { useState, useEffect } from 'react';
import {
  Mail, Lock, User, Eye, EyeOff, CheckCircle2,
  GraduationCap, MonitorPlay, Shield, ArrowRight, ArrowLeft,
  Sparkles
} from 'lucide-react';
import { auth, googleProvider, signInWithPopup, rtdb, ref, set, get, child } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile
} from 'firebase/auth';
import { db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthProps {
  onLogin: (isNewUser: boolean, userName: string, role: string, studentData?: any) => void;
}

interface StoredAccount {
  email: string;
  password?: string;
  fullName: string;
  role: 'TRAINEE' | 'TRAINER' | 'ADMIN';
  studentData?: any;
  authProvider?: string;
}

const STORAGE_USERS_KEY = 'capacity_connect_accounts_v2';

// Helper to sanitize email keys for Firebase Realtime Database paths
const encodeEmailKey = (email: string) => email.toLowerCase().replace(/[^a-z0-9]/g, '_');

// Timeout wrapper so UI never hangs on network latency
const timeoutPromise = <T,>(promise: Promise<T>, ms: number = 2200): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Network timeout - continuing with local persistence')), ms))
  ]);
};

// Initial default accounts for immediate testing
const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    email: 'bhavya.shree@capacityconnect.org',
    password: 'password123',
    fullName: 'Bhavya Shree D',
    role: 'TRAINEE',
    studentData: {
      fullName: 'Bhavya Shree D',
      degree: 'B.E. Computer Science',
      institution: 'Visvesvaraya Technological University',
      skills: ['Kubernetes', 'Docker', 'Python', 'AWS', 'React'],
      interests: ['Cloud Architecture', 'AI Microservices']
    }
  },
  {
    email: 'rajesh.raman@capacityconnect.org',
    password: 'password123',
    fullName: 'Dr. Rajesh Raman',
    role: 'TRAINER'
  },
  {
    email: 'admin.siva@capacityconnect.org',
    password: 'password123',
    fullName: 'Platform Admin',
    role: 'ADMIN'
  }
];

// Crisp Google "G" SVG Icon
const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export default function Auth({ onLogin }: AuthProps) {
  // STEP 1: If selectedRole is null, show the 3 cards. If selectedRole is chosen, show that role's login page!
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'TRAINER' | 'TRAINEE' | null>(null);

  // STEP 2: Mode on the login page (Sign In vs Sign Up)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Google Onboarding Modal State
  const [isGoogleOnboarding, setIsGoogleOnboarding] = useState(false);
  const [googleUser, setGoogleUser] = useState<{
    email: string;
    displayName: string;
    photoURL: string;
    uid: string;
  } | null>(null);

  // Seed default accounts in background (non-blocking) with separate role subtrees
  useEffect(() => {
    const seed = async () => {
      try {
        const snap = await timeoutPromise(get(child(ref(rtdb), 'users')), 1500);
        if (!snap.exists()) {
          const payload: Record<string, any> = {};
          const traineeTree: Record<string, any> = {};
          const trainerTree: Record<string, any> = {};
          const adminTree: Record<string, any> = {};

          DEFAULT_ACCOUNTS.forEach(acc => {
            const key = encodeEmailKey(acc.email);
            const userObj = {
              email: acc.email,
              password: acc.password,
              fullName: acc.fullName,
              role: acc.role,
              avatar: '/default-avatar.png',
              traineeData: acc.studentData || null,
              studentData: acc.studentData || null,
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString()
            };
            payload[key] = userObj;

            if (acc.role === 'TRAINEE') {
              traineeTree[key] = {
                ...userObj,
                degree: acc.studentData?.degree || 'B.E. Computer Science',
                institution: acc.studentData?.institution || 'Visvesvaraya Technological University',
                skills: acc.studentData?.skills || ['Kubernetes', 'Docker', 'Python', 'AWS'],
                interests: acc.studentData?.interests || ['Cloud Architecture', 'AI']
              };
            } else if (acc.role === 'TRAINER') {
              trainerTree[key] = {
                ...userObj,
                title: 'Principal Cloud Architect & Senior Corporate Trainer',
                organization: 'Capacity Connect Global Academy',
                specialization: ['Cloud Architecture', 'Kubernetes', 'DevOps'],
                yearsOfExperience: 16,
                rating: 4.95
              };
            } else if (acc.role === 'ADMIN') {
              adminTree[key] = {
                ...userObj,
                department: 'Platform Governance & Executive Operations',
                permissions: ['ALL', 'USER_MANAGEMENT', 'COURSE_AUDIT']
              };
            }
          });

          // Save to root users as well as separate role fields: users/trainee, users/trainer, users/admin
          await timeoutPromise(set(ref(rtdb, 'users'), {
            ...payload,
            trainee: traineeTree,
            trainer: trainerTree,
            admin: adminTree
          }), 1500);
        }
      } catch {}
    };
    seed();
  }, []);

  const getRegisteredUsers = (): StoredAccount[] => {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
        return DEFAULT_ACCOUNTS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  };

  const saveUserToRegistry = (newUser: StoredAccount) => {
    try {
      const existing = getRegisteredUsers();
      const updated = existing.filter(u => u.email.toLowerCase() !== newUser.email.toLowerCase());
      updated.push(newUser);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Local storage write notice', e);
    }
  };

  // Select role to transition to its login page
  const handleSelectRole = (role: 'ADMIN' | 'TRAINER' | 'TRAINEE') => {
    setError('');
    setSelectedRole(role);
    setAuthMode('signin');
    setEmail('');
    setPassword('');
    setFullName('');
    setConfirmPassword('');
    setDegree('');
    setInstitution('');
    setSpecialization('');
    setAdminCode('');
  };

  // ==========================================
  // GOOGLE LOGIN HANDLER
  // ==========================================
  const handleGoogleSignIn = async (cardRole: 'TRAINEE' | 'TRAINER' | 'ADMIN') => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user || !user.email) {
        setError('Google sign-in completed, but no verified email was returned.');
        setLoading(false);
        return;
      }

      const gEmail = user.email.toLowerCase();
      const emailKey = encodeEmailKey(gEmail);
      const gName = user.displayName || gEmail.split('@')[0];
      const gPhoto = user.photoURL || '';

      // Check Realtime Database for existing account in role-specific subtree first, then root users
      try {
        const roleFolder = cardRole.toLowerCase();
        let snap = await timeoutPromise(get(child(ref(rtdb), `users/${roleFolder}/${emailKey}`)), 1500);
        if (!snap.exists()) {
          snap = await timeoutPromise(get(child(ref(rtdb), `users/${emailKey}`)), 1500);
        }

        if (snap.exists()) {
          const dbUser = snap.val();
          try {
            set(ref(rtdb, `users/${roleFolder}/${emailKey}/lastLoginAt`), new Date().toISOString());
            set(ref(rtdb, `users/${emailKey}/lastLoginAt`), new Date().toISOString());
          } catch {}

          setLoading(false);
          onLogin(false, dbUser.fullName || gName, dbUser.role || cardRole, dbUser.traineeData || dbUser.studentData);
          return;
        }
      } catch (err) {
        // Fallback to local accounts
        const users = getRegisteredUsers();
        const matched = users.find(u => u.email.toLowerCase() === gEmail);
        if (matched) {
          setLoading(false);
          onLogin(false, matched.fullName || gName, matched.role || cardRole, matched.studentData);
          return;
        }
      }

      // New Google User: Open completion prompt
      setGoogleUser({
        email: gEmail,
        displayName: gName,
        photoURL: gPhoto,
        uid: user.uid
      });
      setFullName(gName);
      setIsGoogleOnboarding(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      if (err.code === 'auth/popup-closed-by-user') {
        return;
      }
      setError(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  // Google Onboarding Submission
  const handleGoogleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUser || !selectedRole) return;
    setError('');

    const cleanEmail = googleUser.email.toLowerCase();
    const emailKey = encodeEmailKey(cleanEmail);
    const finalName = fullName.trim() || googleUser.displayName;
    const roleFolder = selectedRole.toLowerCase();

    let traineeData = undefined;
    if (selectedRole === 'TRAINEE') {
      traineeData = {
        fullName: finalName,
        email: cleanEmail,
        degree: degree.trim() || 'B.E. Computer Science',
        institution: institution.trim() || 'Engineering College',
        title: `${degree.trim() || 'Software'} Trainee`,
        skills: ['Python', 'System Design', 'Algorithms', 'Full Stack Development'],
        interests: ['Modern Web Architecture', 'Cloud Services'],
        githubUrl: ''
      };
    }

    const payload = {
      email: cleanEmail,
      fullName: finalName,
      role: selectedRole,
      authProvider: 'google',
      avatar: googleUser.photoURL || '/default-avatar.png',
      photoURL: googleUser.photoURL,
      degree: selectedRole === 'TRAINEE' ? (degree.trim() || 'B.E. Computer Science') : null,
      institution: selectedRole === 'TRAINEE' ? (institution.trim() || 'Engineering College') : null,
      traineeData: traineeData || null,
      studentData: traineeData || null,
      specialization: specialization.trim() || null,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    saveUserToRegistry({
      email: cleanEmail,
      fullName: finalName,
      role: selectedRole,
      studentData: traineeData,
      authProvider: 'google'
    });

    try {
      // 1. Save in separate role subtree in database: users/trainee, users/trainer, users/admin
      set(ref(rtdb, `users/${roleFolder}/${emailKey}`), payload);
      // 2. Save in root users
      set(ref(rtdb, `users/${emailKey}`), payload);
      // 3. Save in roles registry
      set(ref(rtdb, `roles/${selectedRole}/${emailKey}`), payload);
      setDoc(doc(db, 'users', googleUser.uid), {
        name: finalName,
        email: cleanEmail,
        role: selectedRole,
        traineeData,
        authProvider: 'google',
        createdAt: serverTimestamp()
      });
    } catch {}

    setIsGoogleOnboarding(false);
    onLogin(true, finalName, selectedRole, traineeData);
  };

  // ==========================================
  // SIGN IN SUBMISSION
  // ==========================================
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const emailKey = encodeEmailKey(cleanEmail);
    const roleFolder = selectedRole.toLowerCase();

    try {
      // 1. Try Firebase Realtime Database in role-specific folder first, then general users
      try {
        let snap = await timeoutPromise(get(child(ref(rtdb), `users/${roleFolder}/${emailKey}`)), 2000);
        if (!snap.exists()) {
          snap = await timeoutPromise(get(child(ref(rtdb), `users/${emailKey}`)), 2000);
        }

        if (snap.exists()) {
          const dbUser = snap.val();
          if (dbUser.password && dbUser.password !== password.trim()) {
            setError('Incorrect password. Please verify your credentials.');
            setLoading(false);
            return;
          }

          try {
            set(ref(rtdb, `users/${roleFolder}/${emailKey}/lastLoginAt`), new Date().toISOString());
            set(ref(rtdb, `users/${emailKey}/lastLoginAt`), new Date().toISOString());
          } catch {}

          setLoading(false);
          onLogin(false, dbUser.fullName, dbUser.role || selectedRole, dbUser.traineeData || dbUser.studentData);
          return;
        }
      } catch (e) {}

      // 2. Check local accounts registry
      const users = getRegisteredUsers();
      const matched = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (matched) {
        if (matched.password && matched.password !== password) {
          setError('Incorrect password. Please verify your credentials.');
          setLoading(false);
          return;
        }

        setLoading(false);
        onLogin(false, matched.fullName, matched.role || selectedRole, matched.studentData);
        return;
      }

      // 3. Fallback to Firebase Auth
      try {
        const cred = await timeoutPromise(signInWithEmailAndPassword(auth, cleanEmail, password), 2500);
        const u = cred.user;
        setLoading(false);
        onLogin(false, u.displayName || cleanEmail.split('@')[0], selectedRole);
        return;
      } catch (authErr: any) {
        setError('No account found with this email. Please check credentials or use 1-Click Demo.');
      }
    } catch (generalErr: any) {
      setError(generalErr.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SIGN UP SUBMISSION
  // ==========================================
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setError('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (selectedRole === 'ADMIN' && adminCode.trim() && adminCode.trim() !== 'CAPACITY2026' && adminCode.trim() !== 'admin123') {
      setError('Invalid Admin Security Code. Enter CAPACITY2026 or leave blank.');
      return;
    }

    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const emailKey = encodeEmailKey(cleanEmail);
    const roleFolder = selectedRole.toLowerCase();

    let traineeData = undefined;
    if (selectedRole === 'TRAINEE') {
      traineeData = {
        fullName: fullName.trim(),
        email: cleanEmail,
        degree: degree.trim() || 'B.E. Computer Science',
        institution: institution.trim() || 'Visvesvaraya Technological University',
        title: `${degree.trim() || 'Software'} Trainee`,
        qualification: {
          degree: degree.trim() || 'B.E. Computer Science',
          institution: institution.trim() || 'Engineering College',
          fieldOfStudy: degree.trim() || 'Computer Science',
          startYear: new Date().getFullYear() - 2,
          endYear: new Date().getFullYear() + 2,
          gradeOrGpa: '8.8 CGPA'
        },
        skills: ['Algorithms', 'Python', 'React', 'Problem Solving'],
        interests: ['Cloud Architecture', 'Distributed Systems'],
        githubUrl: ''
      };
    }

    const payload = {
      email: cleanEmail,
      password: password.trim(),
      fullName: fullName.trim(),
      role: selectedRole,
      avatar: '/default-avatar.png',
      degree: selectedRole === 'TRAINEE' ? (degree.trim() || 'B.E. Computer Science') : null,
      institution: selectedRole === 'TRAINEE' ? (institution.trim() || 'Visvesvaraya Technological University') : null,
      specialization: selectedRole === 'TRAINER' ? (specialization.trim() || 'Software & Cloud Engineering') : null,
      traineeData: traineeData || null,
      studentData: traineeData || null,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    saveUserToRegistry({
      email: cleanEmail,
      password: password.trim(),
      fullName: fullName.trim(),
      role: selectedRole,
      studentData: traineeData
    });

    try {
      // 1. Separate role subtree: users/trainee, users/trainer, users/admin with all profile info
      set(ref(rtdb, `users/${roleFolder}/${emailKey}`), payload);
      // 2. Root users
      set(ref(rtdb, `users/${emailKey}`), payload);
      // 3. Roles registry
      set(ref(rtdb, `roles/${selectedRole}/${emailKey}`), payload);

      createUserWithEmailAndPassword(auth, cleanEmail, password.trim()).then(cred => {
        updateProfile(cred.user, { displayName: fullName.trim() });
        setDoc(doc(db, 'users', cred.user.uid), {
          name: fullName.trim(),
          email: cleanEmail,
          role: selectedRole,
          traineeData,
          createdAt: serverTimestamp()
        });
      }).catch(() => {});
    } catch {}

    setLoading(false);
    onLogin(true, fullName.trim(), selectedRole, traineeData);
  };

  // 1-Click Demo Login
  const handleQuickDemo = (role: 'TRAINEE' | 'TRAINER' | 'ADMIN') => {
    const demo = DEFAULT_ACCOUNTS.find(a => a.role === role);
    if (demo) {
      onLogin(false, demo.fullName, demo.role, demo.studentData);
    }
  };

  // =========================================================================
  // VIEW 1: THE THREE CARDS SCREEN (EXACT REFERENCE IMAGE 2)
  // Shown first, with NO form inputs. Clicking "Enter as [Role] ->" shows Login
  // =========================================================================
  if (selectedRole === null) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between items-center py-12 px-4 sm:px-6 font-sans text-slate-900">
        
        {/* Header */}
        <div className="w-full max-w-5xl flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="CapacityConnect Logo"
            className="h-12 sm:h-14 w-auto object-contain mb-3"
          />
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight text-center">
            Capacity Connect Enterprise Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 text-center">
            Select your portal to proceed to your dedicated sign in and workspace
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="w-full max-w-5xl mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm font-medium shadow-xs text-center">
            {error}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* THREE CARDS (EXACT REFERENCE IMAGE 2: CLEAN, SPACIOUS, 3D)    */}
        {/* ------------------------------------------------------------- */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 items-stretch my-auto">

          {/* CARD 1: ADMIN LOGIN */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md mb-6">
                <Shield size={28} />
              </div>

              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Admin Login
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200">
                  NETWORK
                </span>
              </div>

              <div className="text-xs font-bold text-blue-600 mb-3">
                Platform Controller (All Workspaces)
              </div>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 font-normal">
                Super admin portal with global access. Manages platform users, trainee approvals, curriculum audits, trainer mapping, and executive operations.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleSelectRole('ADMIN')}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter as Admin</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                className="w-full py-1 text-[11px] font-semibold text-slate-400 hover:text-blue-600 transition text-center cursor-pointer"
              >
                1-Click Demo Access
              </button>
            </div>
          </div>

          {/* CARD 2: TRAINER LOGIN (PRIMARY) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md mb-6">
                <MonitorPlay size={28} />
              </div>

              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Trainer Login
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200">
                  ★ PRIMARY
                </span>
              </div>

              <div className="text-xs font-bold text-blue-600 mb-3">
                Curriculum & Evaluator Portal
              </div>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 font-normal">
                Faculty management portal. Create assessment questionnaires, monitor student batch progress, upload library learning materials, and evaluate competencies.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleSelectRole('TRAINER')}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter as Trainer</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('TRAINER')}
                className="w-full py-1 text-[11px] font-semibold text-slate-400 hover:text-blue-600 transition text-center cursor-pointer"
              >
                1-Click Demo Access
              </button>
            </div>
          </div>

          {/* CARD 3: TRAINEE LOGIN */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md mb-6">
                <GraduationCap size={28} />
              </div>

              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Trainee Login
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200">
                  LEARNER
                </span>
              </div>

              <div className="text-xs font-bold text-blue-600 mb-3">
                Roadmap, DSA Hub & Career
              </div>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 font-normal">
                Learner portal with company-specific DSA blueprints, interactive milestone roadmaps, project ideation, and verified industry credentials.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleSelectRole('TRAINEE')}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter as Trainee</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('TRAINEE')}
                className="w-full py-1 text-[11px] font-semibold text-slate-400 hover:text-blue-600 transition text-center cursor-pointer"
              >
                1-Click Demo Access
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 mt-12 font-medium tracking-wide">
          Capacity Connect Enterprise Architecture • Admin Manages All • Trainers Guide Batches • Trainees Master Skills
        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: THE LOGIN PAGE (SHOWN AFTER CLICKING ENTER ON A CARD)
  // "fire the three card should shown after that the login page should be shown"
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center py-10 px-4 sm:px-6 font-sans text-slate-900">
      
      <div className="w-full max-w-md">
        
        {/* Back Button to Return to the 3 Cards */}
        <button
          type="button"
          onClick={() => { setSelectedRole(null); setError(''); }}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Portal Selection</span>
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-7 sm:p-9 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
              {selectedRole === 'ADMIN' && <Shield size={24} />}
              {selectedRole === 'TRAINER' && <MonitorPlay size={24} />}
              {selectedRole === 'TRAINEE' && <GraduationCap size={24} />}
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                {selectedRole} PORTAL
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mt-0.5">
                {authMode === 'signin' ? `${selectedRole} Sign In` : `Create ${selectedRole} Account`}
              </h2>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {/* Dedicated Google Login for this Role */}
          <button
            type="button"
            onClick={() => handleGoogleSignIn(selectedRole)}
            disabled={loading}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-blue-400 rounded-xl font-semibold text-xs sm:text-sm shadow-2xs transition flex items-center justify-center gap-2.5 cursor-pointer mb-4"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-4">
            <div className="w-full border-t border-slate-200" />
            <span className="absolute bg-white px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              or with credentials
            </span>
          </div>

          {/* Sign In / Sign Up Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); setError(''); }}
              className={`flex-1 py-2 rounded-lg transition cursor-pointer text-center ${
                authMode === 'signin'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setError(''); }}
              className={`flex-1 py-2 rounded-lg transition cursor-pointer text-center ${
                authMode === 'signup'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* FORM: Sign In */}
          {authMode === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {selectedRole === 'ADMIN' ? 'Admin Email' : selectedRole === 'TRAINER' ? 'Trainer Email' : 'Trainee Email'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`${selectedRole.toLowerCase()}@capacityconnect.org`}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : `Sign In as ${selectedRole}`}</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(selectedRole)}
                className="w-full mt-2 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50/80 rounded-xl transition border border-dashed border-blue-200 text-center cursor-pointer"
              >
                1-Click Demo Login ({selectedRole === 'ADMIN' ? 'Platform Admin' : selectedRole === 'TRAINER' ? 'Dr. Rajesh Raman' : 'Bhavya Shree D'})
              </button>
            </form>
          ) : (
            /* FORM: Sign Up */
            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-0.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-0.5">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-0.5">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-0.5">Confirm *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              {selectedRole === 'TRAINEE' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-0.5">Degree / Program</label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-0.5">College / Institution</label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. Visvesvaraya Tech University"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                    />
                  </div>
                </>
              )}

              {selectedRole === 'TRAINER' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-0.5">Specialization / Domain</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Distributed Systems & Cloud"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
              )}

              {selectedRole === 'ADMIN' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-0.5">Admin Security Code</label>
                  <input
                    type="text"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="CAPACITY2026"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Creating Account...' : `Create ${selectedRole} Account`}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

        </div>
      </div>

      {/* Google Onboarding Modal (For First Time Google Users) */}
      {isGoogleOnboarding && googleUser && selectedRole && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full relative">
            <div className="flex items-center gap-3 mb-4">
              {googleUser.photoURL ? (
                <img
                  src={googleUser.photoURL}
                  alt={googleUser.displayName}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500 shadow-xs"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {googleUser.displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>{googleUser.email}</span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Verified Google Account • Role: <strong className="text-blue-600">{selectedRole}</strong>
                </span>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Complete Your {selectedRole} Profile
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Google email verified. Confirm your name and details to finish onboarding.
            </p>

            <form onSubmit={handleGoogleOnboardingSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              {selectedRole === 'TRAINEE' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Degree / Program</label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">College / University</label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. Visvesvaraya Technological University"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                    />
                  </div>
                </>
              )}

              {selectedRole === 'TRAINER' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Domain / Specialization</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Distributed Systems & Cloud"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer mt-4"
              >
                Complete & Enter Platform
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
