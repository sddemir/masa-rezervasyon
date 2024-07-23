import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import {
  listUsers,
  createReservation,
  deleteReservation,
  listReservations,
} from "../../services/userService";
import Scene from "../shared/Kroki/Scene";

const FormComponent = ({
  onSubmit,
  includeCalisanSelect,
  silMode,
  selectedDay,
}) => {
  const [calisanlar, setCalisanlar] = useState([]);
  const [selectedCalisan, setSelectedCalisan] = useState("");
  const [selectedOda, setSelectedOda] = useState("");
  const [selectedChair, setSelectedChair] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showScene, setShowScene] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [showCalisanSelect, setShowCalisanSelect] = useState(false);

  useEffect(() => {
    fetchCalisanlar();
  }, []);

  const fetchCalisanlar = async () => {
    try {
      const response = await listUsers();
      const formattedData = response.data.map((calisan) => ({
        ...calisan,
        name: `${calisan.firstName} ${calisan.lastName}`,
      }));
      setCalisanlar(formattedData);
    } catch (error) {
      setError("Error fetching çalışanlar.");
    }
  };

  const fetchReservationsForUser = async (userId) => {
    try {
      const response = await listReservations();
      const userReservations = response.data.filter(
        (res) => res.userId === parseInt(userId)
      );
      setReservations(userReservations);
    } catch (error) {
      setError("Error fetching reservations.");
    }
  };

  const handleCalisanChange = (event) => {
    setSelectedCalisan(event.target.value);
  };

  const handleChairSelect = (chairId) => {
    setSelectedChair(chairId);
  };

  const handleButtonClick = (odaType) => {
    setSelectedOda(odaType);
    setShowScene(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCalisan || !selectedChair || !selectedOda) {
      setError("Please fill all fields before submitting.");
      return;
    }

    const reservationData = {
      userId: selectedCalisan,
      deskId: selectedChair,
      reservationDate: new Date().toISOString().split("T")[0],
    };

    try {
      await createReservation(reservationData);
      setSuccess(true);
      setError(null);
      onSubmit(reservationData);
    } catch (error) {
      setError("Failed to make reservation.");
      setSuccess(false);
    }
  };

  const handleDeleteByWorker = async () => {
    if (!selectedCalisan) {
      setError("Please select a user.");
      return;
    }

    try {
      await fetchReservationsForUser(selectedCalisan);
      setSuccess(true);
      setError(null);
    } catch (error) {
      setError("Failed to fetch reservations by worker.");
      setSuccess(false);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      await deleteReservation(reservationId);
      setReservations((prev) => prev.filter((res) => res.id !== reservationId));
      setSuccess(true);
      setError(null);
    } catch (error) {
      setError("Failed to delete reservation.");
      setSuccess(false);
    }
  };

  const handleShowCalisanSelect = () => {
    setShowCalisanSelect(true);
    setShowScene(false);
  };

  return (
    <Container className="form-container">
      <h3>Form Component</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">Operation completed successfully!</Alert>
      )}
      {silMode ? (
        <>
          <Button variant="primary" onClick={handleShowCalisanSelect}>
            Çalışana Göre
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowCalisanSelect(false)}
          >
            Masaya Göre
          </Button>
          {showCalisanSelect && (
            <>
              <Form.Group controlId="calisanSelect">
                <Form.Label>Çalışanlar</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedCalisan}
                  onChange={handleCalisanChange}
                >
                  <option value="">Select a çalışan</option>
                  {calisanlar.map((calisan) => (
                    <option key={calisan.id} value={calisan.id}>
                      {calisan.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" onClick={handleDeleteByWorker}>
                Fetch Reservations
              </Button>
              {reservations.length > 0 && (
                <ul>
                  {reservations.map((reservation) => (
                    <li key={reservation.id}>
                      {`Desk ID: ${reservation.deskId}, Date: ${reservation.reservationDate}`}
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteReservation(reservation.id)}
                      >
                        Sil
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      ) : (
        <Form onSubmit={handleSubmit}>
          {includeCalisanSelect && (
            <Form.Group controlId="calisanSelect">
              <Form.Label>Çalışanlar</Form.Label>
              <Form.Control
                as="select"
                value={selectedCalisan}
                onChange={handleCalisanChange}
              >
                <option value="">Select a çalışan</option>
                {calisanlar.map((calisan) => (
                  <option key={calisan.id} value={calisan.id}>
                    {calisan.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}

          <Form.Group controlId="odaSelect">
            <Form.Label>Odalar</Form.Label>
            <Button
              variant="primary"
              onClick={() => handleButtonClick("Mobilite")}
            >
              Mobilite
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleButtonClick("Kat")}
            >
              Kat
            </Button>
          </Form.Group>

          {showScene && (
            <Scene
              selectedOda={selectedOda}
              onChairSelect={handleChairSelect}
            />
          )}

          {selectedChair && (
            <Form.Group controlId="selectedChair">
              <Form.Label>Seçilen Masa</Form.Label>
              <Form.Control type="text" value={selectedChair} readOnly />
            </Form.Group>
          )}

          <Button variant="primary" type="submit">
            Masayı Seç
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default FormComponent;