import React, { useState, useEffect } from 'react';
import { 
  HardDrive, 
  Search, 
  Video, 
  Eye, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Loader2, 
  X,
  Play,
  FileVideo,
  ExternalLink,
  ChevronRight,
  Info,
  Youtube,
  Cloud,
  FolderOpen
} from 'lucide-react';
import { apiFetch } from '../../config';

const AdminDrive = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileDetails, setFileDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentFolder, setCurrentFolder] = useState({ id: '1EwrHXO5kSCk-heyiUZAk_38zv_PUpHgT', name: 'Root' });
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: '1EwrHXO5kSCk-heyiUZAk_38zv_PUpHgT', name: 'Root' }]);

  useEffect(() => {
    fetchFiles(currentFolder.id);
  }, [currentFolder.id]);

  const fetchFiles = async (folderId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const url = folderId ? `/api/drive/list?folderId=${folderId}` : '/api/drive/list';
      const res = await apiFetch(url, {
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error('Failed to fetch drive files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFileDetails = async (file) => {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      setCurrentFolder({ id: file.id, name: file.name });
      setBreadcrumbs(prev => [...prev, { id: file.id, name: file.name }]);
      return;
    }
    setSelectedFile(file);
    setIsModalOpen(true);
    setFileDetails(null);
    setLoadingDetails(true);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch(`/api/admin/fetch-video-info?videoId=${file.id}`, {
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        setFileDetails(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch file details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleBreadcrumbClick = (crumb, index) => {
    setCurrentFolder({ id: crumb.id, name: crumb.name });
    setBreadcrumbs(prev => prev.slice(0, index + 1));
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand/5 rounded-2xl border border-brand/10 shadow-sm">
            <HardDrive className="w-8 h-8 text-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Resource Drive</h1>
            <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                <Cloud size={14} className="text-brand" /> 
                {files.length} Managed Cloud Resources
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Breadcrumbs */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
           {breadcrumbs.map((crumb, index) => (
             <React.Fragment key={crumb.id}>
               <button 
                 onClick={() => handleBreadcrumbClick(crumb, index)}
                 className={`text-[10px] font-black uppercase tracking-widest transition-colors hover:text-brand ${index === breadcrumbs.length - 1 ? 'text-brand' : 'text-slate-400'}`}
               >
                 {crumb.name}
               </button>
               {index < breadcrumbs.length - 1 && <ChevronRight size={12} className="text-slate-300" />}
             </React.Fragment>
           ))}
        </div>

        {/* Search & Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
           <div className="relative group w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                placeholder="Search for files or videos..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-xs font-bold border border-slate-100 rounded-xl outline-none focus:border-brand/30 focus:bg-white transition-all text-slate-600 placeholder:text-slate-300"
              />
           </div>

           <div className="px-4 py-2 bg-brand/5 rounded-xl border border-brand/5">
                <span className="text-[10px] font-bold text-brand uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={12} /> Connected to Google Drive
                </span>
           </div>
        </div>

        {/* Files Grid */}
        <div className="p-8">
          {loading ? (
             <div className="py-32 flex flex-col items-center justify-center">
               <Loader2 className="w-12 h-12 text-brand animate-spin mb-4 opacity-20" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Querying Storage Volume...</p>
             </div>
          ) : filteredFiles.length === 0 ? (
             <div className="py-32 text-center text-slate-300 border-2 border-dashed border-slate-100 rounded-2xl">
                <FolderOpen size={64} className="mx-auto mb-4 opacity-10" />
                <h3 className="text-xl font-bold uppercase tracking-tight">No Resources Found</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your cloud storage seems empty</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {filteredFiles.map((file) => {
                    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                    return (
                      <div 
                        key={file.id} 
                        onClick={() => handleOpenFileDetails(file)}
                        className="group bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden active:scale-95 duration-300"
                      >
                         <div className={`w-14 h-14 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center mb-4 transition-all ${isFolder ? 'text-amber-500 group-hover:bg-amber-500 group-hover:text-white' : 'text-brand group-hover:bg-brand group-hover:text-white'}`}>
                            {isFolder ? <FolderOpen size={24} /> : (file.mimeType.includes('pdf') || file.mimeType.includes('document') ? <FileText size={24} /> : <Video size={24} />)}
                         </div>
                         <h3 className="text-sm font-bold text-slate-800 leading-tight mb-2 line-clamp-2 uppercase tracking-tight group-hover:text-brand transition-colors">
                            {file.name}
                         </h3>
                         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Calendar size={12} /> {isFolder ? 'Directory' : 'Managed Resource'}
                         </div>
                      </div>
                    );
                  })}
             </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {isModalOpen && selectedFile && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh]">
             {/* Modal Header */}
             <div className="shrink-0 p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <div>
                   <h2 className="text-xl font-bold text-slate-900 tracking-tight truncate max-w-xl">{selectedFile.name}</h2>
                   <p className="text-xs text-slate-500 font-medium tracking-tight mt-0.5 uppercase">Resource ID: {selectedFile.id}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-all active:scale-95 border border-slate-100">
                   <X size={20} />
                </button>
             </div>

             {/* Modal Body */}
             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                   {/* Left Col: Info */}
                   <div className="space-y-6">
                      <div className="p-8 bg-slate-900 text-white rounded-2xl relative overflow-hidden group shadow-2xl shadow-brand/10">
                          <div className="absolute top-0 right-0 p-10 opacity-5 -mr-10 -mt-10">
                              <Play size={160} fill="white" />
                          </div>
                          <div className="relative z-10">
                             <h3 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-4">Metadata Snapshot</h3>
                             {loadingDetails ? (
                                <div className="space-y-3 font-bold">
                                   <div className="h-4 w-32 bg-white/10 rounded-full animate-pulse"></div>
                                   <div className="h-4 w-48 bg-white/10 rounded-full animate-pulse"></div>
                                   <div className="h-4 w-24 bg-white/10 rounded-full animate-pulse"></div>
                                </div>
                             ) : fileDetails ? (
                                <div className="space-y-4">
                                   <div className="flex items-center gap-3">
                                      <Info size={16} className="text-brand-accent" />
                                      <span className="text-sm font-bold opacity-80 truncate uppercase tracking-tight">{fileDetails.mimeType?.split('/').pop() || 'Unknown File'} Resource</span>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <Play size={16} className="text-brand-accent" />
                                      <span className="text-sm font-bold opacity-80 uppercase tracking-tight">Size: {(parseInt(fileDetails.size) / (1024 * 1024)).toFixed(2)} MB Volume</span>
                                   </div>
                                   {fileDetails.videoMediaMetadata?.durationMillis && (
                                     <div className="flex items-center gap-3">
                                        <Clock size={16} className="text-brand-accent" />
                                        <span className="text-sm font-bold opacity-80 uppercase tracking-tight">Length: {(parseInt(fileDetails.videoMediaMetadata.durationMillis) / 60000).toFixed(2)} MIN CRITICAL</span>
                                     </div>
                                   )}
                                   <div className="flex items-center gap-3">
                                      <Eye size={16} className="text-brand-accent" />
                                      <span className="text-sm font-bold opacity-80 uppercase tracking-tight">Ready for System Integration</span>
                                   </div>
                                </div>
                             ) : (
                                <p className="text-xs font-bold text-white/50 italic font-bold">Metadata analysis pending sync from Cloud.</p>
                             )}
                          </div>
                      </div>

                      <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Embed Link for Courses</h4>
                          <div className="flex items-center gap-3">
                             <input 
                                id="drive-link-input"
                                readOnly
                                value={`https://drive.google.com/file/d/${selectedFile.id}/preview`}
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-black text-slate-500 truncate"
                             />
                             <button 
                                onClick={() => {
                                   const input = document.getElementById('drive-link-input');
                                   input.select();
                                   navigator.clipboard.writeText(input.value);
                                   setCopied(true);
                                   setTimeout(() => setCopied(false), 2000);
                                }}
                                className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all cursor-pointer ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:opacity-90'}`}
                             >
                                {copied ? 'Copied' : 'Copy'}
                             </button>
                          </div>
                      </div>
                   </div>

                   {/* Right Col: Video Preview Mockup */}
                   <div className="space-y-6">
                      <div className="aspect-video bg-slate-100 rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative group">
                          <iframe 
                            src={`https://drive.google.com/file/d/${selectedFile.id}/preview`}
                            className="w-full h-full border-0"
                            allow="autoplay"
                          ></iframe>
                        </div>

                      <div className="grid grid-cols-2 gap-4">
                         <a 
                            href={`https://drive.google.com/file/d/${selectedFile.id}/view`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 py-3 bg-white text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all border border-slate-200 shadow-sm cursor-pointer"
                         >
                            <ExternalLink size={14} /> Source Link
                         </a>
                         <button 
                           onClick={() => alert("This file is now mapped to course inventory. You can assign it via the Curriculum manager.")}
                           className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-slate-900/10 cursor-pointer"
                         >
                            <FileVideo size={14} /> Attach to Course
                         </button>
                      </div>
                   </div>
                </div>

                <div className="mt-10 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                   <p className="text-[10px] font-bold text-slate-400 text-center italic uppercase tracking-widest">Resource is automatically synchronized from Al-Haq's central Google Cloud Project.</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDrive;
