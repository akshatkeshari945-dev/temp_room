import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Check, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck,
  Eye,
  Loader2
} from 'lucide-react';
import { useRooms } from '../context/RoomContext';

export default function ListRoomPage() {
  const navigate = useNavigate();
  const { addNewRoom } = useRooms();

  const [currentStep, setCurrentStep] = useState(1);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Location
    city: 'Indore',
    area: 'Vijay Nagar',
    fullAddress: 'Plot 105, Near Main Market, Sector A',
    nearbyLandmark: 'Near Metro Station (500m)',

    // Step 2: Room Details
    roomType: 'Single private room',
    furnishedStatus: 'Furnished',
    rent: 6500,
    deposit: 10000,
    availableFrom: '2026-10-15',
    availableDisplay: '15 Oct',
    genderPreference: 'Any (Students / Working)',

    // Step 3: Amenities
    amenities: ['Wi-Fi', 'Attached bathroom', 'Ceiling Fan', 'Bed & Mattress'],

    // Step 4: Photos
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef9?auto=format&fit=crop&w=1000&q=80'
    ],
    selectedDemoPhoto: 'photo-1',

    // Step 5: Description
    description: 'Clean and well-ventilated single private room on 1st floor of our residential house. Ideal for a student or working professional. Separate entry staircase.',

    // Owner Contact
    ownerName: 'Sunil Kumar',
    ownerPhone: '+91 98263 77102'
  });

  const allAmenitiesList = [
    'Wi-Fi',
    'Attached bathroom',
    'Kitchen access',
    'Parking',
    'Bed & Mattress',
    'Cupboard',
    'AC',
    'Ceiling Fan',
    'Laundry'
  ];

  const toggleAmenity = (item) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(item);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== item)
          : [...prev.amenities, item]
      };
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Mock "Improve description with AI" feature
  const handleAiImproveDescription = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const improved = `Spacious and well-lit ${formData.roomType.toLowerCase()} available in a peaceful residential house in ${formData.area}, ${formData.city}.\n\n` +
        `The room is ${formData.furnishedStatus.toLowerCase()} with basic essentials included (${formData.amenities.slice(0, 3).join(', ')}). ` +
        `Suitable for quiet students or working professionals. Independent entrance ensures complete privacy. ` +
        `Electricity charged by sub-meter at government tariff rates. Available for move-in from ${formData.availableDisplay}.`;

      setFormData((prev) => ({ ...prev, description: improved }));
      setIsAiGenerating(false);
    }, 900);
  };

  // Final Publish
  const handlePublish = () => {
    const newRoom = {
      isDemo: false,
      title: `${formData.furnishedStatus} ${formData.roomType} in ${formData.area}`,
      city: formData.city,
      area: formData.area,
      fullAddress: `${formData.fullAddress}, ${formData.area}, ${formData.city}`,
      rent: Number(formData.rent),
      deposit: Number(formData.deposit),
      roomType: formData.roomType.toLowerCase().includes('shared') ? 'Shared Room' : 'Private Room',
      sharingCapacity: formData.roomType.toLowerCase().includes('shared') ? 2 : 1,
      currentOccupants: 1,
      furnishedStatus: formData.furnishedStatus,
      availableFrom: formData.availableFrom,
      availableDisplay: formData.availableDisplay || 'Available Now',
      genderPreference: formData.genderPreference,
      floor: '1st Floor',
      commuteTimeMins: 15,
      nearbyLandmarks: [formData.nearbyLandmark || 'Near public transport'],
      images: formData.images,
      amenities: formData.amenities,
      hasWifi: formData.amenities.includes('Wi-Fi'),
      hasAttachedBath: formData.amenities.includes('Attached bathroom'),
      hasKitchen: formData.amenities.includes('Kitchen access'),
      hasParking: formData.amenities.includes('Parking'),
      hasAC: formData.amenities.includes('AC'),
      hasLaundry: formData.amenities.includes('Laundry'),
      electricityRule: 'Electricity charged as per separate sub-meter reading.',
      description: formData.description,
      livingArrangement: formData.roomType.toLowerCase().includes('shared') ? '2 people will share the room.' : 'Single occupant private room.',
      thingsToKnow: [
        formData.roomType.toLowerCase().includes('shared') ? 'Room is shared with another person' : 'Private independent room',
        'Electricity charged as per separate sub-meter',
        'Standard 30-day notice period'
      ],
      owner: {
        name: formData.ownerName || 'House Owner',
        phone: formData.ownerPhone || '+91 98263 77102',
        role: 'Verified Room Owner',
        verified: true,
        isVerified: true,
        memberSince: 'Sep 2026',
        responseTime: 'Usually responds in 30 mins',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      }
    };

    const created = addNewRoom(newRoom);
    setCreatedRoomId(created.id);
    setIsPublished(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Heading */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Room Owner Listing Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Have an empty room? Rent it out.
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            List your available room and connect with people looking for a place to live.
          </p>
        </div>

        {isPublished ? (
          /* Success Screen */
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Your room has been listed successfully!
            </h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Your listing is now live in our available rooms database. Potential tenants can view your room, test AI match compatibility, and send visit requests.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/rooms/${createdRoomId}`}
                className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Live Listing</span>
              </Link>

              <Link
                to="/owner"
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                <span>Go to Owner Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Multi-step form container */
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            
            {/* Step Progress Bar */}
            <div className="bg-slate-50 border-b border-slate-200/80 px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Step {currentStep} of 6</span>
                <span className="text-teal-700 font-bold">
                  {currentStep === 1 && "Location"}
                  {currentStep === 2 && "Room Details & Rent"}
                  {currentStep === 3 && "Amenities"}
                  {currentStep === 4 && "Room Photos"}
                  {currentStep === 5 && "Description & AI"}
                  {currentStep === 6 && "Review & Preview"}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-6 sm:p-8">
              
              {/* STEP 1: LOCATION */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Step 1: Where is your room located?
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        City
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white"
                      >
                        <option value="Indore">Indore</option>
                        <option value="Rewa">Rewa</option>
                        <option value="Bhopal">Bhopal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Area / Colony
                      </label>
                      <input
                        type="text"
                        value={formData.area}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        placeholder="e.g. Vijay Nagar, MP Nagar, Civil Lines"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Full Address
                    </label>
                    <input
                      type="text"
                      value={formData.fullAddress}
                      onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                      placeholder="e.g. House No. 42, Sector B, Near Temple"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Nearby Landmark / Transit (Important for Tenants)
                    </label>
                    <input
                      type="text"
                      value={formData.nearbyLandmark}
                      onChange={(e) => handleInputChange('nearbyLandmark', e.target.value)}
                      placeholder="e.g. 5 min walk to Bus Stand or College Campus"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: ROOM DETAILS */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Step 2: Room Details & Rent Terms
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Room Type
                      </label>
                      <select
                        value={formData.roomType}
                        onChange={(e) => handleInputChange('roomType', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white"
                      >
                        <option value="Single private room">Single private room</option>
                        <option value="Shared room">Shared room</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Furnishing Status
                      </label>
                      <select
                        value={formData.furnishedStatus}
                        onChange={(e) => handleInputChange('furnishedStatus', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white"
                      >
                        <option value="Furnished">Furnished</option>
                        <option value="Semi-furnished">Semi-furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Monthly Rent (₹)
                      </label>
                      <input
                        type="number"
                        step="500"
                        value={formData.rent}
                        onChange={(e) => handleInputChange('rent', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Security Deposit (₹)
                      </label>
                      <input
                        type="number"
                        step="500"
                        value={formData.deposit}
                        onChange={(e) => handleInputChange('deposit', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Available From
                      </label>
                      <input
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) => {
                          handleInputChange('availableFrom', e.target.value);
                          handleInputChange('availableDisplay', e.target.value);
                        }}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800 mb-0.5">Indian Residential Norm</p>
                    <p>Standard security deposits are usually 1 to 2 months rent, refunded upon departure after key handover.</p>
                  </div>
                </div>
              )}

              {/* STEP 3: AMENITIES */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Step 3: Select Available Amenities
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tenants filter rooms based on these options. Check all items included in the rent.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {allAmenitiesList.map((amenity) => {
                      const selected = formData.amenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                            selected
                              ? 'bg-teal-50 border-teal-300 text-teal-800 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{amenity}</span>
                          {selected ? (
                            <Check className="w-4 h-4 text-teal-600" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-slate-300" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: PHOTOS */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Step 4: Upload Room Photos
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clear photos of the bed, window, study table, and attached bathroom help tenants decide faster.
                  </p>

                  {/* Photo selection options for demo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-teal-200 bg-teal-50/40 rounded-2xl p-6 text-center flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-teal-600 mb-2" />
                      <p className="text-xs font-bold text-slate-800 mb-1">
                        Sample Residential Photos Loaded
                      </p>
                      <p className="text-[11px] text-slate-500 mb-4">
                        High-resolution room photos ready for preview
                      </p>
                      <div className="flex gap-2">
                        <span className="text-[11px] bg-white border border-teal-200 text-teal-800 px-2 py-1 rounded">
                          2 photos selected
                        </span>
                      </div>
                    </div>

                    {/* Previews */}
                    <div className="grid grid-cols-2 gap-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                            Photo {idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: DESCRIPTION */}
              {currentStep === 5 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      Step 5: Room Description
                    </h3>

                    {/* Improve with AI button */}
                    <button
                      type="button"
                      disabled={isAiGenerating}
                      onClick={handleAiImproveDescription}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 rounded-xl text-xs font-bold transition shadow-2xs"
                    >
                      {isAiGenerating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>AI Improving...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>Improve description with AI</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Description for Prospective Tenants
                    </label>
                    <textarea
                      rows={5}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe the room, floor, sunlight, kitchen sharing rules, and water timings..."
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white leading-relaxed resize-none"
                    />
                  </div>

                  {/* Owner Contact Information */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Your Name (Owner)
                      </label>
                      <input
                        type="text"
                        value={formData.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Contact Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.ownerPhone}
                        onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: REVIEW */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Step 6: Review & Publish Your Room
                  </h3>

                  {/* Complete Preview Card */}
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img
                        src={formData.images[0]}
                        alt="room preview"
                        className="w-full sm:w-48 aspect-video object-cover rounded-xl border border-slate-200"
                      />
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">
                          {formData.city} • {formData.area}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">
                          {formData.furnishedStatus} {formData.roomType}
                        </h4>
                        <p className="text-lg font-extrabold text-slate-900">
                          ₹{Number(formData.rent).toLocaleString('en-IN')}{' '}
                          <span className="text-xs text-slate-500 font-normal">/month</span>
                        </p>
                        <p className="text-xs text-slate-600">
                          Security Deposit: ₹{Number(formData.deposit).toLocaleString('en-IN')} • Ready {formData.availableDisplay}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200/80 pt-3">
                      <p className="text-xs font-bold text-slate-700 uppercase mb-2">Amenities Included:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.amenities.map((a, i) => (
                          <span key={i} className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700">
                            ✓ {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-200/80 pt-3">
                      <p className="text-xs font-bold text-slate-700 uppercase mb-1">Description:</p>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        {formData.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Button Footer */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm hover:bg-slate-50 transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : <div />}

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePublish}
                    className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Publish Room</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
