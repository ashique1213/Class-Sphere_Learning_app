import { BrowserRouter as Router, Routes, Route,Navigate  } from "react-router-dom";
import Home from "./Pages/User/Home";
import Profile from "./Pages/User/Profile";
import Signup from "./Pages/User/Signup";
import AdminLogin from "./Pages/Admin/AdminLogin";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import Students from "./Pages/Admin/Students";
import Teachers from "./Pages/Admin/Teachers";
import { useSelector } from "react-redux";
import Createclass from "./Pages/User/Createclass";
import Classrooms from "./Pages/User/Classrooms";
import ClassDetails from "./Pages/User/ClassDetails";
import Notfound from "./Pages/Notfound";

function App() {
  const authToken = useSelector((state) => state.auth.authToken);
  const role = useSelector((state) => state.auth.role);
  
  const PrivateRoute = ({ element }) => {
    return authToken ? element : <Navigate to="/signup" />;
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/adminlogin" element={authToken ? <Navigate to="/admindashboard" /> : <AdminLogin />} />
        <Route path="/admindashboard" element={authToken && role === "staff" ? <AdminDashboard /> : <Navigate to="/adminlogin" />}/>
        <Route path="/students" element={authToken && (role === "staff") ? <Students /> : <Navigate to="/adminlogin" />} />
        <Route path="/teachers" element={authToken && role === "staff" ? <Teachers /> : <Navigate to="/adminlogin" />} />

        <Route path="/myclassrooms/:teachername" element={<PrivateRoute element={<Createclass />} />} />
        <Route path="/classrooms/:studentname" element={<PrivateRoute element={<Classrooms />} />} />
        <Route path="/classroom/:slug" element={<PrivateRoute element={<ClassDetails />} />} />

        <Route path="/notfound" element={<Notfound/>}/>
      </Routes>
    </Router>
  );
}

export default App;

