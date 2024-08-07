import React, { useState, useEffect } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import {
  createUser,
  fetchDepartments,
  fetchCompanies,
} from "../../services/userService";
import axios from "axios";

const AddEmployee = ({ addEmployee }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    departmentId: "",
    companyId: "",
    userRoleId: 1, // default to user role
  });

  const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // Fetch departments and companies
    const fetchDepartmentsAndCompanies = async () => {
      try {
        const [departmentsResponse, companiesResponse] = await Promise.all([
          fetchDepartments(),
          fetchCompanies(),
        ]);
        setDepartments(departmentsResponse.data);
        setCompanies(companiesResponse.data);
      } catch (error) {
        console.error("Error fetching departments or companies:", error);
      }
    };

    fetchDepartmentsAndCompanies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(formData);
      addEmployee(response.data); // Update the parent component with the new employee
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        departmentId: "",
        companyId: "",
        userRoleId: 1,
      });
      alert("Kullanıcı oluşturuldu!");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <Container>
      {/* <h2>Add Employee</h2> */}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="formFirstName">
              <Form.Label>Ad</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formLastName">
              <Form.Label>Soyad</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Şifre</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDepartment">
          <Form.Label>Departman</Form.Label>
          <Form.Control
            as="select"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleInputChange}
            required
          >
            <option value="">Departman Seç</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.departmentName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formCompany">
          <Form.Label>Şirket</Form.Label>
          <Form.Control
            as="select"
            name="companyId"
            value={formData.companyId}
            onChange={handleInputChange}
            required
          >
            <option value="">Şirket Seç</option>
            {companies.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.companyName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formUserRole">
          <Form.Label>Kullanıcı Rolü</Form.Label>
          <Form.Check
            type="radio"
            label="Admin"
            name="userRoleId"
            value={1}
            checked={formData.userRoleId === 1}
            onChange={handleInputChange}
          />
          <Form.Check
            type="radio"
            label="User"
            name="userRoleId"
            value={2}
            checked={formData.userRoleId === 2}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Çalışan Ekle
        </Button>
      </Form>
    </Container>
  );
};

export default AddEmployee;
