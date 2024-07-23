import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { updateUser } from "../../services/userService";

const UpdateEmployee = ({ employee, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    password: employee.password,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const updatedEmployee = await updateUser(employee.id, formData);
      onUpdate(updatedEmployee.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return isEditing ? (
    <div className="update-form">
      <Form>
        <Form.Group controlId="formFirstName">
          <Form.Label>İsim:</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="First Name"
          />
        </Form.Group>
        <Form.Group controlId="formLastName">
          <Form.Label>Soyisim:</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Şifre:</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
          />
        </Form.Group>
        <Button variant="success" onClick={handleUpdate} className="mt-3">
          Güncelle
        </Button>
      </Form>
    </div>
  ) : (
    <Button variant="primary" onClick={handleEditClick}>
      Güncelle
    </Button>
  );
};

export default UpdateEmployee;
