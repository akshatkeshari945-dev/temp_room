import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Send, 
  Building, 
  Lock, 
  Phone,
  Pin,
  Trash2,
  ExternalLink,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import { useRooms } from '../context/RoomContext';

export default function ChatModal({
  isOpen,
  onClose,
  recipientType = 'partner', // 'partner' or 'owner'
  room = null
}) {
  const navigate = useNavigate();
  const { getOrCreateConversation } = useRooms();

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeMenuMsgId, setActiveMenuMsgId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [hasUnseenNewMessage, setHasUnseenNewMessage] = useState(false);
  const messagesContainerRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  const isPartner = recipientType === 'partner';
  const partner = room?.roomPartner || {
    name: 'Aman',
    occupation: 'Student',
    stayingSince: 'September 2026'
  };
  const owner = room?.owner || {
    name: 'Rajesh Kumar',
    role: 'Property Owner',
    phone: '+91 98765 43210'
  };

  const recipientName = isPartner ? partner.name : owner.name;
  const recipientRole = isPartner ? 'Current Room Partner' : (owner.role || 'Property Owner');

  // Initialize realistic mock messages based on recipient
  useEffect(() => {
    if (!room) return;

    if (isPartner) {
      setMessages([
        {
          id: 'cm-1',
          sender: 'user',
          text: 'Hi, I am interested in sharing this room. Is the room still available?',
          time: '10:14 AM',
          isPinned: false
        },
        {
          id: 'cm-2',
          sender: 'recipient',
          text: 'Yes, it is currently available.',
          time: '10:16 AM',
          isPinned: false
        },
        {
          id: 'cm-3',
          sender: 'user',
          text: 'Could you tell me a little about the room and the daily living arrangement?',
          time: '10:18 AM',
          isPinned: false
        },
        {
          id: 'cm-4',
          sender: 'recipient',
          text: `Sure! It's a peaceful setup. 2 people share the room, we have separate beds and cupboards. Kitchen is shared and the environment is very quiet for studying. Feel free to ask if you have any questions!`,
          time: '10:20 AM',
          isPinned: true
        }
      ]);
    } else {
      setMessages([
        {
          id: 'cm-101',
          sender: 'user',
          text: `Namaste ${owner.name}, I saw your room listing on Room Assist and I am interested in renting it.`,
          time: 'Yesterday',
          isPinned: false
        },
        {
          id: 'cm-102',
          sender: 'recipient',
          text: `Namaste! Yes, the room is ready for move-in from ${room.availableDisplay || 'this month'}. Would you like to schedule an in-person visit?`,
          time: 'Yesterday',
          isPinned: true
        },
        {
          id: 'cm-103',
          sender: 'user',
          text: 'Yes, I would like to visit and inspect the room before taking a decision.',
          time: '11:05 AM',
          isPinned: false
        },
        {
          id: 'cm-104',
          sender: 'recipient',
          text: 'Great, you can request a convenient date & time using the visit button, and I will confirm right away.',
          time: '11:12 AM',
          isPinned: false
        }
      ]);
    }
  }, [isOpen, recipientType, room]);

  // When modal opens or room/recipient changes: natural default top scroll (0), never auto-jump to bottom
  useEffect(() => {
    if (isOpen) {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = 0;
      }
      setHasUnseenNewMessage(false);
      prevMessagesLengthRef.current = messages.length;
    }
  }, [isOpen, room?.id, recipientType]);

  // Handle messages changes
  useEffect(() => {
    const currentLen = messages.length;
    const prevLen = prevMessagesLengthRef.current;

    if (currentLen > prevLen && prevLen > 0) {
      const container = messagesContainerRef.current;
      const lastMessage = messages[currentLen - 1];
      const isSentByMe = lastMessage?.sender === 'user';

      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 80;

        if (isSentByMe || isNearBottom) {
          container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
          setHasUnseenNewMessage(false);
        } else {
          setHasUnseenNewMessage(true);
        }
      }
    }

    prevMessagesLengthRef.current = currentLen;
  }, [messages]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 80;
    if (isNearBottom) {
      setHasUnseenNewMessage(false);
    }
  };

  const scrollToLatestMessage = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setHasUnseenNewMessage(false);
    }
  };

  // Click outside to close message menu
  useEffect(() => {
    function handleDocClick() {
      setActiveMenuMsgId(null);
    }
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  if (!isOpen || !room) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `cm-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      time: 'Just now',
      isPinned: false
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    if (messagesContainerRef.current) {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
          setHasUnseenNewMessage(false);
        }
      }, 50);
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `cm-${Date.now() + 1}`,
          sender: 'recipient',
          text: isPartner
            ? `Thanks for reaching out! Let me know if you'd like to coordinate a quick visit to see the room.`
            : `Thank you for your message. I am available today if you have any further questions.`,
          time: 'Just now',
          isPinned: false
        }
      ]);
    }, 1200);
  };

  const handleTogglePin = (msgId, e) => {
    e.stopPropagation();
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, isPinned: !m.isPinned } : m))
    );
    setActiveMenuMsgId(null);
  };

  const handleDeleteMessage = (msgId) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    setConfirmDeleteId(null);
  };

  const handleOpenFullChat = () => {
    const convId = getOrCreateConversation(room, recipientType);
    onClose();
    navigate(`/messages?conv=${convId}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col h-[600px] max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 relative">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm ring-2 ${
              isPartner ? 'bg-indigo-600 ring-indigo-400/30' : 'bg-teal-600 ring-teal-400/30'
            }`}>
              {recipientName ? recipientName[0] : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white leading-tight">
                  {isPartner ? 'Message Room Partner' : 'Message Room Owner'}
                </h3>
                <span className="text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                  In-App Chat
                </span>
              </div>
              <p className="text-xs text-slate-300">
                <strong className="text-white font-semibold">{recipientName}</strong> • {recipientRole}
                {isPartner && partner.stayingSince && (
                  <span className="text-slate-400 ml-1">(Staying since {partner.stayingSince})</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleOpenFullChat}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Open in full screen messages"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              aria-label="Close message window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Property & Contact Strip */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-700 shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <Building className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="font-semibold text-slate-900 truncate">{room.title}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Owner Phone Accessible */}
            {!isPartner && owner.phone && (
              <a
                href={`tel:${owner.phone}`}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-white border border-slate-300 px-2 py-0.5 rounded hover:bg-teal-50"
                title={`Call ${owner.name}`}
              >
                <Phone className="w-3 h-3 text-teal-600" />
                <span>Call: {owner.phone}</span>
              </a>
            )}

            <span className="font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-slate-200">
              ₹{room.rent.toLocaleString('en-IN')}/mo
            </span>
          </div>
        </div>

        {/* Privacy Banner */}
        <div className="bg-teal-50/80 border-b border-teal-100 px-4 py-1.5 flex items-center gap-2 text-[11px] text-teal-900 shrink-0">
          <Lock className="w-3.5 h-3.5 text-teal-700 shrink-0" />
          <span>
            {isPartner ? (
              <strong>Room Partner Privacy:</strong>
            ) : (
              <strong>In-App Messaging:</strong>
            )} Direct chat keeps communication safe and organized inside Room Assist.
          </span>
        </div>

        {/* Messages Body */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8fafc]"
        >
          {messages.map((msg) => {
            const isMe = msg.sender === 'user';
            const isMenuOpen = activeMenuMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col group relative ${isMe ? 'items-end' : 'items-start'}`}
              >
                {msg.isPinned && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 mb-1 px-1">
                    <Pin className="w-3 h-3 text-amber-600" />
                    <span>Pinned</span>
                  </div>
                )}

                <div className="relative max-w-[84%] flex items-start gap-1">
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      isMe
                        ? 'bg-teal-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                    } ${msg.isPinned ? 'ring-2 ring-amber-300' : ''}`}
                  >
                    <p>{msg.text}</p>
                  </div>

                  {/* Actions ⋮ */}
                  <div className="relative self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuMsgId(isMenuOpen ? null : msg.id);
                      }}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {isMenuOpen && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-6 w-36 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100"
                      >
                        <button
                          onClick={(e) => handleTogglePin(msg.id, e)}
                          className="w-full px-3 py-1.5 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Pin className="w-3.5 h-3.5 text-amber-600" />
                          <span>{msg.isPinned ? 'Unpin message' : 'Pin message'}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(msg.id);
                            setActiveMenuMsgId(null);
                          }}
                          className="w-full px-3 py-1.5 text-xs text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete message</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* Floating "↓ New message" Indicator */}
        {hasUnseenNewMessage && (
          <div className="absolute bottom-16 inset-x-0 flex justify-center pointer-events-none z-20">
            <button
              type="button"
              onClick={scrollToLatestMessage}
              className="pointer-events-auto bg-slate-900/95 hover:bg-slate-900 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-slate-700/80 backdrop-blur-xs transition hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-2 duration-150"
            >
              <span>↓ New message</span>
            </button>
          </div>
        )}

        {/* Message Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-600 focus:bg-white text-slate-800 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl transition flex items-center gap-1.5 font-semibold text-xs shadow-2xs"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

      {/* Delete confirmation dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xs w-full p-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Delete this message?</h4>
            <p className="text-xs text-slate-500">The message will be removed from your view.</p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMessage(confirmDeleteId)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
