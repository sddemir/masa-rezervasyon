import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/shared/Navbar/Navbar.jsx";
import Guncelleme from "./components/admin/Guncelleme/Guncelleme.jsx";
import Home from "./components/shared/Home/Home.jsx";
import WorkerWeekdays from "./components/user/Worker/WorkerWeekdays.jsx";
import Calisanlar from "./components/admin/Calisanlar.jsx";
import Login from "./components/shared/Authentication/Login.jsx";
import Password from "./components/shared/Authentication/Password.jsx";

const App = () => {
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(""); // Added state for user ID
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (user) => {
    setUserRole(user.role);
    setUserId(user.id); // Set user ID from the logged-in user
    setIsLoggedIn(true);
    navigate("/home");
  };

  const handleLogout = () => {
    setUserRole("");
    setUserId(""); // Clear user ID on logout
    setIsLoggedIn(false);
    navigate("/");
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Navbar userRole={userRole} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/guncelleme" element={<Guncelleme />} />
        <Route path="/calisanlar" element={<Calisanlar />} />
        <Route path="/ayarlar" element={<Password />} />
        <Route
          path="/rezervasyon"
          element={<WorkerWeekdays userId={userId} />}
        />
      </Routes>
    </div>
  );
};

export default App;
