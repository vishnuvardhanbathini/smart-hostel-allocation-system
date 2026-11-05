import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import { Building, Plus, Edit, Trash2, X, CheckCircle, Bed, User, Shield } from 'lucide-react';

export default function ManageHostels() {
  const { getHostels, getRooms, getWardens, createHostel, updateHostel, deleteHostel } = useDatabase();
  const { addToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    hostel_type: 'Boys',
    total_floors: 3,
    description: '',
    facilities: '',
    image_url: ''
  });

  const hostels = getHostels();
  const rooms = getRooms();
  const wardens = getWardens();

  const handleOpenAdd = () => {
    setEditingHostel(null);
    setFormData({
      name: '',
      code: '',
      hostel_type: 'Boys',
      total_floors: 3,
      description: '',
      facilities: 'High-Speed Wi-Fi, Study Lounge, Dining Hall',
      image_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (hostel) => {
    setEditingHostel(hostel);
    setFormData({ ...hostel });
    setModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete hostel "${name}"? This cannot be undone.`)) {
      try {
        deleteHostel(id);
        addToast(`Hostel "${name}" deleted.`, 'info');
      } catch (err) {
        addToast(err.message, 'danger');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Hostel name is required.', 'warning');
      return;
    }

    if (editingHostel) {
      updateHostel(editingHostel.id, formData);
      addToast(`Hostel "${formData.name}" updated!`, 'success');
    } else {
      createHostel(formData);
      addToast(`Hostel "${formData.name}" created!`, 'success');
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Building className="w-6 h-6 text-cyan-400" />
            <span>Manage Campus Hostels</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Hostel facilities, capacities, floors, and warden assignments
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4 text-navy-950" />
          <span>Add New Hostel</span>
        </button>
      </div>

      {/* Hostels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hostels.map(hostel => {
          const hostelRooms = rooms.filter(r => r.hostel_id === hostel.id);
          const capacity = hostelRooms.reduce((sum, r) => sum + r.capacity, 0);
          const occupied = hostelRooms.reduce((sum, r) => sum + r.occupied_beds, 0);
          const warden = wardens.find(w => w.hostel_id === hostel.id);

          return (
            <div
              key={hostel.id}
              className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        hostel.hostel_type === 'Boys' ? 'bg-blue-500/20 text-blue-300' : 'bg-pink-500/20 text-pink-300'
                      }`}>
                        {hostel.hostel_type}
                      </span>
                      <span className="text-xs font-mono text-cyan-400">{hostel.code || 'ID: ' + hostel.id}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">{hostel.name}</h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(hostel)}
                      title="Edit Hostel"
                      className="p-2 rounded-xl bg-navy-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(hostel.id, hostel.name)}
                      title="Delete Hostel"
                      className="p-2 rounded-xl bg-navy-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {hostel.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 my-4 text-center">
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                    <div className="text-base font-extrabold text-white">{hostel.total_floors}</div>
                    <div className="text-[10px] text-slate-400">Floors</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                    <div className="text-base font-extrabold text-white">{hostelRooms.length}</div>
                    <div className="text-[10px] text-slate-400">Rooms</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                    <div className="text-base font-extrabold text-cyan-400">{capacity - occupied} / {capacity}</div>
                    <div className="text-[10px] text-slate-400">Beds Free</div>
                  </div>
                </div>

                {/* Warden In-Charge */}
                <div className="p-3 rounded-xl bg-navy-950 border border-navy-800/80 text-xs flex items-center justify-between">
                  <span className="text-slate-400">Assigned Warden:</span>
                  <span className="font-semibold text-white">
                    {warden?.full_name || 'Central Housing Cell'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <h3 className="text-base font-bold text-white">
                {editingHostel ? 'Edit Hostel Facility' : 'Add New Hostel'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Hostel Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. SR University Boys Hostel BH-05"
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="BH-05"
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Hostel Type</label>
                  <select
                    value={formData.hostel_type}
                    onChange={(e) => setFormData({ ...formData, hostel_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Total Floors</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.total_floors}
                    onChange={(e) => setFormData({ ...formData, total_floors: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Hostel description..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Facilities (comma-separated)</label>
                <input
                  type="text"
                  value={formData.facilities}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                  placeholder="Wi-Fi, Study Lounge, Gym, Dining Hall"
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Image path or URL"
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                />
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold"
                >
                  {editingHostel ? 'Save Changes' : 'Create Hostel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
