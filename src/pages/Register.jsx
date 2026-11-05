import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Hotel, User, Mail, Lock, Phone, MapPin, BookOpen, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    student_id: '',
    gender: 'Male',
    department: 'Computer Science and Engineering',
    year_of_study: 1,
    phone: '',
    parent_name: '',
    parent_phone: '',
    address: '',
    email: '',
    username: '',
    password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const session = await register(formData);
      addToast(`Registration successful! Welcome to SmartHostel, ${session.displayName}.`, 'success');
      navigate('/student/dashboard');
    } catch (err) {
      addToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-navy-950 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 items-center justify-center shadow-xl shadow-cyan-500/20 mb-4">
            <Hotel className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Student Registration
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Create your university hostel account to apply for residential housing
          </p>
        </div>

        {/* Registration Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-navy-900 border border-navy-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Academic & Personal Details */}
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Academic & Identity Profile</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="e.g. Karthik Raman"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    University Student ID *
                  </label>
                  <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    placeholder="e.g. STU2024099"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-sm text-white focus:border-cyan-400 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Year of Study *
                  </label>
                  <select
                    name="year_of_study"
                    value={formData.year_of_study}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-sm text-white focus:border-cyan-400 outline-none"
                  >
                    <option value={1}>1st Year (Fresher)</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year (Final Year)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Department / Branch *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science and Engineering"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Contact & Family Details */}
            <div className="pt-4 border-t border-navy-800">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Contact & Guardian Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Student Phone Number *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    name="parent_name"
                    value={formData.parent_name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Raman"
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Parent / Emergency Phone
                  </label>
                  <input
                    type="text"
                    name="parent_phone"
                    value={formData.parent_phone}
                    onChange={handleChange}
                    placeholder="+91 98765 11223"
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Permanent Hometown Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="City, State, PIN"
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Account & Login Credentials */}
            <div className="pt-4 border-t border-navy-800">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Login Credentials</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    University Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="karthik.r@university.edu"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Choose Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. karthik_raman"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Re-type password"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Complete Registration & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-navy-800 text-center text-xs text-slate-400">
            <span>Already registered? </span>
            <Link to="/login" className="font-bold text-cyan-400 hover:underline">
              Log in to your account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
