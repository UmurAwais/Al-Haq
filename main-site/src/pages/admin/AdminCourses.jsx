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
  AlertCircle,
  ShieldCheck,
  Layout,
  Play,
  GripVertical,
  PlusCircle,
  FolderPlus,
  Video,
  Settings2,
  ChevronDown,
  ChevronUp,
  FileText,
  MousePointer2,
  Download,
  FileJson,
  FileSpreadsheet,
  FolderOpen,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
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
  
  // Curriculum Management State
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [currentCourseForCurriculum, setCurrentCourseForCurriculum] = useState(null);
  const [curriculumSections, setCurriculumSections] = useState([]);
  const [isUpdatingCurriculum, setIsUpdatingCurriculum] = useState(false);
  
  // Google Drive Files (Mock or Real)
  const [driveFiles, setDriveFiles] = useState([]);
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const [isDriveMock, setIsDriveMock] = useState(false);
  const [isDriveSettingsOpen, setIsDriveSettingsOpen] = useState(false);
  const [activeLectureId, setActiveLectureId] = useState(null); // Which lecture is being edited/expanded
  const [driveCurrentFolder, setDriveCurrentFolder] = useState({ id: '1EwrHXO5kSCk-heyiUZAk_38zv_PUpHgT', name: 'Root' });
  const [driveBreadcrumbs, setDriveBreadcrumbs] = useState([{ id: '1EwrHXO5kSCk-heyiUZAk_38zv_PUpHgT', name: 'Root' }]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
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

  const openCurriculumModal = async (course) => {
    setCurrentCourseForCurriculum(course);
    setCurriculumSections(course.lectures || []);
    setIsCurriculumModalOpen(true);
    setDriveCurrentFolder({ id: '1EwrHXO5kSCk-heyiUZAk_38zv_PUpHgT', name: 'Root' });
    setDriveBreadcrumbs([{ id: '1EwrHXO5kSCk-heyiUZAk_38zv_PUpHgT', name: 'Root' }]);
    fetchDriveFiles('1EwrHXO5kSCk-heyiUZAk_38zv_PUpHgT');
  };

  const fetchDriveFiles = async (folderId) => {
    try {
      setIsDriveLoading(true);
      const token = localStorage.getItem('adminToken');
      const url = folderId ? `/api/drive/list?folderId=${folderId}` : '/api/drive/list';
      const res = await apiFetch(url, {
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        setDriveFiles(data.files || []);
        setIsDriveMock(data.mock || false);
      }
    } catch (err) {
      console.error('Failed to fetch drive files:', err);
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleDriveFolderClick = (folder) => {
    setDriveCurrentFolder({ id: folder.id, name: folder.name });
    setDriveBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }]);
    fetchDriveFiles(folder.id);
  };

  const handleDriveBreadcrumbClick = (crumb, index) => {
    setDriveCurrentFolder({ id: crumb.id, name: crumb.name });
    setDriveBreadcrumbs(prev => prev.slice(0, index + 1));
    fetchDriveFiles(crumb.id);
  };

  const closeCurriculumModal = () => {
    setIsCurriculumModalOpen(false);
    setCurrentCourseForCurriculum(null);
    setCurriculumSections([]);
  };

  const handleAddSection = () => {
    const newSection = {
      id: "section-" + Date.now(),
      sectionTitle: "New Module",
      lectures: []
    };
    setCurriculumSections([...curriculumSections, newSection]);
  };

  const handleUpdateSectionTitle = (sectionId, title) => {
    setCurriculumSections(curriculumSections.map(s => 
      s.id === sectionId ? { ...s, sectionTitle: title } : s
    ));
  };

  const handleRemoveSection = (sectionId) => {
    setCurriculumSections(curriculumSections.filter(s => s.id !== sectionId));
  };

  const handleCreateEmptyLecture = (sectionId) => {
    setCurriculumSections(curriculumSections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          lectures: [
            ...s.lectures,
            {
              id: "lecture-" + Date.now(),
              title: "Untitled Lesson",
              video: null,
              pdf: null,
              description: ""
            }
          ]
        };
      }
      return s;
    }));
  };

  const handleAssignFileToLecture = (sectionId, lectureId, file, slot) => {
    setCurriculumSections(curriculumSections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          lectures: s.lectures.map(l => {
            if (l.id === lectureId) {
              return {
                ...l,
                [slot]: {
                  id: file.id,
                  name: file.name,
                  thumbnail: file.thumbnailLink,
                  mimeType: file.mimeType
                }
              };
            }
            return l;
          })
        };
      }
      return s;
    }));
  };

  const handleUpdateLectureTitle = (sectionId, lectureId, title) => {
    setCurriculumSections(curriculumSections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          lectures: s.lectures.map(l => l.id === lectureId ? { ...l, title } : l)
        };
      }
      return s;
    }));
  };

  const handleUpdateLectureDescription = (sectionId, lectureId, description) => {
    setCurriculumSections(curriculumSections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          lectures: s.lectures.map(l => l.id === lectureId ? { ...l, description } : l)
        };
      }
      return s;
    }));
  };

  const handleRemoveLecture = (sectionId, lectureId) => {
    setCurriculumSections(curriculumSections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          lectures: s.lectures.filter(l => l.id !== lectureId)
        };
      }
      return s;
    }));
  };

  const handleRemoveFileFromLecture = (sectionId, lectureId, slot) => {
    setCurriculumSections(curriculumSections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          lectures: s.lectures.map(l => l.id === lectureId ? { ...l, [slot]: null } : l)
        };
      }
      return s;
    }));
  };

  const saveCurriculum = async () => {
    if (!currentCourseForCurriculum) return;
    setIsUpdatingCurriculum(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch('/api/courses/curriculum', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token 
        },
        body: JSON.stringify({
          courseId: currentCourseForCurriculum.id,
          lectures: curriculumSections
        })
      });
      const data = await res.json();
      if (data.ok) {
        closeCurriculumModal();
        fetchCourses();
      } else {
        alert(data.message || 'Failed to update curriculum');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating curriculum');
    } finally {
      setIsUpdatingCurriculum(false);
    }
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

  const downloadCSV = () => {
    if (filteredCourses.length === 0) return;
    const headers = ['Title', 'Price', 'Duration', 'Language', 'Rating', 'Enrolled'];
    const rows = filteredCourses.map(c => [
      c.title,
      c.price,
      c.duration,
      c.language,
      c.rating,
      c.ratingCount
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alhaq_courses_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setShowExportMenu(false);
  };

  const downloadJSON = () => {
    if (filteredCourses.length === 0) return;
    const blob = new Blob([JSON.stringify(filteredCourses, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alhaq_courses_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    setShowExportMenu(false);
  };

  const filteredCourses = courses.filter(course => 
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.instructor || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-6 md:pb-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand/5 rounded-2xl border border-brand/10 shadow-sm">
            <BookOpen className="w-8 h-8 text-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Course Registry</h1>
            <p className="text-sm text-slate-500 font-medium">Manage and refine your interactive course catalog ({courses.length} courses)</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-brand/20 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95"
            >
              <Download size={16} className="text-brand" /> Export <ChevronDown size={14} className={`transition-transform duration-300 ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 origin-top-right overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    onClick={downloadCSV}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:text-brand transition-all uppercase tracking-widest text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                      <FileSpreadsheet size={14} />
                    </div>
                    Download CSV
                  </button>
                  <button 
                    onClick={downloadJSON}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:text-brand transition-all uppercase tracking-widest text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand/5 text-brand flex items-center justify-center">
                      <FileJson size={14} />
                    </div>
                    Download JSON
                  </button>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={() => openModal()} 
            className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand/10 hover:-translate-y-0.5 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} /> Add New Course
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 border-b border-slate-50 pb-6">
           <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Main Catalog</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filteredCourses.length} Matches Found</p>
           </div>
           
           <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <div className="relative group w-full sm:w-80">
                 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search course library..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="pl-10 pr-4 py-3 text-xs font-bold border border-slate-100 rounded-xl outline-none focus:border-brand/30 focus:bg-white transition-all text-slate-600 placeholder:text-slate-300 w-full bg-slate-50/50"
                 />
              </div>
              
              <div className="flex items-center gap-3 shrink-0 ml-auto">
                 {selectedCourses.length > 0 && (
                   <button 
                     onClick={handleDeleteSelected}
                     className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm"
                   >
                     <Trash2 size={14} /> Remove Selected ({selectedCourses.length})
                   </button>
                 )}
                 <button 
                   onClick={() => handleSelectAll(filteredCourses)}
                   className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${selectedCourses.length > 0 && selectedCourses.length === filteredCourses.length ? 'text-brand bg-brand/5 border border-brand/10' : 'text-slate-400 hover:text-brand hover:bg-brand/5'}`}
                 >
                   {selectedCourses.length > 0 && selectedCourses.length === filteredCourses.length ? 'Deselect All' : 'Select All In View'}
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
                     <div onClick={() => openModal(course)} className="aspect-16/10 w-full bg-slate-100 overflow-hidden relative rounded-xl cursor-pointer">
                       <img 
                          src={course.image ? (course.image.startsWith('http') ? course.image : `${getApiUrl().replace(/\/$/, '')}${course.image.startsWith('/') ? '' : '/'}${course.image}`) : 'https://placehold.co/600x400/f1f5f9/64748b?text=No+Image'} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                       />
                     </div>

                        {/* Content */}
                        <div className="py-5 flex flex-col flex-1">
                          <div className="mb-3">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${course.badge?.color || 'bg-brand/5 text-brand border-brand/10'}`}>
                              <ShieldCheck size={14} className="stroke-[2.5]" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">
                                {course.badge?.label || 'Premium • Online'}
                              </span>
                            </div>
                          </div>
 
                          <h3 onClick={() => openModal(course)} className="text-lg font-bold text-slate-900 leading-snug mb-2 line-clamp-2 min-h-12 cursor-pointer hover:text-brand transition-colors">
                            {course.title}
                          </h3>
                         
                         <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed min-h-10">
                           {course.excerpt || 'Master this subject with our comprehensive online course. Start learning today!'}
                         </p>
                         <div className="mt-auto pt-4 border-t border-slate-50">
                            <div className="flex items-center justify-between mb-4">
                               <span className="text-xl font-bold text-slate-900 tracking-tight">
                                 {String(course.price || '').toLowerCase() === 'free' ? 'Free' : (String(course.price || '').startsWith('Rs') ? course.price : `Rs. ${course.price}`)}
                               </span>
                               <div className="flex items-center gap-2">
                                 <Star size={16} className="fill-amber-400 text-amber-400" />
                                 <span className="text-sm font-bold text-slate-900">{course.rating || '4.5'}</span>
                               </div>
                            </div>
 
                            <div className="grid grid-cols-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => openModal(course)} className="flex items-center justify-center gap-1.5 py-2 bg-brand text-white rounded-xl font-bold text-[9px] uppercase tracking-widest shadow-lg shadow-brand/10 hover:opacity-90 transition-all cursor-pointer">
                                 <Edit size={12} /> Design
                               </button>
                               <button onClick={() => openCurriculumModal(course)} className="flex items-center justify-center gap-1.5 py-2 bg-slate-900 text-white rounded-xl font-bold text-[9px] uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all cursor-pointer">
                                 <Layout size={12} /> Lessons
                               </button>
                               <button onClick={() => handleDelete(currentId)} className="flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-red-100 border border-red-100 transition-all cursor-pointer">
                                 <Trash2 size={12} /> Purge
                               </button>
                            </div>
                          </div>
                         </div>
                  </div>
              )})}
           </div>
        )}
      </div>

      {/* CREATE/EDIT MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/50 cursor-pointer" onClick={closeModal}></div>
          
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-200">
            
            {/* Modal Header */}
            <div className="shrink-0 p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{editingCourse ? 'Edit online course' : 'Create online course'}</h2>
                <p className="text-xs text-slate-500 font-medium">Configure course visibility and academic content</p>
              </div>
              <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-all active:scale-95 border border-slate-100 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
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
             <div className="shrink-0 p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
               <button disabled={saving} onClick={closeModal} type="button" className="px-6 py-3 rounded-2xl font-bold text-xs text-slate-500 hover:bg-slate-200 transition-all disabled:opacity-50">Discard Changes</button>
               <button disabled={saving} form="courseForm" type="submit" className="flex items-center gap-2 px-8 py-3 bg-brand hover:opacity-90 text-white rounded-2xl font-bold text-xs shadow-lg shadow-brand/10 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:pointer-events-none">
                 {saving ? <Loader2 size={16} className="animate-spin" /> : <Settings2 size={16} />} 
                 {saving ? 'Processing...' : (editingCourse ? 'Save Changes' : 'Launch Course')}
               </button>
             </div>

          </div>
        </div>
      )}

      {/* CURRICULUM MODAL */}
      <AnimatePresence>
        {isCurriculumModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 cursor-pointer" 
              onClick={closeCurriculumModal}
            ></motion.div>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200"
            >
              
              {/* Header */}
              <div className="shrink-0 p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Curriculum Manager</h2>
                  <p className="text-xs text-slate-500 font-medium">Manage modules and lessons for <span className="text-brand font-bold">{currentCourseForCurriculum?.title}</span></p>
                </div>
                <button onClick={closeCurriculumModal} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-all active:scale-95 border border-slate-100 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-hidden flex">
                {/* Left: Sections List */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/30">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Course structure</h3>
                    </div>
                    <button 
                      onClick={handleAddSection}
                      className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-brand/10 hover:-translate-y-0.5 transition-all"
                    >
                      <PlusCircle size={14} /> Add New Module
                    </button>
                  </div>

                  {curriculumSections.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white">
                      <Layout className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">No sections created yet</h4>
                      <p className="text-xs text-slate-500 mt-1">Start by adding your first learning module</p>
                    </div>
                  ) : (
                    <Reorder.Group 
                      axis="y" 
                      values={curriculumSections} 
                      onReorder={setCurriculumSections}
                      className="space-y-6"
                    >
                      {curriculumSections.map((section) => (
                        <Reorder.Item 
                          key={section.id} 
                          value={section}
                          className="group"
                        >
                          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all">
                            {/* Section Header */}
                            <div className="p-4 bg-slate-900 text-white flex items-center gap-3">
                              <div className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 transition-colors">
                                <GripVertical size={20} />
                              </div>
                              <input 
                                type="text" 
                                value={section.sectionTitle}
                                onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-sm font-black placeholder:text-white/30"
                              />
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleCreateEmptyLecture(section.id)}
                                  className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                                >
                                  <Plus size={14} /> New Lesson
                                </button>
                                <button 
                                  onClick={() => handleRemoveSection(section.id)}
                                  className="p-2 text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Lectures in Section */}
                            <div className="p-4 space-y-4">
                              <Reorder.Group 
                                axis="y" 
                                values={section.lectures || []} 
                                onReorder={(newLectures) => {
                                  setCurriculumSections(curriculumSections.map(s => 
                                    s.id === section.id ? { ...s, lectures: newLectures } : s
                                  ));
                                }}
                                className="space-y-3"
                              >
                                {section.lectures && section.lectures.map((lecture) => (
                                  <Reorder.Item key={lecture.id} value={lecture}>
                                    <div className={`border rounded-2xl transition-all ${activeLectureId === lecture.id ? 'border-brand shadow-lg bg-white ring-4 ring-brand/5' : 'border-slate-100 bg-slate-50/50 hover:border-slate-300'}`}>
                                      {/* Lecture Header */}
                                      <div className="p-4 flex items-center gap-3">
                                        <div className="cursor-grab active:cursor-grabbing text-slate-300">
                                          <GripVertical size={16} />
                                        </div>
                                        <div className="flex-1">
                                          <input 
                                            type="text" 
                                            value={lecture.title}
                                            onChange={(e) => handleUpdateLectureTitle(section.id, lecture.id, e.target.value)}
                                            className="w-full bg-transparent border-none outline-none text-[13px] font-black text-slate-700 focus:text-slate-900"
                                          />
                                        </div>
                                        <div className="flex items-center gap-1">
                                          {(lecture.video || lecture.pdf) && (
                                              <div className="flex gap-1 mr-2">
                                                {lecture.video && <Video size={12} className="text-emerald-500" />}
                                                {lecture.pdf && <FileText size={12} className="text-blue-500" />}
                                              </div>
                                          )}
                                          <button 
                                            onClick={() => setActiveLectureId(activeLectureId === lecture.id ? null : lecture.id)}
                                            className={`p-2 rounded-xl transition-all cursor-pointer ${activeLectureId === lecture.id ? 'bg-brand text-white' : 'hover:bg-slate-200 text-slate-400'}`}
                                          >
                                            {activeLectureId === lecture.id ? <ChevronUp size={16} /> : <Settings2 size={16} />}
                                          </button>
                                          <button 
                                            onClick={() => handleRemoveLecture(section.id, lecture.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      </div>

                                      {/* Lecture Content Multi-Panel */}
                                      <AnimatePresence>
                                        {activeLectureId === lecture.id && (
                                          <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden border-t border-slate-100"
                                          >
                                            <div className="p-5 space-y-6">
                                              <div className="grid grid-cols-2 gap-4">
                                                {/* Video Slot */}
                                                <div className={`p-4 rounded-xl border-2 border-dashed transition-all ${lecture.video ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100 bg-white'}`}>
                                                  <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Video Content</span>
                                                    {lecture.video && <button onClick={() => handleRemoveFileFromLecture(section.id, lecture.id, 'video')} className="text-red-400 hover:text-red-500"><X size={12} /></button>}
                                                  </div>
                                                  {lecture.video ? (
                                                    <div className="flex items-center gap-3">
                                                      <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                                        <Video size={18} />
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                        <p className="text-[11px] font-bold text-slate-900 truncate">{lecture.video.name}</p>
                                                        <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">Linked</p>
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <div className="py-4 text-center">
                                                      <p className="text-[10px] text-slate-400 font-bold">Drop Video Here</p>
                                                    </div>
                                                  )}
                                                </div>

                                                {/* PDF Slot */}
                                                <div className={`p-4 rounded-xl border-2 border-dashed transition-all ${lecture.pdf ? 'border-blue-100 bg-blue-50/30' : 'border-slate-100 bg-white'}`}>
                                                  <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reference PDF</span>
                                                    {lecture.pdf && <button onClick={() => handleRemoveFileFromLecture(section.id, lecture.id, 'pdf')} className="text-red-400 hover:text-red-500"><X size={12} /></button>}
                                                  </div>
                                                  {lecture.pdf ? (
                                                    <div className="flex items-center gap-3">
                                                      <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-md">
                                                        <FileText size={18} />
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                        <p className="text-[11px] font-bold text-slate-900 truncate">{lecture.pdf.name}</p>
                                                        <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest">Linked</p>
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <div className="py-4 text-center">
                                                      <p className="text-[10px] text-slate-400 font-bold">Drop PDF Here</p>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lesson Description / Notes</label>
                                                <textarea 
                                                  value={lecture.description || ''}
                                                  onChange={(e) => handleUpdateLectureDescription(section.id, lecture.id, e.target.value)}
                                                  rows="4" 
                                                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-medium text-slate-600 focus:bg-white focus:border-brand/20 outline-none transition-all resize-none"
                                                  placeholder="Detail what students will learn in this specific session..."
                                                ></textarea>
                                              </div>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  </Reorder.Item>
                                ))}
                              </Reorder.Group>

                              {(!section.lectures || section.lectures.length === 0) && (
                                <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Add lessons to this module</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  )}
                </div>

                {/* Right: Drive Library */}
                <div className="w-80 border-l border-slate-100 flex flex-col bg-white">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/20">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-between gap-2 w-full">
                       <span>Drive Inventory Library</span>
                       <button 
                         onClick={() => setIsDriveSettingsOpen(true)}
                         className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-brand transition-all cursor-pointer"
                         title="Manage Drive Connection"
                       >
                         <Settings2 size={14} />
                       </button>
                     </h3>
                  </div>

                  {/* Drive Breadcrumbs */}
                  <div className="px-4 py-2 border-b border-slate-50 flex items-center gap-1 overflow-x-auto scrollbar-hide bg-slate-50/10">
                    {driveBreadcrumbs.map((crumb, index) => (
                      <React.Fragment key={crumb.id}>
                        <button 
                          onClick={() => handleDriveBreadcrumbClick(crumb, index)}
                          className={`text-[9px] font-black uppercase tracking-tighter transition-all hover:text-brand ${index === driveBreadcrumbs.length - 1 ? 'text-brand' : 'text-slate-400'}`}
                        >
                          {crumb.name === 'Root' ? 'DRIVE' : crumb.name}
                        </button>
                        {index < driveBreadcrumbs.length - 1 && <ChevronRight size={10} className="text-slate-300" />}
                      </React.Fragment>
                    ))}
                  </div>

                  {isDriveMock && (
                    <div className="mx-4 mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex items-start gap-2">
                         <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                         <div>
                            <p className="text-[10px] font-black text-amber-900 uppercase tracking-tighter mb-1">Mock Library Active</p>
                            <p className="text-[9px] text-amber-700 leading-tight font-medium">Drive connection is not yet configured with real credentials.</p>
                            <button 
                              onClick={() => setIsDriveSettingsOpen(true)}
                              className="mt-1.5 text-[9px] font-black text-brand uppercase tracking-widest hover:underline cursor-pointer"
                            >
                               Configure Now
                            </button>
                         </div>
                      </div>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                    {isDriveLoading ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-brand animate-spin mb-4" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Syncing Cloud...</span>
                      </div>
                    ) : driveFiles.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-xs text-slate-400 font-medium">No files found on Drive</p>
                      </div>
                    ) : (
                      driveFiles.map((file) => {
                        const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                        const isVideo = file.mimeType.includes('video');
                        const isPdf = file.mimeType.includes('pdf') || file.mimeType.includes('document');
                        
                        return (
                          <div 
                            key={file.id} 
                            onClick={() => isFolder ? handleDriveFolderClick(file) : null}
                            className={`bg-white border rounded-xl p-3 transition-all group/drive relative ${isFolder ? 'border-amber-100 hover:border-amber-300 bg-amber-50/10 cursor-pointer' : 'border-slate-200 hover:border-brand/30 cursor-default hover:shadow-md'}`}
                          >
                            <div className="flex items-center gap-3">
                              {file.thumbnailLink && !isFolder ? (
                                <img src={file.thumbnailLink} className="w-10 h-10 rounded-lg object-cover border border-slate-200" alt="" />
                              ) : (
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isFolder ? 'bg-amber-100 text-amber-600' : (isVideo ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500')}`}>
                                  {isFolder ? <FolderOpen size={16} /> : (isVideo ? <Video size={16} /> : <FileText size={16} />)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className={`text-[11px] font-black truncate transition-colors ${isFolder ? 'text-amber-900 group-hover/drive:text-amber-600' : 'text-slate-700 group-hover/drive:text-brand'}`}>{file.name}</p>
                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">{isFolder ? 'Directory' : file.mimeType.split('/').pop()}</p>
                              </div>
                              {isFolder && <ChevronRight size={14} className="text-amber-300 group-hover/drive:translate-x-1 transition-transform" />}
                            </div>
                            
                            {!isFolder && (
                              <div className="mt-3 flex gap-2">
                                 {activeLectureId ? (
                                   <button 
                                     onClick={() => {
                                        const section = curriculumSections.find(s => s.lectures.some(l => l.id === activeLectureId));
                                        if (section) handleAssignFileToLecture(section.id, activeLectureId, file, isVideo ? 'video' : 'pdf');
                                     }}
                                     className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer ${isVideo ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                                   >
                                     <PlusCircle size={12} /> Assign to active
                                   </button>
                                 ) : (
                                   <div className="flex-1 py-1.5 border border-slate-100 rounded-lg text-[8px] font-bold text-slate-300 uppercase tracking-widest text-center">
                                     Select lesson to assign
                                   </div>
                                 )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Real-time Sync Active</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={closeCurriculumModal}
                    className="px-6 py-3 rounded-2xl font-bold text-xs text-slate-500 hover:bg-slate-200 transition-all"
                  >
                    Discard Changes
                  </button>
                  <button 
                    onClick={saveCurriculum}
                    disabled={isUpdatingCurriculum}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs shadow-xl shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >
                    {isUpdatingCurriculum ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />} 
                    {isUpdatingCurriculum ? 'Saving Curriculum...' : 'Publish Curriculum'}
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setDeleteModal({ isOpen: false, courseId: null, isMultiple: false })}></div>
          
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 border border-red-100">
                <Trash2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Delete confirm</h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                {deleteModal.isMultiple 
                  ? `Are you sure you want to remove all ${selectedCourses.length} selected courses?` 
                  : `Are you sure you want to remove this course from the catalog?`}
              </p>
            </div>
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, courseId: null, isMultiple: false })} 
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all text-xs cursor-pointer"
              >
                Discard
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/10 text-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRIVE SETTINGS / HELP MODAL */}
      <AnimatePresence>
        {isDriveSettingsOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setIsDriveSettingsOpen(false)}></div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand/10 text-brand rounded-xl">
                    <Video size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none">Cloud Connectivity</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Google Drive Integration Setup</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDriveSettingsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-8">
                 {/* Connection Status */}
                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connection Status</span>
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isDriveMock ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {isDriveMock ? 'Using Mock Library' : 'Live Connection'}
                       </span>
                    </div>
                    <div className="space-y-4">
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Service Account Email</p>
                          <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl group">
                             <input 
                               readOnly 
                               value="spark-trainings-drive@spark-trainings-lms.iam.gserviceaccount.com" 
                               className="flex-1 bg-transparent border-none text-[11px] font-bold text-slate-700 outline-none"
                             />
                             <button 
                               onClick={() => {
                                 navigator.clipboard.writeText("spark-trainings-drive@spark-trainings-lms.iam.gserviceaccount.com");
                                 alert("Email copied!");
                               }}
                               className="px-3 py-1.5 bg-brand text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer"
                             >
                               Copy
                             </button>
                          </div>
                          <p className="text-[9px] text-slate-400 mt-2 italic font-medium">Share your Drive folders/files with this email to see them here.</p>
                       </div>
                    </div>
                 </div>

                 {/* Step by Step Guide */}
                 <div className="space-y-6">
                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Setup Instructions</h3>
                    
                    <div className="flex gap-4">
                       <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                       <div>
                          <p className="text-sm font-bold text-slate-800 mb-1">Share your Content</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Go to your Google Drive, right-click the folder containing your lectures, and share it with the service account email above.</p>
                       </div>
                    </div>

                    <div className="flex gap-4">
                       <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                       <div>
                          <p className="text-sm font-bold text-slate-800 mb-1">Check Permissions</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Make sure the shared files are NOT in a restricted "shortcut" format. Real files or folders must be accessible by the service account.</p>
                       </div>
                    </div>

                    <div className="flex gap-4 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl">
                       <AlertCircle size={18} className="text-blue-500 shrink-0" />
                       <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                          <strong>Note:</strong> It might take a minute for new shared files to appear in the inventory. Click <strong>Publish Curriculum</strong> to save any assignments you make.
                       </p>
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                 <button 
                   onClick={() => setIsDriveSettingsOpen(false)}
                   className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs shadow-xl shadow-slate-900/20 transition-all hover:scale-[1.02] cursor-pointer"
                 >
                   I've Shared My Files
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminCourses;

