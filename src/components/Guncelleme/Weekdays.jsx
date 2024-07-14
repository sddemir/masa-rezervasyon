import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, ListGroup } from "react-bootstrap";
import axios from "axios";
import Day from "./Day";
import FormComponent from "./Form";
import "./Weekdays.css";

const Weekdays = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const [numbers, setNumbers] = useState({});
  const [nextWeekVisible, setNextWeekVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [silMode, setSilMode] = useState(false);
  const [silModeOptions, setSilModeOptions] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [calisanlar, setCalisanlar] = useState([]);
  const [departmanlar, setDepartmanlar] = useState([]);
  const [odalar, setOdalar] = useState([]);
  const [masalar, setMasalar] = useState([]);
  const [reservationData, setReservationData] = useState([]);

  useEffect(() => {
    const today = new Date();
    if (today.getDay() === 6 || today.getDay() === 0) {
      setCurrentMonday(getNextMonday(today));
    } else {
      setCurrentMonday(getMonday(today));
    }
  }, []);

  useEffect(() => {
    fetchNumbers();
    checkNextWeekVisibility(currentMonday);
  }, [currentMonday]);

  function getMonday(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  function getNextMonday(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? 1 : 8 - day);
    return new Date(date.setDate(diff));
  }

  const getCurrentWeekDates = (monday) => {
    return days.map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  };

  const fetchNumbers = async () => {
    try {
      const response = await axios.get("/your-backend-endpoint", {
        params: { startDate: currentMonday },
      });
      setNumbers(response.data);
    } catch (error) {
      console.error("Error fetching numbers:", error);
    }
  };

  const handlePrevWeek = () => {
    const prevMonday = new Date(currentMonday);
    prevMonday.setDate(prevMonday.getDate() - 7);
    setCurrentMonday(prevMonday);
    checkNextWeekVisibility(prevMonday);
  };

  const handleNextWeek = () => {
    const nextMonday = new Date(currentMonday);
    nextMonday.setDate(nextMonday.getDate() + 7);
    setCurrentMonday(nextMonday);
    checkNextWeekVisibility(nextMonday);
  };

  const weekDates = getCurrentWeekDates(currentMonday);

  const handleButtonClick1 = (day) => {
    console.log(`Button 1 clicked for ${day}`);
    setFormVisible(false); // Hide FormComponent if Güncelle is clicked
    setSilMode(false); // Hide Sil mode options if Güncelle is clicked
  };

  const handleButtonClick2 = (day) => {
    console.log(`Button 2 clicked for ${day}`);
    setFormVisible(false); // Hide FormComponent if Sil is clicked
    setSilMode(false); // Hide Sil mode options if Sil is clicked
  };

  const handleGuncelleClick = (day) => {
    console.log(`Güncelle clicked for ${day}`);
    setFormVisible(true);
    setSilMode(false); // Ensure Sil mode is hidden if Güncelle is clicked
    setSilModeOptions(null); // Reset Sil mode options when switching to Güncelle
  };

  const handleSilClick = (day) => {
    console.log(`Sil clicked for ${day}`);
    setSilMode(true);
    setSelectedDay(day);
    setFormVisible(false); // Hide FormComponent if Sil is clicked
  };

  const handleSelectChange = (event, type) => {
    const value = event.target.value;
    console.log(`${type} selected: ${value}`);
    // Fetch and display the reservation data based on the selection
  };

  const handleFormSubmit = (data) => {
    console.log("Form submitted with data:", data);
    // Add your submission logic here
  };

  const handleDeleteReservation = (id) => {
    console.log(`Delete reservation with id: ${id}`);
    // Add your deletion logic here
  };

  const formatDateRange = (start, end) => {
    const options = { month: "2-digit", day: "2-digit", year: "2-digit" };
    return `${start.toLocaleDateString(
      undefined,
      options
    )} - ${end.toLocaleDateString(undefined, options)}`;
  };

  const checkNextWeekVisibility = (currentMondayDate) => {
    const today = new Date();
    const nextFriday = new Date(currentMondayDate);
    nextFriday.setDate(currentMondayDate.getDate() + 4); // Assuming Friday is 4 days after Monday

    if (today >= nextFriday) {
      setNextWeekVisible(true);
    } else {
      setNextWeekVisible(false);
    }
  };

  const isCurrentWeek =
    currentMonday.getTime() === getMonday(new Date()).getTime();
  const isPastWeek = currentMonday < getMonday(new Date());

  const today = new Date();
  const isSaturdayOrLater = today.getDay() === 6 || today.getDay() === 0;

  return (
    <Container>
      <Container className="weekdays-container">
        <div className="week-navigation text-center mb-4">
          {!isCurrentWeek && (
            <Button variant="outline-primary" onClick={handlePrevWeek}>
              &lt;
            </Button>
          )}
          <span className="mx-3">
            {formatDateRange(weekDates[0], weekDates[4])}
          </span>
          {nextWeekVisible && (
            <Button variant="outline-primary" onClick={handleNextWeek}>
              &gt;
            </Button>
          )}
        </div>
        <Row className="justify-content-center">
          {days.map((day, index) => (
            <Col key={day} xs={12} sm={6} md={4} lg={2} className="mb-3">
              <Day
                dayName={day}
                date={weekDates[index]}
                onButtonClick1={() => handleButtonClick1(day)}
                onButtonClick2={() => handleButtonClick2(day)}
                onGuncelleClick={() => handleGuncelleClick(day)}
                onSilClick={() => handleSilClick(day)}
                isCurrentDay={day === days[new Date().getDay() - 1]}
                number={numbers[day] || 0}
                disableButtons={isPastWeek && isSaturdayOrLater}
              />
            </Col>
          ))}
        </Row>
      </Container>
      {formVisible && <FormComponent onSubmit={handleFormSubmit} />}
      {silMode && (
        <div className="sil-mode-options">
          <Button
            variant="primary"
            onClick={() => setSilModeOptions("calisan")}
          >
            Çalışana Göre
          </Button>
          <Button variant="secondary" onClick={() => setSilModeOptions("masa")}>
            Masaya Göre
          </Button>
        </div>
      )}
      {silModeOptions === "calisan" && (
        <Form.Group>
          <Form.Label>Çalışanlar</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => handleSelectChange(e, "calisan")}
          >
            {calisanlar.map((calisan) => (
              <option key={calisan.id} value={calisan.id}>
                {calisan.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      )}
      {silModeOptions === "masa" && (
        <>
          <Form.Group>
            <Form.Label>Departmanlar</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => handleSelectChange(e, "departman")}
            >
              {departmanlar.map((departman) => (
                <option key={departman.id} value={departman.id}>
                  {departman.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Odalar</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => handleSelectChange(e, "oda")}
            >
              {odalar.map((oda) => (
                <option key={oda.id} value={oda.id}>
                  {oda.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Masalar</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => handleSelectChange(e, "masa")}
            >
              {masalar.map((masa) => (
                <option key={masa.id} value={masa.id}>
                  {masa.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </>
      )}
      {reservationData.length > 0 && (
        <Container className="mt-4">
          <h5>Reservation Data</h5>
          <ListGroup>
            {reservationData.map((reservation) => (
              <ListGroup.Item key={reservation.id}>
                {reservation.data}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteReservation(reservation.id)}
                >
                  Sil
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Container>
      )}
    </Container>
  );
};

export default Weekdays;
