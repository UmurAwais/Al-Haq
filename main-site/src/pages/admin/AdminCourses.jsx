import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  BookOpen,
  Users,
  Star,
  Loader2,
  X,
  Upload,
  AlertCircle
} from 'lucide-react';
import { apiFetch, getApiUrl } from '../../config';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, courseId: null, isMultiple: false });
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    id: '', title: '', excerpt: '', price: '', 
    duration: '', language: 'Urdu / Hindi', 
    rating: '4.8', ratingCount: '1.2k ratings',
    badge: 'Premium • Online', whatYouWillLearn: '', 
    includes: '', fullDescription: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle Image Preview
  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await apiFetch('/api/courses/online', {
        headers: { 'x-admin-token': token }
      });
      const data = await response.json();
      if (data.ok) {
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      if (err.message === '401' || err.message === '403') {
        setError('Session expired. Please log in again.');
      } else {
        setError('Connection error or database failure.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token === 'mock-admin-token') {
      setError('You are using a mock session. Please Log Out and Log In again to save courses.');
    }
    fetchCourses();
  }, []);

  const openModal = (course = null) => {
    setError('');
    if (course) {
      setEditingCourse(course);
      setFormData({
        id: course.id || '',
        title: course.title || '',
        excerpt: course.excerpt || '',
        price: course.price || '',
        duration: course.duration || '',
        language: course.language || '',
        rating: course.rating || '4.8',
        ratingCount: course.ratingCount || '',
        badge: course.badge?.label || '',
        whatYouWillLearn: (course.whatYouWillLearn || []).join('\n'),
        includes: (course.includes || []).join('\n'),
        fullDescription: (course.fullDescription || []).join('\n\n')
      });
    } else {
      setEditingCourse(null);
      setFormData({
        id: '', title: '', excerpt: '', price: '', 
        duration: '', language: 'Urdu / Hindi (Online)', 
        rating: '4.8', ratingCount: '1.2k ratings',
        badge: 'Premium • Online', whatYouWillLearn: '', 
        includes: '', fullDescription: ''
      });
    }
    setImageFile(null);
    setVideoFile(null);
    if (course && course.image) {
      const url = course.image.startsWith('http') ? course.image : `${getApiUrl().replace(/\/$/, '')}${course.image.startsWith('/') ? '' : '/'}${course.image}`;
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSelectAll = (filtered) => {
    if (selectedCourses.length === filtered.length) {
      setSelectedCourses([]); // Deselect all
    } else {
      setSelectedCourses(filtered.map(c => c.id || c._id)); // Select all
    }
  };

  const toggleSelectCourse = (courseId) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleDeleteSelected = () => {
    setDeleteModal({ isOpen: true, courseId: null, isMultiple: true });
  };

  const handleDelete = (courseId) => {
    setDeleteModal({ isOpen: true, courseId, isMultiple: false });
  };

  const confirmDelete = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    setDeleteModal({ isOpen: false, courseId: null, isMultiple: false });

    if (deleteModal.isMultiple) {
      let hasError = false;
      for (const courseId of selectedCourses) {
        try {
          const res = await apiFetch(`/api/courses/online/${courseId}`, {
            method: 'DELETE',
            headers: { 'x-admin-token': token }
          });
          if (!res.ok) hasError = true;
        } catch (err) {
          console.error(`Error deleting course ${courseId}:`, err);
          hasError = true;
        }
      }
      if (hasError) {
        alert('Some courses could not be deleted. They might be in use or there was a server error.');
      }
      setSelectedCourses([]);
      fetchCourses();
    } else {
      try {
        const res = await apiFetch(`/api/courses/online/${deleteModal.courseId}`, {
          method: 'DELETE',
          headers: { 'x-admin-token': token }
        });
        const data = await res.json();
        if (data.ok) {
          fetchCourses();
        } else {
          alert(data.message || data.error || 'Failed to delete');
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        alert('Error deleting course');
        setLoading(false);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const token = localStorage.getItem('adminToken');
    const fd = new FormData();
    fd.append('courseType', 'online');
    
    // Auto-generate ID if empty (slug from title)
    const courseId = formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    fd.append('id', courseId);
    
    Object.keys(formData).forEach(key => {
      if (key === 'id') return;
      if (['whatYouWillLearn', 'includes'].includes(key)) {
        fd.append(key, JSON.stringify(formData[key].split('\n').filter(Boolean)));
      } else if (key === 'fullDescription') {
        fd.append(key, JSON.stringify(formData[key].split('\n\n').filter(Boolean)));
      } else {
        fd.append(key, formData[key]);
      }
    });

    if (imageFile) fd.append('image', imageFile);
    if (videoFile) fd.append('video', videoFile);
    
    // If we're editing and haven't uploaded a new image, tell the backend about the existing one
    if (editingCourse && !imageFile && editingCourse.image) {
      fd.append('existingImageUrl', editingCourse.image);
    }

    try {
      const url = editingCourse 
        ? `${getApiUrl()}/api/courses/update/online/${editingCourse.id}`
        : `${getApiUrl()}/api/courses/upload`;
        
      const res = await fetch(url, {
        method: editingCourse ? 'PUT' : 'POST',
        headers: { 'x-admin-token': token },
        body: fd
      });
      
      const data = await res.json();
      if (data.ok) {
        closeModal();
        fetchCourses();
      } else {
        if (res.status === 401 || res.status === 403) {
          setError('Access Denied: Your session is invalid. Please log out and back in.');
        } else {
          setError(data.message || data.error || 'Error saving course');
        }
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred during save.');
    } finally {
      setSaving(false);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.instructor || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-6 md:pb-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-brand" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Courses</h1>
            <p className="text-sm text-slate-500 font-medium">Manage your course catalog ({courses.length} online)</p>
          </div>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2.5 bg-brand hover:opacity-90 text-white rounded-lg font-bold text-sm transition-all shadow-sm shadow-brand/20">
          <Plus size={18} strokeWidth={2.5} /> Add Course
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
           <h2 className="text-lg font-bold text-slate-900 tracking-tight">Online Courses ({filteredCourses.length})</h2>
           <div className="flex items-center gap-4 w-full sm:w-auto">
             <div className="relative group w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand" />
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm font-medium border border-slate-200 rounded-lg focus:outline-none focus:border-brand/30 focus:ring-2 focus:ring-brand/10 transition-all w-full text-slate-700 placeholder:text-slate-400"
                />
             </div>
             <div className="flex items-center gap-3 shrink-0 ml-auto">
                {selectedCourses.length > 0 && (
                  <button 
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-bold transition-colors"
                  >
                    <Trash2 size={14} /> Delete ({selectedCourses.length})
                  </button>
                )}
                <button 
                  onClick={() => handleSelectAll(filteredCourses)}
                  className={`text-sm font-semibold transition-colors hidden sm:block whitespace-nowrap ${selectedCourses.length > 0 && selectedCourses.length === filteredCourses.length ? 'text-brand' : 'text-slate-500 hover:text-brand'}`}
                >
                  {selectedCourses.length > 0 && selectedCourses.length === filteredCourses.length ? 'Deselect All' : 'Select All'}
                </button>
             </div>
           </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
           <div className="py-20 flex flex-col items-center justify-center">
             <Loader2 className="w-10 h-10 text-brand animate-spin mb-4" />
             <p className="text-sm text-slate-500 font-medium tracking-wide">Loading course catalog...</p>
           </div>
        ) : filteredCourses.length === 0 ? (
           <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-xl">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">No Courses Found</h3>
              <p className="text-sm text-slate-500">No online courses matched your search.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => {
                 const currentId = course.id || course._id;
                 return (
                  <div key={currentId} className={`group flex flex-col bg-white border rounded-2xl overflow-hidden transition-all duration-300 relative ${selectedCourses.includes(currentId) ? 'border-brand shadow-md ring-1 ring-brand/20' : 'border-slate-100 p-4 hover:shadow-2xl hover:border-brand/40'}`}>
                    
                    {/* Checkbox */}
                    <div className={`absolute top-6 left-6 z-10 transition-opacity duration-200 ${selectedCourses.includes(currentId) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <input 
                        type="checkbox" 
                        checked={selectedCourses.includes(currentId)}
                        onChange={() => toggleSelectCourse(currentId)}
                        className="w-6 h-6 rounded border-slate-300 text-brand focus:ring-brand/20 cursor-pointer bg-white/95 backdrop-blur-sm shadow-sm"
                      />
                    </div>
                    
                    {/* Hover Actions */}
                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                       <button onClick={() => openModal(course)} className="p-2 bg-white/95 backdrop-blur-sm text-brand rounded-lg shadow-sm hover:bg-brand hover:text-white transition-colors" title="Edit Course">
                         <Edit size={16} />
                       </button>
                       <button onClick={() => handleDelete(currentId)} className="p-2 bg-white/95 backdrop-blur-sm text-red-500 rounded-lg shadow-sm hover:bg-red-500 hover:text-white transition-colors" title="Delete Course">
                         <Trash2 size={16} />
                       </button>
                    </div>

                    {/* Image */}
                    <div className="aspect-[16/10] w-full bg-slate-100 overflow-hidden relative rounded-xl">
                      <img 
                         src={course.image?.startsWith('http') ? course.image : `${getApiUrl().replace(/\/$/, '')}${course.image.startsWith('/') ? '' : '/'}${course.image}`} 
                         alt={course.title}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* Content */}
                    <div className="py-5 flex flex-col flex-1">
                      <div className="mb-3">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm shadow-brand/10 ${course.badge?.color || 'bg-[#5022C3] text-white'}`}>
                          <ShieldCheck size={14} className="stroke-[3]" />
                          <span className="text-[11px] font-black uppercase tracking-tight">
                            {course.badge?.label || 'Premium • Online'}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-[18px] font-black text-[#0F172A] leading-[1.2] mb-2 line-clamp-2 h-[44px]">
                        {course.title}
                      </h3>
                      
                      <p className="text-[13px] text-[#64748B] mb-4 line-clamp-2 leading-relaxed h-[40px]">
                        {course.excerpt || 'Master this subject with our comprehensive online course. Start learning today!'}
                      </p>

                      <div className="mb-4">
                        <span className="text-[22px] font-black text-[#0F172A] tracking-tight">
                          {String(course.price || '').toLowerCase() === 'free' ? 'Free' : (String(course.price || '').startsWith('Rs') ? course.price : `Rs. ${course.price}`)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-6">
                        <div className="flex items-center gap-1">
                           <Star size={18} className="fill-[#F59E0B] text-[#F59E0B]" />
                           <span className="text-[14px] font-black text-[#0F172A]">{course.rating || '4.5'}</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg border border-slate-100 bg-[#F8FAFC] text-[12px] text-[#64748B] font-bold">
                          {course.ratingCount || '0 ratings'}
                        </div>
                      </div>

                      <button className="w-full rounded-xl py-3.5 text-[15px] font-black bg-brand/5 text-brand border border-brand/10 cursor-default">
                        Dashboard Preview
                      </button>
                    </div>
                  </div>
              )})}
           </div>
        )}
      </div>

      {/* CREATE/EDIT MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60" onClick={closeModal}></div>
          
          <div className="relative w-full max-w-4xl bg-white rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in slide-in-from-bottom-16 duration-500">
            
            {/* Modal Header */}
            <div className="shrink-0 p-6 sm:px-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-brand uppercase tracking-tight">{editingCourse ? 'Edit Course' : 'Create Course'}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure online course details</p>
              </div>
              <button onClick={closeModal} className="p-2 bg-white hover:bg-slate-100 text-slate-400 rounded-xl transition-all shadow-sm border border-slate-100">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
              <form id="courseForm" onSubmit={handleSave} className="space-y-8">
                
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Title</label>
                        <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-slate-300" placeholder="e.g. Master React in 30 Days" />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ID / Slug (Optional)</label>
                        <input type="text" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-slate-300" placeholder="e.g. master-react-30-days" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Price</label>
                            <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 outline-none transition-all" placeholder="Rs. 5000 / Free" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Duration</label>
                            <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 outline-none transition-all" placeholder="e.g. 2 Months" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Badge</label>
                            <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 outline-none transition-all" placeholder="Premium • Online" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Language</label>
                            <input type="text" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 outline-none transition-all" placeholder="Urdu / Hindi" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Excerpt (Short Desc)</label>
                        <textarea rows="3" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-slate-300 resize-none" placeholder="Brief summary of the course..."></textarea>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex justify-between">
                            Cover Image {editingCourse && !imageFile && <span className="text-emerald-500 font-bold lowercase">Keeps Existing</span>}
                        </label>
                        <div className="relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-slate-200">
                            <input required={!editingCourse} type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                            
                            {imagePreview ? (
                                <div className="relative w-full aspect-video">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                                        <Upload size={24} className="mb-2" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Change Image</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full bg-slate-50 px-5 py-6 text-center group-hover:bg-brand/5 group-hover:border-brand/20 transition-all flex flex-col items-center justify-center gap-2">
                                    <Upload size={24} className="text-slate-300 group-hover:text-brand transition-colors" />
                                    <span className="text-xs font-bold text-slate-500 group-hover:text-brand flex flex-col">
                                        {imageFile ? imageFile.name : 'Upload New Cover Image'}
                                        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-1">(Max 5MB)</span>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Promo Video (Optional)</label>
                        <div className="relative group cursor-pointer">
                            <input type="file" accept="video/mp4" onChange={e => setVideoFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                            <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl px-5 py-4 text-center group-hover:bg-brand/5 group-hover:border-brand/20 transition-all flex flex-col items-center justify-center gap-2">
                                <Upload size={20} className="text-slate-300 group-hover:text-brand transition-colors" />
                                <span className="text-xs font-bold text-slate-500 group-hover:text-brand line-clamp-1 px-4 text-center">
                                    {videoFile ? videoFile.name : 'Upload Overview Video (.mp4)'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">What You Will Learn (1 per line)</label>
                        <textarea rows="4" value={formData.whatYouWillLearn} onChange={e => setFormData({...formData, whatYouWillLearn: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 outline-none transition-all placeholder:text-slate-300 resize-none text-nowrap" placeholder="Build modern apps&#10;Learn React basics&#10;Deploy to production"></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="shrink-0 p-6 sm:px-10 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4 rounded-b-4xl">
              <button disabled={saving} onClick={closeModal} type="button" className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all disabled:opacity-50">Cancel</button>
              <button disabled={saving} form="courseForm" type="submit" className="flex items-center gap-3 px-8 py-3 bg-brand hover:opacity-90 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />} 
                {saving ? 'Saving...' : 'Save Course'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setDeleteModal({ isOpen: false, courseId: null, isMultiple: false })}></div>
          
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-16 duration-500">
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <Trash2 size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Confirm Deletion</h2>
              <p className="text-slate-500 font-medium text-sm">
                {deleteModal.isMultiple 
                  ? `Are you absolutely sure you want to delete ${selectedCourses.length} selected courses? This action cannot be undone.` 
                  : `Are you sure you want to delete this course? This action cannot be undone.`}
              </p>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, courseId: null, isMultiple: false })} 
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors uppercase text-xs tracking-widest leading-none drop-shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-3 px-4 rounded-xl font-black bg-red-500 hover:bg-red-600 text-white transition-all hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-red-500/20 uppercase text-xs tracking-widest leading-none flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Delete {deleteModal.isMultiple && 'All'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCourses;

