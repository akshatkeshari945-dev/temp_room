import React, { useState } from 'react';
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
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useRooms } from '../context/RoomContext';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadNotificationCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
  } = useRooms();

  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Messages', 'Room Updates', 'Visits'

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ROOM_PARTNER_MESSAGE':
      case 'MESSAGE':
        return <MessageCircle className="w-5 h-5 text-indigo-600" />;
      case 'OWNER_REPLY':
        return <MessageSquare className="w-5 h-5 text-teal-600" />;
      case 'VISIT_ACCEPTED':
        return <CalendarCheck className="w-5 h-5 text-emerald-600" />;
      case 'VISIT_DECLINED':
        return <CalendarX className="w-5 h-5 text-rose-600" />;
      case 'VISIT_REQUEST':
        return <Calendar className="w-5 h-5 text-amber-600" />;
      case 'SAVED_ROOM':
        return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
      case 'ROOM_UPDATE':
      default:
        return <Home className="w-5 h-5 text-teal-600" />;
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Messages') {
      return ['MESSAGE', 'OWNER_REPLY', 'ROOM_PARTNER_MESSAGE'].includes(notif.type);
    }
    if (activeTab === 'Room Updates') {
      return ['ROOM_UPDATE', 'SAVED_ROOM'].includes(notif.type);
    }
    if (activeTab === 'Visits') {
      return ['VISIT_REQUEST', 'VISIT_ACCEPTED', 'VISIT_DECLINED'].includes(notif.type);
    }
    return true;
  });

  const handleAction = (notif) => {
    markNotificationAsRead(notif.id);
    if (notif.actionLink) {
      navigate(notif.actionLink);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 bg-teal-50 text-teal-700 rounded-xl">
                <Bell className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Notifications
              </h1>
              {unreadNotificationCount > 0 && (
                <span className="bg-teal-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full ml-1">
                  {unreadNotificationCount} new
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600">
              Stay updated on room partner replies, owner messages, visit schedules, and room alerts.
            </p>
          </div>

          {unreadNotificationCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-teal-700 text-xs font-semibold rounded-xl border border-slate-200 transition shadow-2xs shrink-0 self-start sm:self-auto"
            >
              <CheckCheck className="w-4 h-4 text-teal-600" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200/80">
          {['All', 'Messages', 'Room Updates', 'Visits'].map((tab) => {
            const count = notifications.filter((notif) => {
              if (tab === 'All') return true;
              if (tab === 'Messages') return ['MESSAGE', 'OWNER_REPLY', 'ROOM_PARTNER_MESSAGE'].includes(notif.type);
              if (tab === 'Room Updates') return ['ROOM_UPDATE', 'SAVED_ROOM'].includes(notif.type);
              if (tab === 'Visits') return ['VISIT_REQUEST', 'VISIT_ACCEPTED', 'VISIT_DECLINED'].includes(notif.type);
              return true;
            }).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">
                No notifications in this category
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When you receive room inquiries, visit approvals, or replies from owners and room partners, they will show up here.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !notif.isRead
                    ? 'bg-white border-teal-200 shadow-xs ring-1 ring-teal-100'
                    : 'bg-white border-slate-200/90'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shadow-2xs shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" title="Unread notification" />
                      )}
                      <h3 className={`text-sm font-bold ${!notif.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                      {notif.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!notif.isRead && (
                    <button
                      onClick={() => markNotificationAsRead(notif.id)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition"
                    >
                      Mark read
                    </button>
                  )}

                  {notif.actionText && (
                    <button
                      onClick={() => handleAction(notif)}
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>{notif.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
