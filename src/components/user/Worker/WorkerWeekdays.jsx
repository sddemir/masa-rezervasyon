import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import Day from "../../shared/Day";
import FormComponent from "./FormComponent";
import "./WorkerWeekdays.css";
import { listReservations } from "../../../services/userService";

const WorkerWeekdays = ({ userId }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const [numbers, setNumbers] = useState({});
  const [nextWeekVisible, setNextWeekVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Add state for selected date
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch all reservations
  const fetchReservations = async () => {
    try {
      const response = await listReservations();
      console.log("Fetching reservations for userId:", userId);
      console.log("Reservations response:", response.data); // Add logging

      if (response.data && Array.isArray(response.data)) {
        setReservations(response.data);
        // Filter reservations for the current user
        const userReservations = response.data.filter(
          (reservation) => reservation.userId === userId
        );
        setFilteredReservations(userReservations);

        // Calculate reservation counts
        const reservationCounts = {};
        response.data.forEach((reservation) => {
          const reservationDate = new Date(reservation.reservationDate);
          const dayName = days[reservationDate.getDay() - 1]; // Adjust based on your day names
          if (dayName) {
            reservationCounts[dayName] = (reservationCounts[dayName] || 0) + 1;
          }
        });
        setNumbers(reservationCounts);
      } else {
        setReservations([]);
        setFilteredReservations([]);
        setNumbers({});
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setError("Error fetching reservations");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [userId]);

  useEffect(() => {
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

  const handleGuncelleClick = (day, date) => {
    // Updated to accept date
    console.log(`Güncelle clicked for ${day}`);
    setSelectedDate(date); // Set the selected date
    setFormVisible(true);
  };

  const handleSilClick = async (reservationId) => {
    try {
      await deleteReservation(reservationId);
      setSuccess(true);
      setError(null);
      fetchReservations(); // Refresh reservations list
    } catch (error) {
      console.error("Error deleting reservation:", error);
      setError("Failed to delete reservation");
      setSuccess(false);
    }
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

    setNextWeekVisible(today >= nextFriday);
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
                onGuncelleClick={() =>
                  handleGuncelleClick(day, weekDates[index])
                } // Pass date here
                isCurrentDay={day === days[new Date().getDay() - 1]}
                number={numbers[day] || 0} // This shows the reservation count
                disableButtons={isPastWeek && isSaturdayOrLater}
              />
            </Col>
          ))}
        </Row>
      </Container>
      {formVisible && (
        <FormComponent
          onSubmit={fetchReservations}
          userId={userId} // Pass userId to FormComponent
          selectedDate={selectedDate} // Pass selected date to FormComponent
        />
      )}
      <Container className="mt-4">
        <h4>My Reservations</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">Reservation deleted successfully!</Alert>
        )}
        <ul>
          {filteredReservations.length === 0 && <li>No reservations found.</li>}
          {filteredReservations.map((reservation) => (
            <li key={reservation.id}>
              {reservation.reservationDate} - Desk ID: {reservation.deskId}{" "}
              <Button
                variant="danger"
                onClick={() => handleSilClick(reservation.id)}
              >
                Sil
              </Button>
            </li>
          ))}
        </ul>
      </Container>
    </Container>
  );
};

export default WorkerWeekdays;
