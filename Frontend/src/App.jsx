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
import Createclass from "./Pages/User/Teacher/Createclass";
import Classrooms from "./Pages/User/Student/Classrooms";
import ClassDetails from "./Pages/User/Teacher/ClassDetails";
import Notfound from "./Pages/Notfound";
import { useSelector } from "react-redux";
import Classroom from "./Pages/User/Student/Classroom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Meetings from "./Pages/User/Teacher/Meetings"
import JoinMeeting from "./Components/Layouts/JoinMeeting";
import MeetingDetails from "./Components/Teacher/MeetingDetails";
import ExamsPage from "./Pages/User/Teacher/ExamsPage";
import ExamDetail from "./Components/Teacher/ExamDetail";
import MaterialsPage from "./Pages/User/Teacher/MaterialsPage";
import AssignmentsPage from "./Pages/User/Teacher/AssignmentsPage";
import AssignmentDetail from "./Components/Teacher/AssignmentDetail";
import AttendancePage from "./Pages/User/Teacher/AttendancePage";
import Notifications from "./Pages/User/Notifications";
import About from "./Pages/User/About";
import Reviews from "./Pages/Admin/Reviews";
import Subscription from "./Pages/Admin/Subscription";
import Plans from "./Pages/User/Plans";
import Payment from "./Pages/User/Payment";
import SubscriptionHistory from "./Pages/User/SubscriptionHistory";
import Finance from "./Pages/Admin/Finance";
import ChatWindow from "./Pages/User/ChatWindow";

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
            authToken !== "null" && role === "staff" ? (
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
          <Route path="/exams/:slug" element={<ExamsPage />} />
          <Route path="/exam/:examId" element={<ExamDetail />} />
          <Route path="/materials/:slug" element={<MaterialsPage />} />
          <Route path="/assignments/:slug" element={<AssignmentsPage />} />
          <Route path="/assignments/:slug/:assignmentId" element={<AssignmentDetail />} />
          <Route path="/attendance/:slug" element={<AttendancePage/>} />
        </Route>
        
        <Route element={<RoleRoute allowedRoles={["student", "teacher"]} />}>
          <Route path="/join/:meetingId" element={<JoinMeeting />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/subscription-history" element={<SubscriptionHistory />} />
          <Route path="/chat" element={<ChatWindow />} />
        </Route>

          <Route path="/about" element={<About />} />

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
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/finance" element={<Finance />} />

        </Route>

        {/* Catch-all route (redirect invalid URLs) */}
        <Route path="*" element={<Navigate to="/notfound" />} />
      </Routes>
    </Router>
  );
}

export default App;
