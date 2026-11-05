import { db } from './db.js';

const SESSION_KEY = 'smarthostel_auth_session';

export const authService = {
  getCurrentSession: () => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  login: async (usernameOrEmail, password) => {
    const user = db.getUserByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      throw new Error('Invalid username or email. Please check your credentials.');
    }
    if (user.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    let profile = null;
    if (user.role === 'student') {
      profile = db.getStudentByUserId(user.id);
    } else if (user.role === 'warden') {
      profile = db.getWardenByUserId(user.id);
    }

    const sessionData = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      displayName: user.display_name || user.username,
      profile: profile || null,
      token: 'demo-token-' + Date.now()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    return sessionData;
  },

  quickLogin: async (role) => {
    let targetUser = null;
    if (role === 'admin') {
      targetUser = db.getUserByUsernameOrEmail('admin');
    } else if (role === 'warden' || role === 'warden_boys') {
      targetUser = db.getUserByUsernameOrEmail('warden_boys');
    } else if (role === 'warden_girls') {
      targetUser = db.getUserByUsernameOrEmail('warden_girls');
    } else if (role === 'student') {
      targetUser = db.getUserByUsernameOrEmail('rahul_sharma');
    }

    if (!targetUser) {
      throw new Error(`Demo account for ${role} not found.`);
    }

    return await authService.login(targetUser.username, targetUser.password);
  },

  registerStudent: async (formData) => {
    const {
      full_name,
      student_id,
      username,
      email,
      password,
      confirm_password,
      phone,
      gender,
      department,
      year_of_study,
      address,
      parent_name,
      parent_phone
    } = formData;

    // Validations
    if (!full_name || !student_id || !username || !email || !password || !phone || !department) {
      throw new Error('Please fill in all required fields marked with *.');
    }

    if (password !== confirm_password) {
      throw new Error('Passwords do not match. Please re-enter.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    if (db.getUserByUsernameOrEmail(username)) {
      throw new Error(`Username "${username}" is already taken. Please choose another.`);
    }

    if (db.getUserByUsernameOrEmail(email)) {
      throw new Error(`Email address "${email}" is already registered. Please log in.`);
    }

    if (db.getStudentByStudentId(student_id)) {
      throw new Error(`Student ID "${student_id}" is already registered.`);
    }

    // 1. Create User
    const newUser = db.createUser({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: 'student',
      display_name: full_name.trim()
    });

    // 2. Create Student Profile
    const newStudent = db.createStudent({
      user_id: newUser.id,
      student_id: student_id.trim().toUpperCase(),
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      gender: gender || 'Male',
      department: department.trim(),
      year_of_study: Number(year_of_study) || 1,
      address: address ? address.trim() : '',
      parent_name: parent_name ? parent_name.trim() : '',
      parent_phone: parent_phone ? parent_phone.trim() : '',
      emergency_contact: parent_phone ? parent_phone.trim() : phone.trim()
    });

    // 3. Welcome notification
    db.createNotification({
      user_id: newUser.id,
      title: 'Welcome to SmartHostel!',
      message: `Hello ${full_name}, your student account has been created successfully. You can now apply for university hostel accommodation.`,
      type: 'info',
      link: '/student/apply'
    });

    // 4. Automatically authenticate new student
    return await authService.login(newUser.username, password);
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};
