import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import Day from "../../shared/Day";
import FormComponent from "./FormComponent";
import "./WorkerWeekdays.css";
import {
  listReservations,
  deleteReservation,
} from "../../../services/userService";

const getMonday = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  return new Date(date.setDate(diff));
};

const getNextMonday = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? 1 : 8 - day); // Next Monday
  return new Date(date.setDate(diff));
};

const WorkerWeekdays = ({ userId }) => {
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const [numbers, setNumbers] = useState({});
  const [nextWeekVisible, setNextWeekVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [firstWeekMonday, setFirstWeekMonday] = useState(getMonday(new Date()));

  useEffect(() => {
    fetchReservations();
  }, [userId, currentMonday]);

  useEffect(() => {
    checkNextWeekVisibility(currentMonday);
    // Update the state of firstWeekMonday when the currentMonday changes
    const today = new Date();
    const firstMonday = getMonday(today);
    setFirstWeekMonday(firstMonday);
  }, [currentMonday]);

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

  const checkNextWeekVisibility = (currentMondayDate) => {
    const today = new Date();
    const nextFriday = new Date(currentMondayDate);
    nextFriday.setDate(currentMondayDate.getDate() + 4);

    setNextWeekVisible(today >= nextFriday);
  };

  const formatDateRange = (start, end) => {
    const options = { month: "2-digit", day: "2-digit", year: "2-digit" };
    return `${start.toLocaleDateString(
      undefined,
      options
    )} - ${end.toLocaleDateString(undefined, options)}`;
  };

  const isPastWeek = (monday) => {
    const today = new Date();
    const endOfLastWeek = getMonday(today);
    endOfLastWeek.setDate(endOfLastWeek.getDate() - 1); // End of last week (Saturday)

    return monday <= endOfLastWeek;
  };

  const isWithinCurrentAndNextWeek = (monday) => {
    const today = new Date();
    const currentMonday = getMonday(today);
    const nextMonday = getNextMonday(currentMonday);
    const endOfNextWeek = new Date(nextMonday);
    endOfNextWeek.setDate(nextMonday.getDate() + 6); // End of next week (Sunday)

    return monday >= currentMonday && monday <= endOfNextWeek;
  };

  const weekDates = getCurrentWeekDates(currentMonday);
  const isFirstWeek = currentMonday.getTime() === firstWeekMonday.getTime();

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
      console.error("Rezervasyonlar getirilemedi:", error);
      setError("Rezervasyonlar getirilemedi");
    }
  };

  return (
    <Container>
      <Container className="weekdays-container">
        <div className="week-navigation text-center mb-4">
          <Button
            variant="outline-primary"
            onClick={handlePrevWeek}
            disabled={isFirstWeek} // Disable when on the first week
          >
            &lt;
          </Button>
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
                disableButtons={
                  isPastWeek(currentMonday) &&
                  !isWithinCurrentAndNextWeek(weekDates[index])
                }
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
        <h4>Rezervasyonlarım</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Rezervasyon silindi!</Alert>}
        <ul>
          {filteredReservations.length === 0 && <li>Hiç rezervasyon yok.</li>}
          {filteredReservations.map((reservation) => (
            <li key={reservation.id}>
              {reservation.reservationDate} - Masa ID: {reservation.deskId}{" "}
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
