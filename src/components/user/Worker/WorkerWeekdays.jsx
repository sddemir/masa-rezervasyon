import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import Day from "../../shared/Day";
import FormComponent from "./FormComponent";
import "./WorkerWeekdays.css";
import {
  listReservations,
  deleteReservation,
} from "../../../services/userService";

const WorkerWeekdays = ({ userId }) => {
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const [numbers, setNumbers] = useState({});
  const [nextWeekVisible, setNextWeekVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, [userId, currentMonday]);

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
  };

  const handleNextWeek = () => {
    const nextMonday = new Date(currentMonday);
    nextMonday.setDate(nextMonday.getDate() + 7);
    setCurrentMonday(nextMonday);
  };

  const weekDates = getCurrentWeekDates(currentMonday);

  const handleGuncelleClick = (day, date) => {
    setSelectedDate(date);
    setFormVisible(true);
  };

  const handleSilClick = async (reservationId, date) => {
    const today = new Date();
    if (date < today) {
      setError("You cannot delete reservations for past dates.");
      return;
    }

    try {
      await deleteReservation(reservationId);
      setSuccess(true);
      setError(null);
      fetchReservations();
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

  const isDateInPast = (date) => {
    const today = new Date();
    return today > date;
  };

  const fetchReservations = async () => {
    try {
      const response = await listReservations();
      console.log("Fetching reservations for userId:", userId);
      console.log("Reservations response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        const today = new Date();
        const isSaturday = today.getDay() === 6;

        setReservations(response.data);
        const userReservations = response.data.filter(
          (reservation) => reservation.userId === userId
        );

        const reservationCounts = {};
        response.data.forEach((reservation) => {
          const reservationDate = reservation.reservationDate;
          if (reservationCounts.hasOwnProperty(reservationDate)) {
            reservationCounts[reservationDate]++;
          } else {
            reservationCounts[reservationDate] = 1;
          }
        });
        setNumbers(reservationCounts);

        // Determine current and next week boundaries
        const startOfCurrentWeek = getMonday(new Date());
        const endOfCurrentWeek = new Date(startOfCurrentWeek);
        endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 4); // Friday

        const startOfNextWeek = new Date(endOfCurrentWeek);
        startOfNextWeek.setDate(endOfCurrentWeek.getDate() + 3); // Monday of next week

        // Adjust reservation list based on the current date and the day of the week
        if (isSaturday) {
          // If it's Saturday, don't show reservations for the current week
          setFilteredReservations(
            userReservations.filter((reservation) => {
              const reservationDate = new Date(reservation.reservationDate);
              return reservationDate >= startOfNextWeek;
            })
          );
        } else {
          // Show reservations for current and next week
          setFilteredReservations(
            userReservations.filter((reservation) => {
              const reservationDate = new Date(reservation.reservationDate);
              return (
                (reservationDate >= startOfCurrentWeek &&
                  reservationDate <= endOfCurrentWeek) ||
                reservationDate >= startOfNextWeek
              );
            })
          );
        }
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
                }
                onSilClick={(reservationId) =>
                  handleSilClick(reservationId, weekDates[index])
                }
                isCurrentDay={day === days[new Date().getDay() - 1]}
                number={
                  numbers[weekDates[index].toISOString().split("T")[0]] || 0
                }
                disableButtons={isDateInPast(weekDates[index])}
              />
            </Col>
          ))}
        </Row>
      </Container>
      {formVisible && (
        <FormComponent
          onSubmit={fetchReservations}
          userId={userId}
          selectedDate={selectedDate}
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
                onClick={() =>
                  handleSilClick(
                    reservation.id,
                    new Date(reservation.reservationDate)
                  )
                }
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
