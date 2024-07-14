import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";
import axios from "axios";
import Day from "../Guncelleme/Day";
import "./WorkerWeekdays.css";
import FormComponent from "../Guncelleme/Form";

const WorkerWeekdays = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const [numbers, setNumbers] = useState({});
  const [nextWeekVisible, setNextWeekVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [silMode, setSilMode] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
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

  useEffect(() => {
    fetchReservationData();
  }, [silMode, selectedDay]);

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
      const response = {
        data: { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5 },
      };
      setNumbers(response.data);
    } catch (error) {
      console.error("Error fetching numbers:", error);
    }
  };

  const fetchReservationData = () => {
    if (silMode && selectedDay) {
      const placeholderData = [{ id: 1, data: "Reservation 1" }];
      setReservationData(placeholderData);
    } else {
      setReservationData([]);
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

  const checkNextWeekVisibility = (currentMondayDate) => {
    const today = new Date();
    const nextFriday = new Date(currentMondayDate);
    nextFriday.setDate(currentMondayDate.getDate() + 4);

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

  const weekDates = getCurrentWeekDates(currentMonday);

  const handleButtonClick1 = (day) => {
    console.log(`Button 1 clicked for ${day}`);
    setFormVisible(false);
    setSilMode(false);
  };

  const handleButtonClick2 = (day) => {
    console.log(`Button 2 clicked for ${day}`);
    setFormVisible(false);
    setSilMode(false);
  };

  const handleGuncelleClick = (day) => {
    console.log(`Güncelle clicked for ${day}`);
    setFormVisible(true);
    setSilMode(false);
  };

  const handleSilClick = (day) => {
    console.log(`Sil clicked for ${day}`);
    setSilMode(true);
    setSelectedDay(day);
    setFormVisible(false);
  };

  const handleFormSubmit = (data) => {
    console.log("Form submitted with data:", data);
  };

  const handleDeleteReservation = (id) => {
    console.log(`Delete reservation with id: ${id}`);
  };

  const formatDateRange = (start, end) => {
    const options = { month: "short", day: "numeric" };
    return `${start.toLocaleDateString(
      undefined,
      options
    )} - ${end.toLocaleDateString(undefined, options)}`;
  };

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
        <div className="sil-mode-reservations">
          <h5>Reservations for {selectedDay}</h5>
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
        </div>
      )}
    </Container>
  );
};

export default WorkerWeekdays;
