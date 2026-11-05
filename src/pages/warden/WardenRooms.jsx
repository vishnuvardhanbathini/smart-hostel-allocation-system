import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import { Bed, Wrench, CheckCircle } from 'lucide-react';

export default function WardenRooms() {
  const { profile } = useAuth();
  const { getHostels, getRooms, updateRoom } = useDatabase();
  const { addToast } = useToast();

  const hostels = getHostels();
  const allRooms = getRooms();

  const assignedHostel = hostels.find(h => h.id === profile?.hostel_id) || hostels[0];
  const rooms = allRooms.filter(r => r.hostel_id === assignedHostel.id);

  const toggleMaintenance = (room) => {
    const newStatus = room.status === 'Maintenance' ? (room.occupied_beds > 0 ? 'Partially Occupied' : 'Available') : 'Maintenance';
    updateRoom(room.id, { status: newStatus });
    addToast(`Room ${room.room_number} status changed to ${newStatus}.`, 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Bed className="w-6 h-6 text-cyan-400" />
          <span>{assignedHostel.name} &bull; Room Status</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor bed occupancy and set maintenance flags for individual rooms
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rooms.map(room => {
          let badge = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
          if (room.status === 'Full') badge = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
          else if (room.status === 'Partially Occupied') badge = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
          else if (room.status === 'Maintenance') badge = 'bg-slate-700 text-slate-400 border-slate-600';

          return (
            <div
              key={room.id}
              className="p-5 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-extrabold text-white">{room.room_number}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge}`}>
                    {room.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Floor {room.floor} &bull; {room.room_type} Room
                </div>
                <div className="text-xs text-slate-300 font-semibold mt-2">
                  Occupancy: {room.occupied_beds} / {room.capacity} Beds
                </div>
              </div>

              <div className="pt-3 border-t border-navy-800 flex justify-between items-center">
                <span className="text-[11px] text-cyan-400 font-mono">₹{room.price_per_semester}/sem</span>
                <button
                  onClick={() => toggleMaintenance(room)}
                  className="px-2.5 py-1 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white border border-navy-700 text-[10px] font-semibold flex items-center gap-1 transition"
                >
                  <Wrench className="w-3 h-3 text-cyan-400" />
                  <span>{room.status === 'Maintenance' ? 'Reopen' : 'Maintenance'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
