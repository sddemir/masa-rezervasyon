import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { Button, Container, Form } from "react-bootstrap";

const Login = () => {
  return (
    <Container className="login-container">
      <Form className="login-form">
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
