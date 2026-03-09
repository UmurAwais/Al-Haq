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

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch('/api/drive/list', {
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
                {filteredFiles.map((file) => (
                  <div 
                    key={file.id} 
                    onClick={() => handleOpenFileDetails(file)}
                    className="group bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden active:scale-95 duration-300"
                  >
                     <div className="w-14 h-14 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center text-brand mb-4 group-hover:bg-brand group-hover:text-white transition-all">
                        <Video size={24} />
                     </div>
                     <h3 className="text-sm font-bold text-slate-800 leading-tight mb-2 line-clamp-2 uppercase tracking-tight group-hover:text-brand transition-colors">
                        {file.name}
                     </h3>
                     <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar size={12} /> Created Over Cloud
                     </div>
                  </div>
                ))}
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
                                <div className="space-y-3">
                                   <div className="h-4 w-32 bg-white/10 rounded-full animate-pulse"></div>
                                   <div className="h-4 w-48 bg-white/10 rounded-full animate-pulse"></div>
                                   <div className="h-4 w-24 bg-white/10 rounded-full animate-pulse"></div>
                                </div>
                             ) : fileDetails ? (
                                <div className="space-y-4">
                                   <div className="flex items-center gap-3">
                                      <Info size={16} className="text-brand-accent" />
                                      <span className="text-sm font-bold opacity-80 truncate">{fileDetails.title || 'Untitled Video'}</span>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <Clock size={16} className="text-brand-accent" />
                                      <span className="text-sm font-bold opacity-80">Duration: {fileDetails.duration || 'N/A'}s</span>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <Eye size={16} className="text-brand-accent" />
                                      <span className="text-sm font-bold opacity-80">Ready for Integration</span>
                                   </div>
                                </div>
                             ) : (
                                <p className="text-xs font-bold text-white/50 italic">Fetch engine failed to extract extended metadata.</p>
                             )}
                          </div>
                      </div>

                      <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Embed Link for Courses</h4>
                          <div className="flex items-center gap-3">
                             <input 
                                readOnly
                                value={selectedFile.webViewLink}
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-bold text-slate-500 truncate"
                             />
                             <button className="px-5 py-2 bg-brand text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90">Copy</button>
                          </div>
                      </div>
                   </div>

                   {/* Right Col: Video Preview Mockup */}
                   <div className="space-y-6">
                      <div className="aspect-video bg-slate-100 rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative group">
                         {fileDetails?.thumbnail ? (
                            <img src={fileDetails.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                         ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                               <Youtube size={64} className="opacity-10 mb-2" />
                               <span className="text-[10px] font-bold uppercase tracking-widest">Preview Unavailable</span>
                            </div>
                         )}
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                            <div className="p-4 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                               <Play size={24} fill="white" className="text-white ml-1" />
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <a 
                            href={selectedFile.webViewLink} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 py-3 bg-white text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all border border-slate-200 shadow-sm"
                         >
                            <ExternalLink size={14} /> Source Link
                         </a>
                         <button className="flex items-center justify-center gap-2 py-3 bg-brand text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-brand/10">
                            <FileVideo size={14} /> Attach to Course
                         </button>
                      </div>
                   </div>
                </div>

                <div className="mt-10 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                   <p className="text-[10px] font-medium text-slate-400 text-center italic">Resource is automatically synchronized from Al-Haq's central Google Cloud Project.</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDrive;
