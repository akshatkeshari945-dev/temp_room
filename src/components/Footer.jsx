import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Heart, MapPin, Phone, Mail, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Room <span className="text-teal-400">Assist</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-sm">
              A community platform designed for students, working professionals, and newcomers to find and rent available residential rooms in houses and flats across India.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified local room owners & genuine tenant visits</span>
            </div>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Featured Cities
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/rooms?city=Indore" className="hover:text-teal-400 transition flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  Rooms in Indore (Vijay Nagar, Bhawarkua, Rau)
                </Link>
              </li>
              <li>
                <Link to="/rooms?city=Rewa" className="hover:text-teal-400 transition flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  Rooms in Rewa (University Rd, Civil Lines)
                </Link>
              </li>
              <li>
                <Link to="/rooms?city=Bhopal" className="hover:text-teal-400 transition flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  Rooms in Bhopal (MP Nagar, Kolar Rd)
                </Link>
              </li>
              <li>
                <span className="text-xs text-slate-500 italic block mt-1">Expanding soon to Jabalpur, Ujjain & Gwalior</span>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/rooms" className="hover:text-teal-400 transition">Browse Available Rooms</Link>
              </li>
              <li>
                <Link to="/ai-finder" className="hover:text-teal-400 transition flex items-center gap-1">
                  <span>AI Room Matcher</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link to="/list-room" className="hover:text-teal-400 transition">List Your Empty Room</Link>
              </li>
              <li>
                <Link to="/owner" className="hover:text-teal-400 transition">Owner Dashboard</Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-teal-400 transition">Compare Rooms</Link>
              </li>
            </ul>
          </div>

          {/* Tenant Safety & Guidelines */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Tenant & Owner Tips
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-800">
                <span className="font-medium text-slate-200 block mb-0.5">Always Visit in Person</span>
                Inspect the room, sub-meter, and water timings before transferring deposit.
              </li>
              <li className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-800">
                <span className="font-medium text-slate-200 block mb-0.5">Simple Rent Agreement</span>
                Sign an 11-month residential agreement clearly stating the monthly rent & deposit.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Room Assist India. Residential room rental platform.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Built for students, job seekers & home owners across Indian cities</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
