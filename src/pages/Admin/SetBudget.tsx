import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SetBudget = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useState('');
  const [limit, setLimit] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/admin/set-budget',
        { team, limit },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('✅ Budget set successfully!');
      setTeam('');
      setLimit('');
    } catch (err) {
      setMessage('❌ Failed to set budget.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-green-700">Set Budget</h2>

        {message && <p className="text-center text-sm text-green-600">{message}</p>}

        <input
          name="team"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          placeholder="Team (e.g., ECE)"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="limit"
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="Limit (₹)"
          required
          className="w-full p-2 border rounded"
        />

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Save
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

export default SetBudget;
