import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../services/db.js';

const DatabaseContext = createContext(null);

export function DatabaseProvider({ children }) {
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => {
    setVersion(v => v + 1);
  }, []);

  const resetToDemo = useCallback(() => {
    db.resetDatabase();
    refresh();
  }, [refresh]);

  const value = {
    version,
    refresh,
    resetToDemo,
    // Accessors
    getHostels: () => db.getHostels(),
    getHostelById: (id) => db.getHostelById(id),
    createHostel: (data) => { const r = db.createHostel(data); refresh(); return r; },
    updateHostel: (id, updates) => { const r = db.updateHostel(id, updates); refresh(); return r; },
    deleteHostel: (id) => { const r = db.deleteHostel(id); refresh(); return r; },

    getRooms: () => db.getRooms(),
    getRoomById: (id) => db.getRoomById(id),
    getRoomsByHostelId: (hId) => db.getRoomsByHostelId(hId),
    createRoom: (data) => { const r = db.createRoom(data); refresh(); return r; },
    updateRoom: (id, updates) => { const r = db.updateRoom(id, updates); refresh(); return r; },
    deleteRoom: (id) => { const r = db.deleteRoom(id); refresh(); return r; },

    getStudents: () => db.getStudents(),
    getStudentById: (id) => db.getStudentById(id),
    getStudentByUserId: (uId) => db.getStudentByUserId(uId),
    updateStudent: (id, updates) => { const r = db.updateStudent(id, updates); refresh(); return r; },
    deleteStudent: (id) => { const r = db.deleteStudent(id); refresh(); return r; },

    getWardens: () => db.getWardens(),
    getWardenById: (id) => db.getWardenById(id),
    getWardenByUserId: (uId) => db.getWardenByUserId(uId),

    getAllocations: () => db.getAllocations(),
    getAllocationById: (id) => db.getAllocationById(id),
    getActiveAllocationForStudent: (sId) => db.getActiveAllocationForStudent(sId),
    createAllocation: (data) => { const r = db.createAllocation(data); refresh(); return r; },
    deallocateRoom: (allocId) => { const r = db.deallocateRoom(allocId); refresh(); return r; },

    getApplications: () => db.getApplications(),
    getApplicationById: (id) => db.getApplicationById(id),
    getApplicationsByStudentId: (sId) => db.getApplicationsByStudentId(sId),
    createApplication: (data) => { const r = db.createApplication(data); refresh(); return r; },
    updateApplication: (id, updates) => { const r = db.updateApplication(id, updates); refresh(); return r; },

    getComplaints: () => db.getComplaints(),
    getComplaintById: (id) => db.getComplaintById(id),
    getComplaintsByStudentId: (sId) => db.getComplaintsByStudentId(sId),
    getComplaintsByHostelId: (hId) => db.getComplaintsByHostelId(hId),
    createComplaint: (data) => { const r = db.createComplaint(data); refresh(); return r; },
    updateComplaint: (id, updates) => { const r = db.updateComplaint(id, updates); refresh(); return r; },

    getNotices: () => db.getNotices(),
    createNotice: (data) => { const r = db.createNotice(data); refresh(); return r; },
    deleteNotice: (id) => { const r = db.deleteNotice(id); refresh(); return r; },

    getNotifications: () => db.getNotifications(),
    getNotificationsByUserId: (uId) => db.getNotificationsByUserId(uId),
    createNotification: (data) => { const r = db.createNotification(data); refresh(); return r; },
    markNotificationAsRead: (id) => { db.markNotificationAsRead(id); refresh(); },
    markAllNotificationsAsRead: (uId) => { db.markAllNotificationsAsRead(uId); refresh(); }
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
