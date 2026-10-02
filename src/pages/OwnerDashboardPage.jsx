import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  Users, 
  Eye, 
  Check, 
  X, 
  PauseCircle, 
  PlayCircle, 
  PlusCircle, 
  Clock, 
  Phone, 
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useRooms } from '../context/RoomContext';

export default function OwnerDashboardPage() {
  const { rooms, visitRequests, updateRequestStatus, updateRoomStatus } = useRooms();

  // Filter owner's rooms (default to first 2-3 demo rooms as belonging to this owner account)
  const myRooms = rooms.slice(0, 3);

  // Calculate dynamic stats
  const activeRoomsCount = myRooms.filter(r => !r.isPaused).length;
  const pendingRequestsCount = visitRequests.filter(r => r.status === 'Pending').length;
  const totalViewsCount = myRooms.reduce((acc, curr) => acc + (curr.viewsCount || 50), 0);
  const totalInterested = visitRequests.length * 2 + 5;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                Owner Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Room Owner Dashboard
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Manage your listed rooms, schedule in-person tenant visits, and review interest.
            </p>
          </div>

          <Link
            to="/list-room"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-sm self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Another Room</span>
          </Link>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Active Rooms */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Rooms</span>
              <Building2 className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {activeRoomsCount}
            </div>
            <span className="text-[11px] text-teal-700 font-medium">Visible to tenants</span>
          </div>

          {/* Visit Requests */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Visit Requests</span>
              <Calendar className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {visitRequests.length}
            </div>
            <span className="text-[11px] text-amber-600 font-medium">
              {pendingRequestsCount} pending response
            </span>
          </div>

          {/* Interested People */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Interested People</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalInterested}
            </div>
            <span className="text-[11px] text-slate-500">Inquired or saved</span>
          </div>

          {/* Total Views */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Room Views</span>
              <Eye className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalViewsCount}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Across your rooms</span>
          </div>
        </div>

        {/* Section 1: Visit Requests (Interactive) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 mb-10">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Tenant Visit Requests
              </h2>
              <p className="text-xs text-slate-500">
                People who asked to visit your room before making an agreement.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
              {visitRequests.length} requests
            </span>
          </div>

          {visitRequests.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No pending visit requests right now.</p>
          ) : (
            <div className="space-y-4">
              {visitRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {req.tenantName}
                      </h4>
                      <span className="text-xs text-slate-500">• {req.tenantPhone}</span>
                      
                      {/* Status Tag */}
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        req.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Declined'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700">
                      Interested in: <strong className="text-slate-900">{req.roomTitle}</strong> ({req.roomArea})
                    </p>

                    <div className="flex items-center gap-3 text-xs text-teal-800 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Requested Visit: <strong>{req.requestedDate}</strong>
                      </span>
                      <span>at <strong>{req.requestedTime}</strong></span>
                    </div>

                    {req.message && (
                      <p className="text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200 max-w-xl">
                        "{req.message}"
                      </p>
                    )}
                  </div>

                  {/* Accept / Decline Action Buttons */}
                  <div className="flex sm:flex-col items-center gap-2 shrink-0">
                    {req.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Accepted')}
                          className="w-full px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-2xs flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Visit</span>
                        </button>
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Declined')}
                          className="w-full px-4 py-1.5 bg-white hover:bg-rose-50 border border-slate-300 text-rose-600 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">
                        Request {req.status.toLowerCase()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 1.5: Tenant Messages & Inquiries (Requirement 15) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 mb-10">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Tenant Messages & Inquiries
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Direct in-app messages from prospective tenants interested in your rooms.
              </p>
            </div>

            <Link
              to="/messages"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
            >
              <span>View Inbox</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center shrink-0">
                  P
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-slate-900 text-sm">Priya Sharma</h4>
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-semibold px-2 py-0.2 rounded-full">New Inquiry</span>
                    <span className="text-[11px] text-slate-400">3 hours ago</span>
                  </div>
                  <p className="text-xs text-slate-700 mb-1">
                    Interested in: <strong className="text-slate-900">Furnished Private Room with Attached Bath</strong> (Vijay Nagar)
                  </p>
                  <p className="text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200 max-w-xl">
                    "Priya is interested in your room in Vijay Nagar. Can I schedule an in-person inspection tomorrow?"
                  </p>
                </div>
              </div>

              <Link
                to="/messages?conv=conv-priya"
                className="px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs shrink-0 self-end sm:self-center"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Message</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Section 2: My Rooms */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                My Listed Rooms
              </h2>
              <p className="text-xs text-slate-500">
                Review your active and paused listings.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {myRooms.map((room) => {
              const isPaused = room.isPaused || false;
              return (
                <div
                  key={room.id}
                  className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={room.images[0]}
                      alt={room.title}
                      className="w-20 h-16 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-teal-800">
                          {room.area}, {room.city}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPaused ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isPaused ? 'Paused' : 'Active & Available'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">
                        {room.title}
                      </h4>

                      <p className="text-xs text-slate-600">
                        ₹{room.rent.toLocaleString('en-IN')}/month • {room.furnishedStatus} • Move-in: {room.availableDisplay}
                      </p>
                    </div>
                  </div>

                  {/* Actions: View, Edit, Pause */}
                  <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                    <Link
                      to={`/rooms/${room.id}`}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>

                    <button
                      onClick={() => updateRoomStatus(room.id, !isPaused)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition flex items-center gap-1 ${
                        isPaused
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {isPaused ? <PlayCircle className="w-3.5 h-3.5 text-emerald-600" /> : <PauseCircle className="w-3.5 h-3.5" />}
                      <span>{isPaused ? 'Resume Listing' : 'Pause Listing'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
