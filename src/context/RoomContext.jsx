import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ROOMS, DEMO_VISIT_REQUESTS } from '../data/mockRooms';
import { INITIAL_NOTIFICATIONS } from '../data/mockNotifications';
import { INITIAL_CONVERSATIONS } from '../data/mockConversations';
import { matchRoomsWithAI } from '../utils/aiMatcher';

const RoomContext = createContext();

export function RoomProvider({ children }) {
  // Inventory of rooms with shared room support
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('roomassist_rooms_v3') || localStorage.getItem('roomsathi_rooms_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(r => r.roomType === 'Shared Room')) {
          return parsed.map((r, idx) => {
            const initial = INITIAL_ROOMS.find(ir => ir.id === r.id);
            return {
              ...r,
              owner: {
                ...r.owner,
                name: r.owner?.name || initial?.owner?.name || 'Property Owner',
                phone: initial?.owner?.phone || r.owner?.phone || `+91 9826${idx} 4321${idx}`,
                verified: r.owner?.verified ?? r.owner?.isVerified ?? true,
                isVerified: r.owner?.isVerified ?? r.owner?.verified ?? true,
                role: r.owner?.role || initial?.owner?.role || 'Property Owner',
                memberSince: r.owner?.memberSince || initial?.owner?.memberSince || 'Jan 2024',
                responseTime: r.owner?.responseTime || initial?.owner?.responseTime || 'Usually responds in 30 mins'
              }
            };
          });
        }
      } catch (e) {
        // fallback to INITIAL_ROOMS
      }
    }
    return INITIAL_ROOMS;
  });

  // Saved/bookmarked rooms
  const [savedIds, setSavedIds] = useState(() => {
    const saved = localStorage.getItem('roomassist_saved') || localStorage.getItem('roomsathi_saved');
    return saved ? JSON.parse(saved) : ['room-1', 'room-2'];
  });

  // Visit requests for owner dashboard
  const [visitRequests, setVisitRequests] = useState(() => {
    const saved = localStorage.getItem('roomassist_visits') || localStorage.getItem('roomsathi_visits');
    return saved ? JSON.parse(saved) : DEMO_VISIT_REQUESTS;
  });

  // Active city selector ('Indore' default)
  const [demoCity, setDemoCity] = useState('Indore');

  // Comparison room IDs (max 3)
  const [compareIds, setCompareIds] = useState(['room-1', 'room-2']);

  // Notifications state
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('roomassist_notifications_v1') || localStorage.getItem('roomsathi_notifications_v1');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Conversations state
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('roomassist_conversations_v1') || localStorage.getItem('roomsathi_conversations_v1');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState('conv-aman');

  // Active AI requirements state
  const [aiRequirements, setAiRequirements] = useState({
    city: 'Indore',
    budget: 7000,
    roomType: 'No Preference',
    furnishedStatus: 'Furnished',
    moveInDate: '2026-10-01',
    maxCommute: 20,
    area: '',
    amenities: ['Wi-Fi', 'Attached bathroom'],
    rawPrompt: ''
  });

  // Modal state for Request Visit
  const [activeVisitModalRoom, setActiveVisitModalRoom] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('roomassist_rooms_v3', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('roomassist_saved', JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem('roomassist_visits', JSON.stringify(visitRequests));
  }, [visitRequests]);

  useEffect(() => {
    localStorage.setItem('roomassist_notifications_v1', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('roomassist_conversations_v1', JSON.stringify(conversations));
  }, [conversations]);

  // Derived unread count
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  // Notification actions
  const markNotificationAsRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const addNotification = (notifData) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
      ...notifData
    };
    setNotifications((prev) => [newNotif, ...prev]);
    return newNotif;
  };

  // Messaging actions
  const sendMessage = (conversationId, text) => {
    if (!text || !text.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: 'Just now',
      isPinned: false
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMsg]
          };
        }
        return conv;
      })
    );

    // Simulate realistic response & notification after 1.4 seconds
    setTimeout(() => {
      const activeConv = conversations.find((c) => c.id === conversationId);
      const isPartner = activeConv?.participant?.isRoomPartner;
      const responderName = activeConv?.participant?.name || 'Contact';

      const replyMsg = {
        id: `m-${Date.now() + 1}`,
        sender: 'them',
        text: isPartner
          ? `Thanks for your message! Yes, I usually study in the evenings, so the room remains quiet. Let me know when you'd like to visit.`
          : `Thank you for your inquiry! The room is open for in-person visits this week. Feel free to request a date using the visit button.`,
        time: 'Just now',
        isPinned: false
      };

      setConversations((latestConvs) =>
        latestConvs.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, replyMsg]
            };
          }
          return conv;
        })
      );

      // Trigger notification if user might be elsewhere
      addNotification({
        type: isPartner ? 'ROOM_PARTNER_MESSAGE' : 'OWNER_REPLY',
        title: `New message from ${responderName}`,
        description: `${responderName}: "${replyMsg.text.slice(0, 55)}..."`,
        relatedConversationId: conversationId,
        actionLink: `/messages?conv=${conversationId}`,
        actionText: 'Open Message'
      });
    }, 1400);
  };

  const pinMessage = (conversationId, messageId) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.map((m) =>
              m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
            )
          };
        }
        return conv;
      })
    );
  };

  const deleteMessage = (conversationId, messageId) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.filter((m) => m.id !== messageId)
          };
        }
        return conv;
      })
    );
  };

  const getOrCreateConversation = (room, recipientType = 'owner') => {
    const isPartner = recipientType === 'partner';
    const convId = isPartner ? `conv-partner-${room.id}` : `conv-owner-${room.id}`;

    const existing = conversations.find((c) => c.id === convId);
    if (existing) {
      setActiveConversationId(convId);
      return convId;
    }

    // Create fresh conversation
    const newConv = {
      id: convId,
      participant: isPartner
        ? {
            name: room.roomPartner?.name || 'Aman',
            role: 'Current Room Partner',
            avatar: (room.roomPartner?.name || 'A')[0],
            isRoomPartner: true,
            stayingSince: room.roomPartner?.stayingSince || 'September 2026',
            occupation: room.roomPartner?.occupation || 'Student',
            isOnline: true
          }
        : {
            name: room.owner?.name || 'Property Owner',
            role: room.owner?.role || 'Property Owner',
            avatar: (room.owner?.name || 'O')[0],
            isRoomPartner: false,
            isVerified: true,
            phone: room.owner?.phone,
            isOnline: true
          },
      roomId: room.id,
      roomTitle: room.title,
      roomRent: room.rent,
      roomArea: `${room.area}, ${room.city}`,
      messages: [
        {
          id: `m-init-1`,
          sender: 'them',
          text: isPartner
            ? `Hi! I am ${room.roomPartner?.name || 'Aman'}, currently staying in this room. Feel free to ask about the daily living arrangement, habits, or schedule.`
            : `Namaste! I am ${room.owner?.name || 'the owner'}. How can I assist you with ${room.title}?`,
          time: 'Available',
          isPinned: true
        }
      ]
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(convId);
    return convId;
  };

  // Saved / Bookmark Actions
  const toggleSave = (roomId) => {
    setSavedIds((prev) => {
      const exists = prev.includes(roomId);
      if (!exists) {
        const roomObj = rooms.find((r) => r.id === roomId);
        if (roomObj) {
          addNotification({
            type: 'SAVED_ROOM',
            title: 'Room saved',
            description: `You saved '${roomObj.title}' in ${roomObj.area}.`,
            relatedRoomId: roomId,
            actionLink: `/rooms/${roomId}`,
            actionText: 'View Room'
          });
        }
        return [...prev, roomId];
      }
      return prev.filter((id) => id !== roomId);
    });
  };

  const isSaved = (roomId) => savedIds.includes(roomId);

  const toggleCompare = (roomId) => {
    setCompareIds((prev) => {
      if (prev.includes(roomId)) {
        return prev.filter((id) => id !== roomId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), roomId];
      }
      return [...prev, roomId];
    });
  };

  const isCompared = (roomId) => compareIds.includes(roomId);

  const clearCompare = () => setCompareIds([]);

  const addVisitRequest = (requestData) => {
    const newReq = {
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...requestData
    };
    setVisitRequests((prev) => [newReq, ...prev]);

    // Add notification
    addNotification({
      type: 'VISIT_REQUEST',
      title: 'Visit request submitted',
      description: `Visit scheduled for ${requestData.roomTitle} on ${requestData.requestedDate}, ${requestData.requestedTime}.`,
      relatedRoomId: requestData.roomId,
      actionLink: '/owner',
      actionText: 'View Request'
    });

    return newReq;
  };

  const updateRequestStatus = (requestId, newStatus) => {
    setVisitRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req))
    );

    const reqObj = visitRequests.find((r) => r.id === requestId);
    if (reqObj) {
      addNotification({
        type: newStatus === 'Accepted' ? 'VISIT_ACCEPTED' : 'VISIT_DECLINED',
        title: `Visit request ${newStatus.toLowerCase()}`,
        description: `Your visit for ${reqObj.roomTitle} on ${reqObj.requestedDate} was ${newStatus.toLowerCase()}.`,
        relatedRoomId: reqObj.roomId,
        actionLink: '/owner',
        actionText: 'View Request'
      });
    }
  };

  const addNewRoom = (newRoom) => {
    const roomWithId = {
      id: `room-${Date.now()}`,
      viewsCount: 1,
      isFeatured: false,
      ...newRoom
    };
    setRooms((prev) => [roomWithId, ...prev]);
    return roomWithId;
  };

  const updateRoomStatus = (roomId, isPaused) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId ? { ...room, isPaused: isPaused } : room
      )
    );
  };

  const getRoomById = (id) => {
    return rooms.find((r) => r.id === id);
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        savedIds,
        toggleSave,
        isSaved,
        visitRequests,
        addVisitRequest,
        updateRequestStatus,
        addNewRoom,
        updateRoomStatus,
        demoCity,
        setDemoCity,
        compareIds,
        toggleCompare,
        isCompared,
        clearCompare,
        aiRequirements,
        setAiRequirements,
        activeVisitModalRoom,
        setActiveVisitModalRoom,
        getRoomById,
        // Notifications
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        // Conversations & In-App Messaging
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        pinMessage,
        deleteMessage,
        getOrCreateConversation
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRooms() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRooms must be used within a RoomProvider');
  }
  return context;
}
