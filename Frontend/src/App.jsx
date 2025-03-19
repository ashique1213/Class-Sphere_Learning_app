import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  PrivateRoute,
  RoleRoute,
  AdminRoute,
} from "./Protectedroute/ProtectedRoutes";
import Home from "./Pages/User/Home";
import Profile from "./Pages/User/Profile";
import Signup from "./Pages/User/Signup";
import AdminLogin from "./Pages/Admin/AdminLogin";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import Students from "./Pages/Admin/Students";
import Teachers from "./Pages/Admin/Teachers";
import Createclass from "./Pages/User/Createclass";
import Classrooms from "./Pages/User/Classrooms";
import ClassDetails from "./Pages/User/ClassDetails";
import Notfound from "./Pages/Notfound";
import { useSelector } from "react-redux";
import Classroom from "./Pages/User/Classroom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Meetings from "./Pages/User/Meetings";
import JoinMeeting from "./Components/JoinMeeting";
import MeetingDetails from "./Components/MeetingDetails";

function App() {
  const authToken = useSelector((state) => state.auth.authToken);
  const role = useSelector((state) => state.auth.role);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={!authToken ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/adminlogin"
          element={
            authToken && role === "staff" ? (
              <Navigate to="/admindashboard" />
            ) : (
              <AdminLogin />
            )
          }
        />
        <Route path="/notfound" element={<Notfound />} />

        {/* Protected routes (only for authenticated users) */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Teacher-specific routes */}
        <Route element={<RoleRoute allowedRoles={["teacher"]} />}>
          <Route path="/myclassrooms/:teachername" element={<Createclass />} />
          <Route path="/classdetails/:slug" element={<ClassDetails />} />
          <Route path="/meetings/:slug" element={<Meetings />} />
          <Route path="/meetings/details/:meetingId" element={<MeetingDetails />} />
        </Route>
        
        <Route path="/join/:meetingId" element={<JoinMeeting />} />

        {/* Student-specific routes */}
        <Route element={<RoleRoute allowedRoles={["student"]} />}>
          <Route path="/classrooms/:studentname" element={<Classrooms />} />
          <Route path="/classroom/:slug" element={<Classroom />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
        </Route>

        {/* Catch-all route (redirect invalid URLs) */}
        <Route path="*" element={<Navigate to="/notfound" />} />
      </Routes>
    </Router>
  );
}

export default App;
