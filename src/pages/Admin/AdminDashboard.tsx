import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from '../../components/LogoutButton';
import { useNavigate } from 'react-router-dom';


type ExpenseItem = {
  id: string;
  category: string;
  amount: number;
  status: string;
  createdAt: string;
  employee: {
    name: string;
    team: string;
  };
  receipt: string | null;
};




const AdminDashboard = () => {
  const [teamData, setTeamData] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // ✅ Fetch all team budgets + approved expenses
  const fetchTeamData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTeamData(res.data.teamOverview || []);
      setExpenses(res.data.expenses || []);
    } catch (err) {
      console.error('Error fetching team data:', err);
      setMessage('Failed to fetch team data.');
    }
  };

  // ✅ Budget update handler
  const handleSetBudget = async (team: string, budget: number) => {
    const token = localStorage.getItem('token');
    try {
      const payload = { team, limit: Number(budget) }; // ✅ Ensure it's a number
      console.log('Sending payload:', payload); // 🐞 debug
      await axios.post('http://localhost:5000/admin/set-budget', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(`✅ Budget updated for ${team}`);
      fetchTeamData();
    } catch (err) {
      console.error('Error setting budget:', err);
      setMessage('❌ Failed to set budget.');
    }
  };
  

  useEffect(() => {
    fetchTeamData();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Admin Dashboard</h1>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate('/admin/create-user')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Create User
        </button>
        <LogoutButton />
      </div>

      {message && <p className="text-center text-green-600 mb-4">{message}</p>}

      {/* ✅ TEAM BUDGET OVERVIEW */}
      <h2 className="text-xl font-semibold mb-2 text-gray-700">Team Budgets</h2>
      <div className="space-y-4">
        {teamData.length === 0 ? (
          <p className="text-center mt-8 text-gray-500">No team data available.</p>
        ) : (
          teamData.map((team: any, index: number) => (
            <div key={`${team.team}-${team.month}-${index}`} className="bg-white p-4 rounded-xl shadow-md">
              <p><strong>Team:</strong> {team.team}</p>
              <p><strong>Month:</strong> {team.month}</p>
              <p><strong>Budget Limit:</strong> ₹{team.limit}</p>
              <p><strong>Used:</strong> ₹{team.used}</p>
              <p><strong>Remaining:</strong> ₹{team.remaining}</p>
              <p><strong>Overspent:</strong> {team.isOverspent ? 'Yes' : 'No'}</p>

              <button
                onClick={() => handleSetBudget(team.team, Number(team.limit) + 5000)}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                ➕ Increase Budget
              </button>
            </div>
          ))
        )}
      </div>

      {/* ✅ APPROVED EXPENSE OVERVIEW */}
     {/* ✅ Approved Expenses */}
<h2 className="text-xl font-semibold mb-2 mt-6">Approved Expenses</h2>
<table className="w-full bg-white rounded shadow">
  <thead>
    <tr className="bg-gray-100">
      <th className="p-2 text-left">Team</th>
      <th className="p-2 text-left">Employee</th>
      <th className="p-2 text-left">Category</th>
      <th className="p-2 text-left">Amount</th>
      <th className="p-2 text-left">Date</th>
      <th className="p-2 text-left">Status</th>
      <th className="p-2 text-left">Receipt</th>
    </tr>
  </thead>
  <tbody>
    {expenses.length === 0 ? (
      <tr>
        <td colSpan={7} className="p-4 text-center text-gray-500">No approved expenses</td>
      </tr>
    ) : (
      expenses.map((exp) => (
        <tr key={exp.id} className="border-t">
          <td className="p-2">{exp.employee?.team}</td>
          <td className="p-2">{exp.employee?.name}</td>
          <td className="p-2">{exp.category}</td>
          <td className="p-2">₹{exp.amount}</td>
          <td className="p-2">{new Date(exp.createdAt).toLocaleDateString('en-GB')}</td>
          <td className="p-2">{exp.status}</td>
          <td className="p-2">
            {exp.receipt ? (
              <a
                href={exp.receipt}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                📎 View Receipt
              </a>
            ) : (
              '—'
            )}
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

    </div>
  );
};

export default AdminDashboard;
