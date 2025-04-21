import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from '../../components/LogoutButton';

type Expense = {
  id: string;
  employeeName: string;
  amount: number;
  category: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  receipt?: string;
};

const ManagerDashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/manager/expenses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data.expenses); // ✅ Ensure backend sends { expenses: [...] }
    } catch (err) {
      console.error('Error fetching manager expenses:', err);
      setExpenses([]);
    }
  };

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(
        `http://localhost:5000/manager/expenses/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(`✅ Expense ${status.toLowerCase()}!`);
      fetchExpenses();
    } catch (err) {
      console.error(`Error updating status to ${status}:`, err);
      setMessage(`❌ Failed to update expense`);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (filter === 'ALL') {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(expenses.filter((exp) => exp.status === filter));
    }
  }, [filter, expenses]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Manager Dashboard</h1>

      <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>

      {message && <p className="text-center text-green-600 mb-4">{message}</p>}

      {/* Filter Dropdown */}
      <div className="mb-4 flex justify-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED')}
          className="p-2 border rounded"
        >
          <option value="ALL">All Expenses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {filteredExpenses.length === 0 ? (
        <p className="text-center mt-8 text-gray-500">No expenses found.</p>
      ) : (
        <div className="space-y-4 mt-4">
          {filteredExpenses.map((exp) => (
            <div key={exp.id} className="bg-white p-4 rounded-xl shadow-md">
              <p><strong>Employee:</strong> {exp.employeeName}</p>
              <p><strong>Amount:</strong> ₹{exp.amount}</p>
              <p><strong>Category:</strong> {exp.category}</p>
              <p><strong>Date:</strong> {new Date(exp.date).toLocaleDateString()}</p>
              <p className="flex items-center gap-2">
                <strong>Status:</strong>
                <span
                  className={`px-2 py-1 text-xs rounded font-semibold ${
                    exp.status === 'APPROVED'
                      ? 'bg-green-100 text-green-700'
                      : exp.status === 'REJECTED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {exp.status}
                </span>
              </p>

              {exp.receipt && (
                <a
                  href={`http://localhost:5000/uploads/${exp.receipt}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline block mt-2"
                >
                  📎 View Receipt
                </a>
              )}

              {exp.status === 'PENDING' && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleAction(exp.id, 'APPROVED')}
                    className="px-4 py-1 bg-green-600 text-white rounded"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleAction(exp.id, 'REJECTED')}
                    className="px-4 py-1 bg-red-600 text-white rounded"
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
