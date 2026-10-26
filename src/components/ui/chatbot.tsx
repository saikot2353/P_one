import React, { useState, useRef, useEffect } from "react";
import { Bot, BotMessageSquare, X, Send, Sparkles, User, ExternalLink, Paperclip, Mic, Loader2, ChevronRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: React.ReactNode;
  action?: {
    label: string;
    path: string;
  };
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hi there! I'm CRIPTON, your AI Assistant. How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    // Simulate AI typing delay based on message length (min 800ms, max 2000ms)
    const userTextStr = userMessage.text as string;
    setTimeout(() => {
      processAiResponse(userTextStr);
    }, Math.min(Math.max(userTextStr.length * 30, 800), 2000));
  };

  const processAiResponse = (userInput: string) => {
    const text = userInput.toLowerCase();
    let botMessage: Message = {
      id: Date.now().toString(),
      sender: "bot",
      text: (
        <div className="flex flex-col gap-2">
          <span>I'm not quite sure how to help with that yet.</span>
          <span className="text-muted-foreground">You can ask me about navigating to modules like <strong>Leave</strong>, <strong>Attendance</strong>, <strong>Payroll</strong>, or ask for an employee's information.</span>
        </div>
      ),
    };

    // Navigation logic
    if (text.includes("how to apply leave") || text.includes("leave requisition") || text.includes("leave application") || text.includes("ssp leave") || (text.includes("ssp") && text.includes("leave"))) {
      botMessage = {
        id: Date.now().toString(),
        sender: "bot",
        text: (
          <div className="flex flex-col gap-3">
            <span>To apply for leave, you should navigate through the SSP menu. Here is the exact path:</span>
            
            <div className="flex flex-col gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10 mt-1 mb-1">
              <div className="text-[10px] font-bold text-primary/70 uppercase tracking-wider mb-0.5">Navigation Path</div>
              <div className="flex flex-wrap items-center gap-2 text-[11.5px] font-semibold text-foreground">
                <div className="flex items-center justify-center px-2.5 py-1.5 bg-background rounded-lg shadow-sm border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">SSP</div>
                <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />
                <div className="flex items-center justify-center px-2.5 py-1.5 bg-background rounded-lg shadow-sm border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">New Requisition</div>
                <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />
                <div className="flex items-center justify-center px-2.5 py-1.5 bg-primary text-primary-foreground rounded-lg shadow-sm">Leave Application</div>
              </div>
            </div>

            <span>I can take you there directly right now!</span>
          </div>
        ),
        action: { label: "Go to Leave Application", path: "/ssp-leave-requisition" },
      };
    } else if (text.includes("leave") || text.includes("vacation") || text.includes("time off")) {
      botMessage = {
        id: Date.now().toString(),
        sender: "bot",
        text: (
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-foreground/90">Leave Management</span>
            <span>You can manage and apply for leave in the Leave module. Let me take you there!</span>
          </div>
        ),
        action: { label: "Go to Leave Module", path: "/leave-management" },
      };
    } else if (text.includes("recruit") || text.includes("hire") || text.includes("apply")) {
      botMessage = {
        id: Date.now().toString(),
        sender: "bot",
        text: "The e-Recruitment form handles new applications. Click below to open it.",
        action: { label: "Go to e-Recruitment", path: "/e-recruitment-form" },
      };
    } else if (text.includes("budget") || text.includes("statement")) {
      botMessage = {
        id: Date.now().toString(),
        sender: "bot",
        text: "You can view the budget and statements in the Budget Statement module.",
        action: { label: "View Budget Statement", path: "/budget-statement" },
      };
    } else if (text.includes("transfer") || text.includes("control center")) {
      botMessage = {
        id: Date.now().toString(),
        sender: "bot",
        text: "You can manage transfers in the Transfer Control Center.",
        action: { label: "Go to Transfer Control Center", path: "/transfer-control-center" },
      };
    } else if (text.includes("id card") || text.includes("badge")) {
      botMessage = {
        id: Date.now().toString(),
        sender: "bot",
        text: "You can design and setup ID cards here.",
        action: { label: "Go to ID Card Setup", path: "/id-card-setup" },
      };
    }
    // Employee Information logic
    else if (text.includes("salary") || text.includes("information") || text.includes("details")) {
      botMessage = {
        id: Date.now().toString(),
        sender: "bot",
        text: (
          <div className="flex flex-col gap-3">
            <span>Here is the information I found:</span>
            <div className="bg-background/40 p-3 rounded-lg border border-border/50 text-[11.5px] space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between border-b border-border/50 pb-1.5 mb-1.5">
                <span className="font-bold text-foreground text-xs">John Doe</span>
                <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded font-semibold text-[10px]">ID: 10245</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2"><span className="text-muted-foreground">Department:</span> <span className="font-medium">Business Innovation</span></div>
              <div className="grid grid-cols-[80px_1fr] gap-2"><span className="text-muted-foreground">Designation:</span> <span className="font-medium">Senior PM</span></div>
              <div className="grid grid-cols-[80px_1fr] gap-2"><span className="text-muted-foreground">Gross Salary:</span> <span className="font-medium">$4,500/month</span></div>
              <div className="grid grid-cols-[80px_1fr] gap-2"><span className="text-muted-foreground">Status:</span> <span className="text-emerald-500 font-semibold">Active</span></div>
            </div>
          </div>
        ),
      };
    } else if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      botMessage = {
        id: Date.now().toString(),
        sender: "bot",
        text: "Hello! How can I assist you with HRIS today?",
      };
    }

    setIsTyping(false);
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none print:hidden">
      {/* Chat Window */}
      <div 
        className={`pointer-events-auto mb-4 w-[360px] sm:w-[400px] bg-card/95 backdrop-blur-2xl border border-border/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right transform ${
          isOpen ? "opacity-100 scale-100 translate-y-0 h-[550px] max-h-[calc(100vh-120px)]" : "opacity-0 scale-90 translate-y-10 h-[0px] pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 opacity-90"></div>
          <div className="absolute inset-0 bg-primary/5 opacity-20"></div>
          
          <div className="relative p-4 px-5 flex items-center justify-between text-white">
            <div className="flex items-center gap-3.5">
              <div className="relative p-2.5 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner border border-white/10 group">
                <BotMessageSquare className="size-5.5 text-white drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -bottom-1 -right-1 size-3.5 bg-emerald-400 border-2 border-indigo-600 rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <h3 className="font-extrabold text-[15px] tracking-tight text-white flex items-center gap-1.5 drop-shadow-md">
                  CRIPTON AI <Sparkles className="size-3.5 text-amber-300 animate-pulse" />
                </h3>
                <p className="text-[11px] text-indigo-100 font-medium tracking-wide flex items-center gap-1.5">
                  <span className="relative flex size-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-1.5 bg-emerald-400"></span>
                  </span>
                  Always online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors text-white/90 hover:text-white cursor-pointer"
            >
              <X className="size-4.5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-background/30 to-background/10 custom-scrollbar">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both`}
              style={{ animationDelay: `${index === messages.length - 1 ? '100ms' : '0ms'}` }}
            >
              <div
                className={`flex items-end gap-2.5 max-w-[88%] ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="shrink-0 size-7.5 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md border border-indigo-200/20 mb-1">
                    <Bot className="size-4" />
                  </div>
                )}
                
                <div
                  className={`p-3 text-[12.5px] leading-relaxed shadow-sm relative group ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm shadow-primary/20"
                      : "bg-card border border-border/60 text-foreground rounded-2xl rounded-bl-sm shadow-black/5"
                  }`}
                >
                  <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                  
                  {msg.action && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate({ to: msg.action!.path as any });
                      }}
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold py-2 px-4 rounded-xl transition-all duration-300 border border-primary/20 text-[11px] uppercase tracking-wide cursor-pointer group/btn"
                    >
                      {msg.action.label}
                      <ExternalLink className="size-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex flex-col items-start animate-in fade-in duration-300">
              <div className="flex items-end gap-2.5 max-w-[85%] flex-row">
                <div className="shrink-0 size-7.5 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md border border-indigo-200/20 mb-1">
                  <Bot className="size-4" />
                </div>
                <div className="p-3 bg-card border border-border/60 text-foreground rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 h-[38px]">
                  <span className="size-1 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="size-1 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="size-1 bg-primary/60 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-card/80 backdrop-blur-xl border-t border-border/50 shrink-0">
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 bg-background border border-border/80 rounded-2xl pl-3 pr-2 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-inner"
          >
            <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted cursor-pointer shrink-0">
              <Paperclip className="size-4.5" />
            </button>
            <input
              type="text"
              placeholder="Ask me anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[13.5px] font-medium text-foreground placeholder:text-muted-foreground py-1"
            />
            {!inputValue.trim() ? (
              <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted cursor-pointer shrink-0">
                <Mic className="size-4.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="size-9 rounded-xl bg-primary text-primary-foreground shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="size-4 -ml-0.5" />
              </button>
            )}
          </form>
          <div className="text-center mt-3">
            <span className="text-[9.5px] text-muted-foreground font-medium tracking-wide">AI Assistant can make mistakes. Verify important info.</span>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`pointer-events-auto relative size-14 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer group ${
          isOpen
            ? "bg-card border border-border/80 text-foreground rotate-90 scale-90 shadow-md hover:bg-muted"
            : "bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-[0_8px_30px_rgba(79,70,229,0.4)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.6)] hover:-translate-y-1"
        }`}
      >
        {/* Glow effect behind button */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse -z-10 group-hover:bg-primary/40 transition-colors"></div>
        )}
        
        {isOpen ? (
          <X className="size-6 transition-transform duration-500 rotate-0" />
        ) : (
          <BotMessageSquare className="size-6 transition-transform duration-500 group-hover:scale-110" />
        )}
      </button>
    </div>
  );
}
