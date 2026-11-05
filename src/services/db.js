import {
  initialUsers,
  initialHostels,
  initialWardens,
  initialRooms,
  initialStudents,
  initialAllocations,
  initialApplications,
  initialComplaints,
  initialNotices,
  initialNotifications
} from './seedData.js';

const STORAGE_PREFIX = 'smarthostel_v2_';

function getStore(key, initialData) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error reading ${key} from storage, fallback to seed:`, e);
    return initialData;
  }
}

function setStore(key, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const db = {
  resetDatabase: () => {
    localStorage.removeItem(STORAGE_PREFIX + 'users');
    localStorage.removeItem(STORAGE_PREFIX + 'hostels');
    localStorage.removeItem(STORAGE_PREFIX + 'wardens');
    localStorage.removeItem(STORAGE_PREFIX + 'rooms');
    localStorage.removeItem(STORAGE_PREFIX + 'students');
    localStorage.removeItem(STORAGE_PREFIX + 'allocations');
    localStorage.removeItem(STORAGE_PREFIX + 'applications');
    localStorage.removeItem(STORAGE_PREFIX + 'complaints');
    localStorage.removeItem(STORAGE_PREFIX + 'notices');
    localStorage.removeItem(STORAGE_PREFIX + 'notifications');
    // Re-seed
    setStore('users', initialUsers);
    setStore('hostels', initialHostels);
    setStore('wardens', initialWardens);
    setStore('rooms', initialRooms);
    setStore('students', initialStudents);
    setStore('allocations', initialAllocations);
    setStore('applications', initialApplications);
    setStore('complaints', initialComplaints);
    setStore('notices', initialNotices);
    setStore('notifications', initialNotifications);
  },

  // USERS
  getUsers: () => getStore('users', initialUsers),
  getUserById: (id) => db.getUsers().find(u => u.id === Number(id)),
  getUserByUsernameOrEmail: (term) => {
    const cleaned = (term || '').trim().toLowerCase();
    return db.getUsers().find(u =>
      u.username.toLowerCase() === cleaned || u.email.toLowerCase() === cleaned
    );
  },
  createUser: (user) => {
    const users = db.getUsers();
    const newUser = {
      ...user,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    setStore('users', users);
    return newUser;
  },

  // STUDENTS
  getStudents: () => getStore('students', initialStudents),
  getStudentById: (id) => db.getStudents().find(s => s.id === Number(id)),
  getStudentByUserId: (userId) => db.getStudents().find(s => s.user_id === Number(userId)),
  getStudentByStudentId: (sid) => db.getStudents().find(s => s.student_id.toLowerCase() === (sid || '').trim().toLowerCase()),
  createStudent: (studentData) => {
    const students = db.getStudents();
    const newStudent = {
      ...studentData,
      id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1
    };
    students.push(newStudent);
    setStore('students', students);
    return newStudent;
  },
  updateStudent: (id, updates) => {
    const students = db.getStudents().map(s => s.id === Number(id) ? { ...s, ...updates } : s);
    setStore('students', students);
    return students.find(s => s.id === Number(id));
  },
  deleteStudent: (id) => {
    const student = db.getStudentById(id);
    if (!student) return false;
    // Remove allocations, applications, complaints
    const allocations = db.getAllocations().filter(a => a.student_id !== Number(id));
    setStore('allocations', allocations);
    const applications = db.getApplications().filter(a => a.student_id !== Number(id));
    setStore('applications', applications);
    const complaints = db.getComplaints().filter(c => c.student_id !== Number(id));
    setStore('complaints', complaints);
    // Remove student record & user account
    const students = db.getStudents().filter(s => s.id !== Number(id));
    setStore('students', students);
    if (student.user_id) {
      const users = db.getUsers().filter(u => u.id !== student.user_id);
      setStore('users', users);
    }
    return true;
  },

  // WARDENS
  getWardens: () => getStore('wardens', initialWardens),
  getWardenById: (id) => db.getWardens().find(w => w.id === Number(id)),
  getWardenByUserId: (userId) => db.getWardens().find(w => w.user_id === Number(userId)),
  getWardenByHostelId: (hostelId) => db.getWardens().find(w => w.hostel_id === Number(hostelId)),

  // HOSTELS
  getHostels: () => getStore('hostels', initialHostels),
  getHostelById: (id) => db.getHostels().find(h => h.id === Number(id)),
  createHostel: (hostelData) => {
    const hostels = db.getHostels();
    const newHostel = {
      ...hostelData,
      id: hostels.length > 0 ? Math.max(...hostels.map(h => h.id)) + 1 : 1
    };
    hostels.push(newHostel);
    setStore('hostels', hostels);
    return newHostel;
  },
  updateHostel: (id, updates) => {
    const hostels = db.getHostels().map(h => h.id === Number(id) ? { ...h, ...updates } : h);
    setStore('hostels', hostels);
    return hostels.find(h => h.id === Number(id));
  },
  deleteHostel: (id) => {
    const hostel = db.getHostelById(id);
    if (!hostel) return false;
    // Check occupancy safeguard
    const activeAllocations = db.getAllocations().filter(a => a.hostel_id === Number(id) && a.status === 'Active');
    if (activeAllocations.length > 0) {
      throw new Error(`Cannot delete hostel with ${activeAllocations.length} active resident student(s). Vacate rooms first.`);
    }
    // Delete rooms
    const rooms = db.getRooms().filter(r => r.hostel_id !== Number(id));
    setStore('rooms', rooms);
    const hostels = db.getHostels().filter(h => h.id !== Number(id));
    setStore('hostels', hostels);
    return true;
  },

  // ROOMS
  getRooms: () => getStore('rooms', initialRooms),
  getRoomById: (id) => db.getRooms().find(r => r.id === Number(id)),
  getRoomsByHostelId: (hostelId) => db.getRooms().filter(r => r.hostel_id === Number(hostelId)),
  createRoom: (roomData) => {
    const rooms = db.getRooms();
    const newRoom = {
      ...roomData,
      id: rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1,
      occupied_beds: Number(roomData.occupied_beds || 0),
      status: Number(roomData.occupied_beds || 0) >= Number(roomData.capacity) ? 'Full' : (Number(roomData.occupied_beds || 0) > 0 ? 'Partially Occupied' : 'Available')
    };
    rooms.push(newRoom);
    setStore('rooms', rooms);
    return newRoom;
  },
  updateRoom: (id, updates) => {
    const rooms = db.getRooms().map(r => {
      if (r.id === Number(id)) {
        const merged = { ...r, ...updates };
        if (merged.status !== 'Maintenance') {
          if (merged.occupied_beds >= merged.capacity) {
            merged.status = 'Full';
          } else if (merged.occupied_beds > 0) {
            merged.status = 'Partially Occupied';
          } else {
            merged.status = 'Available';
          }
        }
        return merged;
      }
      return r;
    });
    setStore('rooms', rooms);
    return rooms.find(r => r.id === Number(id));
  },
  deleteRoom: (id) => {
    const room = db.getRoomById(id);
    if (!room) return false;
    const active = db.getAllocations().filter(a => a.room_id === Number(id) && a.status === 'Active');
    if (active.length > 0) {
      throw new Error(`Cannot delete room with active occupants (${active.length} student(s) currently allocated).`);
    }
    const rooms = db.getRooms().filter(r => r.id !== Number(id));
    setStore('rooms', rooms);
    return true;
  },

  // ALLOCATIONS
  getAllocations: () => getStore('allocations', initialAllocations),
  getAllocationById: (id) => db.getAllocations().find(a => a.id === Number(id)),
  getAllocationsByStudentId: (studentId) => db.getAllocations().filter(a => a.student_id === Number(studentId)),
  getActiveAllocationForStudent: (studentId) => db.getAllocations().find(a => a.student_id === Number(studentId) && a.status === 'Active'),
  createAllocation: (allocData) => {
    const allocations = db.getAllocations();
    const newAlloc = {
      ...allocData,
      id: allocations.length > 0 ? Math.max(...allocations.map(a => a.id)) + 1 : 1,
      allocated_date: new Date().toISOString(),
      status: 'Active'
    };
    allocations.push(newAlloc);
    setStore('allocations', allocations);

    // Update room occupancy
    const room = db.getRoomById(allocData.room_id);
    if (room) {
      db.updateRoom(room.id, { occupied_beds: room.occupied_beds + 1 });
    }
    return newAlloc;
  },
  deallocateRoom: (allocId) => {
    const alloc = db.getAllocationById(allocId);
    if (!alloc || alloc.status !== 'Active') return false;
    const allocations = db.getAllocations().map(a =>
      a.id === Number(allocId) ? { ...a, status: 'Vacated', vacated_date: new Date().toISOString() } : a
    );
    setStore('allocations', allocations);
    const room = db.getRoomById(alloc.room_id);
    if (room && room.occupied_beds > 0) {
      db.updateRoom(room.id, { occupied_beds: room.occupied_beds - 1 });
    }
    return true;
  },

  // APPLICATIONS
  getApplications: () => getStore('applications', initialApplications),
  getApplicationById: (id) => db.getApplications().find(a => a.id === Number(id)),
  getApplicationsByStudentId: (studentId) => db.getApplications().filter(a => a.student_id === Number(studentId)),
  createApplication: (appData) => {
    const applications = db.getApplications();
    const newApp = {
      ...appData,
      id: applications.length > 0 ? Math.max(...applications.map(a => a.id)) + 1 : 1,
      status: 'Pending',
      applied_at: new Date().toISOString()
    };
    applications.push(newApp);
    setStore('applications', applications);
    return newApp;
  },
  updateApplication: (id, updates) => {
    const applications = db.getApplications().map(a =>
      a.id === Number(id) ? { ...a, ...updates, reviewed_at: new Date().toISOString() } : a
    );
    setStore('applications', applications);
    return applications.find(a => a.id === Number(id));
  },

  // COMPLAINTS
  getComplaints: () => getStore('complaints', initialComplaints),
  getComplaintById: (id) => db.getComplaints().find(c => c.id === Number(id)),
  getComplaintsByStudentId: (studentId) => db.getComplaints().filter(c => c.student_id === Number(studentId)),
  getComplaintsByHostelId: (hostelId) => db.getComplaints().filter(c => c.hostel_id === Number(hostelId)),
  createComplaint: (compData) => {
    const complaints = db.getComplaints();
    const newComp = {
      ...compData,
      id: complaints.length > 0 ? Math.max(...complaints.map(c => c.id)) + 1 : 1,
      status: 'Pending',
      warden_remarks: null,
      created_at: new Date().toISOString(),
      resolved_at: null
    };
    complaints.push(newComp);
    setStore('complaints', complaints);
    return newComp;
  },
  updateComplaint: (id, updates) => {
    const complaints = db.getComplaints().map(c => {
      if (c.id === Number(id)) {
        const merged = { ...c, ...updates };
        if (merged.status === 'Resolved' && !merged.resolved_at) {
          merged.resolved_at = new Date().toISOString();
        }
        return merged;
      }
      return c;
    });
    setStore('complaints', complaints);
    return complaints.find(c => c.id === Number(id));
  },

  // NOTICES
  getNotices: () => getStore('notices', initialNotices),
  createNotice: (noticeData) => {
    const notices = db.getNotices();
    const newNotice = {
      ...noticeData,
      id: notices.length > 0 ? Math.max(...notices.map(n => n.id)) + 1 : 1,
      created_at: new Date().toISOString()
    };
    notices.unshift(newNotice);
    setStore('notices', notices);
    return newNotice;
  },
  deleteNotice: (id) => {
    const notices = db.getNotices().filter(n => n.id !== Number(id));
    setStore('notices', notices);
    return true;
  },

  // NOTIFICATIONS
  getNotifications: () => getStore('notifications', initialNotifications),
  getNotificationsByUserId: (userId) => db.getNotifications().filter(n => n.user_id === Number(userId)),
  createNotification: (notifData) => {
    const notifications = db.getNotifications();
    const newNotif = {
      ...notifData,
      id: notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1,
      is_read: false,
      created_at: new Date().toISOString()
    };
    notifications.unshift(newNotif);
    setStore('notifications', notifications);
    return newNotif;
  },
  markNotificationAsRead: (id) => {
    const notifications = db.getNotifications().map(n =>
      n.id === Number(id) ? { ...n, is_read: true } : n
    );
    setStore('notifications', notifications);
  },
  markAllNotificationsAsRead: (userId) => {
    const notifications = db.getNotifications().map(n =>
      n.user_id === Number(userId) ? { ...n, is_read: true } : n
    );
    setStore('notifications', notifications);
  }
};
