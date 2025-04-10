import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  receipt?: string;
};

type Notification = {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
};

const EmployeeDashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      const token = getToken();
      const res = await axios.get('http://localhost:5000/employee/my-expenses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data.expenses);
    } catch (err) {
      console.error('Error fetching employee expenses', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/notifications', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error('Error fetching notifications', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchExpenses();
    fetchNotifications();
  }, []);

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredExpenses =
    filter === 'ALL'
      ? expenses
      : expenses.filter((exp) => exp.status === filter);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md relative">
        {/* Header with buttons */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-blue-700">Employee Dashboard</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => navigate('/employee/submit-expense')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              ➕ Submit Expense
            </button>

            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-yellow-500 text-xl"
              >
                🔔
              </button>
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 bg-white shadow-md border rounded w-64 z-10 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-2 text-gray-500 text-sm">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-2 text-sm border-b last:border-none">
                        <p>{n.message}</p>
                        <span className="text-xs text-gray-500">{formatDate(n.createdAt)}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-1 rounded ${
                filter === status ? 'bg-blue-700 text-white' : 'bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Expense List */}
        {filteredExpenses.length === 0 ? (
          <p className="text-center text-gray-500">No expenses found.</p>
        ) : (
          <div className="space-y-4">
            {filteredExpenses.map((exp) => (
              <div key={exp.id} className="p-4 border rounded-md bg-gray-50 space-y-1">
                <p><strong>Category:</strong> {exp.category}</p>
                <p><strong>Amount:</strong> ₹{exp.amount}</p>
                <p><strong>Date:</strong> {formatDate(exp.date)}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={
                      exp.status === 'APPROVED'
                        ? 'text-green-600'
                        : exp.status === 'REJECTED'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }
                  >
                    {exp.status}
                  </span>
                </p>
                {exp.receipt && (
                  <a
                    href={`http://localhost:5000/uploads/${exp.receipt}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    📎 View Receipt
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
