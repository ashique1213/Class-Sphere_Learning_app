import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/User/Home";
import Profile from "./Pages/User/Profile";
import Signup from "./Pages/User/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

