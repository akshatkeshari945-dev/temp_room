import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  RotateCcw, 
  Building2, 
  Filter, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useRooms } from '../context/RoomContext';
import RoomCard from '../components/RoomCard';

export default function BrowseRoomsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { rooms } = useRooms();

  // Search & Filter state
  const initialCity = searchParams.get('city') || 'All';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [maxRent, setMaxRent] = useState(9000);
  const [roomType, setRoomType] = useState('No Preference');
  const [furnishedStatus, setFurnishedStatus] = useState('All');
  const [availabilityMonth, setAvailabilityMonth] = useState('All');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync if URL query param changes
  useEffect(() => {
    const cityParam = searchParams.get('city');
    if (cityParam) {
      setSelectedCity(cityParam);
    }
  }, [searchParams]);

  const toggleAmenity = (name) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setMaxRent(9000);
    setRoomType('No Preference');
    setFurnishedStatus('All');
    setAvailabilityMonth('All');
    setSelectedAmenities([]);
    setSearchParams({});
  };

  // Filter logic
  const filteredRooms = rooms.filter((room) => {
    // City filter
    if (selectedCity !== 'All' && room.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }

    // Search query (area, college, landmark, address)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        room.city.toLowerCase().includes(q) ||
        room.area.toLowerCase().includes(q) ||
        room.fullAddress.toLowerCase().includes(q) ||
        (room.roomType && room.roomType.toLowerCase().includes(q)) ||
        room.nearbyLandmarks.some((l) => l.toLowerCase().includes(q)) ||
        room.description.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Rent filter
    if (room.rent > maxRent) {
      return false;
    }

    // Room type filter: Private Room, Shared Room, No Preference
    if (roomType && roomType !== 'All' && roomType !== 'No Preference') {
      if (roomType === 'Shared Room' || roomType === 'Shared') {
        if (room.roomType !== 'Shared Room') return false;
      } else if (roomType === 'Private Room' || roomType === 'Single') {
        if (room.roomType !== 'Private Room') return false;
      } else if (!room.roomType.toLowerCase().includes(roomType.toLowerCase())) {
        return false;
      }
    }

    // Furnished status
    if (furnishedStatus !== 'All' && room.furnishedStatus !== furnishedStatus) {
      return false;
    }

    // Availability month
    if (availabilityMonth !== 'All') {
      if (!room.availableDisplay.toLowerCase().includes(availabilityMonth.toLowerCase())) {
        return false;
      }
    }

    // Amenities
    if (selectedAmenities.length > 0) {
      const hasAllSelected = selectedAmenities.every((req) =>
        room.amenities.some((a) => a.toLowerCase().includes(req.toLowerCase()))
      );
      if (!hasAllSelected) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Available Rooms
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Find and rent residential rooms in houses & flats. Showing verified properties with direct owner contact.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs"
            >
              <Filter className="w-3.5 h-3.5 text-teal-600" />
              <span>Filters ({selectedAmenities.length + (selectedCity !== 'All' ? 1 : 0)})</span>
            </button>

            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
              {filteredRooms.length} of {rooms.length} rooms
            </span>
          </div>
        </div>

        {/* Search Bar Strip */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs mb-8 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by area, college (e.g. Vijay Nagar, APS University, MP Nagar)..."
              className="w-full pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-teal-600 transition"
            />
          </div>

          {/* City quick buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Indore', 'Rewa', 'Bhopal'].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  selectedCity === city
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {city === 'All' ? 'All Cities' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Main Layout: Filters Sidebar + Room Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Filter Sidebar */}
          <div className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} lg:col-span-1`}>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                  Filter Rooms
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              {/* Monthly Rent Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    Max Monthly Rent
                  </label>
                  <span className="text-xs font-bold text-teal-700">
                    ₹{maxRent.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="4000"
                  max="9000"
                  step="500"
                  value={maxRent}
                  onChange={(e) => setMaxRent(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹4,000</span>
                  <span>₹6,500</span>
                  <span>₹9,000</span>
                </div>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Room Type
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-600 bg-white font-medium text-slate-800"
                >
                  <option value="No Preference">No Preference</option>
                  <option value="Private Room">Private Room</option>
                  <option value="Shared Room">Shared Room</option>
                </select>
              </div>

              {/* Furnished Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Furnished Status
                </label>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {['All', 'Furnished', 'Semi-furnished', 'Unfurnished'].map((status) => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="furnished"
                        checked={furnishedStatus === status}
                        onChange={() => setFurnishedStatus(status)}
                        className="accent-teal-600"
                      />
                      <span>{status === 'All' ? 'Any Furnishing' : status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Month */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Availability
                </label>
                <select
                  value={availabilityMonth}
                  onChange={(e) => setAvailabilityMonth(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-600 bg-white"
                >
                  <option value="All">All Move-in Dates</option>
                  <option value="Oct">Available in October</option>
                  <option value="Nov">Available in November</option>
                </select>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Required Amenities
                </label>
                <div className="space-y-2 text-xs text-slate-700">
                  {['Wi-Fi', 'Attached bathroom', 'Shared kitchen', 'Parking'].map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded accent-teal-600 w-3.5 h-3.5"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Room Grid */}
          <div className="lg:col-span-3">
            {filteredRooms.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  No rooms match these filters
                </h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                  Try adjusting the monthly rent slider, clearing the city filter, or removing some amenities.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-xl hover:bg-teal-700 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} showAiBadge={false} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
