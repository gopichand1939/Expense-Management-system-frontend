import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = token ? JSON.parse(atob(token.split('.')[1])).role : '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // ✅ changed from '/login'
  };

  return (
    <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">EMS Dashboard - {role}</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-sm px-4 py-1 rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
