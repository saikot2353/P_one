import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Send, 
  Image as ImageIcon,
  PlayCircle,
  FileText,
  Users,
  Check,
  CheckCheck,
  X,
  UserPlus,
  Trash2,
  Plus,
  Pin,
  Reply,
  Pencil,
  MoreHorizontal
} from "lucide-react";

export const Route = createFileRoute("/messenger")({
  head: () => ({
    meta: [{ title: "Messenger — CRIPTON" }],
  }),
  component: MessengerPage,
});

// -- Mock Data Base --
interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  members: number;
  isOnline?: boolean;
  isDirect?: boolean;
}

const INITIAL_GROUPS: ChatItem[] = [
  { id: "g1", name: "Business Innovation", avatar: "https://i.pravatar.cc/150?u=g1", lastMessage: "Great. Please review this video walkthrough.", time: "10:42 AM", unread: 2, members: 6, isDirect: false, isOnline: true },
  { id: "g2", name: "HR Team", avatar: "https://i.pravatar.cc/150?u=g2", lastMessage: "Don't forget the all-hands meeting at 3 PM.", time: "09:15 AM", unread: 0, members: 3, isDirect: false, isOnline: true },
  { id: "g3", name: "Finance & Accounts", avatar: "https://i.pravatar.cc/150?u=g3", lastMessage: "The Q3 reports are finalized.", time: "Yesterday", unread: 0, members: 4, isDirect: false, isOnline: false },
  { id: "g4", name: "IT & Infrastructure", avatar: "https://i.pravatar.cc/150?u=g4", lastMessage: "Server maintenance scheduled for tonight.", time: "Yesterday", unread: 5, members: 5, isDirect: false, isOnline: true },
  { id: "g5", name: "Marketing", avatar: "https://i.pravatar.cc/150?u=g5", lastMessage: "New ad creatives are ready for review.", time: "Tuesday", unread: 0, members: 2, isDirect: false, isOnline: false },
  { id: "g6", name: "Security Operations", avatar: "https://i.pravatar.cc/150?u=g6", lastMessage: "Gate 2 access logs verified.", time: "Monday", unread: 0, members: 3, isDirect: false, isOnline: true },
];

