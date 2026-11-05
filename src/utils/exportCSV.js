export function downloadCSV(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportStudentsCSV(students) {
  const headers = ['ID', 'Student ID', 'Full Name', 'Email', 'Phone', 'Gender', 'Department', 'Year of Study', 'Parent Name', 'Parent Phone', 'Address'];
  const rows = students.map(s => [
    s.id,
    `"${s.student_id}"`,
    `"${s.full_name}"`,
    `"${s.email}"`,
    `"${s.phone}"`,
    s.gender,
    `"${s.department}"`,
    s.year_of_study,
    `"${s.parent_name || ''}"`,
    `"${s.parent_phone || ''}"`,
    `"${(s.address || '').replace(/"/g, '""')}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`Students_Directory_${new Date().toISOString().slice(0, 10)}.csv`, csv);
}

export function exportAllocationsCSV(allocations, students, hostels, rooms) {
  const headers = ['Allocation ID', 'Student Name', 'Student ID', 'Hostel Name', 'Room Number', 'Bed Number', 'Status', 'Allocated Date'];
  const rows = allocations.map(a => {
    const student = students.find(s => s.id === a.student_id) || {};
    const hostel = hostels.find(h => h.id === a.hostel_id) || {};
    const room = rooms.find(r => r.id === a.room_id) || {};
    return [
      a.id,
      `"${student.full_name || 'N/A'}"`,
      `"${student.student_id || 'N/A'}"`,
      `"${hostel.name || 'N/A'}"`,
      `"${room.room_number || 'N/A'}"`,
      `"${a.bed_number || 'N/A'}"`,
      a.status,
      a.allocated_date ? a.allocated_date.slice(0, 10) : 'N/A'
    ];
  });

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`Hostel_Allocations_${new Date().toISOString().slice(0, 10)}.csv`, csv);
}

export function exportRoomsCSV(rooms, hostels) {
  const headers = ['Room ID', 'Hostel', 'Room Number', 'Floor', 'Type', 'Capacity', 'Occupied Beds', 'Available Beds', 'Status', 'Semester Price (INR)'];
  const rows = rooms.map(r => {
    const hostel = hostels.find(h => h.id === r.hostel_id) || {};
    return [
      r.id,
      `"${hostel.name || 'N/A'}"`,
      `"${r.room_number}"`,
      r.floor,
      r.room_type,
      r.capacity,
      r.occupied_beds,
      r.capacity - r.occupied_beds,
      r.status,
      r.price_per_semester
    ];
  });

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`Room_Inventory_${new Date().toISOString().slice(0, 10)}.csv`, csv);
}
