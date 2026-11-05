import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Users, Phone, Mail, Search } from 'lucide-react';

export default function WardenStudents() {
  const { profile } = useAuth();
  const { getHostels, getRooms, getStudents, getAllocations } = useDatabase();
  const [searchTerm, setSearchTerm] = useState('');

  const hostels = getHostels();
  const assignedHostel = hostels.find(h => h.id === profile?.hostel_id) || hostels[0];
  const rooms = getRooms().filter(r => r.hostel_id === assignedHostel.id);
  const students = getStudents();
  const allocations = getAllocations().filter(a => a.hostel_id === assignedHostel.id && a.status === 'Active');

  const filtered = allocations.filter(alloc => {
    const student = students.find(s => s.id === alloc.student_id);
    const room = rooms.find(r => r.id === alloc.room_id);
    const search = searchTerm.toLowerCase();
    return (
      (student?.full_name || '').toLowerCase().includes(search) ||
      (student?.student_id || '').toLowerCase().includes(search) ||
      (room?.room_number || '').toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <span>Resident Students &bull; {assignedHostel.name}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Total of {allocations.length} resident students currently allocated
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search student or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-navy-900 border border-navy-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider border-b border-navy-800">
              <tr>
                <th className="py-3 px-4">Room & Bed</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Student Phone</th>
                <th className="py-3 px-4">Parent Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No resident students match the search.
                  </td>
                </tr>
              ) : (
                filtered.map(alloc => {
                  const student = students.find(s => s.id === alloc.student_id);
                  const room = rooms.find(r => r.id === alloc.room_id);

                  return (
                    <tr key={alloc.id} className="hover:bg-navy-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                        {room?.room_number} ({alloc.bed_number})
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {student?.full_name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {student?.student_id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {student?.department}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-cyan-400" />
                          <span>{student?.phone}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div>{student?.parent_name}</div>
                        <div className="text-[10px] text-slate-400">{student?.parent_phone}</div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