const BASE_MESSAGES = [
  { id: 1, senderId: "u1", senderName: "Anika Mehta", avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d", text: "Hey team! Is the new payroll module design ready?", time: "10:30 AM", isMe: false },
  { id: 2, senderId: "me", senderName: "You", avatar: "https://i.pravatar.cc/150?u=me", text: "Yes! I just uploaded the final UI mockups to the shared drive.", time: "10:35 AM", isMe: true },
  { id: 3, senderId: "u2", senderName: "Md. Anik Islam", avatar: "https://i.pravatar.cc/150?u=2023044078", text: "Looks amazing! I'll start implementing the frontend components today.", time: "10:38 AM", isMe: false },
  { id: 4, senderId: "me", senderName: "You", avatar: "https://i.pravatar.cc/150?u=me", text: "Here is a quick preview of the dashboard layout.", time: "10:40 AM", isMe: true, attachment: { type: "image", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" } },
  { id: 5, senderId: "u3", senderName: "Tahmid Afsar", avatar: "https://i.pravatar.cc/150?u=2023043910", text: "Great. Please review this video walkthrough of the new animations.", time: "10:42 AM", isMe: false, attachment: { type: "video", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", duration: "1:24" } },
];

const BASE_MEMBERS = [
  { id: 101, name: "Anika Mehta", role: "HR Manager", img: "https://i.pravatar.cc/150?u=a048581f4e29026701d" },
  { id: 102, name: "You", role: "HR Executive", img: "https://i.pravatar.cc/150?u=me" },
  { id: 103, name: "Md. Anik Islam", role: "Software Engineer", img: "https://i.pravatar.cc/150?u=2023044078" },
  { id: 104, name: "Tahmid Afsar", role: "UI/UX Designer", img: "https://i.pravatar.cc/150?u=2023043910" },
  { id: 105, name: "Hanif Uddin", role: "Sr. Executive", img: "https://i.pravatar.cc/150?u=2024049326" },
  { id: 106, name: "Parvej Mahmud", role: "Executive", img: "https://i.pravatar.cc/150?u=2026058726" },
];

const COMPANY_EMPLOYEES = [
  { id: 201, name: "Md Mahir Shahriyar", role: "Jr. Executive", img: "https://bpm.pakizaknit.com/Photo/EmpPicture/b314987a-a621-4906-9a64-2a18104da3e6.jpg" },
  { id: 202, name: "MD Maimoon Hossain Shomoy", role: "Sr. Executive", img: "https://bpm.pakizaknit.com/Photo/EmpPicture/988bc5ac-552c-48bd-9d6f-cc2329c56d08.jpg" },
  { id: 203, name: "Md. Sadmanur Islam Shishir", role: "Jr. Executive", img: "https://bpm.pakizaknit.com/Photo/EmpPicture/e4668770-dddd-4026-b3e6-963fbeedb13a.jpg" },
  { id: 204, name: "Al Riyad Karim", role: "Sr. Executive", img: "https://bpm.pakizaknit.com/Photo/EmpPicture/7668c174-80e8-49bf-808f-5b6624c853a0.jpg" },
  { id: 205, name: "Allama Bakhtiyar Nafis", role: "Jr. Executive", img: "https://bpm.pakizaknit.com/Photo/EmpPicture/abd4f21d-eb54-4cc6-a197-ca373e4693be.jpg" },
  { id: 206, name: "Raihan Jami Khan", role: "Jr. Executive", img: "https://bpm.pakizaknit.com/Photo/EmpPicture/93e35c4c-f827-4152-8faa-34ed422a1629.jpg" },
  { id: 207, name: "Md Robayet Hasan Yeasin", role: "Jr. Executive", img: "https://bpm.pakizaknit.com/Photo/EmpPicture/4e73fa2f-e1d4-4b6a-90f8-153d977f9e63.jpg" },
  { id: 208, name: "Mir Md Moshiu Islam", role: "Jr. Executive", img: "https://bpm.pakizaknit.com/Photo/EmpPicture/108e0e41-f8c9-439c-aa94-46a83b263b3a.jpg" },
  { id: 209, name: "Md. Piyash Hasan", role: "Executive", img: "https://bpm.pakizaknit.com/Photo/EmpPicture/0fa2e575-f1e5-4490-9e5b-6b89d039ce10.jpg" },
];

const INITIAL_DIRECT_CHATS: ChatItem[] = COMPANY_EMPLOYEES.slice(0, 5).map((emp, i) => ({
  id: `dm_${emp.id}`,
  name: emp.name,
  avatar: emp.img,
  lastMessage: i % 2 === 0 ? "Sounds good, thanks!" : "Can you send me the report?",
  time: i === 0 ? "10:30 AM" : "Yesterday",
  unread: i === 1 ? 2 : 0,
  members: 2,
  isOnline: i % 2 === 0,
  isDirect: true
}));

function MessengerPage() {
  const [chatTab, setChatTab] = useState<"departments" | "direct">("departments");
  const [groups, setGroups] = useState<ChatItem[]>(INITIAL_GROUPS);
  const [directChats, setDirectChats] = useState<ChatItem[]>(INITIAL_DIRECT_CHATS);
  
  const [activeChatId, setActiveChatId] = useState(INITIAL_GROUPS[0].id);
  
  // Dynamic State
  const [messagesByGroup, setMessagesByGroup] = useState<Record<string, any[]>>({
    g1: [...BASE_MESSAGES],
    g2: [{ id: 1, senderId: "u1", senderName: "Anika", avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d", text: "Don't forget the all-hands meeting at 3 PM.", time: "09:15 AM", isMe: false }],
    g3: [{ id: 1, senderId: "u4", senderName: "John", avatar: "https://i.pravatar.cc/150?u=j", text: "The Q3 reports are finalized.", time: "Yesterday", isMe: false }],
    dm_201: [{ id: 1, senderId: "201", senderName: "Md Mahir Shahriyar", avatar: "https://bpm.pakizaknit.com/Photo/EmpPicture/b314987a-a621-4906-9a64-2a18104da3e6.jpg", text: "Hey! When you have a moment, could you check the latest PR?", time: "10:30 AM", isMe: false }]
  });

  const [membersByGroup, setMembersByGroup] = useState<Record<string, any[]>>({
    g1: [...BASE_MEMBERS],
    g2: [BASE_MEMBERS[0], BASE_MEMBERS[1], BASE_MEMBERS[2]],
    g3: [BASE_MEMBERS[1], BASE_MEMBERS[4], BASE_MEMBERS[5], BASE_MEMBERS[3]],
    ...Object.fromEntries(
      INITIAL_DIRECT_CHATS.map(chat => [
        chat.id,
        [
          BASE_MEMBERS[1], // You
          COMPANY_EMPLOYEES.find(e => `dm_${e.id}` === chat.id)
        ]
      ])
    )
  });

  const activeChat = (chatTab === 'departments' ? groups : directChats).find(g => g.id === activeChatId) || (chatTab === 'departments' ? groups[0] : directChats[0]);
  const activeMessages = messagesByGroup[activeChatId] || [];
  const activeMembers = membersByGroup[activeChatId] || [BASE_MEMBERS[1]]; // Defaults to just 'You' if empty

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
  const [infoTab, setInfoTab] = useState<"members" | "media">("members");
  
  // Modals for Remove/Add Member
  const [memberToRemove, setMemberToRemove] = useState<number | null>(null);
  const [removePassword, setRemovePassword] = useState("");
  const [removeError, setRemoveError] = useState("");

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  
  // Mock Call States
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [activeMessageOptions, setActiveMessageOptions] = useState<number | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);
  const [pinnedMessageByGroup, setPinnedMessageByGroup] = useState<Record<string, number | null>>({
    g1: 1 // Default pinned message for HR Team
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, activeChatId, isTyping]);

  useEffect(() => {
    // Random typing simulator when switching chats
    setIsTyping(false);
    if (!activeChat.isDirect) {
      const timer = setTimeout(() => setIsTyping(true), 2000);
      const timer2 = setTimeout(() => setIsTyping(false), 6000);
      return () => { clearTimeout(timer); clearTimeout(timer2); };
    }
  }, [activeChatId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (editingMessageId) {
      setMessagesByGroup(prev => ({
        ...prev,
        [activeChatId]: (prev[activeChatId] || []).map(m => m.id === editingMessageId ? { ...m, text: newMessage } : m)
      }));
      setEditingMessageId(null);
      setNewMessage("");
      return;
    }

    const newMsg = {
      id: Date.now(),
      senderId: "me",
      senderName: "You",
      avatar: "https://i.pravatar.cc/150?u=me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      replyToId: replyingTo?.id
    };

    setMessagesByGroup(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg]
    }));
    
    // Update last message preview in group list
    if (chatTab === 'departments') {
      setGroups(prev => prev.map(g => g.id === activeChatId ? { ...g, lastMessage: newMessage, time: newMsg.time } : g));
    } else {
      setDirectChats(prev => prev.map(g => g.id === activeChatId ? { ...g, lastMessage: newMessage, time: newMsg.time } : g));
    }
    setNewMessage("");
    setReplyingTo(null);
  };

  const togglePinMessage = (msgId: number) => {
    setPinnedMessageByGroup(prev => ({
      ...prev,
      [activeChatId]: prev[activeChatId] === msgId ? null : msgId
    }));
  };

  const toggleReaction = (msgId: number, emoji: string) => {
    setMessagesByGroup(prev => {
      const msgs = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: msgs.map(m => {
          if (m.id === msgId) {
            const currentReactions = m.reactions || {};
            const count = currentReactions[emoji] || 0;
            return {
              ...m,
              reactions: { ...currentReactions, [emoji]: count === 0 ? 1 : 0 }
            };
          }
          return m;
        })
      };
    });
  };

  const startEditing = (msg: any) => {
    setEditingMessageId(msg.id);
    setNewMessage(msg.text);
    setReplyingTo(null);
  };

  const handleDeleteMessage = (msgId: number) => {
    setMessagesByGroup(prev => ({
      ...prev,
      [activeChatId]: (prev[activeChatId] || []).filter(m => m.id !== msgId)
    }));
  };

  const handleRemoveMember = (memberId: number) => {
    setMemberToRemove(memberId);
  };

  const confirmRemoveMember = () => {
    if (removePassword !== "87654321!") {
      setRemoveError("Incorrect password");
      return;
    }
    setMembersByGroup(prev => {
      const updatedMembers = (prev[activeChatId] || []).filter(m => m.id !== memberToRemove);
      if (chatTab === 'departments') {
        setGroups(gPrev => gPrev.map(g => g.id === activeChatId ? { ...g, members: updatedMembers.length } : g));
      }
      return { ...prev, [activeChatId]: updatedMembers };
    });
    setMemberToRemove(null);
    setRemovePassword("");
    setRemoveError("");
  };

  const handleAddMember = () => {
    setIsAddMemberModalOpen(true);
    setMemberSearchQuery("");
  };

  const handleAddSpecificMember = (emp: any) => {
    setMembersByGroup(prev => {
      const updatedMembers = [...(prev[activeChatId] || []), emp];
      if (chatTab === 'departments') {
        setGroups(gPrev => gPrev.map(g => g.id === activeChatId ? { ...g, members: updatedMembers.length } : g));
      }
      return { ...prev, [activeChatId]: updatedMembers };
    });
    
    setIsAddMemberModalOpen(false);
    setMemberSearchQuery("");
  };

  const handleCall = (type: "audio" | "video") => {
    setCallType(type);
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
      setCallType(null);
    }, 5000);
  };

  const currentList = chatTab === 'departments' ? groups : directChats;
  const filteredList = currentList.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const availableEmployees = COMPANY_EMPLOYEES.filter(emp => !activeMembers.some(m => m.id === emp.id));
  const filteredEmployees = availableEmployees.filter(emp => emp.name.toLowerCase().includes(memberSearchQuery.toLowerCase()));

  return (
    <div className="h-screen flex bg-background text-foreground transition-colors duration-300 overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative h-full">
        <Topbar />

        {/* Messenger Container */}
        <div className="flex-1 flex overflow-hidden p-4 md:p-6 gap-6">
          
          {/* Left Panel: Groups List */}
          <div className="w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col bg-card rounded-2xl border border-border/80 shadow-sm overflow-hidden h-full">
            {/* Header with Tabs */}
            <div className="p-5 border-b border-border/60">
              <div className="flex bg-muted/50 p-1 rounded-xl mb-4">
                <button 
                  onClick={() => { setChatTab('departments'); setActiveChatId(groups[0].id); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${chatTab === 'departments' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Departments
                </button>
                <button 
                  onClick={() => { setChatTab('direct'); setActiveChatId(directChats[0].id); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${chatTab === 'direct' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Direct Messages
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                <input 
                  type="text" 
                  placeholder={chatTab === 'departments' ? "Search departments..." : "Search people..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted/50 border border-border/60 text-sm outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
              {filteredList.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                    activeChatId === chat.id 
                      ? "bg-primary text-primary-foreground shadow-md transform scale-[1.02]" 
                      : "hover:bg-muted/60"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover border-2 border-background shadow-xs" />
                    {chat.unread > 0 && activeChatId !== chat.id && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                        {chat.unread}
                      </span>
                    )}
                    {chat.isDirect && chat.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className={`font-bold text-sm truncate ${activeChatId === chat.id ? "text-primary-foreground" : "text-foreground"}`}>
                        {chat.name}
                      </h4>
                      <span className={`text-[10px] shrink-0 ${activeChatId === chat.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {chat.time}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${activeChatId === chat.id ? "text-primary-foreground/90 font-medium" : "text-muted-foreground"}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: Active Chat */}
          <div className="flex-1 flex flex-col bg-card rounded-2xl border border-border/80 shadow-sm overflow-hidden h-full relative">
            
            {/* Calling Overlay Mock */}
            {isCalling && (
              <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-6 animate-pulse">
                  <div className="w-24 h-24 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center">
                    {callType === 'video' ? <Video size={40} className="text-primary-foreground" /> : <Phone size={40} className="text-primary-foreground" />}
                  </div>
                </div>
                <h2 className="text-2xl font-black mb-2 text-foreground">Calling {activeChat.name}...</h2>
                <p className="text-muted-foreground font-medium animate-pulse">Connecting securely</p>
                
                <button onClick={() => setIsCalling(false)} className="mt-12 px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-full shadow-lg hover:shadow-rose-500/25 transition-all active:scale-95">
                  End Call
                </button>
              </div>
            )}

            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-border/60 flex items-center justify-between bg-muted/10 shrink-0">
              <button 
                onClick={() => setIsGroupInfoOpen(true)}
                className="flex items-center gap-4 text-left hover:bg-muted/50 p-1.5 rounded-xl transition-colors -ml-1.5 group"
              >
                <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:shadow-md transition-all" />
                <div>
                  <h3 className="font-extrabold text-foreground group-hover:text-primary transition-colors">{activeChat.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    {activeChat.isDirect ? (
                      <>
                        <span className={`w-1.5 h-1.5 rounded-full ${activeChat.isOnline ? 'bg-emerald-500' : 'bg-muted-foreground'}`}></span>
                        {activeChat.isOnline ? 'Online' : 'Offline'}
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {activeChat.members} members online
                      </>
                    )}
                  </p>
                </div>
              </button>
              
              <div className="flex items-center gap-2">
                <button onClick={() => handleCall('audio')} className="p-2.5 rounded-xl text-primary hover:bg-primary/10 transition-colors tooltip-trigger" title="Voice Call">
                  <Phone size={18} />
                </button>
                <button onClick={() => handleCall('video')} className="p-2.5 rounded-xl text-primary hover:bg-primary/10 transition-colors tooltip-trigger" title="Video Call">
                  <Video size={18} />
                </button>
                <div className="w-px h-6 bg-border mx-1"></div>
                <button className="p-2.5 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed bg-opacity-5">
              <div className="flex justify-center my-4">
                <span className="px-3 py-1 bg-muted/60 backdrop-blur-sm rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Today
                </span>
              </div>
              
              {/* Pinned Message Banner */}
              {pinnedMessageByGroup[activeChatId] && (
                <div className="bg-muted/40 border-b border-border/60 px-4 py-2 flex items-center justify-between shadow-sm z-10 shrink-0">
                  <div className="flex items-center gap-3 text-sm min-w-0">
                    <Pin size={14} className="text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-primary mb-0.5">Pinned Message</p>
                      <p className="text-muted-foreground truncate max-w-xl">
                        {activeMessages.find(m => m.id === pinnedMessageByGroup[activeChatId])?.text || "Attachment"}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => togglePinMessage(pinnedMessageByGroup[activeChatId] as number)}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {activeMessages.map((msg, index) => {
                const showAvatar = !msg.isMe && (index === 0 || activeMessages[index - 1].senderId !== msg.senderId);
                const replyToMsg = msg.replyToId ? activeMessages.find(m => m.id === msg.replyToId) : null;
                
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"} w-full mb-1`}
                    onMouseEnter={() => setHoveredMessageId(msg.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                  >
                    {/* Name & Time */}
                    {showAvatar && (
                      <span className={`block text-xs font-bold mb-1 text-foreground ${msg.isMe ? "pr-10 text-right" : "pl-10 text-left"}`}>
                        {msg.isMe ? "You" : msg.senderName} <span className="font-normal text-[10px] ml-1 opacity-70">{msg.time}</span>
                      </span>
                    )}

                    <div className={`flex items-start max-w-[85%] ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}>
                      {/* Avatar */}
                      {showAvatar ? (
                        <img src={msg.avatar} alt={msg.senderName} className={`w-8 h-8 rounded-full shrink-0 shadow-sm ${msg.isMe ? "ml-2" : "mr-2"}`} />
                      ) : (
                        <div className={`w-8 shrink-0 ${msg.isMe ? "ml-2" : "mr-2"}`}></div>
                      )}
                      
                      <div className={`
                        relative flex flex-col gap-2 p-3.5 rounded-2xl shadow-sm text-sm
                        ${msg.isMe 
                          ? "bg-primary text-primary-foreground rounded-tr-sm" 
                          : "bg-background border border-border/60 text-foreground rounded-tl-sm"
                        }
                      `}>
                        
                        {/* Quoted Reply Block */}
                        {replyToMsg && (
                          <div className={`pl-2.5 py-1.5 pr-2 mb-1 border-l-2 rounded-r-lg text-xs flex flex-col gap-0.5 ${msg.isMe ? 'border-primary-foreground/40 bg-primary-foreground/10' : 'border-primary/40 bg-primary/5'}`}>
                            <span className={`font-bold ${msg.isMe ? 'text-primary-foreground/90' : 'text-primary/90'}`}>{replyToMsg.senderName}</span>
                            <span className={`truncate max-w-[200px] ${msg.isMe ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{replyToMsg.text || 'Attachment'}</span>
                          </div>
                        )}

                        {msg.text && <p className="leading-relaxed relative z-10">{msg.text}</p>}
                        
                        {/* Attachments */}
                        {msg.attachment && (
                          <div className="mt-2 rounded-xl overflow-hidden shadow-sm border border-black/10 max-w-sm relative group cursor-pointer">
                            {msg.attachment.type === 'image' && (
                              <img src={msg.attachment.url} alt="Attachment" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300" />
                            )}
                            {msg.attachment.type === 'video' && (
                              <>
                                <img src={msg.attachment.thumbnail} alt="Video" className="w-full h-auto object-cover opacity-80" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                    <PlayCircle size={24} className="text-primary" />
                                  </div>
                                </div>
                                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  {msg.attachment.duration}
                                </span>
                              </>
                            )}
                          </div>
                        )}
                        
                        {/* Read Receipts */}
                        {msg.isMe && (
                          <span className="absolute -bottom-4 right-1 text-primary">
                            <CheckCheck size={14} />
                          </span>
                        )}
                      </div>

                      {/* Reactions Display */}
                      {msg.reactions && Object.keys(msg.reactions).some(k => msg.reactions[k] > 0) && (
                        <div className={`flex gap-1 absolute -bottom-3 ${msg.isMe ? 'right-4' : 'left-4'} z-10`}>
                          {Object.entries(msg.reactions).filter(([_, count]) => (count as number) > 0).map(([emoji, count]) => (
                            <button 
                              key={emoji}
                              onClick={() => toggleReaction(msg.id, emoji)}
                              className="bg-background border border-border/60 shadow-sm rounded-full px-1.5 py-0.5 text-[10px] flex items-center gap-1 hover:scale-110 transition-transform"
                            >
                              <span>{emoji}</span>
                              <span className="font-bold text-muted-foreground">{count as number}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Hover Action Toolbar Container */}
                      <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 z-20 ${msg.isMe ? '-left-10' : '-right-10'}`}>
                        {/* Three dots button */}
                        <button 
                          onClick={() => setActiveMessageOptions(activeMessageOptions === msg.id ? null : msg.id)}
                          className={`p-1.5 bg-background border border-border/80 shadow-sm rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all 
                            ${(activeMessageOptions === msg.id || hoveredMessageId === msg.id) ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                          `}
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        
                        {/* Popover Menu */}
                        {activeMessageOptions === msg.id && (
                          <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 bg-background border border-border/80 shadow-xl rounded-xl p-1 animate-in zoom-in-95 duration-100 ${msg.isMe ? 'right-full mr-2' : 'left-full ml-2'}`}>
                            {['👍', '❤️', '😂'].map(emoji => (
                              <button key={emoji} onClick={() => { toggleReaction(msg.id, emoji); setActiveMessageOptions(null); }} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-base leading-none">
                                {emoji}
                              </button>
                            ))}
                            <div className="w-px h-4 bg-border mx-0.5"></div>
                            <button onClick={() => { setReplyingTo(msg); setActiveMessageOptions(null); }} className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors tooltip-trigger" title="Reply">
                              <Reply size={14} />
                            </button>
                            <button onClick={() => { togglePinMessage(msg.id); setActiveMessageOptions(null); }} className="p-1.5 hover:bg-muted text-muted-foreground hover:text-primary rounded-lg transition-colors tooltip-trigger" title={pinnedMessageByGroup[activeChatId] === msg.id ? "Unpin" : "Pin"}>
                              <Pin size={14} className={pinnedMessageByGroup[activeChatId] === msg.id ? 'fill-primary' : ''} />
                            </button>
                            {msg.isMe && (
                              <>
                                <button onClick={() => { startEditing(msg); setActiveMessageOptions(null); }} className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors tooltip-trigger" title="Edit">
                                  <Pencil size={14} />
                                </button>
                                <button onClick={() => { handleDeleteMessage(msg.id); setActiveMessageOptions(null); }} className="p-1.5 hover:bg-muted text-muted-foreground hover:text-rose-500 rounded-lg transition-colors tooltip-trigger" title="Delete">
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )
              })}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex gap-3 max-w-[75%] items-end">
                    {!activeChat.isDirect && (
                      <div className="w-8 h-8 rounded-full bg-muted border border-border/60 flex items-center justify-center shrink-0">
                        <MoreVertical size={14} className="text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="bg-background border border-border/60 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 pr-24 bg-background border-t border-border/60 shrink-0 flex flex-col gap-2">
              
              {/* Replying To Preview */}
              {replyingTo && !editingMessageId && (
                <div className="bg-muted/40 border border-border/60 rounded-xl p-2.5 flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-primary mb-0.5">Replying to {replyingTo.senderName}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-2xl">{replyingTo.text || 'Attachment'}</p>
                  </div>
                  <button type="button" onClick={() => setReplyingTo(null)} className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors">
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Editing Preview */}
              {editingMessageId && (
                <div className="bg-muted/40 border border-border/60 rounded-xl p-2.5 flex items-start justify-between">
                  <div className="min-w-0 flex items-center gap-2">
                    <Pencil size={14} className="text-primary" />
                    <div>
                      <p className="text-xs font-bold text-primary mb-0.5">Editing Message</p>
                      <p className="text-xs text-muted-foreground">Press Escape to cancel</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => { setEditingMessageId(null); setNewMessage(""); }} className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors">
                    <X size={14} />
                  </button>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-card shadow-sm p-2 rounded-3xl border border-border/80 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 focus-within:shadow-md transition-all">
                
                {/* Attach Buttons */}
                <div className="flex items-center gap-1 mb-1 px-1">
                  <button type="button" className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                    <Paperclip size={18} />
                  </button>
                  <button type="button" className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                    <ImageIcon size={18} />
                  </button>
                </div>
                
                {/* Text Input */}
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape' && editingMessageId) {
                      setEditingMessageId(null);
                      setNewMessage("");
                    }
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 max-h-32 min-h-[40px] bg-transparent resize-none outline-none text-sm py-2.5 px-2 scrollbar-thin"
                  rows={1}
                />
                
                {/* Send/Emoji Buttons */}
                <div className="flex items-center gap-2 mb-1 px-1">
                  <button type="button" className="p-2 text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10 rounded-full transition-colors">
                    <Smile size={18} />
                  </button>
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="p-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:hover:shadow-none transition-all active:scale-95"
                  >
                    <Send size={16} className="ml-0.5" />
                  </button>
                </div>
              </form>
            </div>
            
          </div>
        </div>
        
        {/* Department Info Modal */}
        {isGroupInfoOpen && (
          <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-6 text-center relative border-b border-border/60 bg-muted/20">
                <button 
                  onClick={() => setIsGroupInfoOpen(false)}
                  className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <img src={activeChat.avatar} alt={activeChat.name} className="w-20 h-20 rounded-full mx-auto mb-3 shadow-md border-4 border-background" />
                <h2 className="text-xl font-extrabold text-foreground">{activeChat.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeChat.isDirect ? 'Direct Message' : `Department Group • ${activeChat.members} Members`}
                </p>
                
                <div className="flex bg-background/50 p-1 rounded-xl mt-4 max-w-[200px] mx-auto border border-border/40">
                  <button 
                    onClick={() => setInfoTab('members')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${infoTab === 'members' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Members
                  </button>
                  <button 
                    onClick={() => setInfoTab('media')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${infoTab === 'media' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Media
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              {infoTab === 'members' ? (
                <>
                  <div className="p-4 border-b border-border/60 flex items-center justify-between">
                    <h3 className="font-bold text-sm">Members</h3>
                    {!activeChat.isDirect && (
                      <button 
                        onClick={handleAddMember}
                        className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <UserPlus size={14} /> Add Member
                      </button>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                    {activeMembers.map((emp) => (
                      <div key={emp.id} className="flex items-center justify-between p-2.5 hover:bg-muted/50 rounded-xl transition-colors group">
                        <div className="flex items-center gap-3">
                          <img src={emp.img} alt={emp.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                          <div>
                            <p className="font-bold text-sm text-foreground">{emp.name}</p>
                            <p className="text-[10px] text-muted-foreground">{emp.role}</p>
                          </div>
                        </div>
                        {emp.name !== "You" && !activeChat.isDirect && (
                          <button 
                            onClick={() => handleRemoveMember(emp.id)}
                            className="p-2 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all" 
                            title="Remove Member"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                  <div className="grid grid-cols-3 gap-2">
                    {activeMessages.filter(m => m.attachment).map(m => (
                      <div key={m.id} className="aspect-square rounded-xl overflow-hidden border border-border/60 relative group cursor-pointer">
                        {m.attachment?.type === 'image' && (
                          <img src={m.attachment.url} alt="Shared Image" className="w-full h-full object-cover hover:scale-110 transition-transform" />
                        )}
                        {m.attachment?.type === 'video' && (
                          <>
                            <img src={m.attachment.thumbnail} alt="Shared Video" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                              <PlayCircle size={20} className="text-white" />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    {activeMessages.filter(m => m.attachment).length === 0 && (
                      <div className="col-span-3 text-center text-muted-foreground text-sm py-10 font-medium">
                        No media shared yet
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Remove Member Password Modal */}
        {memberToRemove !== null && (
          <div className="absolute inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-sm rounded-2xl border border-border shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-200">
              <h3 className="text-xl font-bold text-foreground mb-2">Authentication Required</h3>
              <p className="text-sm text-muted-foreground mb-4">Please enter your password to remove this member from the group.</p>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    value={removePassword}
                    onChange={(e) => setRemovePassword(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all outline-none"
                    autoFocus
                  />
                  {removeError && <p className="text-xs text-rose-500 mt-1.5 font-medium">{removeError}</p>}
                </div>
                
                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => {
                      setMemberToRemove(null);
                      setRemovePassword("");
                      setRemoveError("");
                    }}
                    className="px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmRemoveMember}
                    className="px-4 py-2 text-sm font-bold bg-rose-500 text-white hover:bg-rose-600 rounded-lg shadow-sm transition-colors"
                  >
                    Remove Member
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Member Modal */}
        {isAddMemberModalOpen && (
          <div className="absolute inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[70vh] animate-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-border/60 flex items-center justify-between bg-muted/20">
                <h3 className="text-xl font-bold text-foreground">Add New Member</h3>
                <button 
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4 border-b border-border/60">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                  <input
                    type="text"
                    placeholder="Search employees by name..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-xl border border-border/80 bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-sm"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => handleAddSpecificMember(emp)}
                      className="w-full flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <img src={emp.img} alt={emp.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                        <div>
                          <p className="font-bold text-sm text-foreground">{emp.name}</p>
                          <p className="text-xs text-muted-foreground">{emp.role}</p>
                        </div>
                      </div>
                      <div className="p-2 text-primary bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                        <Plus size={16} />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <p className="text-sm font-medium">No employees found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MessengerPage;
