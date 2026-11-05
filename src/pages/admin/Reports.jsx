import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { exportStudentsCSV, exportAllocationsCSV, exportRoomsCSV } from '../../utils/exportCSV';
import { BarChart3, Download, FileSpreadsheet, Building, Users, Bed, CheckCircle } from 'lucide-react';

export default function Reports() {
  const { getStudents, getHostels, getRooms, getAllocations, getApplications } = useDatabase();

  const students = getStudents();
  const hostels = getHostels();
  const rooms = getRooms();
  const allocations = getAllocations().filter(a => a.status === 'Active');
  const applications = getApplications();

  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + r.occupied_beds, 0);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          <span>Analytics & Institutional Reports</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Export verified university reports and view residential capacity analytics
        </p>
      </div>

      {/* CSV Export Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Students CSV */}
        <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Students Directory Report</h3>
            <p className="text-xs text-slate-400">
              Complete CSV containing student names, IDs, departments, phone numbers, parents, and addresses.
            </p>
          </div>
          <button
            onClick={() => exportStudentsCSV(students)}
            className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-cyan-400 border border-navy-700 text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Students.csv ({students.length})</span>
          </button>
        </div>

        {/* Allocations CSV */}
        <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Room Allocations Report</h3>
            <p className="text-xs text-slate-400">
              Active bed assignments, room numbers, hostel names, academic year, and student identifiers.
            </p>
          </div>
          <button
            onClick={() => exportAllocationsCSV(allocations, students, hostels, rooms)}
            className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-cyan-400 border border-navy-700 text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Allocations.csv ({allocations.length})</span>
          </button>
        </div>

        {/* Room Inventory CSV */}
        <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bed className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Room Inventory Audit</h3>
            <p className="text-xs text-slate-400">
              Detailed list of all 29 rooms, floors, capacities, occupied vs available beds, and semester fees.
            </p>
          </div>
          <button
            onClick={() => exportRoomsCSV(rooms, hostels)}
            className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-cyan-400 border border-navy-700 text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Inventory.csv ({rooms.length})</span>
          </button>
        </div>

      </div>

      {/* Hostel Capacity Comparison Visuals */}
      <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Building className="w-5 h-5 text-cyan-400" />
          <span>Residences Capacity & Occupancy Breakdown</span>
        </h2>

        <div className="space-y-6">
          {hostels.map(hostel => {
            const hRooms = rooms.filter(r => r.hostel_id === hostel.id);
            const cap = hRooms.reduce((sum, r) => sum + r.capacity, 0);
            const occ = hRooms.reduce((sum, r) => sum + r.occupied_beds, 0);
            const pct = cap > 0 ? Math.round((occ / cap) * 100) : 0;

            return (
              <div key={hostel.id} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{hostel.name}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">({hostel.hostel_type})</span>
                  </div>
                  <div className="text-slate-400">
                    <strong className="text-white">{occ}</strong> of {cap} beds occupied &bull; <strong className="text-cyan-400">{pct}%</strong>
                  </div>
                </div>

                <div className="w-full h-3 rounded-full bg-navy-950 overflow-hidden border border-navy-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
