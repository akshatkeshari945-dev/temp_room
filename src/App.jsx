import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { RoomProvider } from './context/RoomContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequestVisitModal from './components/RequestVisitModal';

// Pages
import HomePage from './pages/HomePage';
import BrowseRoomsPage from './pages/BrowseRoomsPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import AiFinderPage from './pages/AiFinderPage';
import ListRoomPage from './pages/ListRoomPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import SavedRoomsPage from './pages/SavedRoomsPage';
import ComparePage from './pages/ComparePage';
import AuthPage from './pages/AuthPage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <RoomProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-['Plus_Jakarta_Sans',sans-serif]">
          {/* Universal Navbar */}
          <Navbar />

          {/* Dynamic Page Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rooms" element={<BrowseRoomsPage />} />
              <Route path="/rooms/:id" element={<RoomDetailsPage />} />
              <Route path="/ai-finder" element={<AiFinderPage />} />
              <Route path="/list-room" element={<ListRoomPage />} />
              <Route path="/owner" element={<OwnerDashboardPage />} />
              <Route path="/saved" element={<SavedRoomsPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/login" element={<AuthPage isSignUp={false} />} />
              <Route path="/signup" element={<AuthPage isSignUp={true} />} />
              {/* Catch-all fallback */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          {/* Global Request Visit Modal */}
          <RequestVisitModal />

          {/* Universal Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </RoomProvider>
  );
}
