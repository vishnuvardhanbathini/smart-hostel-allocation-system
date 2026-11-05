import { db } from './db.js';

export const allocationEngine = {
  runSmartAllocation: () => {
    const applications = db.getApplications().filter(a => a.status === 'Approved');
    const hostels = db.getHostels();
    const rooms = db.getRooms();
    const students = db.getStudents();
    const activeAllocations = db.getAllocations().filter(a => a.status === 'Active');

    // Determine students who already have an active allocation
    const allocatedStudentIds = new Set(activeAllocations.map(a => a.student_id));

    // Filter applications for students without an active room
    const eligibleApps = applications.filter(a => !allocatedStudentIds.has(a.student_id));

    // Sort by Merit Score: (CGPA * 0.6) + (min(Distance / 100, 10) * 0.4)
    eligibleApps.sort((a, b) => {
      const scoreA = (a.academic_score * 0.6) + (Math.min(a.distance_from_home_km / 100, 10) * 0.4);
      const scoreB = (b.academic_score * 0.6) + (Math.min(b.distance_from_home_km / 100, 10) * 0.4);
      return scoreB - scoreA; // Highest score first
    });

    const results = {
      totalProcessed: eligibleApps.length,
      allocatedCount: 0,
      unallocatedCount: 0,
      details: []
    };

    eligibleApps.forEach(app => {
      const student = students.find(s => s.id === app.student_id);
      if (!student) {
        results.unallocatedCount++;
        results.details.push({
          studentName: 'Unknown',
          status: 'Failed',
          reason: 'Student profile missing'
        });
        return;
      }

      // 1. Gender Match: Identify eligible hostels
      // Boys must go to Boys hostel; Girls to Girls hostel
      const eligibleHostels = hostels.filter(h => {
        if (student.gender === 'Male') {
          return h.hostel_type === 'Boys';
        } else {
          return h.hostel_type === 'Girls';
        }
      });

      // Prefer the student's selected preferred_hostel_id if gender matches, else fallback to other matching hostels
      let targetHostel = eligibleHostels.find(h => h.id === app.preferred_hostel_id) || eligibleHostels[0];

      if (!targetHostel) {
        results.unallocatedCount++;
        results.details.push({
          studentName: student.full_name,
          status: 'Unallocated',
          reason: `No eligible ${student.gender} hostel found`
        });
        return;
      }

      // 2. Find Available Room in Target Hostel
      // First try matching student's preferred room type, then fallback to any available room
      let availableRooms = db.getRoomsByHostelId(targetHostel.id)
        .filter(r => r.status !== 'Maintenance' && (r.capacity - r.occupied_beds) > 0);

      let matchedRoom = availableRooms.find(r => r.room_type.toLowerCase() === (app.preferred_room_type || '').toLowerCase())
        || availableRooms[0];

      // If preferred hostel is full, check alternate eligible hostels
      if (!matchedRoom) {
        for (const altHostel of eligibleHostels) {
          if (altHostel.id !== targetHostel.id) {
            const altAvailable = db.getRoomsByHostelId(altHostel.id)
              .filter(r => r.status !== 'Maintenance' && (r.capacity - r.occupied_beds) > 0);
            if (altAvailable.length > 0) {
              matchedRoom = altAvailable[0];
              targetHostel = altHostel;
              break;
            }
          }
        }
      }

      if (!matchedRoom) {
        results.unallocatedCount++;
        results.details.push({
          studentName: student.full_name,
          status: 'Waitlist',
          reason: `All rooms at full capacity in ${targetHostel.name}`
        });
        return;
      }

      // 3. Perform Allocation
      const bedNumber = `Bed-${matchedRoom.occupied_beds + 1}`;
      db.createAllocation({
        student_id: student.id,
        room_id: matchedRoom.id,
        hostel_id: targetHostel.id,
        bed_number: bedNumber,
        academic_year: '2024-2025'
      });

      // 4. Update Application status
      db.updateApplication(app.id, {
        status: 'Allocated',
        admin_remarks: `Allocated to ${targetHostel.name}, Room ${matchedRoom.room_number} (${bedNumber}) via Smart Allocation Engine.`
      });

      // 5. Notify Student
      if (student.user_id) {
        db.createNotification({
          user_id: student.user_id,
          title: 'Room Allocated!',
          message: `Congratulations! You have been allocated to ${targetHostel.name}, Room ${matchedRoom.room_number} (${bedNumber}).`,
          type: 'success',
          link: '/student/room-details'
        });
      }

      results.allocatedCount++;
      results.details.push({
        studentName: student.full_name,
        hostelName: targetHostel.name,
        roomNumber: matchedRoom.room_number,
        bedNumber: bedNumber,
        status: 'Allocated'
      });
    });

    return results;
  }
};
