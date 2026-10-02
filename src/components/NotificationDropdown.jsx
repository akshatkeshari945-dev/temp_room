import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  MessageCircle, 
  MessageSquare, 
  Calendar, 
  CalendarCheck, 
  CalendarX, 
  Home, 
  Heart, 
  CheckCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useRooms } from '../context/RoomContext';

export default function NotificationDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadNotificationCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
  } = useRooms();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ROOM_PARTNER_MESSAGE':
      case 'MESSAGE':
        return <MessageCircle className="w-4 h-4 text-indigo-600" />;
      case 'OWNER_REPLY':
        return <MessageSquare className="w-4 h-4 text-teal-600" />;
      case 'VISIT_ACCEPTED':
        return <CalendarCheck className="w-4 h-4 text-emerald-600" />;
      case 'VISIT_DECLINED':
        return <CalendarX className="w-4 h-4 text-rose-600" />;
      case 'VISIT_REQUEST':
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'SAVED_ROOM':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'ROOM_UPDATE':
      default:
        return <Home className="w-4 h-4 text-teal-600" />;
    }
  };

  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);
    onClose();
    if (notif.actionLink) {
      navigate(notif.actionLink);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <div className="p-3.5 px-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-400" />
          <h3 className="font-bold text-sm text-white">Notifications</h3>
          {unreadNotificationCount > 0 && (
            <span className="text-[10px] font-bold bg-teal-500 text-white px-2 py-0.5 rounded-full">
              {unreadNotificationCount} new
            </span>
          )}
        </div>

        {unreadNotificationCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="text-xs text-teal-300 hover:text-white flex items-center gap-1 font-medium transition"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 bg-white">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No notifications yet
          </div>
        ) : (
          notifications.slice(0, 5).map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${
                !notif.isRead ? 'bg-teal-50/40' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs shrink-0 mt-0.5">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className={`text-xs font-bold truncate ${!notif.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                    {notif.title}
                  </h4>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" title="Unread" />
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-1">
                  {notif.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{notif.timestamp}</span>
                  {notif.actionText && (
                    <span className="text-teal-700 font-semibold hover:underline flex items-center gap-0.5">
                      {notif.actionText}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
        <Link
          to="/notifications"
          onClick={onClose}
          className="text-xs font-bold text-teal-700 hover:text-teal-800 transition inline-flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-teal-50"
        >
          <span>View all notifications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
