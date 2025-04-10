// src/components/LogoutButton.tsx
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clears token from localStorage
    navigate('/'); // redirects to login
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      🚪 Logout
    </button>
  );
};

export default LogoutButton;
