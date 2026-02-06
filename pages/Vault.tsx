
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppDocument } from '../types';
import { FileText, UploadCloud, Search, Trash2, Download, Filter, FileStack, FileCheck, FileArchive, X, Plus, AlertCircle, CheckCircle2, DollarSign, RefreshCw, Eye, MoreVertical } from 'lucide-react';

export default function Vault() {
  const { documents, addDocument, deleteDocument, user } = useApp();
  const [activeTab, setActiveTab] = useState<'ALL' | 'CONTRACT' | 'INVOICE' | 'RECEIPT' | 'REPORT' | 'DOWNLOAD'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<AppDocument | null>(null);
  
  const [newDoc, setNewDoc] = useState<Partial<AppDocument>>({ type: 'CONTRACT', category: 'General' });
  const [isUploading, setIsUploading] = useState(false);

  const filteredDocs = documents.filter(doc => {
      const matchTab = activeTab === 'ALL' || doc.type === activeTab;
      const matchSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTab && matchSearch;
  });

  const handleUpload = () => {
    if (newDoc.name && newDoc.type) {
        setIsUploading(true);
        setTimeout(() => {
            addDocument({
                id: Math.random().toString(),
                name: newDoc.name!,
                type: newDoc.type!,
                category: newDoc.category || 'General',
                size: (Math.random() * 5 + 0.5).toFixed(1) + 'MB', 
                date: new Date().toISOString(),
                url: '#',
                uploadedBy: user?.name || 'Authorized Lead'
            } as AppDocument);
            setIsUploading(false);
            setShowUploadModal(false);
            setNewDoc({ type: 'CONTRACT', category: 'General' });
        }, 1500);
    }
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'CONTRACT': return <FileCheck className="text-emerald-500" />;
          case 'INVOICE': return <DollarSign className="text-blue-500" />;
          case 'RECEIPT': return <FileArchive className="text-amber-500" />;
          case 'REPORT': return <FileStack className="text-purple-500" />;
          default: return <FileText className="text-slate-400" />;
      }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Corporate Vault</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-3">High-integrity repository for legal, financial, and operational assets.</p>
        </div>
        <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center"
        >
            <UploadCloud size={18} className="mr-2" />
            Launch Ingestion Manager
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row items-center gap-4">
          <div className="flex-1 relative w-full lg:w-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                className="w-full pl-14 pr-4 py-4 border-none bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] outline-none font-bold shadow-inner"
                placeholder="Find document by signature or category..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
          </div>
          <div className="flex space-x-1 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl w-full lg:w-auto overflow-x-auto scrollbar-hide">
              {['ALL', 'CONTRACT', 'INVOICE', 'RECEIPT', 'REPORT'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                      {tab === 'ALL' ? 'Everything' : tab + 's'}
                  </button>
              ))}
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocs.length === 0 ? (
              <div className="col-span-full py-24 text-center bg-white dark:bg-slate-900 rounded-[3.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileStack size={40} className="text-slate-200 dark:text-slate-700" />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">No Signal Detected in Archive</p>
              </div>
          ) : filteredDocs.map(doc => (
              <div key={doc.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                            {getIcon(doc.type)}
                        </div>
                        <div className="flex space-x-1">
                            <button onClick={() => setPreviewDoc(doc)} className="p-2.5 text-slate-400 hover:text-blue-500 bg-slate-50 dark:bg-slate-800 rounded-xl transition-all" title="Preview"><Eye size={16}/></button>
                            <button onClick={() => deleteDocument(doc.id)} className="p-2.5 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 rounded-xl transition-all" title="Delete"><Trash2 size={16}/></button>
                        </div>
                    </div>
                    <h3 className="font-black text-slate-800 dark:text-white text-base line-clamp-2 leading-snug mb-3">{doc.name}</h3>
                    <div className="flex items-center space-x-2 mb-8">
                        <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded text-emerald-600 border border-emerald-100 dark:border-emerald-800/50">{doc.type}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{doc.size}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <Plus size={10} className="mr-1 text-emerald-500" /> {doc.uploadedBy.split(' ')[0]}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                            {new Date(doc.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="bg-slate-900 dark:bg-white text-white dark:text-black p-3 rounded-xl hover:scale-110 active:scale-90 transition-all shadow-lg">
                          <Download size={16} />
                      </button>
                  </div>
              </div>
          ))}
      </div>

      {/* PREVIEW MODAL */}
      {previewDoc && (
          <div className="fixed inset-0 bg-slate-950/95 flex items-center justify-center z-[200] p-4 md:p-12 backdrop-blur-xl animate-in zoom-in duration-300">
               <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-white/10">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center space-x-6">
                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-emerald-500 shadow-sm border dark:border-slate-700">
                                {getIcon(previewDoc.type)}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">{previewDoc.name}</h3>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{previewDoc.type} • Secured Node Identifier • {previewDoc.size}</p>
                            </div>
                        </div>
                        <button onClick={() => setPreviewDoc(null)} className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm border dark:border-slate-700"><X size={24}/></button>
                    </div>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-12 flex items-center justify-center overflow-auto">
                        <div className="w-full max-w-3xl bg-white dark:bg-slate-900 p-20 rounded-[2.5rem] shadow-2xl space-y-10 min-h-full border dark:border-slate-800">
                            <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-800 rounded-full" />
                            <div className="space-y-4">
                                <div className="h-3 w-full bg-slate-50 dark:bg-slate-800/50 rounded-full" />
                                <div className="h-3 w-full bg-slate-50 dark:bg-slate-800/50 rounded-full" />
                                <div className="h-3 w-4/5 bg-slate-50 dark:bg-slate-800/50 rounded-full" />
                            </div>
                            <div className="h-40 w-full bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
                                <FileText size={48} className="text-slate-200 dark:text-slate-800" />
                            </div>
                            <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic pt-10">End of Encrypted Section</p>
                        </div>
                    </div>
               </div>
          </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
          <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-[150] p-4 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/10">
                  <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Ingestion Manager</h3>
                        <p className="text-slate-500 mt-3 font-medium text-sm">Secure corporate file ingestion with automated indexing.</p>
                    </div>
                    <button onClick={() => setShowUploadModal(false)} className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={24}/></button>
                  </div>
                  
                  <div className="p-10 space-y-10">
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[3rem] p-12 text-center bg-slate-50/30 dark:bg-slate-800/30 hover:bg-slate-50 transition-all cursor-pointer group shadow-inner">
                           <UploadCloud size={48} className="mx-auto text-slate-300 group-hover:text-emerald-600 transition-colors mb-4" />
                           <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Select Statutory Assets</p>
                           <p className="text-[10px] text-slate-400 mt-2 font-medium">PDF, DOCX, XLSX, JPG (Enterprise Limit: 50MB)</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4 block">Manifest Display Name</label>
                              <input 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] dark:text-white font-black outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner"
                                placeholder="e.g. Q4 Logistics Manifest"
                                onChange={e => setNewDoc({...newDoc, name: e.target.value})}
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4 block">Asset Classification</label>
                              <select 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] dark:text-white font-black outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner uppercase tracking-widest text-[10px]"
                                value={newDoc.type}
                                onChange={e => setNewDoc({...newDoc, type: e.target.value as any})}
                              >
                                  <option value="CONTRACT">Legal Contract</option>
                                  <option value="INVOICE">Fiscal Invoice</option>
                                  <option value="RECEIPT">Settlement Receipt</option>
                                  <option value="REPORT">Sector Report</option>
                                  <option value="DOWNLOAD">Public Download</option>
                              </select>
                          </div>
                      </div>
                  </div>

                  <div className="p-10 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-6 bg-slate-50/50 dark:bg-slate-900/50">
                      <button onClick={() => setShowUploadModal(false)} className="px-10 py-5 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-100 rounded-3xl transition-all">Discard</button>
                      <button 
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="px-14 py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all text-xs flex items-center justify-center disabled:opacity-50 min-w-[240px]"
                      >
                          {isUploading ? (
                              <><RefreshCw className="animate-spin mr-3" size={16} /> Finalizing Asset...</>
                          ) : (
                              <>Synchronize with Vault <CheckCircle2 size={18} className="ml-3" /></>
                          )}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
