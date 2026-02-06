
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Message, Announcement } from '../types';
import { MessageSquare, Bell, Mail, Search, User, AlertCircle, CheckCircle2, X, Plus, ShieldCheck, Globe, Smartphone, RefreshCw, SendHorizontal, ChevronRight, UserCircle } from 'lucide-react';

export default function Communication() {
  const { messages, announcements, sendMessage, addAnnouncement, user } = useApp();
  const [activeTab, setActiveTab] = useState<'INBOX' | 'ANNOUNCEMENTS' | 'SMTP'>('INBOX');
  const [showNewMsgModal, setShowNewMsgModal] = useState(false);
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);

  const [newMsg, setNewMsg] = useState<Partial<Message>>({ subject: '', content: '' });
  const [newAnn, setNewAnn] = useState<Partial<Announcement>>({ priority: 'MEDIUM' });

  const handleSendMessage = () => {
    if (newMsg.subject && newMsg.content) {
        sendMessage({
            id: Math.random().toString(),
            senderId: user?.id || 'sys',
            senderName: user?.name || 'Authorized Lead',
            subject: newMsg.subject,
            content: newMsg.content,
            date: new Date().toISOString(),
            read: false,
            type: 'SENT'
        } as Message);
        setShowNewMsgModal(false);
        setNewMsg({ subject: '', content: '' });
    }
  };

  const handlePostAnnouncement = () => {
      if (newAnn.title && newAnn.content) {
          addAnnouncement({
              id: Math.random().toString(),
              title: newAnn.title,
              content: newAnn.content,
              author: user?.name || 'Administrative Hub',
              date: new Date().toISOString(),
              priority: newAnn.priority || 'MEDIUM'
          } as Announcement);
          setShowAnnModal(false);
          setNewAnn({ priority: 'MEDIUM' });
      }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Communication Hub</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-3">Unified nexus for corporate broadcasts and team synchronization.</p>
        </div>
        <div className="flex space-x-3">
             <button 
                onClick={() => setShowNewMsgModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center"
            >
                <Plus size={18} className="mr-2" />
                Compose Message
            </button>
            {user?.role === 'ADMIN' && (
                 <button 
                    onClick={() => setShowAnnModal(true)}
                    className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center"
                >
                    <Bell size={18} className="mr-2" />
                    New Broadcast
                </button>
            )}
        </div>
      </div>

      <div className="flex space-x-1 p-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] w-fit shadow-sm overflow-x-auto scrollbar-hide">
          {[
              { id: 'INBOX', label: 'Message Center', icon: MessageSquare },
              { id: 'ANNOUNCEMENTS', label: 'System Broadcasts', icon: Bell },
              { id: 'SMTP', label: 'SMTP Services', icon: Mail }
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-3 px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-50 dark:bg-slate-800 text-emerald-600 shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
              </button>
          ))}
      </div>

      {activeTab === 'INBOX' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
              <div className="lg:col-span-1 flex flex-col bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-50 dark:border-slate-800">
                       <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-[11px] font-bold outline-none placeholder:uppercase placeholder:tracking-widest" placeholder="Find contact..." />
                       </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
                      {messages.length === 0 ? (
                          <div className="py-20 text-center text-slate-300 italic text-[10px] font-black uppercase tracking-widest">Inbox Clean</div>
                      ) : messages.map(msg => (
                          <div 
                            key={msg.id} 
                            onClick={() => setSelectedMsg(msg)}
                            className={`p-5 rounded-[2rem] cursor-pointer transition-all border ${selectedMsg?.id === msg.id ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800' : 'bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                          >
                              <div className="flex justify-between items-start mb-2">
                                  <p className={`text-[11px] font-black leading-tight line-clamp-1 ${selectedMsg?.id === msg.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>{msg.subject}</p>
                                  {!msg.read && <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shadow-sm" />}
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{msg.senderName.split(' ')[0]}</p>
                                <p className="text-[8px] text-slate-300 font-bold">{new Date(msg.date).toLocaleDateString()}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
              
              <div className="lg:col-span-2 flex flex-col bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                   {selectedMsg ? (
                       <div className="flex flex-col h-full animate-in fade-in duration-500">
                           <div className="p-10 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 flex justify-between items-center">
                               <div className="flex items-center space-x-5">
                                   <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border dark:border-slate-700">
                                       <UserCircle size={32} />
                                   </div>
                                   <div>
                                       <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{selectedMsg.subject}</h3>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">From: {selectedMsg.senderName} • Authorized Thread</p>
                                   </div>
                               </div>
                               <button className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 transition-colors">Audit log</button>
                           </div>
                           <div className="flex-1 p-10 overflow-y-auto scrollbar-thin">
                               <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-[2.5rem] shadow-inner text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-lg border dark:border-slate-800">
                                   {selectedMsg.content}
                               </div>
                               <div className="mt-8 flex justify-end">
                                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest flex items-center">
                                        <ShieldCheck size={14} className="mr-2" /> End-to-End Encrypted Node Communication
                                    </div>
                               </div>
                           </div>
                           <div className="p-8 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-50 dark:border-slate-800 flex items-center space-x-4">
                               <input className="flex-1 bg-white dark:bg-slate-900 border-none px-8 py-4 rounded-2xl text-sm font-bold shadow-inner outline-none focus:ring-4 focus:ring-emerald-500/10" placeholder="Type an internal response..." />
                               <button className="bg-emerald-600 text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"><SendHorizontal size={20}/></button>
                           </div>
                       </div>
                   ) : (
                       <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-8">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-200 mb-2"><Mail size={48} /></div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">Unified Workspace Inbox</h3>
                                <p className="text-sm text-slate-400 mt-3 max-w-sm leading-relaxed font-medium">Select a secure thread from the directory to review authorized corporate correspondence.</p>
                            </div>
                       </div>
                   )}
              </div>
          </div>
      )}

      {activeTab === 'ANNOUNCEMENTS' && (
          <div className="space-y-6">
              {announcements.length === 0 ? (
                  <div className="py-40 text-center bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <Bell size={64} className="mx-auto text-slate-100 mb-6" />
                    <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-xs">No Signal Detected</p>
                  </div>
              ) : announcements.map(ann => (
                  <div key={ann.id} className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-all hover:shadow-xl">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Bell size={120} /></div>
                      <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className="flex items-center space-x-6">
                              <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] ${ann.priority === 'HIGH' ? 'bg-red-500 animate-pulse' : ann.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{ann.title}</h3>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(ann.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-lg mb-10 max-w-4xl relative z-10">{ann.content}</p>
                      <div className="pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 relative z-10">
                          <UserCircle size={16} className="mr-2 text-emerald-500" /> Administrative Feed • <span className="text-slate-900 dark:text-white ml-2">{ann.author}</span>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {activeTab === 'SMTP' && (
          <div className="max-w-4xl animate-in zoom-in duration-500">
              <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5"><Globe size={200} /></div>
                  <div className="relative z-10">
                      <h2 className="text-3xl font-black tracking-tight mb-4 leading-none">Automated SMTP Relay</h2>
                      <p className="text-slate-400 text-lg font-medium max-w-xl mb-12 leading-relaxed">Synchronize your enterprise email infrastructure to automate client settlement invoices and logistics notifications directly from the platform.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                           <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] flex flex-col justify-between group hover:bg-white/10 transition-colors shadow-inner">
                                <div className="flex items-center space-x-6 mb-8">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform shadow-lg"><Mail size={28} /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Operational SMTP</p>
                                        <p className="font-black text-lg">Workplace Relay</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-rose-400 text-[10px] font-black uppercase tracking-widest">
                                    <AlertCircle size={16} className="mr-2" /> Synchronization Offline
                                </div>
                           </div>
                           <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] flex flex-col justify-between group hover:bg-white/10 transition-colors shadow-inner">
                                <div className="flex items-center space-x-6 mb-8">
                                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20"><ShieldCheck size={28} /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Auth Security</p>
                                        <p className="font-black text-lg">TLS Protocol v3</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                    <CheckCircle2 size={16} className="mr-2" /> Security Handshake Valid
                                </div>
                           </div>
                      </div>

                      <button className="bg-white text-slate-900 px-12 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all">
                          Establish Enterprise Handshake
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* NEW MESSAGE MODAL */}
      {showNewMsgModal && (
          <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-[150] p-4 backdrop-blur-xl animate-in zoom-in duration-300">
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col">
                  <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase tracking-tighter">Compose Memo</h3>
                        <p className="text-slate-500 mt-3 font-medium text-sm">Synchronize with team members across authorized nodes.</p>
                    </div>
                    <button onClick={() => setShowNewMsgModal(false)} className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={24}/></button>
                  </div>
                  
                  <div className="p-10 space-y-8 flex-1 overflow-y-auto">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Subject Narrative</label>
                        <input className="w-full bg-slate-50 dark:bg-slate-800 border-none p-6 rounded-[2rem] font-black text-lg outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner" placeholder="Logistics Audit Summary..." onChange={e => setNewMsg({...newMsg, subject: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Recipient Node Group</label>
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border-none p-6 rounded-[2rem] font-black text-xs uppercase tracking-widest outline-none shadow-inner appearance-none">
                            <option>Broad System Access (All Staff)</option>
                            <option>Operations & Logistics Hub</option>
                            <option>Administrative / Finance Leads</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Detailed Narrative</label>
                        <textarea className="w-full bg-slate-50 dark:bg-slate-800 border-none p-10 rounded-[3rem] h-48 outline-none font-medium text-lg shadow-inner resize-none leading-relaxed" placeholder="Draft your briefing here..." onChange={e => setNewMsg({...newMsg, content: e.target.value})} />
                      </div>
                  </div>

                  <div className="p-10 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-6 bg-slate-50/50 dark:bg-slate-900/50">
                      <button onClick={() => setShowNewMsgModal(false)} className="px-10 py-5 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-100 rounded-3xl transition-all">Discard</button>
                      <button onClick={handleSendMessage} className="px-14 py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all text-xs flex items-center">
                          Authorize Dispatch <SendHorizontal size={18} className="ml-3" />
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* ANNOUNCEMENT MODAL */}
      {showAnnModal && (
          <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-[150] p-4 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col">
                  <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase tracking-tighter">System Broadcast</h3>
                        <p className="text-slate-500 mt-3 font-medium text-sm">Inject a system-wide announcement across all authorized nodes.</p>
                    </div>
                    <button onClick={() => setShowAnnModal(false)} className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={24}/></button>
                  </div>
                  
                  <div className="p-10 space-y-8 flex-1 overflow-y-auto">
                      <div className="grid grid-cols-1 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Broadcast Headline</label>
                            <input className="w-full bg-slate-50 dark:bg-slate-800 border-none p-6 rounded-[2rem] font-black text-lg outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner" placeholder="e.g. Mandatory System Sync..." onChange={e => setNewAnn({...newAnn, title: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Priority Protocol</label>
                            <select className="w-full bg-slate-50 dark:bg-slate-800 border-none p-6 rounded-[2rem] font-black text-[10px] uppercase tracking-widest outline-none shadow-inner appearance-none" onChange={e => setNewAnn({...newAnn, priority: e.target.value as any})}>
                                <option value="MEDIUM">Standard Operational Update</option>
                                <option value="HIGH">CRITICAL ALERT - IMMEDIATE ATTENTION</option>
                                <option value="LOW">Low Impact Synchronization</option>
                            </select>
                          </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Broadcast Narrative</label>
                        <textarea className="w-full bg-slate-50 dark:bg-slate-800 border-none p-10 rounded-[3rem] h-48 outline-none font-medium text-lg shadow-inner resize-none leading-relaxed" placeholder="Detailed broadcast content..." onChange={e => setNewAnn({...newAnn, content: e.target.value})} />
                      </div>
                  </div>

                  <div className="p-10 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-6 bg-slate-50/50">
                      <button onClick={() => setShowAnnModal(false)} className="px-10 py-5 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-100 rounded-3xl transition-all">Discard</button>
                      <button onClick={handlePostAnnouncement} className="px-14 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all text-xs flex items-center justify-center min-w-[240px]">
                          Commit to Feed <ShieldCheck size={18} className="ml-3" />
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
