import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import {
  listUsers,
  createReservation,
  deleteReservation,
  listReservations,
  listDesksWithStatus,
} from "../../services/userService";
import Scene from "../shared/Kroki/Scene";

const FormComponent = ({
  onSubmit,
  includeCalisanSelect,
  silMode,
  selectedDay,
  selectedDate,
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
  const [desksWithStatus, setDesksWithStatus] = useState([]);

  useEffect(() => {
    fetchCalisanlar();
    if (selectedDate) {
      fetchDesks();
      fetchReservations();
    }
  }, [selectedDate]);

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

  const fetchDesks = async () => {
    try {
      if (!selectedDate) {
        throw new Error("Selected date is undefined");
      }
      console.log("Fetching desks for selected date:", selectedDate);
      const desksWithStatus = await listDesksWithStatus(selectedDate);
      setDesksWithStatus(desksWithStatus);
    } catch (error) {
      console.error("Error fetching desks:", error);
      setError("Error fetching desks.");
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await listReservations();
      setReservations(response.data);
      console.log("Fetched reservations:", response.data);
    } catch (error) {
      setError("Error fetching reservations.");
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

    const reservationDate = selectedDate.toISOString().split("T")[0];
    const reservationData = {
      userId: selectedCalisan,
      deskId: selectedChair,
      reservationDate: reservationDate,
    };

    // Check if the user already has any reservation for the selected date
    const userReservations = reservations.filter(
      (reservation) =>
        reservation.userId === parseInt(selectedCalisan) &&
        reservation.reservationDate === reservationDate
    );

    if (userReservations.length > 0) {
      setError("Bu tarih için bir rezervasyon zaten var.");
      setSuccess(false);
      return;
    }

    // Check if the chair is already reserved for the selected date
    const existingReservation = reservations.find(
      (reservation) =>
        reservation.deskId === selectedChair &&
        reservation.reservationDate === reservationDate
    );

    if (existingReservation) {
      setError("Bu masada rezervasyon zaten var.");
      setSuccess(false);
      return;
    }

    try {
      await createReservation(reservationData);
      setSuccess(true);
      setError(null);
      onSubmit(reservationData);
      // Update the reservations state after successfully creating a reservation
      setReservations((prev) => [...prev, reservationData]);
      console.log("New reservation added:", reservationData);
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
      setError("Rezervasyonlar getirilemedi.");
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
      {/* <h3>Form Component</h3> */}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">İşlem başarıyla yapıldı!</Alert>}
      {silMode ? (
        <>
          <Button variant="primary" onClick={handleShowCalisanSelect}>
            Çalışana Göre
          </Button>
          {/* <Button
            variant="secondary"
            onClick={() => setShowCalisanSelect(false)}
          >
            Masaya Göre
          </Button> */}
          {showCalisanSelect && (
            <>
              <Form.Group controlId="calisanSelect">
                <Form.Label></Form.Label>
                <Form.Control
                  as="select"
                  value={selectedCalisan}
                  onChange={handleCalisanChange}
                >
                  <option value="">Çalışan Seç</option>
                  {calisanlar.map((calisan) => (
                    <option key={calisan.id} value={calisan.id}>
                      {calisan.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" onClick={handleDeleteByWorker}>
                Rezervasyonları Getir
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
              <Form.Label></Form.Label>
              <Form.Control
                as="select"
                value={selectedCalisan}
                onChange={handleCalisanChange}
              >
                <option value="">Çalışan Seç</option>
                {calisanlar.map((calisan) => (
                  <option key={calisan.id} value={calisan.id}>
                    {calisan.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}

          <Form.Group controlId="odaSelect">
            <Form.Label></Form.Label>
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
              selectedDate={selectedDate}
            />
          )}

          {selectedChair && (
            <div className="text-center mt-3">
              <Alert variant="info">Seçilen Masa: {selectedChair}</Alert>
            </div>
          )}
          <div className="d-flex justify-content-center mt-4">
            <Button variant="success" type="submit">
              Reserve Et
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
};

export default FormComponent;
