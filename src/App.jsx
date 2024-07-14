import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Guncelleme from "./components/Guncelleme/Guncelleme.jsx";
import Home from "./components/Home/Home.jsx";
import WorkerWeekdays from "./components/Worker/WorkerWeekdays";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/guncelleme">
          <Guncelleme />
        </Route>
        <Route path="/worker">
          <WorkerWeekdays />
        </Route>
        {/* <Route path="/çalışanlar">
          <Calisanlar />
        </Route>
        <Route path="/ayarlar">
          <Ayarlar />
        </Route>
        <Route path="/çıkış">
          <Cikis />
        </Route> */}
      </Switch>
    </Router>
  );
};

export default App;
