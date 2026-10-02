import React, { useState } from 'react';
import { X, Calendar, Clock, MessageSquare, User, Phone, CheckCircle2, Building2 } from 'lucide-react';
import { useRooms } from '../context/RoomContext';

export default function RequestVisitModal() {
  const { activeVisitModalRoom, setActiveVisitModalRoom, addVisitRequest } = useRooms();

  const [date, setDate] = useState('2026-10-05');
  const [timeSlot, setTimeSlot] = useState('4:00 PM');
  const [name, setName] = useState('Aman Agrawal');
  const [phone, setPhone] = useState('+91 98261 44512');
  const [message, setMessage] = useState('I would like to visit the room before deciding.');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!activeVisitModalRoom) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addVisitRequest({
      roomId: activeVisitModalRoom.id,
      roomTitle: activeVisitModalRoom.title,
      roomArea: `${activeVisitModalRoom.area}, ${activeVisitModalRoom.city}`,
      rent: activeVisitModalRoom.rent,
      tenantName: name || 'Interested Tenant',
      tenantPhone: phone || '+91 98765 43210',
      requestedDate: date,
      requestedTime: timeSlot,
      message: message
    });

    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setActiveVisitModalRoom(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-lg">Request a Room Visit</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">
              Visit request sent!
            </h4>
            <p className="text-slate-600 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              Room owner <span className="font-semibold text-slate-800">{activeVisitModalRoom.owner.name}</span> will be able to respond to your request for <span className="font-semibold">{date}</span> at <span className="font-semibold">{timeSlot}</span>.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500 mb-6 text-left">
              <p className="font-semibold text-slate-700 mb-1">What happens next?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Owner receives your notification in their dashboard</li>
                <li>They will accept or coordinate via phone call / SMS</li>
                <li>No advance money is requested before the visit</li>
              </ul>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition shadow-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Room Summary preview */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <img
                src={activeVisitModalRoom.images[0]}
                alt={activeVisitModalRoom.title}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
                  {activeVisitModalRoom.area}, {activeVisitModalRoom.city}
                </p>
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {activeVisitModalRoom.title}
                </h4>
                <p className="text-xs font-medium text-slate-700">
                  ₹{activeVisitModalRoom.rent.toLocaleString('en-IN')}/month • {activeVisitModalRoom.roomType}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-teal-600 focus:border-teal-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-teal-600 focus:border-teal-600 bg-white"
                >
                  <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM - 3:00 PM)">Afternoon (12:00 PM - 3:00 PM)</option>
                  <option value="4:00 PM">Evening (4:00 PM - 6:00 PM)</option>
                  <option value="6:30 PM">Late Evening (6:30 PM - 8:00 PM)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aman Agrawal"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-teal-600 focus:border-teal-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98260 00000"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-teal-600 focus:border-teal-600 bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message to Room Owner
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I would like to visit the room before deciding."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-teal-600 focus:border-teal-600 bg-white resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition shadow-sm"
              >
                Send Visit Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
