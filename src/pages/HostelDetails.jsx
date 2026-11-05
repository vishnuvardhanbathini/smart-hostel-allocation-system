import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import {
  Hotel,
  Building,
  Bed,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  Wifi,
  Sparkles,
  ArrowRight,
  Shield,
  Layers
} from 'lucide-react';

export default function HostelDetails() {
  const { id } = useParams();
  const { getHostelById, getRoomsByHostelId, getWardenById, getWardens } = useDatabase();
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [floorFilter, setFloorFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const hostel = getHostelById(Number(id));

  if (!hostel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">
        <h2 className="text-2xl font-bold">Hostel Not Found</h2>
        <p className="text-slate-400 mt-2">The selected residence hall could not be found.</p>
        <Link to="/" className="inline-block mt-4 text-cyan-400 font-bold hover:underline">
          &larr; Back to Hostels Directory
        </Link>
      </div>
    );
  }

  const allRooms = getRoomsByHostelId(hostel.id);
  const wardens = getWardens();
  const warden = wardens.find(w => w.hostel_id === hostel.id) || (hostel.warden_id ? getWardenById(hostel.warden_id) : null);

  const totalCapacity = allRooms.reduce((sum, r) => sum + r.capacity, 0);
  const totalOccupied = allRooms.reduce((sum, r) => sum + r.occupied_beds, 0);
  const totalAvailable = totalCapacity - totalOccupied;
  const occupancyPercentage = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  // Filtered rooms
  const filteredRooms = allRooms.filter(r => {
    const matchFloor = floorFilter === 'All' || r.floor === Number(floorFilter);
    const matchType = typeFilter === 'All' || r.room_type === typeFilter;
    return matchFloor && matchType;
  });

  return (
    <div className="bg-navy-950 text-white min-h-screen pb-20">
      
      {/* Banner & Hero Header */}
      <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-navy-900 border-b border-navy-800">
        <img
          src={hostel.image_url}
          alt={hostel.name}
          className="w-full h-full object-cover object-center brightness-75"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent"></div>

        <div className="absolute bottom-6 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  hostel.hostel_type === 'Boys' ? 'bg-blue-600 text-white' : 'bg-pink-600 text-white'
                }`}>
                  {hostel.hostel_type} Residence
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-navy-900/80 backdrop-blur-md text-cyan-300 border border-navy-700">
                  {hostel.code || 'Campus Hostel'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {hostel.name}
              </h1>
            </div>

            {/* Apply Button */}
            <div>
              {user && role === 'student' ? (
                <Link
                  to={`/student/apply?hostel_id=${hostel.id}`}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Apply for this Hostel</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/login?role=student"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all"
                >
                  <span>Sign in as Student to Apply</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details & Rooms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-cyan-400" />
                <span>Residence Overview</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {hostel.description}
              </p>

              {/* Facilities tags */}
              <div className="pt-3 border-t border-navy-800">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Facilities & Amenities
                </div>
                <div className="flex flex-wrap gap-2">
                  {hostel.facilities.split(',').map((fac, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-navy-800 border border-navy-700 text-xs font-medium text-slate-200 flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{fac.trim()}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Inventory & Interactive Grid */}
            <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Bed className="w-5 h-5 text-cyan-400" />
                    <span>Room Availability & Inventory</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Showing {filteredRooms.length} of {allRooms.length} rooms
                  </p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                  <select
                    value={floorFilter}
                    onChange={(e) => setFloorFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-navy-950 border border-navy-700 text-xs text-slate-200 outline-none"
                  >
                    <option value="All">All Floors</option>
                    {[...new Set(allRooms.map(r => r.floor))].sort().map(f => (
                      <option key={f} value={f}>Floor {f}</option>
                    ))}
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-navy-950 border border-navy-700 text-xs text-slate-200 outline-none"
                  >
                    <option value="All">All Types</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                  </select>
                </div>
              </div>

              {/* Rooms Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredRooms.map(room => {
                  const available = room.capacity - room.occupied_beds;
                  let badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
                  if (room.status === 'Full') badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
                  else if (room.status === 'Partially Occupied') badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
                  else if (room.status === 'Maintenance') badgeColor = 'bg-slate-700 text-slate-400 border-slate-600';

                  return (
                    <div
                      key={room.id}
                      className="p-3.5 rounded-2xl bg-navy-950 border border-navy-800 hover:border-cyan-500/40 transition flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-white">{room.room_number}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                          {room.status}
                        </span>
                      </div>

                      <div className="my-2 space-y-1 text-xs text-slate-400">
                        <div>Floor {room.floor} &bull; {room.room_type} Room</div>
                        <div className="text-[11px] text-cyan-400 font-semibold">
                          ₹{room.price_per_semester?.toLocaleString()} / sem
                        </div>
                      </div>

                      <div className="pt-2 border-t border-navy-800 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Beds:</span>
                        <span className="font-bold text-white">
                          {room.occupied_beds} / {room.capacity} ({available} free)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Statistics & Warden Contact */}
          <div className="space-y-6">
            
            {/* Occupancy Stats Card */}
            <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-4">
              <h3 className="font-bold text-base text-white">Capacity & Occupancy</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Occupancy Rate</span>
                  <span className="text-cyan-400">{occupancyPercentage}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-navy-950 overflow-hidden border border-navy-700">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-700"
                    style={{ width: `${occupancyPercentage}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="p-2 rounded-xl bg-navy-950 border border-navy-800">
                    <div className="text-lg font-black text-white">{totalCapacity}</div>
                    <div className="text-[10px] text-slate-400">Total Beds</div>
                  </div>
                  <div className="p-2 rounded-xl bg-navy-950 border border-navy-800">
                    <div className="text-lg font-black text-rose-400">{totalOccupied}</div>
                    <div className="text-[10px] text-slate-400">Occupied</div>
                  </div>
                  <div className="p-2 rounded-xl bg-navy-950 border border-navy-800">
                    <div className="text-lg font-black text-emerald-400">{totalAvailable}</div>
                    <div className="text-[10px] text-slate-400">Available</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warden In-Charge Card */}
            <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">Warden In-Charge</h3>
              </div>

              {warden ? (
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-navy-950 border border-navy-800">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{warden.full_name}</div>
                      <div className="text-[11px] text-slate-400">Warden ID: {warden.warden_id}</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{warden.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{warden.email}</span>
                    </div>
                    {warden.office_location && (
                      <div className="flex items-start gap-2 text-slate-400">
                        <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{warden.office_location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 py-3">
                  Resident warden contact information is coordinated via Central Housing Office.
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
