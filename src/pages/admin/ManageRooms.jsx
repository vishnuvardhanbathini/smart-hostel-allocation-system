import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import { exportRoomsCSV } from '../../utils/exportCSV';
import { Bed, Plus, Edit, Trash2, Search, Download, X } from 'lucide-react';

export default function ManageRooms() {
  const { getRooms, getHostels, createRoom, updateRoom, deleteRoom } = useDatabase();
  const { addToast } = useToast();

  const [hostelFilter, setHostelFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [formData, setFormData] = useState({
    hostel_id: 1,
    room_number: '',
    floor: 1,
    room_type: 'Double',
    capacity: 2,
    occupied_beds: 0,
    price_per_semester: 18000,
    facilities: 'Attached Bath, Study Desk, Balcony',
    status: 'Available'
  });

  const rooms = getRooms();
  const hostels = getHostels();

  const filteredRooms = rooms.filter(r => {
    const matchHostel = hostelFilter === 'All' || r.hostel_id === Number(hostelFilter);
    const matchType = typeFilter === 'All' || r.room_type === typeFilter;
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchHostel && matchType && matchStatus;
  });

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      hostel_id: hostels[0]?.id || 1,
      room_number: '',
      floor: 1,
      room_type: 'Double',
      capacity: 2,
      occupied_beds: 0,
      price_per_semester: 18000,
      facilities: 'Attached Bath, Study Desk, Balcony',
      status: 'Available'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setFormData({ ...room });
    setModalOpen(true);
  };

  const handleDelete = (id, number) => {
    if (window.confirm(`Are you sure you want to delete room "${number}"?`)) {
      try {
        deleteRoom(id);
        addToast(`Room "${number}" deleted.`, 'info');
      } catch (err) {
        addToast(err.message, 'danger');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.room_number.trim()) {
      addToast('Room number is required.', 'warning');
      return;
    }

    if (editingRoom) {
      updateRoom(editingRoom.id, formData);
      addToast(`Room "${formData.room_number}" updated!`, 'success');
    } else {
      createRoom(formData);
      addToast(`Room "${formData.room_number}" added!`, 'success');
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Bed className="w-6 h-6 text-cyan-400" />
            <span>Manage Hostel Rooms</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Total of {rooms.length} rooms configured across campus hostels
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportRoomsCSV(rooms, hostels)}
            className="px-3.5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4 text-navy-950" />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-navy-900 border border-navy-800 flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Hostel:</span>
            <select
              value={hostelFilter}
              onChange={(e) => setHostelFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none"
            >
              <option value="All">All Hostels</option>
              {hostels.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none"
            >
              <option value="All">All Types</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Partially Occupied">Partially Occupied</option>
              <option value="Full">Full</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <span className="text-slate-400 font-medium">
          Showing {filteredRooms.length} room(s)
        </span>
      </div>

      {/* Rooms Table */}
      <div className="rounded-3xl bg-navy-900 border border-navy-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider border-b border-navy-800">
              <tr>
                <th className="py-3 px-4">Room No</th>
                <th className="py-3 px-4">Hostel</th>
                <th className="py-3 px-4">Floor</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Bed Capacity</th>
                <th className="py-3 px-4">Price / Sem</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {filteredRooms.map(room => {
                const hostel = hostels.find(h => h.id === room.hostel_id);
                let badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
                if (room.status === 'Full') badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
                else if (room.status === 'Partially Occupied') badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
                else if (room.status === 'Maintenance') badgeColor = 'bg-slate-700 text-slate-400 border-slate-600';

                return (
                  <tr key={room.id} className="hover:bg-navy-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {room.room_number}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {hostel?.name || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      Floor {room.floor}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold">
                      {room.room_type}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="font-bold text-cyan-400">{room.occupied_beds}</span> / {room.capacity} occupied
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      ₹{room.price_per_semester?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeColor}`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(room)}
                          title="Edit Room"
                          className="p-1.5 rounded-lg bg-navy-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(room.id, room.room_number)}
                          title="Delete Room"
                          className="p-1.5 rounded-lg bg-navy-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-3xl max-w-md w-full p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <h3 className="text-base font-bold text-white">
                {editingRoom ? 'Edit Room Configuration' : 'Add New Room'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Hostel *</label>
                <select
                  value={formData.hostel_id}
                  onChange={(e) => setFormData({ ...formData, hostel_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                >
                  {hostels.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.room_number}
                    onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                    placeholder="e.g. BH-105"
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Floor Level</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Room Type</label>
                  <select
                    value={formData.room_type}
                    onChange={(e) => {
                      const type = e.target.value;
                      let cap = 2;
                      if (type === 'Single') cap = 1;
                      else if (type === 'Triple') cap = 3;
                      setFormData({ ...formData, room_type: type, capacity: cap });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Single">Single (1 Bed)</option>
                    <option value="Double">Double (2 Beds)</option>
                    <option value="Triple">Triple (3 Beds)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Price / Semester (INR)</label>
                  <input
                    type="number"
                    value={formData.price_per_semester}
                    onChange={(e) => setFormData({ ...formData, price_per_semester: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                >
                  <option value="Available">Available</option>
                  <option value="Partially Occupied">Partially Occupied</option>
                  <option value="Full">Full</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
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
                  {editingRoom ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
