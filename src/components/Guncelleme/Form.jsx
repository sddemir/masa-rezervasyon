import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import "./Form.css";

const FormComponent = ({ onSubmit }) => {
  const [departmanOptions, setDepartmanOptions] = useState([]);
  const [odaOptions, setOdaOptions] = useState([]);
  const [masaOptions, setMasaOptions] = useState([]);
  const [calisanOptions, setCalisanOptions] = useState([]);
  //API HAZIR OLUNCA BURADAN OPTION LARI ÇEKECEĞİZ.
  //   useEffect(() => {
  //     fetchOptions();
  //   }, []);

  const fetchOptions = async () => {
    try {
      const departmanResponse = await axios.get("/api/departman");
      setDepartmanOptions(departmanResponse.data);

      const odaResponse = await axios.get("/api/oda");
      setOdaOptions(odaResponse.data);

      const masaResponse = await axios.get("/api/masa");
      setMasaOptions(masaResponse.data);

      const calisanResponse = await axios.get("/api/calisan");
      setCalisanOptions(calisanResponse.data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const [departman, setDepartman] = useState("");
  const [oda, setOda] = useState("");
  const [masa, setMasa] = useState("");
  const [calisan, setCalisan] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ departman, oda, masa, calisan });
  };

  return (
    <Container className="form-container">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formDepartman">
          <Form.Label>Departman</Form.Label>
          <Form.Control
            as="select"
            value={departman}
            onChange={(e) => setDepartman(e.target.value)}
          >
            <option value="">Select Departman</option>
            {departmanOptions.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formOda">
          <Form.Label>Oda</Form.Label>
          <Form.Control
            as="select"
            value={oda}
            onChange={(e) => setOda(e.target.value)}
          >
            <option value="">Select Oda</option>
            {odaOptions &&
              odaOptions.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formMasa">
          <Form.Label>Masa</Form.Label>
          <Form.Control
            as="select"
            value={masa}
            onChange={(e) => setMasa(e.target.value)}
          >
            <option value="">Select Masa</option>
            {masaOptions &&
              masaOptions.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formCalisan">
          <Form.Label>Çalışan</Form.Label>
          <Form.Control
            as="select"
            value={calisan}
            onChange={(e) => setCalisan(e.target.value)}
          >
            <option value="">Select Çalışan</option>
            {calisanOptions &&
              calisanOptions.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default FormComponent;
