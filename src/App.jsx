import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Authentication/Login.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Guncelleme from "./components/Guncelleme/Guncelleme";

const App = () => {
  return (
    <div className="app">
      <Navbar />
      {/* Other components */}
      <Guncelleme />
    </div>
  );
};

export default App;
