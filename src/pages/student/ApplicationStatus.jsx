import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { FileCheck, CheckCircle2, Clock, XCircle, ArrowRight, Building, Bed } from 'lucide-react';

export default function ApplicationStatus() {
  const { profile } = useAuth();
  const { getApplicationsByStudentId, getHostels, getActiveAllocationForStudent } = useDatabase();

  const student = profile;
  const applications = student ? getApplicationsByStudentId(student.id) : [];
  const latestApp = applications[applications.length - 1];
  const hostels = getHostels();
  const allocation = student ? getActiveAllocationForStudent(student.id) : null;

  if (!latestApp) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-navy-900 border border-navy-800 text-center space-y-4">
        <Clock className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Application Found</h2>
        <p className="text-xs text-slate-400">
          You haven't submitted a hostel application for the current semester.
        </p>
        <Link
          to="/student/apply"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-navy-950 font-bold text-xs"
        >
          <span>Apply for Hostel</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const hostel = hostels.find(h => h.id === latestApp.preferred_hostel_id);

  const getStepStatus = (stepIndex) => {
    // 0: Submitted, 1: Review, 2: Approved, 3: Allocated
    if (latestApp.status === 'Rejected') {
      return stepIndex === 0 ? 'completed' : (stepIndex === 1 ? 'rejected' : 'upcoming');
    }
    if (latestApp.status === 'Pending') {
      return stepIndex === 0 ? 'completed' : (stepIndex === 1 ? 'current' : 'upcoming');
    }
    if (latestApp.status === 'Approved') {
      return stepIndex <= 2 ? 'completed' : 'current';
    }
    if (latestApp.status === 'Allocated') {
      return 'completed';
    }
    return 'upcoming';
  };

  const steps = [
    { title: 'Application Submitted', desc: `Logged on ${latestApp.applied_at ? new Date(latestApp.applied_at).toLocaleDateString() : 'N/A'}` },
    { title: 'Under Academic Review', desc: 'Admin office verifying CGPA and distance credentials' },
    { title: 'Application Approved', desc: 'Cleared for smart automated room allotment' },
    { title: 'Room Allocated', desc: 'Bed number and residence hall assigned' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-cyan-400" />
          <span>Application Progress Timeline</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Tracking live status of application #{latestApp.id}
        </p>
      </div>

      {/* Progress Timeline Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-8">
        
        {/* Step indicator */}
        <div className="space-y-6">
          {steps.map((st, idx) => {
            const state = getStepStatus(idx);
            let icon = <div className="w-6 h-6 rounded-full border-2 border-slate-700 bg-navy-950 flex items-center justify-center text-[10px] font-bold text-slate-500">{idx + 1}</div>;
            let textClass = 'text-slate-500';

            if (state === 'completed') {
              icon = <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />;
              textClass = 'text-white';
            } else if (state === 'current') {
              icon = <Clock className="w-6 h-6 text-cyan-400 shrink-0 animate-pulse" />;
              textClass = 'text-cyan-400 font-bold';
            } else if (state === 'rejected') {
              icon = <XCircle className="w-6 h-6 text-rose-400 shrink-0" />;
              textClass = 'text-rose-400 font-bold';
            }

            return (
              <div key={idx} className="flex items-start gap-4 relative">
                {icon}
                <div className="space-y-0.5">
                  <div className={`text-sm font-bold ${textClass}`}>{st.title}</div>
                  <div className="text-xs text-slate-400">{st.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Admin Remarks */}
        {latestApp.admin_remarks && (
          <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-1 text-xs">
            <span className="font-bold text-slate-400">Official Admin Notes:</span>
            <p className="text-cyan-300/90 font-medium">{latestApp.admin_remarks}</p>
          </div>
        )}

        {/* Application details breakdown */}
        <div className="pt-4 border-t border-navy-800 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-500">Preferred Residence</span>
            <div className="font-semibold text-white mt-0.5">{hostel?.name || 'Any'}</div>
          </div>
          <div>
            <span className="text-slate-500">Room Preference</span>
            <div className="font-semibold text-white mt-0.5">{latestApp.preferred_room_type} Room</div>
          </div>
          <div>
            <span className="text-slate-500">Submitted Academic Score</span>
            <div className="font-semibold text-cyan-400 mt-0.5">{latestApp.academic_score} CGPA</div>
          </div>
          <div>
            <span className="text-slate-500">Hometown Distance</span>
            <div className="font-semibold text-white mt-0.5">{latestApp.distance_from_home_km} km</div>
          </div>
        </div>

        {/* Allocation Action */}
        {latestApp.status === 'Allocated' && (
          <div className="pt-2">
            <Link
              to="/student/room-details"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <span>View Allotted Room Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
