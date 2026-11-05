import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import { Megaphone, Plus, Trash2, X, Tag } from 'lucide-react';

export default function AdminNotices() {
  const { getNotices, createNotice, deleteNotice } = useDatabase();
  const { addToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    target_audience: 'All',
    author: 'System Administrator'
  });

  const notices = getNotices();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      addToast('Title and content are required.', 'warning');
      return;
    }

    createNotice(formData);
    addToast('Notice published successfully!', 'success');
    setFormData({
      title: '',
      content: '',
      category: 'General',
      target_audience: 'All',
      author: 'System Administrator'
    });
    setModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete notice "${title}"?`)) {
      deleteNotice(id);
      addToast('Notice removed.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-cyan-400" />
            <span>Campus Residence Notice Board</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Broadcast official circulars, curfew reminders, and event bulletins to students
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4 text-navy-950" />
          <span>Publish New Notice</span>
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map(notice => {
          let catBadge = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
          if (notice.category === 'Urgent') catBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
          else if (notice.category === 'Maintenance') catBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
          else if (notice.category === 'Event') catBadge = 'bg-purple-500/20 text-purple-300 border-purple-500/30';

          return (
            <div
              key={notice.id}
              className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${catBadge}`}>
                    {notice.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-navy-950 border border-navy-700 text-[10px] font-semibold text-slate-300">
                    Audience: {notice.target_audience}
                  </span>
                  <h3 className="font-bold text-base text-white">{notice.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">
                    {notice.created_at ? new Date(notice.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                  <button
                    onClick={() => handleDelete(notice.id, notice.title)}
                    title="Delete Notice"
                    className="p-1.5 rounded-lg bg-navy-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {notice.content}
              </p>

              <div className="pt-2 border-t border-navy-800/80 text-[11px] text-slate-400">
                Posted by <strong className="text-white">{notice.author || 'Admin Office'}</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Publish Notice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-3xl max-w-md w-full p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <h3 className="text-base font-bold text-white">Publish Notice</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Notice Headline *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Curfew Timings & Biometric In-time"
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="General">General</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Target Audience</label>
                  <select
                    value={formData.target_audience}
                    onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="All">All Students</option>
                    <option value="Boys Hostel">Boys Hostels Only</option>
                    <option value="Girls Hostel">Girls Hostels Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Notice Content *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Type the full announcement content..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:bg-navy-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-navy-950 font-bold"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
