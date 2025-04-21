import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ManagerDashboard from '../pages/Manager/ManagerDashboard';
import EmployeeDashboard from '../pages/Employee/EmployeeDashboard';
import CreateUser from '../pages/Admin/CreateUser';
import SetBudget from '../pages/Admin/SetBudget';
import SubmitExpense from '../pages/Employee/SubmitExpense';
import AdminCharts from '../pages/Admin/AdminCharts';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} /> {/* ✅ Now /login works too */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-user" element={<CreateUser />} />
        <Route path="/admin/set-budget" element={<SetBudget />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/submit-expense" element={<SubmitExpense />} />
        <Route path="/admin/charts" element={<AdminCharts />} />

      </Routes>
    </Router>
  );
};

export default AppRouter;
