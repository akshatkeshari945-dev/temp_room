// Realistic conversations for in-app messaging system

export const INITIAL_CONVERSATIONS = [
  {
    id: "conv-aman",
    participant: {
      name: "Aman",
      role: "Current Room Partner",
      avatar: "A",
      isRoomPartner: true,
      stayingSince: "September 2026",
      occupation: "Student",
      isOnline: true
      // No phone, email, or private contact details (Privacy Rule)
    },
    roomId: "room-2",
    roomTitle: "Shared Room — Bhawarkua, Indore",
    roomRent: 4000,
    roomArea: "Bhawarkua, Indore",
    messages: [
      {
        id: "m-1",
        sender: "user",
        text: "Hi, I am interested in sharing this room. Is the room still available?",
        time: "10:14 AM",
        isPinned: false
      },
      {
        id: "m-2",
        sender: "them",
        text: "Yes, it is currently available.",
        time: "10:16 AM",
        isPinned: false
      },
      {
        id: "m-3",
        sender: "user",
        text: "Could you tell me a little about the room and the daily living arrangement?",
        time: "10:18 AM",
        isPinned: false
      },
      {
        id: "m-4",
        sender: "them",
        text: "Room is available from 1 November. We have 2 separate single cots, study tables, and separate cupboards. Kitchen is on the terrace, and water supply is 24/7.",
        time: "10:20 AM",
        isPinned: true
      },
      {
        id: "m-5",
        sender: "them",
        text: "Please visit after 5 PM if you'd like to check out the place in person.",
        time: "2 min ago",
        isPinned: true
      }
    ]
  },
  {
    id: "conv-rajesh",
    participant: {
      name: "Rajesh Kumar",
      role: "Property Owner",
      avatar: "R",
      isRoomPartner: false,
      isVerified: true,
      phone: "+91 98765 43210", // Kept available for Owner (direct phone + in-app messaging)
      isOnline: true
    },
    roomId: "room-2",
    roomTitle: "Shared Room — Bhawarkua, Indore",
    roomRent: 4000,
    roomArea: "Bhawarkua, Indore",
    messages: [
      {
        id: "m-201",
        sender: "user",
        text: "Namaste Rajesh ji, I saw your room listing on Room Assist and wanted to know if I can visit this weekend.",
        time: "Yesterday",
        isPinned: false
      },
      {
        id: "m-202",
        sender: "them",
        text: "Namaste! Yes, the room is ready for move-in from 15 October. You can visit anytime between 11 AM and 6 PM.",
        time: "1 hour ago",
        isPinned: true
      }
    ]
  },
  {
    id: "conv-prof-shukla",
    participant: {
      name: "Prof. K.N. Shukla",
      role: "House Owner",
      avatar: "K",
      isRoomPartner: false,
      isVerified: true,
      phone: "+91 94251 77209",
      isOnline: false
    },
    roomId: "room-4",
    roomTitle: "Shared Room — University Road, Rewa",
    roomRent: 3500,
    roomArea: "University Road, Rewa",
    messages: [
      {
        id: "m-301",
        sender: "user",
        text: "Hello Sir, does this room have inverter backup for power cuts?",
        time: "3 days ago",
        isPinned: false
      },
      {
        id: "m-302",
        sender: "them",
        text: "Yes, uninterrupted inverter backup for light and fan is included without any surcharge.",
        time: "3 days ago",
        isPinned: true
      }
    ]
  },
  {
    id: "conv-priya",
    participant: {
      name: "Priya Sharma",
      role: "Prospective Tenant",
      avatar: "P",
      isRoomPartner: false,
      isVerified: false,
      isOnline: true
    },
    roomId: "room-1",
    roomTitle: "Furnished Private Room with Attached Bath",
    roomRent: 7000,
    roomArea: "Vijay Nagar, Indore",
    messages: [
      {
        id: "m-401",
        sender: "them",
        text: "Priya is interested in your room in Vijay Nagar. Can I schedule an in-person inspection tomorrow?",
        time: "3 hours ago",
        isPinned: false
      }
    ]
  }
];
