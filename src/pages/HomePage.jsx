import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Home, 
  Building2, 
  Users, 
  Calendar, 
  ShieldCheck, 
  PlusCircle, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { useRooms } from '../context/RoomContext';
import RoomCard from '../components/RoomCard';

export default function HomePage() {
  const navigate = useNavigate();
  const { rooms, demoCity, setDemoCity } = useRooms();

  // Filter 4 rooms near the selected demo city
  const cityFilteredRooms = rooms.filter(
    (room) => room.city.toLowerCase() === demoCity.toLowerCase()
  );
  // Show up to 4 rooms for homepage display
  const nearbyRooms = cityFilteredRooms.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-teal-50/30 pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold mb-6 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Affordable Rooms in Indore, Rewa, Bhopal & Tier-2/3 Cities</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
              Find a room that <span className="text-teal-600 underline decoration-teal-300 decoration-wavy underline-offset-8">fits your needs</span>.
            </h1>

            {/* Supporting text */}
            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Looking for a room in a new city? Tell us your budget, location and requirements. Our AI helps you find rooms that match.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/ai-finder"
                className="w-full sm:w-auto px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Find a Room with AI</span>
              </Link>

              <Link
                to="/list-room"
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold border border-slate-300 rounded-xl transition shadow-xs flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-teal-600" />
                <span>List Your Room</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- NEARBY ROOMS SECTION ----------------- */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Rooms near you
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Verified available rooms in residential houses and apartments with direct owner contact.
            </p>
          </div>

          {/* City location selector */}
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">
                Location
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Showing rooms near:
              </span>
            </div>

            <div className="relative">
              <select
                value={demoCity}
                onChange={(e) => setDemoCity(e.target.value)}
                className="text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 pr-8 focus:outline-teal-600 cursor-pointer"
              >
                <option value="Indore">Indore</option>
                <option value="Rewa">Rewa</option>
                <option value="Bhopal">Bhopal</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4 Room Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {nearbyRooms.map((room) => (
            <RoomCard key={room.id} room={room} showAiBadge={false} />
          ))}
        </div>

        {/* View All Rooms button */}
        <div className="text-center pt-2">
          <Link
            to={`/rooms?city=${demoCity}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold border border-slate-300 rounded-xl transition shadow-xs text-sm"
          >
            <span>View all rooms in {demoCity}</span>
            <ArrowRight className="w-4 h-4 text-teal-600" />
          </Link>
        </div>
      </section>

      {/* ----------------- HOW IT WORKS SECTION ----------------- */}
      <section className="py-14 md:py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
              How Room Assist Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We connect people looking for an affordable room with verified local house owners who have an available empty room.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-base mb-4 shadow-xs">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Tell us what you need
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Specify your city, college or workplace, monthly budget, room type, and preferred move-in date.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-base mb-4 shadow-xs">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                AI finds matching rooms
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our smart matcher scans available residential rooms and ranks them with match percentages and clear explanations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-base mb-4 shadow-xs">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Compare the rooms
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Compare rent, security deposit, bathroom types (attached vs shared), kitchen access, and distance side-by-side.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-base mb-4 shadow-xs">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Request a visit
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Schedule an in-person room inspection directly with the verified owner before making any commitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- CALL TO ACTIONS SECTION ----------------- */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tenant CTA */}
          <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-8 flex flex-col justify-between shadow-md">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 text-xs font-semibold px-2.5 py-1 rounded-full mb-4 border border-teal-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Looking for something specific?</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Let AI Match Your Ideal Room
              </h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Type your requirements in plain Hindi-English or select your filters. We will find rooms that strictly fit your budget and commute.
              </p>
            </div>
            <div>
              <Link
                to="/ai-finder"
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition text-sm shadow-sm"
              >
                <span>Try AI Room Finder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Owner CTA */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-8 flex flex-col justify-between shadow-md border border-slate-700/60">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full mb-4 border border-amber-500/30">
                <Home className="w-3.5 h-3.5" />
                <span>Have an empty room?</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Rent it out to verified tenants
              </h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                List your vacant room in 3 minutes. Connect directly with students and professionals looking for a trustworthy place to stay.
              </p>
            </div>
            <div>
              <Link
                to="/list-room"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition text-sm shadow-sm"
              >
                <span>List Your Room</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
