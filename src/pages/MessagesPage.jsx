import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Send, 
  Search, 
  ArrowLeft, 
  Pin, 
  Trash2, 
  MoreVertical, 
  Phone, 
  Building, 
  ShieldCheck, 
  Users, 
  Lock, 
  Sparkles, 
  Check, 
  X,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { useRooms } from '../context/RoomContext';

export default function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    sendMessage, 
    pinMessage, 
    deleteMessage,
    markNotificationAsRead,
    notifications 
  } = useRooms();

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPinnedDrawer, setShowPinnedDrawer] = useState(false);
  const [activeMenuMsgId, setActiveMenuMsgId] = useState(null);
  const [confirmDeleteMsgId, setConfirmDeleteMsgId] = useState(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [hasUnseenNewMessage, setHasUnseenNewMessage] = useState(false);

  const messagesContainerRef = useRef(null);
  const scrollPositionsRef = useRef({});
  const prevConvIdRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  // Sync active conversation from URL param if present
  useEffect(() => {
    const convParam = searchParams.get('conv');
    if (convParam && conversations.some((c) => c.id === convParam)) {
      setActiveConversationId(convParam);
      setMobileChatOpen(true);
    }
  }, [searchParams, conversations, setActiveConversationId]);

  // Find active conversation
  const currentConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  // Mark related notifications as read when opening conversation
  useEffect(() => {
    if (currentConv) {
      notifications
        .filter((n) => n.relatedConversationId === currentConv.id && !n.isRead)
        .forEach((n) => markNotificationAsRead(n.id));
    }
  }, [currentConv?.id, notifications, markNotificationAsRead]);

  // When switching conversation: preserve position if viewed previously, else natural top (0).
  // Do NOT scroll to bottom.
  useEffect(() => {
    if (!currentConv) return;
    const container = messagesContainerRef.current;
    if (container) {
      const savedPos = scrollPositionsRef.current[currentConv.id];
      if (typeof savedPos === 'number') {
        container.scrollTop = savedPos;
      } else {
        // Natural default scroll position (0) - never force bottom
        container.scrollTop = 0;
      }
    }
    prevConvIdRef.current = currentConv.id;
    prevMessagesLengthRef.current = currentConv.messages?.length || 0;
    setHasUnseenNewMessage(false);
  }, [currentConv?.id]);

  // When messages update in the current conversation
  useEffect(() => {
    if (!currentConv) return;
    const currentLen = currentConv.messages?.length || 0;
    const prevLen = prevMessagesLengthRef.current;

    // Only handle incoming/new messages when conversation didn't change
    if (prevConvIdRef.current === currentConv.id && currentLen > prevLen) {
      const container = messagesContainerRef.current;
      const lastMessage = currentConv.messages[currentLen - 1];
      const isSentByMe = lastMessage?.sender === 'user';

      if (container) {
        // Check if user is already near bottom (within 80px)
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 80;

        if (isSentByMe || isNearBottom) {
          // Allow new message to appear normally without jumping page
          container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
          setHasUnseenNewMessage(false);
        } else {
          // Reading older messages: keep position stable, do NOT jump, show indicator
          setHasUnseenNewMessage(true);
        }
      }
    }

    prevMessagesLengthRef.current = currentLen;
  }, [currentConv?.messages]);

  // Track manual scrolling: save position per conversation and dismiss new message indicator if near bottom
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || !currentConv) return;

    scrollPositionsRef.current[currentConv.id] = container.scrollTop;

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

  // Close message action menu on outside click
  useEffect(() => {
    function handleDocClick() {
      setActiveMenuMsgId(null);
    }
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  const handleSelectConv = (convId) => {
    if (messagesContainerRef.current && currentConv) {
      scrollPositionsRef.current[currentConv.id] = messagesContainerRef.current.scrollTop;
    }
    setActiveConversationId(convId);
    setSearchParams({ conv: convId });
    setMobileChatOpen(true);
    setShowPinnedDrawer(false);
    setHasUnseenNewMessage(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !currentConv) return;
    sendMessage(currentConv.id, inputText.trim());
    setInputText('');

    // Smooth scroll down to show the newly sent message inside container only
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
  };

  const handleTogglePin = (msgId, e) => {
    e.stopPropagation();
    pinMessage(currentConv.id, msgId);
    setActiveMenuMsgId(null);
  };

  const handlePromptDelete = (msgId, e) => {
    e.stopPropagation();
    setConfirmDeleteMsgId(msgId);
    setActiveMenuMsgId(null);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteMsgId) {
      deleteMessage(currentConv.id, confirmDeleteMsgId);
      setConfirmDeleteMsgId(null);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.participant.name.toLowerCase().includes(q) ||
      c.roomTitle.toLowerCase().includes(q) ||
      c.roomArea.toLowerCase().includes(q)
    );
  });

  const pinnedMessages = currentConv?.messages.filter((m) => m.isPinned) || [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Chat Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[780px] max-h-[85vh]">
          
          {/* ----------------- LEFT SIDE: CONVERSATION LIST ----------------- */}
          <div
            className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50 ${
              mobileChatOpen ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Header & Search */}
            <div className="p-4 border-b border-slate-200 bg-white">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-3">
                Messages
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats or rooms..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No conversations found
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = currentConv?.id === conv.id;
                  const lastMsg = conv.messages[conv.messages.length - 1];

                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConv(conv.id)}
                      className={`p-3.5 sm:p-4 hover:bg-white transition cursor-pointer flex items-start gap-3 relative ${
                        isSelected ? 'bg-white border-l-4 border-teal-600 shadow-2xs' : ''
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-2xs ${
                          conv.participant.isRoomPartner ? 'bg-indigo-600' : 'bg-teal-700'
                        }`}>
                          {conv.participant.avatar || conv.participant.name[0]}
                        </div>
                        {conv.participant.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" title="Online" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="font-bold text-sm text-slate-900 truncate">
                            {conv.participant.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {lastMsg?.time || ''}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            conv.participant.isRoomPartner 
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {conv.participant.role}
                          </span>
                          <span className="truncate text-slate-400 text-[11px]">• {conv.roomArea}</span>
                        </div>

                        <p className="text-xs text-slate-600 truncate">
                          {lastMsg?.sender === 'user' ? 'You: ' : ''}
                          {lastMsg?.text || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ----------------- RIGHT SIDE: SELECTED CHAT ----------------- */}
          {currentConv ? (
            <div
              className={`flex-1 flex flex-col bg-white overflow-hidden relative ${
                !mobileChatOpen ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Chat Header */}
              <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setMobileChatOpen(false)}
                    className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg"
                    aria-label="Back to conversations list"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-2xs ${
                    currentConv.participant.isRoomPartner ? 'bg-indigo-600' : 'bg-teal-700'
                  }`}>
                    {currentConv.participant.avatar || currentConv.participant.name[0]}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                        {currentConv.participant.name}
                      </h3>
                      {currentConv.participant.isVerified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.2 rounded-full border border-teal-200">
                          <ShieldCheck className="w-3 h-3 text-teal-600" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {currentConv.participant.role}
                      {currentConv.participant.stayingSince && (
                        <span> • Staying since {currentConv.participant.stayingSince}</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right Action: Call Owner (if Owner) OR Pinned Messages Button */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Owner Contact Number Available (Requirement 1 & 14) */}
                  {!currentConv.participant.isRoomPartner && currentConv.participant.phone && (
                    <a
                      href={`tel:${currentConv.participant.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200 transition"
                      title={`Call ${currentConv.participant.name}`}
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span className="hidden sm:inline">Call Owner:</span>
                      <span>{currentConv.participant.phone}</span>
                    </a>
                  )}

                  {/* Room Partner Privacy indicator */}
                  {currentConv.participant.isRoomPartner && (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-medium border border-indigo-200/60">
                      <Lock className="w-3 h-3 text-indigo-600" />
                      <span>In-App Chat Only</span>
                    </span>
                  )}

                  {/* Pinned Messages Toggle Button (Requirement 11) */}
                  <button
                    onClick={() => setShowPinnedDrawer(!showPinnedDrawer)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      showPinnedDrawer || pinnedMessages.length > 0
                        ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5 text-amber-600" />
                    <span className="hidden sm:inline">Pinned</span>
                    <span>({pinnedMessages.length})</span>
                    {showPinnedDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Property Context Strip */}
              <div className="bg-slate-50/90 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-700 shrink-0">
                <Link
                  to={`/rooms/${currentConv.roomId}`}
                  className="flex items-center gap-1.5 truncate hover:text-teal-700 font-semibold"
                >
                  <Building className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{currentConv.roomTitle}</span>
                  <span className="text-slate-400 font-normal">({currentConv.roomArea})</span>
                </Link>
                <span className="shrink-0 font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  ₹{currentConv.roomRent.toLocaleString('en-IN')}/mo
                </span>
              </div>

              {/* ----------------- PINNED MESSAGES DRAWER (Requirement 11 & 12) ----------------- */}
              {showPinnedDrawer && (
                <div className="bg-amber-50/70 border-b border-amber-200/80 p-3 sm:px-4 space-y-2 animate-in slide-in-from-top-2 duration-150 shrink-0">
                  <div className="flex items-center justify-between text-xs text-amber-900 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Pin className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pinned Messages ({pinnedMessages.length})</span>
                    </span>
                    <button
                      onClick={() => setShowPinnedDrawer(false)}
                      className="text-amber-800 hover:text-amber-950 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {pinnedMessages.length === 0 ? (
                    <p className="text-xs text-amber-800/80 italic">
                      No pinned messages yet. Use the ⋮ menu on any message to pin important dates or terms.
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {pinnedMessages.map((pMsg) => (
                        <div
                          key={pMsg.id}
                          className="bg-white/90 p-2 rounded-xl border border-amber-200/60 text-xs text-slate-800 flex items-start justify-between gap-2 shadow-2xs"
                        >
                          <div className="flex-1">
                            <span className="font-semibold text-amber-900 mr-1.5">
                              {pMsg.sender === 'user' ? 'You:' : `${currentConv.participant.name}:`}
                            </span>
                            <span>{pMsg.text}</span>
                          </div>
                          <button
                            onClick={(e) => handleTogglePin(pMsg.id, e)}
                            className="text-[11px] font-semibold text-amber-800 hover:text-rose-600 shrink-0 hover:underline"
                            title="Unpin message"
                          >
                            Unpin
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Chat Messages Body */}
              <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8fafc]"
              >
                {currentConv.messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Start a conversation with {currentConv.participant.name}
                  </div>
                ) : (
                  currentConv.messages.map((msg) => {
                    const isMe = msg.sender === 'user';
                    const isMenuOpen = activeMenuMsgId === msg.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col group relative ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        {/* Pinned pill if pinned */}
                        {msg.isPinned && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 mb-1 px-1.5">
                            <Pin className="w-3 h-3 text-amber-600" />
                            <span>Pinned</span>
                          </div>
                        )}

                        <div className="relative max-w-[85%] sm:max-w-[75%] flex items-start gap-1">
                          {/* Message Bubble */}
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                              isMe
                                ? 'bg-teal-600 text-white rounded-br-xs'
                                : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                            } ${msg.isPinned ? 'ring-2 ring-amber-300' : ''}`}
                          >
                            <p>{msg.text}</p>
                          </div>

                          {/* Message Action Menu Trigger ⋮ */}
                          <div className="relative self-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuMsgId(isMenuOpen ? null : msg.id);
                              }}
                              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Message actions"
                              aria-label="Message actions"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {/* Dropdown Menu (Requirement 11, 12, 13) */}
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
                                  onClick={(e) => handlePromptDelete(msg.id, e)}
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
                  })
                )}
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
                onSubmit={handleSend}
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
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
              Select a conversation to start messaging
            </div>
          )}

        </div>

      </div>

      {/* ----------------- DELETE CONFIRMATION MODAL (Requirement 13) ----------------- */}
      {confirmDeleteMsgId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete this message?</h3>
                <p className="text-xs text-slate-500">
                  This will remove the message from your conversation view.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteMsgId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition shadow-2xs"
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
