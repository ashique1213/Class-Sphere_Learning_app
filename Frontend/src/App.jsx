import { BrowserRouter as Router, Routes, Route,Navigate  } from "react-router-dom";
import Home from "./Pages/User/Home";
import Profile from "./Pages/User/Profile";
import Signup from "./Pages/User/Signup";
import AdminLogin from "./Pages/Admin/AdminLogin";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import Students from "./Pages/Admin/Students";
import Teachers from "./Pages/Admin/Teachers";
import { useSelector } from "react-redux";

function App() {
  const authToken = useSelector((state) => state.auth.authToken);
  const role = useSelector((state) => state.auth.role);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/adminlogin" element={authToken ? <Navigate to="/admindashboard" /> : <AdminLogin />} />
        <Route path="/admindashboard" element={authToken && role === "staff" ? <AdminDashboard /> : <Navigate to="/adminlogin" />}/>
        <Route path="/students" element={authToken && (role === "staff") ? <Students /> : <Navigate to="/adminlogin" />} />
        <Route path="/teachers" element={authToken && role === "staff" ? <Teachers /> : <Navigate to="/adminlogin" />}/>

      </Routes>
    </Router>
  );
}

export default App;

