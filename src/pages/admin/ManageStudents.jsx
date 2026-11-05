import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import { exportStudentsCSV } from '../../utils/exportCSV';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Edit,
  Download,
  X,
  CheckCircle,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';

export default function ManageStudents() {
  const { getStudents, createStudent, updateStudent, deleteStudent } = useDatabase();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    student_id: '',
    gender: 'Male',
    department: 'Computer Science and Engineering',
    year_of_study: 1,
    phone: '',
    email: '',
    parent_name: '',
    parent_phone: '',
    address: ''
  });

  const students = getStudents();

  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderFilter === 'All' || s.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      full_name: '',
      student_id: '',
      gender: 'Male',
      department: 'Computer Science and Engineering',
      year_of_study: 1,
      phone: '',
      email: '',
      parent_name: '',
      parent_phone: '',
      address: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete student "${name}"? This will remove all their applications and allocations.`)) {
      deleteStudent(id);
      addToast(`Student "${name}" deleted.`, 'info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.student_id || !formData.email) {
      addToast('Please fill in all required fields.', 'warning');
      return;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
      addToast(`Student "${formData.full_name}" updated!`, 'success');
    } else {
      createStudent(formData);
      addToast(`New student "${formData.full_name}" registered!`, 'success');
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <span>Manage Registered Students</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Student directory, academic details, and residential registry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportStudentsCSV(students)}
            className="px-3.5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4 text-navy-950" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-navy-900 border border-navy-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-950 border border-navy-700 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Gender:</span>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-navy-950 border border-navy-700 text-xs text-slate-200 outline-none"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-3xl bg-navy-900 border border-navy-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider border-b border-navy-800">
              <tr>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Phone & Email</th>
                <th className="py-3 px-4">Parent Info</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No students match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-navy-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      {student.student_id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{student.full_name}</div>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        student.gender === 'Male' ? 'bg-blue-500/20 text-blue-300' : 'bg-pink-500/20 text-pink-300'
                      }`}>
                        {student.gender}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-[200px] truncate">
                      {student.department}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      Year {student.year_of_study}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Phone className="w-3 h-3 text-cyan-400" />
                        <span>{student.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                        <Mail className="w-3 h-3 text-cyan-400" />
                        <span>{student.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="font-medium">{student.parent_name || 'N/A'}</div>
                      <div className="text-[11px] text-slate-400">{student.parent_phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(student)}
                          title="Edit Student"
                          className="p-1.5 rounded-lg bg-navy-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, student.full_name)}
                          title="Delete Student"
                          className="p-1.5 rounded-lg bg-navy-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <h3 className="text-base font-bold text-white">
                {editingStudent ? 'Edit Student Details' : 'Register New Student'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Student ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Year of Study</label>
                  <select
                    value={formData.year_of_study}
                    onChange={(e) => setFormData({ ...formData, year_of_study: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Parent Name</label>
                  <input
                    type="text"
                    value={formData.parent_name}
                    onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Parent Phone</label>
                  <input
                    type="text"
                    value={formData.parent_phone}
                    onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:bg-navy-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold"
                >
                  {editingStudent ? 'Save Changes' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
