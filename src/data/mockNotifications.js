// Mock notifications for Room Assist working product

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "ROOM_PARTNER_MESSAGE",
    title: "New message from Aman",
    description: "Aman replied to your message about the shared room in Bhawarkua.",
    timestamp: "2 min ago",
    isRead: false,
    relatedConversationId: "conv-aman",
    actionLink: "/messages?conv=conv-aman",
    actionText: "Open Message"
  },
  {
    id: "notif-2",
    type: "VISIT_ACCEPTED",
    title: "Visit request accepted",
    description: "Rajesh Kumar accepted your visit request for 3 Oct, 11:30 AM.",
    timestamp: "15 min ago",
    isRead: false,
    relatedRoomId: "room-2",
    actionLink: "/owner",
    actionText: "View Request"
  },
  {
    id: "notif-3",
    type: "OWNER_REPLY",
    title: "New message from room owner",
    description: "Rajesh Kumar replied: 'The room is available for inspection this weekend.'",
    timestamp: "1 hour ago",
    isRead: false,
    relatedConversationId: "conv-rajesh",
    actionLink: "/messages?conv=conv-rajesh",
    actionText: "Open Message"
  },
  {
    id: "notif-4",
    type: "SAVED_ROOM",
    title: "Room saved",
    description: "You saved 'Furnished Private Room with Attached Bath' in Vijay Nagar.",
    timestamp: "Yesterday",
    isRead: true,
    relatedRoomId: "room-1",
    actionLink: "/rooms/room-1",
    actionText: "View Room"
  },
  {
    id: "notif-5",
    type: "ROOM_UPDATE",
    title: "Price update in Rewa",
    description: "A verified room near APS University is available at ₹3,500/month.",
    timestamp: "2 days ago",
    isRead: true,
    relatedRoomId: "room-4",
    actionLink: "/rooms/room-4",
    actionText: "View Room"
  }
];
