// src/pages/Admin/CreateUser.tsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    team: 'Alpha', // Set default team to 'Alpha'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/admin/create-user', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ User created successfully!');
      setForm({ name: '', email: '', password: '', role: 'EMPLOYEE', team: 'Alpha' }); // Reset form
    } catch (err) {
      setMessage('❌ Failed to create user.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-blue-700">Create User</h2>

        {message && <p className="text-center text-sm text-green-600">{message}</p>}

        {/* Name Input */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full p-2 border rounded"
        />
        
        {/* Email Input */}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />

        {/* Password Input */}
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
        />

        {/* Team Dropdown */}
        <select
          name="team"
          value={form.team}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="Alpha">Alpha</option>
          <option value="Beta">Beta</option>
          <option value="Gamma">Gamma</option>
        </select>

        {/* Role Dropdown */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="EMPLOYEE">EMPLOYEE</option>
          <option value="MANAGER">MANAGER</option>
        </select>

        {/* Form Submission and Back Button */}
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Create
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
