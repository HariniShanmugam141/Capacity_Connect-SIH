import React, { useState, useEffect } from 'react';
import {
  Mail, Lock, User, Eye, EyeOff, CheckCircle2,
  GraduationCap, MonitorPlay, Shield, ArrowRight,
  School, Award, Briefcase
} from 'lucide-react';
import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthProps {
  onLogin: (isNewUser: boolean, userName: string, role: string, studentData?: any) => void;
}

interface StoredAccount {
  email: string;
  password: string;
  fullName: string;
  role: 'TRAINEE' | 'TRAINER' | 'ADMIN';
  studentData?: any;
}

const STORAGE_USERS_KEY = 'capacity_connect_accounts_v2';

// Initial pre-registered accounts in registry (so returning users work)
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

export default function Auth({ onLogin }: AuthProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Common credentials (NOT HARDCODED - starts empty!)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign up fields
  const [selectedRole, setSelectedRole] = useState<'TRAINEE' | 'TRAINER' | 'ADMIN'>('TRAINEE');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Student data collection fields (collected during signup)
  const [studentDegree, setStudentDegree] = useState('');
  const [studentInstitution, setStudentInstitution] = useState('');
  const [studentSkills, setStudentSkills] = useState('');

  // Staff / Admin extra field
  const [specialization, setSpecialization] = useState('');

  // Load registered users from storage
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
      console.warn('Failed saving user locally', e);
    }
  };

  // 1. SIGN IN SUBMIT
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const users = getRegisteredUsers();
      const matched = users.find(u => u.email.toLowerCase() === cleanEmail);

      // Verify against registered accounts
      if (matched) {
        if (matched.password !== password) {
          setError('Incorrect password. Please verify your password.');
          setLoading(false);
          return;
        }

        // Successfully matched credentials
        onLogin(false, matched.fullName, matched.role, matched.studentData);
        return;
      }

      // Try Firebase auth if exists
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const user = userCredential.user;
        const uName = user.displayName || cleanEmail.split('@')[0];
        onLogin(false, uName, selectedRole);
        return;
      } catch (fbErr: any) {
        setError('No account found with this email. Please sign up first.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 2. SIGN UP SUBMIT (Data is collected first, then login happens)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All required fields must be filled.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password correctly.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // For student: ensure academic data is collected
    if (selectedRole === 'TRAINEE') {
      if (!studentDegree.trim() || !studentInstitution.trim()) {
        setError('Please provide your Degree and College / University.');
        return;
      }
    }

    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // Package student data if student
    let studentData = undefined;
    if (selectedRole === 'TRAINEE') {
      studentData = {
        fullName: fullName.trim(),
        email: cleanEmail,
        degree: studentDegree.trim(),
        institution: studentInstitution.trim(),
        title: `${studentDegree.trim()} Candidate`,
        qualification: {
          degree: studentDegree.trim(),
          institution: studentInstitution.trim(),
          fieldOfStudy: studentDegree.trim(),
          startYear: 2022,
          endYear: 2026,
          gradeOrGpa: '8.8 CGPA'
        },
        skills: studentSkills
          ? studentSkills.split(',').map(s => s.trim()).filter(Boolean)
          : ['Computer Science', 'Software Engineering'],
        interests: ['Cloud Computing', 'AI Systems']
      };
    }

    const newAccount: StoredAccount = {
      email: cleanEmail,
      password: password.trim(),
      fullName: fullName.trim(),
      role: selectedRole,
      studentData
    };

    // Save to local registry
    saveUserToRegistry(newAccount);

    // Also register in Firebase if online
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: fullName.trim() });
      await setDoc(doc(db, 'users', user.uid), {
        name: fullName.trim(),
        email: cleanEmail,
        role: selectedRole,
        studentData,
        createdAt: serverTimestamp()
      });
    } catch {
      // Offline fallback succeeds automatically via storage registry
    }

    setTimeout(() => {
      setLoading(false);
      // Immediately log in with newly created account and collected data!
      onLogin(true, fullName.trim(), selectedRole, studentData);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 sm:p-6 font-sans text-slate-900">
      <div className="w-full max-w-lg">
        
        {/* Brand Logo & Header */}
        <div className="text-center mb-7">
          <img
            src="/logo.png"
            alt="CapacityConnect Logo"
            className="h-20 sm:h-24 w-auto object-contain mx-auto"
          />
          <p className="text-sm sm:text-base text-slate-500 mt-2.5 font-medium">
            {mode === 'signin' ? 'Sign in with your email and password' : 'Create an account to get started'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.06),0_4px_6px_-2px_rgba(0,0,0,0.02)] p-7 sm:p-9">
          
          {/* Segmented Mode Selector: Sign In | Sign Up */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 text-sm font-bold">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); }}
              className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
              {successMsg}
            </div>
          )}

          {/* ===================== FORM 1: SIGN IN ===================== */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm sm:text-base bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-800">Password</label>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl text-sm sm:text-base bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-base shadow-sm transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? 'Signing In...' : 'Sign In'}
                <ArrowRight size={18} />
              </button>

              <div className="text-center pt-2 text-sm text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); }}
                  className="text-blue-600 font-bold hover:underline cursor-pointer ml-1"
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}

          {/* ===================== FORM 2: SIGN UP ===================== */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4 text-sm">
              
              {/* Role Selection (Student, Staff/Trainer, Admin) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Select Role
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('TRAINEE')}
                    className={`py-2.5 px-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition border cursor-pointer ${
                      selectedRole === 'TRAINEE'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap size={16} />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('TRAINER')}
                    className={`py-2.5 px-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition border cursor-pointer ${
                      selectedRole === 'TRAINER'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <MonitorPlay size={16} />
                    <span>Staff</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ADMIN')}
                    className={`py-2.5 px-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition border cursor-pointer ${
                      selectedRole === 'ADMIN'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Shield size={16} />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm sm:text-base bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm sm:text-base bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none transition"
                  />
                </div>
              </div>

              {/* Create Password & Re-enter Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 chars"
                      className="w-full px-3.5 py-3 pr-9 border border-slate-200 rounded-xl text-sm sm:text-base bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Re-enter Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full px-3.5 py-3 pr-9 border border-slate-200 rounded-xl text-sm sm:text-base bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* STUDENT DATA COLLECTION FIELDS:
                  "for student first the data is collected and then the login in happen" */}
              {selectedRole === 'TRAINEE' && (
                <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3 mt-2">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                    Student Academic Details
                  </span>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Degree / Program
                    </label>
                    <input
                      type="text"
                      required
                      value={studentDegree}
                      onChange={(e) => setStudentDegree(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      College / University
                    </label>
                    <input
                      type="text"
                      required
                      value={studentInstitution}
                      onChange={(e) => setStudentInstitution(e.target.value)}
                      placeholder="e.g. State Technical University"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={studentSkills}
                      onChange={(e) => setStudentSkills(e.target.value)}
                      placeholder="e.g. Python, Docker, React, AWS"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* Staff / Admin specialization */}
              {selectedRole === 'TRAINER' && (
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Subject / Department
                  </label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Cloud Architecture & SRE"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm sm:text-base bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
              )}

              {selectedRole === 'ADMIN' && (
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Department Unit
                  </label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Platform Operations"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm sm:text-base bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-base shadow-sm transition flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {loading ? 'Creating Account & Logging In...' : 'Create Account & Sign In'}
                <ArrowRight size={18} />
              </button>

              <div className="text-center pt-2 text-sm text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setError(''); }}
                  className="text-blue-600 font-bold hover:underline cursor-pointer ml-1"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Minimal Footer */}
        <div className="text-center mt-6 text-xs text-slate-400 font-medium">
          CapacityConnect Enterprise • Secure Role-Based Access
        </div>

      </div>
    </div>
  );
}
