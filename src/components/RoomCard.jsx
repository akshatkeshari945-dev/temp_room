import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Wifi, 
  Bath, 
  Utensils, 
  Car, 
  Sparkles, 
  Scale, 
  ArrowRight,
  Users
} from 'lucide-react';
import { useRooms } from '../context/RoomContext';
import DemoRoomBadge from './DemoRoomBadge';

export default function RoomCard({ room, showAiBadge = true, isCompact = false }) {
  const { isSaved, toggleSave, isCompared, toggleCompare, setActiveVisitModalRoom } = useRooms();
  const saved = isSaved(room.id);
  const compared = isCompared(room.id);

  const isShared = room.roomType === 'Shared Room' || (room.sharingCapacity && room.sharingCapacity > 1);

  // Amenity icon helper
  const renderAmenityIcon = (amenity) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wi-fi') || lower.includes('wifi')) {
      return <Wifi className="w-3.5 h-3.5 text-teal-600" />;
    }
    if (lower.includes('bathroom') || lower.includes('bath')) {
      return <Bath className="w-3.5 h-3.5 text-teal-600" />;
    }
    if (lower.includes('kitchen')) {
      return <Utensils className="w-3.5 h-3.5 text-teal-600" />;
    }
    if (lower.includes('parking')) {
      return <Car className="w-3.5 h-3.5 text-teal-600" />;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col overflow-hidden group">
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={room.images[0]}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          loading="lazy"
        />

        {/* Gradient overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Demo Room Badge - only rendered when room.isDemo === true */}
            <DemoRoomBadge isDemo={room.isDemo} />

            {/* Furnished status tag */}
            <span className="text-[11px] font-semibold bg-white/95 text-slate-800 px-2.5 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
              {room.furnishedStatus}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Compare Toggle */}
            <button
              onClick={() => toggleCompare(room.id)}
              className={`p-1.5 rounded-full transition shadow-xs ${
                compared 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-white/90 text-slate-700 hover:bg-white hover:text-teal-700'
              }`}
              title={compared ? "Remove from comparison" : "Add to comparison"}
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Save / Bookmark Button */}
            <button
              onClick={() => toggleSave(room.id)}
              className={`p-1.5 rounded-full transition shadow-xs ${
                saved 
                  ? 'bg-white text-rose-500' 
                  : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500'
              }`}
              title={saved ? "Remove from saved rooms" : "Save this room"}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom image overlay info */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs pointer-events-auto">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-sm">
            <Calendar className="w-3.5 h-3.5 text-teal-300" />
            <span>Available: {room.availableDisplay}</span>
          </div>

          {room.matchScore && showAiBadge && (
            <div className="flex items-center gap-1 bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded-sm shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>{room.matchScore}% Match</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rent & Room Type */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div>
              <span className="text-xl font-bold text-slate-900">
                ₹{room.rent.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-medium"> /month</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                isShared 
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60' 
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {room.roomType}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-slate-600 text-sm mb-2.5">
            <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="font-medium text-slate-800 truncate">
              {room.area}, {room.city}
            </span>
          </div>

          {/* Sharing or Room Partner highlight if shared */}
          {isShared && (
            <div className="flex items-center gap-2 text-xs text-indigo-900 bg-indigo-50/70 border border-indigo-100 px-2.5 py-1 rounded-lg mb-3">
              <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="font-medium">
                {room.sharingCapacity || 2}-person sharing
                {room.roomPartner ? ` • Room Partner: ${room.roomPartner.name}` : ''}
              </span>
            </div>
          )}

          {/* 3 Key Amenities */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {room.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 border border-slate-200/70 px-2 py-1 rounded-md"
              >
                {renderAmenityIcon(amenity)}
                <span>{amenity}</span>
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-[11px] text-slate-400 self-center px-1">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Owner verified tag & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-500" title="Verified Room Owner">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span className="truncate max-w-[110px]">{room.owner.name}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveVisitModalRoom(room)}
              className="text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1.5 rounded-lg transition"
            >
              Request Visit
            </button>

            <Link
              to={`/rooms/${room.id}`}
              className="text-xs font-semibold text-white bg-slate-900 hover:bg-teal-700 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
            >
              <span>View</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
