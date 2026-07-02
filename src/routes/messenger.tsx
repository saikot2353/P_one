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
  Trash2
} from "lucide-react";

export const Route = createFileRoute("/messenger")({
  head: () => ({
    meta: [{ title: "Messenger — CRIPTON" }],
  }),
  component: MessengerPage,
});

// -- Mock Data Base --
const INITIAL_GROUPS = [
  { id: "g1", name: "Business Innovation", avatar: "https://i.pravatar.cc/150?u=g1", lastMessage: "Great. Please review this video walkthrough.", time: "10:42 AM", unread: 2, members: 6 },
  { id: "g2", name: "HR Team", avatar: "https://i.pravatar.cc/150?u=g2", lastMessage: "Don't forget the all-hands meeting at 3 PM.", time: "09:15 AM", unread: 0, members: 3 },
  { id: "g3", name: "Finance & Accounts", avatar: "https://i.pravatar.cc/150?u=g3", lastMessage: "The Q3 reports are finalized.", time: "Yesterday", unread: 0, members: 4 },
  { id: "g4", name: "IT & Infrastructure", avatar: "https://i.pravatar.cc/150?u=g4", lastMessage: "Server maintenance scheduled for tonight.", time: "Yesterday", unread: 5, members: 5 },
  { id: "g5", name: "Marketing", avatar: "https://i.pravatar.cc/150?u=g5", lastMessage: "New ad creatives are ready for review.", time: "Tuesday", unread: 0, members: 2 },
  { id: "g6", name: "Security Operations", avatar: "https://i.pravatar.cc/150?u=g6", lastMessage: "Gate 2 access logs verified.", time: "Monday", unread: 0, members: 3 },
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

function MessengerPage() {
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [activeGroupId, setActiveGroupId] = useState(INITIAL_GROUPS[0].id);
  
  // Dynamic State
  const [messagesByGroup, setMessagesByGroup] = useState<Record<string, any[]>>({
    g1: [...BASE_MESSAGES],
    g2: [{ id: 1, senderId: "u1", senderName: "Anika", avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d", text: "Don't forget the all-hands meeting at 3 PM.", time: "09:15 AM", isMe: false }],
    g3: [{ id: 1, senderId: "u4", senderName: "John", avatar: "https://i.pravatar.cc/150?u=j", text: "The Q3 reports are finalized.", time: "Yesterday", isMe: false }],
  });

  const [membersByGroup, setMembersByGroup] = useState<Record<string, any[]>>({
    g1: [...BASE_MEMBERS],
    g2: [BASE_MEMBERS[0], BASE_MEMBERS[1], BASE_MEMBERS[2]],
    g3: [BASE_MEMBERS[1], BASE_MEMBERS[4], BASE_MEMBERS[5], BASE_MEMBERS[3]],
  });

  const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0];
  const activeMessages = messagesByGroup[activeGroupId] || [];
  const activeMembers = membersByGroup[activeGroupId] || [BASE_MEMBERS[1]]; // Defaults to just 'You' if empty

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
  
  // Mock Call States
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, activeGroupId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      senderId: "me",
      senderName: "You",
      avatar: "https://i.pravatar.cc/150?u=me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessagesByGroup(prev => ({
      ...prev,
      [activeGroupId]: [...(prev[activeGroupId] || []), newMsg]
    }));
    
    // Update last message preview in group list
    setGroups(prev => prev.map(g => g.id === activeGroupId ? { ...g, lastMessage: newMessage, time: newMsg.time } : g));
    setNewMessage("");
  };

  const handleRemoveMember = (memberId: number) => {
    setMembersByGroup(prev => {
      const updatedMembers = (prev[activeGroupId] || []).filter(m => m.id !== memberId);
      setGroups(gPrev => gPrev.map(g => g.id === activeGroupId ? { ...g, members: updatedMembers.length } : g));
      return { ...prev, [activeGroupId]: updatedMembers };
    });
  };

  const handleAddMember = () => {
    const newMockMember = { 
      id: Date.now(), 
      name: "New Hire " + Math.floor(Math.random() * 100), 
      role: "Trainee", 
      img: `https://i.pravatar.cc/150?u=${Date.now()}` 
    };
    
    setMembersByGroup(prev => {
      const updatedMembers = [...(prev[activeGroupId] || []), newMockMember];
      setGroups(gPrev => gPrev.map(g => g.id === activeGroupId ? { ...g, members: updatedMembers.length } : g));
      return { ...prev, [activeGroupId]: updatedMembers };
    });
  };

  const handleCall = (type: "audio" | "video") => {
    setCallType(type);
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
      setCallType(null);
    }, 5000);
  };

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-screen flex bg-background text-foreground transition-colors duration-300 overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative h-full">
        <Topbar />

        {/* Messenger Container */}
        <div className="flex-1 flex overflow-hidden p-4 md:p-6 gap-6">
          
          {/* Left Panel: Groups List */}
          <div className="w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col bg-card rounded-2xl border border-border/80 shadow-sm overflow-hidden h-full">
            {/* Header */}
            <div className="p-5 border-b border-border/60">
              <h2 className="text-xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
                <Users className="text-primary size-5" />
                Department Chats
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                <input 
                  type="text" 
                  placeholder="Search departments..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted/50 border border-border/60 text-sm outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
              {filteredGroups.map(group => (
                <button
                  key={group.id}
                  onClick={() => setActiveGroupId(group.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                    activeGroupId === group.id 
                      ? "bg-primary text-primary-foreground shadow-md transform scale-[1.02]" 
                      : "hover:bg-muted/60"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={group.avatar} alt={group.name} className="w-12 h-12 rounded-full object-cover border-2 border-background shadow-xs" />
                    {group.unread > 0 && activeGroupId !== group.id && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                        {group.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className={`font-bold text-sm truncate ${activeGroupId === group.id ? "text-primary-foreground" : "text-foreground"}`}>
                        {group.name}
                      </h4>
                      <span className={`text-[10px] shrink-0 ${activeGroupId === group.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {group.time}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${activeGroupId === group.id ? "text-primary-foreground/90 font-medium" : "text-muted-foreground"}`}>
                      {group.lastMessage}
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
                <h2 className="text-2xl font-black mb-2 text-foreground">Calling {activeGroup.name}...</h2>
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
                <img src={activeGroup.avatar} alt={activeGroup.name} className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:shadow-md transition-all" />
                <div>
                  <h3 className="font-extrabold text-foreground group-hover:text-primary transition-colors">{activeGroup.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {activeGroup.members} members online
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
              
              {activeMessages.map((msg, index) => {
                const showAvatar = index === 0 || activeMessages[index - 1].senderId !== msg.senderId;
                
                return (
                  <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.isMe ? "ml-auto flex-row-reverse" : ""}`}>
                    {/* Avatar */}
                    {showAvatar ? (
                      <img src={msg.avatar} alt={msg.senderName} className="w-8 h-8 rounded-full shrink-0 shadow-sm mt-1" />
                    ) : (
                      <div className="w-8 shrink-0"></div>
                    )}
                    
                    {/* Message Body */}
                    <div className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}>
                      {showAvatar && (
                        <span className="text-xs font-bold text-muted-foreground mb-1 mx-1">
                          {msg.isMe ? "You" : msg.senderName} <span className="font-normal text-[10px] ml-1 opacity-70">{msg.time}</span>
                        </span>
                      )}
                      
                      <div className={`
                        group relative flex flex-col gap-2 p-3.5 rounded-2xl shadow-sm text-sm
                        ${msg.isMe 
                          ? "bg-primary text-primary-foreground rounded-tr-sm" 
                          : "bg-background border border-border/60 text-foreground rounded-tl-sm"
                        }
                      `}>
                        {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                        
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
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-background border-t border-border/60 shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-muted/30 p-2 rounded-2xl border border-border/60 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                
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
                <img src={activeGroup.avatar} alt={activeGroup.name} className="w-20 h-20 rounded-full mx-auto mb-3 shadow-md border-4 border-background" />
                <h2 className="text-xl font-extrabold text-foreground">{activeGroup.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">Department Group • {activeGroup.members} Members</p>
              </div>

              {/* Modal Body: Employee List */}
              <div className="p-4 border-b border-border/60 flex items-center justify-between">
                <h3 className="font-bold text-sm">Members</h3>
                <button 
                  onClick={handleAddMember}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <UserPlus size={14} /> Add Member
                </button>
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
                    {emp.name !== "You" && (
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
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MessengerPage;
