import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Sparkles, 
  PlusCircle, 
  Search, 
  Heart, 
  Scale, 
  Bell,
  MessageSquare,
  Menu, 
  X, 
  UserCheck, 
  Building2, 
  ShieldCheck,
  LogIn
} from 'lucide-react';
import { useRooms } from '../context/RoomContext';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const location = useLocation();
  const { savedIds, compareIds, unreadNotificationCount } = useRooms();

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setNotificationDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Product Name */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-700 transition">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition">
                  Room <span className="text-teal-600">Assist</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200/60">
                  Affordable Rooms
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/') 
                  ? 'text-teal-700 bg-teal-50 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>

            <Link
              to="/rooms"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/rooms') 
                  ? 'text-teal-700 bg-teal-50 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Find Rooms
            </Link>

            <Link
              to="/ai-finder"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                isActive('/ai-finder') 
                  ? 'text-teal-700 bg-teal-50 font-semibold' 
                  : 'text-slate-700 hover:text-teal-700 hover:bg-teal-50/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>AI Room Finder</span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                Smart
              </span>
            </Link>

            <Link
              to="/list-room"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                isActive('/list-room') 
                  ? 'text-teal-700 bg-teal-50 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-teal-600" />
              <span>List Your Room</span>
            </Link>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Compare */}
            <Link
              to="/compare"
              className="relative p-2 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition"
              title="Compare rooms"
            >
              <Scale className="w-5 h-5" />
              {compareIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {compareIds.length}
                </span>
              )}
            </Link>

            {/* 🔔 Notifications - Placed exactly between Compare and Heart/Saved */}
            <div className="relative">
              <button
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                className={`relative p-2 rounded-lg transition ${
                  notificationDropdownOpen 
                    ? 'bg-teal-50 text-teal-700' 
                    : 'text-slate-600 hover:text-teal-700 hover:bg-slate-100'
                }`}
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              <NotificationDropdown
                isOpen={notificationDropdownOpen}
                onClose={() => setNotificationDropdownOpen(false)}
              />
            </div>

            {/* ❤️ Saved/Favorites */}
            <Link
              to="/saved"
              className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
              title="Saved rooms"
            >
              <Heart className={`w-5 h-5 ${savedIds.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {savedIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {savedIds.length}
                </span>
              )}
            </Link>

            <div className="h-5 w-px bg-slate-200 mx-1" />

            {/* Owner Dashboard link */}
            <Link
              to="/owner"
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>Owner Dashboard</span>
            </Link>

            {/* Login */}
            <Link
              to="/login"
              className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition"
            >
              Login
            </Link>

            {/* Get Started / Find Rooms button */}
            <Link
              to="/ai-finder"
              className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <span>Get Started</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-1 sm:gap-2 md:hidden">
            {/* Mobile Notification Bell */}
            <Link
              to="/notifications"
              className="relative p-2 text-slate-600 rounded-lg"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute 0 right-0 w-3.5 h-3.5 rounded-full bg-teal-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </Link>

            {/* Mobile Saved Heart */}
            <Link
              to="/saved"
              className="relative p-2 text-slate-600 rounded-lg"
              title="Saved Rooms"
            >
              <Heart className={`w-5 h-5 ${savedIds.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {savedIds.length > 0 && (
                <span className="absolute 0 right-0 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {savedIds.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={closeMenu}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/') ? 'text-teal-700 bg-teal-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/rooms"
            onClick={closeMenu}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/rooms') ? 'text-teal-700 bg-teal-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Find Rooms
          </Link>
          <Link
            to="/ai-finder"
            onClick={closeMenu}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/ai-finder') ? 'text-teal-700 bg-teal-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Room Finder</span>
            </span>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
              Smart
            </span>
          </Link>
          <Link
            to="/list-room"
            onClick={closeMenu}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/list-room') ? 'text-teal-700 bg-teal-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-teal-600" />
            <span>List Your Room</span>
          </Link>

          <div className="border-t border-slate-100 my-2 pt-2 space-y-1">
            <Link
              to="/notifications"
              onClick={closeMenu}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-600" />
                <span>Notifications</span>
              </span>
              {unreadNotificationCount > 0 && (
                <span className="bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadNotificationCount}
                </span>
              )}
            </Link>

            <Link
              to="/messages"
              onClick={closeMenu}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>Messages & Chats</span>
            </Link>

            <Link
              to="/compare"
              onClick={closeMenu}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-teal-600" />
                <span>Compare Rooms</span>
              </span>
              {compareIds.length > 0 && (
                <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {compareIds.length}
                </span>
              )}
            </Link>

            <Link
              to="/saved"
              onClick={closeMenu}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Saved Rooms</span>
              </span>
              {savedIds.length > 0 && (
                <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {savedIds.length}
                </span>
              )}
            </Link>

            <Link
              to="/owner"
              onClick={closeMenu}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              <UserCheck className="w-4 h-4 text-slate-600" />
              <span>Owner Dashboard</span>
            </Link>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={closeMenu}
              className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
            >
              Login
            </Link>
            <Link
              to="/ai-finder"
              onClick={closeMenu}
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
