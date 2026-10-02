import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Heart, 
  Scale, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  User, 
  Clock, 
  Share2, 
  Info,
  Check,
  Building,
  Zap,
  Wifi,
  Bath,
  Utensils,
  Car,
  Wind,
  Shirt,
  Users,
  Lock,
  Phone
} from 'lucide-react';
import { useRooms } from '../context/RoomContext';
import { matchRoomsWithAI } from '../utils/aiMatcher';
import DemoRoomBadge from '../components/DemoRoomBadge';
import ChatModal from '../components/ChatModal';

export default function RoomDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    rooms, 
    isSaved, 
    toggleSave, 
    isCompared, 
    toggleCompare, 
    setActiveVisitModalRoom, 
    aiRequirements 
  } = useRooms();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatRecipientType, setChatRecipientType] = useState('owner'); // 'owner' or 'partner'

  const room = rooms.find((r) => r.id === id);

  if (!room) {
    return (
      <div className="min-h-screen bg-[#f8fafc] py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Room Not Found</h2>
          <p className="text-sm text-slate-600 mb-6">
            The room you are looking for may have been rented out or is unavailable.
          </p>
          <Link
            to="/rooms"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition"
          >
            Browse All Rooms
          </Link>
        </div>
      </div>
    );
  }

  // Calculate dynamic AI match explanation for this specific room against active AI requirements
  const matchedList = matchRoomsWithAI([room], aiRequirements);
  const roomAiData = matchedList[0] || room;

  const saved = isSaved(room.id);
  const compared = isCompared(room.id);
  const isShared = room.roomType === 'Shared Room' || (room.sharingCapacity && room.sharingCapacity > 1);

  const openPartnerChat = () => {
    setChatRecipientType('partner');
    setChatModalOpen(true);
  };

  const openOwnerChat = () => {
    setChatRecipientType('owner');
    setChatModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation & actions */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl transition shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to listings</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCompare(room.id)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition shadow-2xs ${
                compared 
                  ? 'bg-teal-600 text-white border-teal-600' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{compared ? 'In Comparison' : 'Compare'}</span>
            </button>

            <button
              onClick={() => toggleSave(room.id)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition shadow-2xs ${
                saved 
                  ? 'bg-rose-50 text-rose-600 border-rose-200' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-500' : ''}`} />
              <span>{saved ? 'Saved' : 'Save Room'}</span>
            </button>
          </div>
        </div>

        {/* Title & Location Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Demo Room Badge */}
            <DemoRoomBadge isDemo={room.isDemo} />

            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/60">
              {room.furnishedStatus}
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
              isShared ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-700'
            }`}>
              {room.roomType}
            </span>
            {isShared && (
              <span className="text-xs font-semibold bg-indigo-100/70 text-indigo-900 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{room.sharingCapacity || 2}-person sharing</span>
              </span>
            )}
            <span className="text-xs text-slate-500 flex items-center gap-1 ml-1">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              Available from {room.availableDisplay}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            {room.title}
          </h1>

          <p className="text-sm text-slate-600 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="font-semibold text-slate-800">{room.fullAddress || `${room.area}, ${room.city}`}</span>
          </p>
        </div>

        {/* Photo Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Main Photo */}
          <div className="lg:col-span-2 relative aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden shadow-sm">
            <img
              src={room.images[activePhotoIndex]}
              alt={room.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-lg">
              Photo {activePhotoIndex + 1} of {room.images.length}
            </div>
          </div>

          {/* Thumbnails list */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto pb-2 lg:pb-0">
            {room.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative rounded-xl overflow-hidden aspect-[16/10] flex-1 shrink-0 border-2 transition ${
                  activePhotoIndex === idx ? 'border-teal-600 ring-2 ring-teal-100' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Details, AI Match Explanation, Partner, Amenities, Owner */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* ----------------- AI MATCH EXPLANATION ----------------- */}
            <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-teal-500/30">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Why this room matches you</h3>
                    <p className="text-xs text-slate-300">
                      Evaluated against your preferences ({aiRequirements.city || room.city}, under ₹{aiRequirements.budget?.toLocaleString('en-IN')})
                    </p>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-sm flex items-center gap-1.5 shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                  <span>{roomAiData.matchScore || 92}% Match</span>
                </div>
              </div>

              {/* Reasons & Things to consider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Match points */}
                <div className="bg-white/5 rounded-xl p-3.5 border border-white/10">
                  <p className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Matching Strengths</span>
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {roomAiData.matchReasons?.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-teal-400 font-bold shrink-0">✓</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Considerations */}
                <div className="bg-amber-500/10 rounded-xl p-3.5 border border-amber-500/20">
                  <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Things to consider</span>
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {roomAiData.considerations?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold shrink-0">⚠</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ----------------- CURRENT ROOM PARTNER (Requirement 2 & 5) ----------------- */}
            {isShared && room.roomPartner && (
              <div className="bg-white p-6 rounded-2xl border border-indigo-200/90 shadow-2xs bg-gradient-to-r from-indigo-50/40 via-white to-white">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-indigo-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Current Room Partner
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    Already staying in this room
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-sm ring-4 ring-indigo-100">
                      {room.roomPartner.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">
                        {room.roomPartner.name}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        {room.roomPartner.occupation} • Staying since {room.roomPartner.stayingSince}
                      </p>
                      <p className="text-[11px] text-indigo-700 font-medium flex items-center gap-1 mt-1">
                        <Lock className="w-3 h-3" />
                        <span>Contact info protected for privacy</span>
                      </p>
                    </div>
                  </div>

                  {/* Message Room Partner Button */}
                  <div>
                    <button
                      onClick={openPartnerChat}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message Room Partner</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-indigo-50 text-xs text-slate-600 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>
                    You can message {room.roomPartner.name} directly inside Room Assist to ask questions about habits, daily study hours, or living arrangements without exchanging phone numbers.
                  </span>
                </div>
              </div>
            )}

            {/* Living Arrangement & Things to Know (Requirement 5) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Living Arrangement
              </h3>
              <p className="text-sm font-semibold text-slate-800 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                {room.livingArrangement || (isShared ? '2 people will share the room.' : 'Single occupant private room.')}
              </p>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Things to know
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {(room.thingsToKnow || [
                  isShared ? "Room is shared with another person" : "Private independent room",
                  isShared ? "Kitchen is shared" : "Clean residential premises",
                  "Electricity is charged separately as per sub-meter"
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Room Description */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Room Description
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-4">
                {room.description}
              </p>

              {/* Electricity & Rules note */}
              {room.electricityRule && (
                <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                  <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Electricity & Utility Terms: </strong>
                    <span>{room.electricityRule}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Amenities Grid */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Available Room Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {room.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-800"
                  >
                    <Check className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Transit & Landmarks */}
            {room.nearbyLandmarks && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Neighborhood & Proximity
                </h3>
                <div className="flex flex-wrap gap-2">
                  {room.nearbyLandmarks.map((landmark, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-100 text-xs font-semibold text-teal-800"
                    >
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      {landmark}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Room Owner Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                About the Room Owner
              </h3>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <img
                    src={room.owner?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"}
                    alt={room.owner?.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-teal-500 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">
                        {room.owner?.name}
                      </h4>
                      {(room.owner?.isVerified || room.owner?.verified) && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                          <ShieldCheck className="w-3 h-3 text-teal-600" />
                          Verified Owner
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{room.owner?.role || 'Property Owner'} • Member since {room.owner?.memberSince}</p>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-teal-600 shrink-0" />
                      <span>{room.owner?.responseTime}</span>
                    </p>
                    {room.owner?.phone && (
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 mt-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80 w-fit">
                        <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{room.owner.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                  {room.owner?.phone && (
                    <a
                      href={`tel:${room.owner.phone.replace(/[\s()-]/g, '')}`}
                      className="px-4 py-2.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                      title={`Call ${room.owner.name} at ${room.owner.phone}`}
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span>Call Owner</span>
                    </a>
                  )}

                  <button
                    onClick={openOwnerChat}
                    className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-teal-700 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message Owner</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Col: Sticky Rent & Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24 space-y-6">
              
              {/* Rent breakdown */}
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                  Monthly Rent
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">
                    ₹{room.rent.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-slate-500 font-medium">/ month</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Security Deposit</span>
                  <strong className="text-slate-800 font-semibold">₹{room.deposit.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Room Type</span>
                  <strong className="text-slate-800 font-semibold">{room.roomType}</strong>
                </div>
                {isShared && (
                  <div className="flex items-center justify-between text-indigo-700">
                    <span>Sharing Capacity</span>
                    <strong className="font-semibold">{room.sharingCapacity || 2}-person sharing</strong>
                  </div>
                )}
                {isShared && room.roomPartner && (
                  <div className="flex items-center justify-between text-indigo-700">
                    <span>Current Room Partner</span>
                    <strong className="font-semibold">{room.roomPartner.name} ({room.roomPartner.occupation})</strong>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Furnished</span>
                  <strong className="text-slate-800 font-semibold">{room.furnishedStatus}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Floor / Access</span>
                  <strong className="text-slate-800 font-semibold">{room.floor || 'Independent'}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Available From</span>
                  <strong className="text-slate-800 font-semibold">{room.availableDisplay}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => setActiveVisitModalRoom(room)}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request a Visit</span>
                </button>

                {/* If shared room, show Message Room Partner button */}
                {isShared && (
                  <button
                    onClick={openPartnerChat}
                    className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-semibold rounded-xl transition text-xs flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Message Room Partner</span>
                  </button>
                )}

                {/* Message Owner Button */}
                <button
                  onClick={openOwnerChat}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition text-xs flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                  <span>Message Owner</span>
                </button>

                <button
                  onClick={() => toggleSave(room.id)}
                  className={`w-full py-2.5 border rounded-xl font-semibold transition text-xs flex items-center justify-center gap-1.5 ${
                    saved 
                      ? 'bg-rose-50 text-rose-600 border-rose-200' 
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-500' : ''}`} />
                  <span>{saved ? 'Saved in My Bookmarks' : 'Save Room'}</span>
                </button>
              </div>

              {/* Trust Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Room Assist Guarantee</span>
                </div>
                <p>Never transfer a token deposit without inspecting the room in person first.</p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* In-App Private Chat Modal */}
      <ChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        recipientType={chatRecipientType}
        room={room}
      />
    </div>
  );
}
