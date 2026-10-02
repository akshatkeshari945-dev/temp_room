import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Clock, 
  Home, 
  CheckCircle2, 
  AlertTriangle, 
  Wifi, 
  Bath, 
  Utensils, 
  Car, 
  Wind, 
  Shirt, 
  ArrowRight, 
  SlidersHorizontal,
  RotateCcw,
  Loader2,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useRooms } from '../context/RoomContext';
import { matchRoomsWithAI, parseNaturalLanguagePrompt } from '../utils/aiMatcher';
import RoomCard from '../components/RoomCard';
import DemoRoomBadge from '../components/DemoRoomBadge';

export default function AiFinderPage() {
  const location = useLocation();
  const { rooms, aiRequirements, setAiRequirements, setActiveVisitModalRoom } = useRooms();

  // Form states
  const [naturalText, setNaturalText] = useState(aiRequirements.rawPrompt || '');
  const [city, setCity] = useState(aiRequirements.city || 'Indore');
  const [area, setArea] = useState(aiRequirements.area || '');
  const [budget, setBudget] = useState(aiRequirements.budget || 7000);
  const [roomType, setRoomType] = useState(aiRequirements.roomType || 'No Preference');
  const [furnishedStatus, setFurnishedStatus] = useState(aiRequirements.furnishedStatus || 'Furnished');
  const [moveInDate, setMoveInDate] = useState(aiRequirements.moveInDate || '2026-10-01');
  const [maxCommute, setMaxCommute] = useState(aiRequirements.maxCommute || 20);
  const [selectedAmenities, setSelectedAmenities] = useState(aiRequirements.amenities || ['Wi-Fi', 'Attached bathroom']);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [matchedResults, setMatchedResults] = useState(null);

  // Sync if came with prompt from homepage
  useEffect(() => {
    if (location.state?.prompt) {
      setNaturalText(location.state.prompt);
      const parsed = parseNaturalLanguagePrompt(location.state.prompt);
      if (parsed.city) setCity(parsed.city);
      if (parsed.budget) setBudget(parsed.budget);
      if (parsed.roomType) setRoomType(parsed.roomType);
      if (parsed.furnishedStatus) setFurnishedStatus(parsed.furnishedStatus);
      if (parsed.area) setArea(parsed.area);
      if (parsed.amenities) setSelectedAmenities(parsed.amenities);

      // Trigger automatic matching
      triggerAiMatching({
        city: parsed.city || city,
        budget: parsed.budget || budget,
        roomType: parsed.roomType || roomType,
        furnishedStatus: parsed.furnishedStatus || furnishedStatus,
        area: parsed.area || area,
        amenities: parsed.amenities || selectedAmenities,
        moveInDate,
        maxCommute
      });
    } else {
      // Run initial match for clean first view
      const initialMatches = matchRoomsWithAI(rooms, {
        city,
        budget,
        roomType,
        furnishedStatus,
        area,
        moveInDate,
        maxCommute,
        amenities: selectedAmenities
      });
      setMatchedResults(initialMatches);
    }
  }, [location.state]);

  const handleNaturalTextChange = (e) => {
    const val = e.target.value;
    setNaturalText(val);

    // Auto-parse on typing
    const parsed = parseNaturalLanguagePrompt(val);
    if (parsed.city) setCity(parsed.city);
    if (parsed.budget) setBudget(parsed.budget);
    if (parsed.roomType) setRoomType(parsed.roomType);
    if (parsed.furnishedStatus) setFurnishedStatus(parsed.furnishedStatus);
    if (parsed.area) setArea(parsed.area);
    if (parsed.amenities) {
      setSelectedAmenities((prev) => Array.from(new Set([...prev, ...parsed.amenities])));
    }
  };

  const toggleAmenity = (name) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const triggerAiMatching = (criteriaOverride) => {
    setIsProcessing(true);
    setProcessStep(1);

    const criteria = criteriaOverride || {
      city,
      area,
      budget: Number(budget),
      roomType,
      furnishedStatus,
      moveInDate,
      maxCommute: Number(maxCommute),
      amenities: selectedAmenities,
      rawPrompt: naturalText
    };

    setAiRequirements(criteria);

    // Simulated multi-stage AI reasoning steps
    setTimeout(() => {
      setProcessStep(2);
    }, 450);

    setTimeout(() => {
      setProcessStep(3);
    }, 900);

    setTimeout(() => {
      const results = matchRoomsWithAI(rooms, criteria);
      setMatchedResults(results);
      setIsProcessing(false);
      setProcessStep(0);
    }, 1400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerAiMatching();
  };

  // Sample prompt chips
  const applyPresetPrompt = (text) => {
    setNaturalText(text);
    const parsed = parseNaturalLanguagePrompt(text);
    if (parsed.city) setCity(parsed.city);
    if (parsed.budget) setBudget(parsed.budget);
    if (parsed.roomType) setRoomType(parsed.roomType);
    if (parsed.furnishedStatus) setFurnishedStatus(parsed.furnishedStatus);
    if (parsed.area) setArea(parsed.area);
    if (parsed.amenities) setSelectedAmenities(parsed.amenities);

    triggerAiMatching({
      city: parsed.city || city,
      budget: parsed.budget || budget,
      roomType: parsed.roomType || roomType,
      furnishedStatus: parsed.furnishedStatus || furnishedStatus,
      area: parsed.area || area,
      amenities: parsed.amenities || selectedAmenities,
      moveInDate,
      maxCommute
    });
  };

  const strongMatchesCount = matchedResults ? matchedResults.filter((r) => r.matchScore >= 80).length : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>AI Room Requirement Matching</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Tell us what kind of room you need
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Enter your requirements naturally or adjust the criteria below. Our AI compares rent, locations, commute time, and room facilities to rank verified rooms for you.
          </p>
        </div>

        {/* AI Requirement Interface Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 mb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Natural language input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Describe in plain words (Natural Requirement Input)
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={naturalText}
                  onChange={handleNaturalTextChange}
                  placeholder="Example: I'm moving to Rewa for college. I need a single room under ₹5,000, preferably furnished, with Wi-Fi, within 20 minutes of my college."
                  className="w-full px-4 py-3 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl focus:outline-teal-600 focus:ring-1 focus:ring-teal-600 transition resize-none"
                />
              </div>

              {/* Preset 1-click prompts */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span className="font-semibold text-slate-600">Quick examples:</span>
                <button
                  type="button"
                  onClick={() => applyPresetPrompt("I am moving to Indore and need an affordable shared room near Bhawarkua under ₹4,500.")}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 text-indigo-900 border border-indigo-200 rounded-lg transition text-[11px] font-semibold"
                >
                  Indore Bhawarkua shared room under ₹4,500
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetPrompt("Moving to Rewa for APS University. Need a shared room under ₹4,000 with Wi-Fi.")}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 rounded-lg transition text-[11px]"
                >
                  Rewa shared room under ₹4,000
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetPrompt("Indore Vijay Nagar IT job. Private room under ₹8,000, furnished with attached bathroom and AC.")}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 rounded-lg transition text-[11px]"
                >
                  Indore IT pro private room
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-4">
                Structured Parameters & Preferences
              </span>

              {/* Grid of structured inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white font-medium text-slate-800"
                  >
                    <option value="Indore">Indore</option>
                    <option value="Rewa">Rewa</option>
                    <option value="Bhopal">Bhopal</option>
                    <option value="All">All Cities</option>
                  </select>
                </div>

                {/* Area / College / Workplace */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Area / College / Workplace
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Vijay Nagar, APS Univ, MP Nagar"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white text-slate-800"
                  />
                </div>

                {/* Monthly budget */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Monthly Budget
                    </label>
                    <span className="text-xs font-bold text-teal-700">
                      ₹{Number(budget).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3500"
                    max="12000"
                    step="500"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹3,500</span>
                    <span>₹7,000</span>
                    <span>₹12,000+</span>
                  </div>
                </div>

                {/* Move-in date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Target Move-in Date
                  </label>
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white text-slate-800"
                  />
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Room Type
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white text-slate-800 font-medium"
                  >
                    <option value="Private Room">Private Room</option>
                    <option value="Shared Room">Shared Room</option>
                    <option value="No Preference">No Preference</option>
                  </select>
                </div>

                {/* Furnished Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Furnishing
                  </label>
                  <select
                    value={furnishedStatus}
                    onChange={(e) => setFurnishedStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white text-slate-800"
                  >
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-furnished">Semi-furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Any">Any furnishing</option>
                  </select>
                </div>

                {/* Max Commute */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Max Commute Time
                    </label>
                    <span className="text-xs font-bold text-teal-700">
                      ~{maxCommute} mins
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    step="5"
                    value={maxCommute}
                    onChange={(e) => setMaxCommute(e.target.value)}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>5m</span>
                    <span>20m</span>
                    <span>45m</span>
                  </div>
                </div>

                {/* Submit action */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                        <span>Find Matching Rooms</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Optional preferences checkboxes */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Amenities & Preferences
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Wi-Fi', icon: Wifi },
                  { name: 'Attached bathroom', icon: Bath },
                  { name: 'Kitchen access', icon: Utensils },
                  { name: 'Parking', icon: Car },
                  { name: 'AC', icon: Wind },
                  { name: 'Laundry', icon: Shirt }
                ].map(({ name, icon: Icon }) => {
                  const active = selectedAmenities.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleAmenity(name)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        active
                          ? 'bg-teal-50 border-teal-300 text-teal-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                      <span>{name}</span>
                      {active && <Check className="w-3 h-3 text-teal-600 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        {/* ----------------- AI PROCESSING EXPERIENCE ----------------- */}
        {isProcessing && (
          <div className="bg-white rounded-2xl border border-teal-200 p-8 mb-10 shadow-md animate-in fade-in duration-300">
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 animate-spin">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {processStep === 1 && "Understanding your requirements..."}
                    {processStep === 2 && "Searching available rooms..."}
                    {processStep === 3 && "Scoring and generating match reasons..."}
                  </h4>
                  <p className="text-xs text-slate-500">Evaluating available residential rooms</p>
                </div>
              </div>

              {/* Step 1 items */}
              <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Budget identified: ₹{Number(budget).toLocaleString('en-IN')}/month</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Location identified: {city} {area ? `(${area})` : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Room type: {roomType} ({furnishedStatus})</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Move-in date: {moveInDate}</span>
                </div>

                {processStep >= 2 && (
                  <div className="pt-2 border-t border-slate-200/80 space-y-1 text-slate-600 animate-in fade-in duration-200">
                    <p className="text-[11px] font-semibold text-teal-800">Checking available rooms...</p>
                    <p className="text-[11px]">✓ Checking location proximity...</p>
                    <p className="text-[11px]">✓ Comparing rent & security deposit slabs...</p>
                    <p className="text-[11px]">✓ Matching requested amenities ({selectedAmenities.join(', ')})...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- AI MATCH RESULTS ----------------- */}
        {!isProcessing && matchedResults && (
          <div className="space-y-6">
            
            {/* Requirements summary strip */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Rooms matched to your requirements</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <span className="font-semibold text-white">Your requirements:</span>
                  <span className="bg-slate-800 px-2.5 py-1 rounded-md">{city}</span>
                  <span className="bg-slate-800 px-2.5 py-1 rounded-md">Under ₹{Number(budget).toLocaleString('en-IN')}/mo</span>
                  <span className="bg-slate-800 px-2.5 py-1 rounded-md">{roomType}</span>
                  <span className="bg-slate-800 px-2.5 py-1 rounded-md">{furnishedStatus}</span>
                  <span className="bg-slate-800 px-2.5 py-1 rounded-md">Max commute: {maxCommute}m</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-lg font-bold text-white block leading-none">
                    {strongMatchesCount} strong matches
                  </span>
                  <span className="text-xs text-slate-400">out of {rooms.length} available rooms</span>
                </div>
              </div>
            </div>

            {/* AI Matched Rooms List (Detailed layout with "Why this matches you" and "One thing to consider") */}
            <div className="grid grid-cols-1 gap-6">
              {matchedResults.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col lg:flex-row"
                >
                  {/* Left Column: Image & Quick Details */}
                  <div className="lg:w-72 relative shrink-0 aspect-[16/10] lg:aspect-auto bg-slate-100">
                    <img
                      src={room.images[0]}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <DemoRoomBadge isDemo={room.isDemo} />
                      <span className="bg-white/95 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                        {room.furnishedStatus}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-sm backdrop-blur-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-teal-300" />
                      <span>Avail: {room.availableDisplay}</span>
                    </div>
                  </div>

                  {/* Middle Column: Room Info & Match Explanations */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Top Bar with Match Score */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div>
                          <span className="text-2xl font-extrabold text-slate-900">
                            ₹{room.rent.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-500 font-medium"> /month</span>
                          <span className="ml-2 text-xs text-slate-400 font-normal">
                            (Deposit: ₹{room.deposit.toLocaleString('en-IN')})
                          </span>
                        </div>

                        {/* Match percentage pill */}
                        <div className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-2xs ${
                          room.matchScore >= 85 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : room.matchScore >= 70
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{room.matchScore}% Match</span>
                        </div>
                      </div>

                      {/* Location & Title */}
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {room.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 mb-4">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{room.area}, {room.city}</span>
                        <span className="text-slate-300 mx-1">•</span>
                        <span className={room.roomType === 'Shared Room' ? 'text-indigo-700 font-semibold' : 'text-slate-800'}>
                          {room.roomType}
                        </span>
                        {room.sharingCapacity > 1 && (
                          <span className="text-indigo-700 font-medium bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[11px]">
                            {room.sharingCapacity}-person sharing
                          </span>
                        )}
                        {room.roomPartner && (
                          <span className="text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[11px] font-medium">
                            Room Partner: {room.roomPartner.name}
                          </span>
                        )}
                        <span className="text-slate-300 mx-1">•</span>
                        <span>~{room.commuteTimeMins} mins commute</span>
                      </div>

                      {/* WHY THIS MATCHES YOU (The core AI explanation) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {/* Positive reasons */}
                        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3">
                          <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Why this matches you</span>
                          </p>
                          <ul className="space-y-1.5 text-xs text-emerald-950">
                            {room.matchReasons?.map((reason, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* One thing to consider */}
                        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3">
                          <p className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>One thing to consider</span>
                          </p>
                          <ul className="space-y-1.5 text-xs text-amber-950">
                            {room.considerations?.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-amber-600 font-bold shrink-0">⚠</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                        <span>Owner: <strong className="text-slate-700">{room.owner.name}</strong></span>
                        <span className="hidden sm:inline text-slate-400">({room.owner.responseTime})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveVisitModalRoom(room)}
                          className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-xl transition"
                        >
                          Request a Visit
                        </button>
                        <Link
                          to={`/rooms/${room.id}`}
                          className="px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                        >
                          <span>View Room</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
