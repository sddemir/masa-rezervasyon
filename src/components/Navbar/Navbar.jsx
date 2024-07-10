import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import Link from "./Link";

const Navbar = () => {
  return (
    <BootstrapNavbar
      bg="light"
      expand="lg"
      className="align_center custom-navbar"
    >
      <BootstrapNavbar.Brand href="#" className="navbar_heading">
        Yaşar Bilgi MRS
      </BootstrapNavbar.Brand>
      <Form inline className="mr-sm-2 navbar_form align_center">
        <FormControl
          type="text"
          placeholder="Search"
          className="navbar_search"
        />
        <Button variant="outline-success" className="search_button">
          Search
        </Button>
      </Form>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto align_center navbar_links">
          <Link title="Home" link="/" className="nav-link" />
          <Link
            title="Rezervazyonlar"
            link="/rezervasyonlar"
            className="nav-link"
          />
          <Link title="Çalışanlar" link="/çalışanlar" className="nav-link" />
          <Link title="Ayarlar" link="/ayarlar" className="nav-link" />
          <Link title="Çıkış" link="/çıkış" className="nav-link" />
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
};

export default Navbar;
