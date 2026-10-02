import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Building2, Phone, Mail, ArrowRight, ShieldCheck, CheckCircle2, User, KeyRound } from 'lucide-react';

export default function AuthPage({ isSignUp = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authMode, setAuthMode] = useState('phone'); // 'phone' or 'email'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [userRole, setUserRole] = useState('tenant'); // 'tenant' or 'owner'

  const handleSendOtp = (e) => {
    e.preventDefault();
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    // Simulate successful login
    if (userRole === 'owner') {
      navigate('/owner');
    } else {
      navigate('/rooms');
    }
  };

  const handleQuickDemoLogin = (role) => {
    if (role === 'owner') {
      navigate('/owner');
    } else {
      navigate('/rooms');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        
        {/* Brand header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Room <span className="text-teal-600">Assist</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">
            {isSignUp ? 'Create your Room Assist account' : 'Welcome to Room Assist'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isSignUp 
              ? 'Find verified rooms or rent out your empty residential room.' 
              : 'Log in with your mobile number to view rooms and visit requests.'}
          </p>
        </div>

        {/* 1-Click Test Login for Quick Testing */}
        <div className="mb-6 p-3 bg-teal-50/70 border border-teal-200/70 rounded-xl text-left">
          <p className="text-[11px] font-bold uppercase tracking-wider text-teal-800 mb-2 flex items-center gap-1">
            <SparklesIcon className="w-3.5 h-3.5 text-teal-600" />
            <span>Quick Test Access (1-Click)</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('tenant')}
              className="py-1.5 px-2 bg-white hover:bg-teal-100/50 border border-teal-300 text-teal-900 text-xs font-semibold rounded-lg transition text-center"
            >
              Tenant Account
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('owner')}
              className="py-1.5 px-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition text-center"
            >
              Room Owner Account
            </button>
          </div>
        </div>

        {/* Auth form */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aman Agrawal"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-teal-600"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Mobile Number (India)
                </label>
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'phone' ? 'email' : 'phone')}
                  className="text-[11px] text-teal-600 hover:underline"
                >
                  Use {authMode === 'phone' ? 'Email' : 'Phone'} instead
                </button>
              </div>

              {authMode === 'phone' ? (
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-slate-300 rounded-l-xl bg-slate-50 text-slate-500 text-xs font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98260 12345"
                    maxLength={10}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-r-xl focus:outline-teal-600"
                  />
                </div>
              ) : (
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-teal-600"
                  />
                </div>
              )}
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  I am using Room Assist primarily as:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setUserRole('tenant')}
                    className={`py-2 px-3 rounded-lg border font-semibold transition ${
                      userRole === 'tenant'
                        ? 'bg-teal-50 border-teal-500 text-teal-800'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Looking for a Room
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRole('owner')}
                    className={`py-2 px-3 rounded-lg border font-semibold transition ${
                      userRole === 'owner'
                        ? 'bg-teal-50 border-teal-500 text-teal-800'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    I have a Room to Rent
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Get OTP & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* OTP Screen */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Enter the 4-digit code sent to</span>
              <p className="text-sm font-bold text-slate-900">
                {authMode === 'phone' ? `+91 ${phoneNumber || '98260 12345'}` : email}
              </p>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-[11px] text-teal-600 hover:underline mt-0.5"
              >
                Change number
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enter OTP
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 1234"
                  maxLength={6}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-teal-600 text-center tracking-widest font-bold"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 text-center">Use any 4-digit code (e.g. 1234)</p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition shadow-sm"
            >
              Verify & Enter
            </button>
          </form>
        )}

        {/* Footer toggle */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-teal-700 font-semibold hover:underline">
                Log in
              </Link>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="text-teal-700 font-semibold hover:underline">
                Sign up for free
              </Link>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

function SparklesIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z" />
    </svg>
  );
}
