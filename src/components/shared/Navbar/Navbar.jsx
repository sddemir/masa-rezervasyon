import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Link as RouterLink } from "react-router-dom";

const Navbar = ({ userRole, onLogout }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(!expanded);
  const handleSelect = () => setExpanded(false);

  console.log("Navbar rendered with userRole:", userRole);

  return (
    <BootstrapNavbar
      bg="light"
      expand="lg"
      expanded={expanded}
      onToggle={handleToggle}
      className="align_center custom-navbar"
    >
      <BootstrapNavbar.Brand href="#" className="navbar_heading">
        Yaşar Bilgi MRS
      </BootstrapNavbar.Brand>
      <Form className="form-inline mr-sm-2 navbar_form align_center">
        <FormControl type="text" placeholder="Ara" className="navbar_search" />
        <Button variant="outline-success" className="search_button">
          Ara
        </Button>
      </Form>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav
          className="ml-auto align_center navbar_links"
          onSelect={handleSelect}
        >
          <RouterLink to="/home" className="nav-link" onClick={handleSelect}>
            Ana Sayfa
          </RouterLink>
          {userRole === "admin" && (
            <>
              <RouterLink
                to="/guncelleme"
                className="nav-link"
                onClick={handleSelect}
              >
                Rezervasyonlar
              </RouterLink>
              <RouterLink
                to="/calisanlar"
                className="nav-link"
                onClick={handleSelect}
              >
                Çalışanlar
              </RouterLink>
              <RouterLink
                to="/ayarlar"
                className="nav-link"
                onClick={handleSelect}
              >
                Ayarlar
              </RouterLink>
            </>
          )}
          {userRole === "user" && (
            <>
              <RouterLink
                to="/rezervasyon"
                className="nav-link"
                onClick={handleSelect}
              >
                Rezervasyon
              </RouterLink>
              <RouterLink
                to="/ayarlar"
                className="nav-link"
                onClick={handleSelect}
              >
                Ayarlar
              </RouterLink>
            </>
          )}
          <Button
            variant="link"
            onClick={() => {
              handleSelect();
              onLogout();
            }}
            className="nav-link"
          >
            Çıkış
          </Button>
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
};

export default Navbar;
