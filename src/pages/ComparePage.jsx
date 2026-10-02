import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  Trash2, 
  Plus, 
  MapPin, 
  Check, 
  X, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { useRooms } from '../context/RoomContext';
import { matchRoomsWithAI } from '../utils/aiMatcher';
import DemoRoomBadge from '../components/DemoRoomBadge';

export default function ComparePage() {
  const { rooms, compareIds, toggleCompare, clearCompare, setActiveVisitModalRoom, aiRequirements } = useRooms();

  const selectedRooms = rooms.filter((r) => compareIds.includes(r.id));
  const scoredRooms = matchRoomsWithAI(selectedRooms, aiRequirements);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-5 h-5 text-teal-600" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Compare Rooms
              </h1>
            </div>
            <p className="text-sm text-slate-600">
              Side-by-side comparison of rent, security deposits, amenities, and commute times (up to 3 rooms).
            </p>
          </div>

          {selectedRooms.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={clearCompare}
                className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:text-rose-600 text-xs font-semibold rounded-xl transition shadow-2xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
              <Link
                to="/rooms"
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition shadow-2xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More Rooms</span>
              </Link>
            </div>
          )}
        </div>

        {selectedRooms.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-2xs">
            <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No rooms selected for comparison
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              When exploring rooms, click the compare icon on any room card to compare their rent, deposits, and amenities here.
            </p>
            <Link
              to="/rooms"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition"
            >
              Browse Available Rooms
            </Link>
          </div>
        ) : (
          /* Comparison Table */
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[650px]">
              
              {/* Header row with photos & titles */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="p-4 sm:p-5 w-1/4 font-bold text-slate-500 uppercase tracking-wider text-xs">
                    Comparison Details
                  </th>
                  {scoredRooms.map((room) => (
                    <th key={room.id} className="p-4 sm:p-5 align-top w-1/4">
                      <div className="space-y-2 relative">
                        <button
                          onClick={() => toggleCompare(room.id)}
                          className="absolute -top-1 -right-1 p-1 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full border border-slate-200 shadow-2xs"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <div className="relative">
                          <img
                            src={room.images[0]}
                            alt={room.title}
                            className="w-full aspect-video object-cover rounded-xl border border-slate-200"
                          />
                          <div className="absolute top-2 left-2">
                            <DemoRoomBadge isDemo={room.isDemo} />
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-teal-700 uppercase">
                            {room.area}, {room.city}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                            {room.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => setActiveVisitModalRoom(room)}
                            className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition"
                          >
                            Request Visit
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                  {/* Empty placeholder column if fewer than 3 */}
                  {Array.from({ length: 3 - scoredRooms.length }).map((_, idx) => (
                    <th key={idx} className="p-5 align-middle text-center border-l border-slate-100 bg-slate-50/40">
                      <Link
                        to="/rooms"
                        className="inline-flex flex-col items-center gap-1 text-slate-400 hover:text-teal-700 text-xs font-medium"
                      >
                        <Plus className="w-6 h-6 p-1 rounded-full border border-dashed border-slate-300" />
                        <span>Select another room</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-700">
                {/* AI Match Percentage */}
                <tr className="bg-teal-50/30">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>AI Match Score</span>
                  </td>
                  {scoredRooms.map((room) => (
                    <td key={room.id} className="p-4">
                      <span className="font-extrabold text-teal-800 text-sm bg-teal-100/70 px-2.5 py-1 rounded-md">
                        {room.matchScore}% Match
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: 3 - scoredRooms.length }).map((_, i) => <td key={i} className="p-4" />)}
                </tr>

                {/* Monthly Rent */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Monthly Rent</td>
                  {scoredRooms.map((room) => (
                    <td key={room.id} className="p-4 font-extrabold text-slate-900 text-base">
                      ₹{room.rent.toLocaleString('en-IN')}{' '}
                      <span className="text-xs text-slate-400 font-normal">/mo</span>
                    </td>
                  ))}
                  {Array.from({ length: 3 - scoredRooms.length }).map((_, i) => <td key={i} className="p-4" />)}
                </tr>

                {/* Security Deposit */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Security Deposit</td>
                  {scoredRooms.map((room) => (
                    <td key={room.id} className="p-4 font-semibold text-slate-800">
                      ₹{room.deposit.toLocaleString('en-IN')}
                    </td>
                  ))}
                  {Array.from({ length: 3 - scoredRooms.length }).map((_, i) => <td key={i} className="p-4" />)}
                </tr>

                {/* Location */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Location</td>
                  {scoredRooms.map((room) => (
                    <td key={room.id} className="p-4">
                      <span className="font-semibold text-slate-800">{room.area}</span>, {room.city}
                    </td>
                  ))}
                  {Array.from({ length: 3 - scoredRooms.length }).map((_, i) => <td key={i} className="p-4" />)}
                </tr>

                {/* Distance / Commute */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Estimated Commute</td>
                  {scoredRooms.map((room) => (
                    <td key={room.id} className="p-4 text-slate-700">
                      ~{room.commuteTimeMins} mins
                    </td>
                  ))}
                  {Array.from({ length: 3 - scoredRooms.length }).map((_, i) => <td key={i} className="p-4" />)}
                </tr>

                {/* Room Type */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Room Type</td>
                  {scoredRooms.map((room) => (
                    <td key={room.id} className="p-4">
                      <span className={room.roomType === 'Shared Room' ? 'text-indigo-700 font-semibold' : 'text-slate-800'}>
                        {room.roomType}
                        {room.sharingCapacity > 1 ? ` (${room.sharingCapacity}-person sharing)` : ''}
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: 3 - scoredRooms.length }).map((_, i) => <td key={i} className="p-4" />)}
                </tr>

                {/* Furnished Status */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Furnishing</td>
                  {scoredRooms.map((room) => (
                    <td key={room.id} className="p-4 font-semibold">
                      {room.furnishedStatus}
                    </td>
                  ))}
                  {Array.from({ length: 3 - scoredRooms.length }).map((_, i) => <td key={i} className="p-4" />)}
                </tr>

                {/* Wi-Fi */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Wi-Fi</td>
                  {scoredRooms.map((room) => (
                    <td key={room.id} className="p-4">
                      {room.hasWifi ? (
                        <span className="text-teal-700 font-semibold flex items-center gap-1">
                          <Check className="w-4 h-4 text-teal-600" /> Yes
                        </span>
                      ) : (
                        <span className="text-slate-400 flex items-center gap-1">
                          <X className="w-4 h-4" /> No
                        </span>
                      )}
                    </td>
                  ))}
                  {Array.from({ length: 3 - scoredRooms.length }).map((_, i) => <td key={i} className="p-4" />)}
                </tr>

                {/* Attached Bathroom */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Bathroom</td>
                  {scoredRooms.map((room) => (
                    <td key={room.id} className="p-4">
                      {room.hasAttachedBath ? (
                        <span className="text-emerald-700 font-semibold">Attached Private Bath</span>
                      ) : (
                        <span className="text-slate-600">Shared Bathroom</span>
                      )}
                    </td>
                  ))}
                  {Array.from({ length: 3 - scoredRooms.length }).map((_, i) => <td key={i} className="p-4" />)}
                </tr>

                {/* Kitchen Access */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Kitchen Access</td>
                  {scoredRooms.map((room) => (
                    <td key={room.id} className="p-4">
                      {room.hasKitchen ? (
                        <span className="text-teal-700 font-semibold">Shared Kitchen</span>
                      ) : (
                        <span className="text-slate-500">No Kitchen (Tiffin nearby)</span>
                      )}
                    </td>
                  ))}
                  {Array.from({ length: 3 - scoredRooms.length }).map((_, i) => <td key={i} className="p-4" />)}
                </tr>

                {/* Parking */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Two-wheeler Parking</td>
                  {scoredRooms.map((room) => (
                    <td key={room.id} className="p-4">
                      {room.hasParking ? (
                        <span className="text-teal-700 font-semibold flex items-center gap-1">
                          <Check className="w-4 h-4" /> Covered Parking
                        </span>
                      ) : (
                        <span className="text-slate-400">Street / Limited</span>
                      )}
                    </td>
                  ))}
                  {Array.from({ length: 3 - scoredRooms.length }).map((_, i) => <td key={i} className="p-4" />)}
                </tr>

                {/* Availability */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Move-in Date</td>
                  {scoredRooms.map((room) => (
                    <td key={room.id} className="p-4 font-semibold text-slate-800">
                      {room.availableDisplay}
                    </td>
                  ))}
                  {Array.from({ length: 3 - scoredRooms.length }).map((_, i) => <td key={i} className="p-4" />)}
                </tr>

                {/* Owner Verification */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Room Owner</td>
                  {scoredRooms.map((room) => (
                    <td key={room.id} className="p-4 text-xs">
                      <div className="font-semibold text-slate-900">{room.owner.name}</div>
                      <div className="text-slate-500">{room.owner.role}</div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - scoredRooms.length }).map((_, i) => <td key={i} className="p-4" />)}
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
