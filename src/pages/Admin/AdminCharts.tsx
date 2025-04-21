import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../../components/LogoutButton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminCharts = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchChartData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/dashboard/charts', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const category = res.data.categorySummary.map((c: any) => ({
        name: c.category,
        value: c._sum.amount,
      }));

      const status = res.data.statusSummary.map((s: any) => ({
        name: s.status,
        value: s._count._all,
      }));

      setCategoryData(category);
      setStatusData(status);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setMessage('❌ Failed to load chart data.');
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">📊 Charts Dashboard</h1>
        <LogoutButton />
      </div>

      <button
        onClick={() => navigate('/admin/dashboard')}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        ← Back to Dashboard
      </button>

      {message && <p className="text-red-500 text-sm text-center">{message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart: Category wise expenses */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Expense by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Status wise count */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Expenses by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;
