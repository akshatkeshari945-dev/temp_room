import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Building2, ArrowRight, Sparkles } from 'lucide-react';
import { useRooms } from '../context/RoomContext';
import RoomCard from '../components/RoomCard';

export default function SavedRoomsPage() {
  const { rooms, savedIds } = useRooms();

  const savedRooms = rooms.filter((r) => savedIds.includes(r.id));

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Saved Rooms
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            Rooms you have bookmarked for comparison or to schedule a visit later.
          </p>
        </div>

        {savedRooms.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-2xs">
            <div className="w-14 h-14 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              You haven't saved any rooms yet
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              When browsing through available rooms, click the heart icon on any card to save it here for easy review.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/rooms"
                className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition shadow-sm"
              >
                Browse Available Rooms
              </Link>
              <Link
                to="/ai-finder"
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Find with AI</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Saved rooms grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRooms.map((room) => (
              <RoomCard key={room.id} room={room} showAiBadge={false} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
