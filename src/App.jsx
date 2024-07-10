import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Authentication/Login.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";

const App = () => {
  return (
    <div className="app">
      <Navbar />
      {/* Other components */}
    </div>
  );
};

export default App;
