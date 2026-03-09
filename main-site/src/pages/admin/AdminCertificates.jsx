import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Search, 
  Trash2, 
  Plus, 
  Loader2, 
  Upload, 
  FileCheck, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Eye,
  BookOpen,
  Image as ImageIcon,
  Layout,
  ExternalLink,
  Info
} from 'lucide-react';
import { apiFetch, getApiUrl } from '../../config';

const AdminCertificates = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      // Certificates are tied to courses
      const res = await apiFetch('/api/courses/online', {
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpload = (course) => {
    setSelectedCourse(course);
    setFile(null);
    setPreview(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('certificate', file);
    formData.append('courseId', selectedCourse.id);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${getApiUrl()}/api/admin/certificates/upload`, {
        method: 'POST',
        headers: {
          'x-admin-token': token
        },
        body: formData
      });

      const data = await response.json();
      if (data.ok) {
        setIsModalOpen(false);
        fetchCourses();
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Delete this certificate template?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await apiFetch('/api/admin/certificates/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({ courseIds: [courseId] })
      });

      const data = await response.json();
      if (data.ok) {
        fetchCourses();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-brand/5 rounded-2xl border border-brand/10 shadow-sm">
            <Award className="w-8 h-8 text-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Credential Forge</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                <FileCheck size={14} className="text-brand-accent" /> 
                Course Certificate Management
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden">
        {/* Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
           <div className="relative group w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH COURSES BY TITLE..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-4 text-xs font-black border border-slate-200 rounded-2xl outline-none focus:border-brand/30 focus:ring-4 focus:ring-brand/5 transition-all text-slate-700 placeholder:text-slate-300 tracking-widest uppercase"
              />
           </div>

           <div className="px-4 py-2 bg-brand/5 rounded-xl border border-brand/5">
                <span className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={12} /> Auto-Generation Ready
                </span>
           </div>
        </div>

        {/* Certificate Grid */}
        <div className="p-8">
          {loading ? (
             <div className="py-32 flex flex-col items-center justify-center">
               <Loader2 className="w-12 h-12 text-brand animate-spin mb-4 opacity-20" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Certificate Registry...</p>
             </div>
          ) : filteredCourses.length === 0 ? (
             <div className="py-20 text-center text-slate-300">
                <Award size={64} className="mx-auto mb-4 opacity-10" />
                <h3 className="text-xl font-black uppercase tracking-tight">No Courses Found</h3>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <div key={course._id} className="group bg-slate-50 border border-slate-100 rounded-[35px] overflow-hidden hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                     <div className="aspect-[1.414/1] relative bg-slate-200 overflow-hidden">
                        {course.certificateTemplate ? (
                          <>
                            <img src={`${getApiUrl()}${course.certificateTemplate}`} alt="Template" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-brand/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                               <div className="flex gap-3">
                                  <a href={`${getApiUrl()}${course.certificateTemplate}`} target="_blank" rel="noreferrer" className="p-3 bg-white text-brand rounded-2xl shadow-xl hover:scale-110 transition-transform"><ExternalLink size={20} /></a>
                                  <button onClick={() => handleDelete(course.id)} className="p-3 bg-white text-red-500 rounded-2xl shadow-xl hover:scale-110 transition-transform"><Trash2 size={20} /></button>
                               </div>
                            </div>
                            <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg border border-white text-[9px] font-black text-brand uppercase tracking-widest flex items-center gap-2">
                               <CheckCircle2 size={12} /> Live Template
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                             <Layout size={40} className="mb-4 opacity-20" />
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">No Template Bound</p>
                             <button onClick={() => handleOpenUpload(course)} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:border-brand hover:text-brand transition-all">Bind Template</button>
                          </div>
                        )}
                     </div>

                     <div className="p-8">
                        <div className="flex items-center gap-2 mb-2">
                           <BookOpen size={12} className="text-brand-accent" />
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{course.id}</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight truncate group-hover:text-brand transition-colors">{course.title}</h3>
                        
                        {course.certificateTemplate && (
                           <button onClick={() => handleOpenUpload(course)} className="mt-6 w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-dashed border-slate-200 rounded-2xl hover:border-brand hover:text-brand transition-all flex items-center justify-center gap-2">
                              <Upload size={14} /> Replace Authority Matrix
                           </button>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          )}
        </div>
      </div>

      {/* UPLOAD MODAL */}
      {isModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-slate-200">
             {/* Modal Header */}
             <div className="shrink-0 p-8 sm:px-10 border-b border-slate-100 flex items-center justify-between bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Course: {selectedCourse.id}</span>
                        <div className="h-px w-8 bg-brand/30"></div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Upload Template</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="relative z-10 w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all active:scale-95 border border-slate-100">
                    <XCircle size={24} />
                </button>
             </div>

             {/* Modal Body */}
             <div className="flex-1 overflow-y-auto p-8 sm:p-10 custom-scrollbar">
                <form id="certForm" onSubmit={handleUpload} className="space-y-8">
                   {error && (
                       <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in shake duration-300">
                           <AlertCircle size={16} /> {error}
                       </div>
                   )}

                   <div 
                      onClick={() => document.getElementById('certFile').click()}
                      className={`relative group h-72 rounded-[35px] border-4 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center cursor-pointer overflow-hidden ${preview ? 'border-brand/40 bg-brand/5' : 'border-slate-100 bg-slate-50 hover:border-brand/20 hover:bg-brand/5'}`}
                   >
                      <input id="certFile" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      
                      {preview ? (
                         <>
                            <img src={preview} alt="Preview" className="w-full h-full object-contain relative z-10" />
                            <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 flex items-center justify-center z-20 transition-opacity">
                               <div className="px-6 py-3 bg-white text-brand rounded-2xl shadow-xl font-black text-[10px] uppercase tracking-widest">Change Image</div>
                            </div>
                         </>
                      ) : (
                         <>
                            <ImageIcon size={48} className="text-slate-200 group-hover:text-brand transition-colors mb-4" />
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">Drop Identity Matrix</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload .PNG or .JPG (Recomm. 1200x850)</p>
                         </>
                      )}
                   </div>

                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed flex items-center gap-2">
                         <Info size={12} className="text-brand" /> System will auto-overlay Student Name & Date upon issuance.
                      </p>
                   </div>
                </form>
             </div>

             {/* Modal Footer */}
             <div className="shrink-0 p-8 sm:px-10 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4 rounded-b-[40px]">
               <button onClick={() => setIsModalOpen(false)} type="button" className="px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-200 transition-all">Cancel</button>
               <button 
                  disabled={uploading || !file} 
                  form="certForm" 
                  type="submit" 
                  className="flex items-center gap-3 px-10 py-4 bg-brand hover:opacity-90 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70"
               >
                 {uploading ? <Loader2 size={16} className="animate-spin" /> : <Award size={16} />} 
                 {uploading ? 'Processing...' : 'Upload Authority Matrix'}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificates;
