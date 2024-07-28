import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { listReservations } from "../../../services/userService";
import Day from "../../shared/Day";
import axios from "axios";
import FormComponent from "../../shared/Form";
import "./Weekdays.css";

// Define utility functions at the top
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

const Weekdays = () => {
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const [numbers, setNumbers] = useState({});
  const [nextWeekVisible, setNextWeekVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [silMode, setSilMode] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calisanlar, setCalisanlar] = useState([]);
  const [odalar, setOdalar] = useState([]);
  const [firstWeekMonday, setFirstWeekMonday] = useState(getMonday(new Date()));

  useEffect(() => {
    fetchCalisanlar();
    fetchOdalar();
  }, []);

  useEffect(() => {
    fetchNumbers();
    checkNextWeekVisibility(currentMonday);
    // Update the state of firstWeekMonday when the currentMonday changes
    const today = new Date();
    const firstMonday = getMonday(today);
    setFirstWeekMonday(firstMonday);
  }, [currentMonday]);

  const fetchCalisanlar = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users");
      const formattedData = response.data.map((calisan) => ({
        ...calisan,
        name: `${calisan.first_name} ${calisan.last_name}`,
      }));
      setCalisanlar(formattedData);
    } catch (error) {
      console.error("Error fetching calisanlar:", error);
      setCalisanlar([]);
    }
  };

  const fetchOdalar = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockOdalar = [
        { id: 1, name: "Meeting Room 1" },
        { id: 2, name: "Office 101" },
      ];
      setOdalar(mockOdalar);
    } catch (error) {
      console.error("Error fetching odalar:", error);
      setOdalar([]);
    }
  };

  const fetchNumbers = async () => {
    try {
      const startDate = new Date(currentMonday);
      const endDate = new Date(currentMonday);
      endDate.setDate(endDate.getDate() + 6); // End of the week (Sunday)

      const response = await listReservations();
      const reservations = response.data;

      const reservationCounts = {};
      const date = new Date(startDate);

      while (date <= endDate) {
        const dateString = date.toISOString().split("T")[0];
        reservationCounts[dateString] = 0;
        date.setDate(date.getDate() + 1);
      }

      reservations.forEach((reservation) => {
        const reservationDate = reservation.reservationDate; // "YYYY-MM-DD"
        if (reservationCounts.hasOwnProperty(reservationDate)) {
          reservationCounts[reservationDate]++;
        }
      });

      setNumbers(reservationCounts);
    } catch (error) {
      console.error("Error fetching numbers:", error);
    }
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

  const getCurrentWeekDates = (monday) => {
    return days.map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  };

  const handleGuncelleClick = (dayName, date) => {
    setSelectedDate(date);
    setFormVisible(true);
    setSilMode(false);
  };

  const handleSilClick = (day) => {
    setSilMode(true);
    setSelectedDay(day);
    setFormVisible(true);
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
    const endOfCurrentWeek = new Date(getMonday(today));
    endOfCurrentWeek.setDate(endOfCurrentWeek.getDate() + 6); // End of the week (Sunday)

    return monday < endOfCurrentWeek;
  };

  const weekDates = getCurrentWeekDates(currentMonday);
  const isPast = !isPastWeek(currentMonday);
  const isFirstWeek = currentMonday.getTime() === firstWeekMonday.getTime();

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
                onSilClick={() => handleSilClick(day)}
                isCurrentDay={day === days[new Date().getDay() - 1]}
                number={
                  numbers[weekDates[index].toISOString().split("T")[0]] || 0
                }
                disableButtons={!isPast}
              />
            </Col>
          ))}
        </Row>
      </Container>
      {formVisible && (
        <FormComponent
          onSubmit={() => {}}
          silMode={silMode}
          includeCalisanSelect={true}
          calisanlar={calisanlar}
          odalar={odalar}
          selectedDay={selectedDay}
          selectedDate={selectedDate}
        />
      )}
    </Container>
  );
};

export default Weekdays;
