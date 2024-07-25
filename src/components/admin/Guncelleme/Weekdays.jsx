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
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const [numbers, setNumbers] = useState({});
  const [nextWeekVisible, setNextWeekVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [silMode, setSilMode] = useState(false);
  const [silModeOptions, setSilModeOptions] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calisanlar, setCalisanlar] = useState([]);
  const [odalar, setOdalar] = useState([]);

  useEffect(() => {
    fetchCalisanlar();
    fetchOdalar();
  }, []);

  useEffect(() => {
    fetchNumbers();
    checkNextWeekVisibility(currentMonday);
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
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Mock data
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
      endDate.setDate(endDate.getDate() + 6);

      const response = await listReservations({
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });

      const reservations = response.data;
      const reservationCounts = {};

      days.forEach((day) => (reservationCounts[day] = 0));

      reservations.forEach((reservation) => {
        const reservationDate = new Date(reservation.reservationDate);
        const reservationDay = days[reservationDate.getDay() - 1];
        if (reservationCounts[reservationDay] !== undefined) {
          reservationCounts[reservationDay]++;
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
    checkNextWeekVisibility(prevMonday);
  };

  const handleNextWeek = () => {
    const nextMonday = new Date(currentMonday);
    nextMonday.setDate(nextMonday.getDate() + 7);
    setCurrentMonday(nextMonday);
    checkNextWeekVisibility(nextMonday);
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
    setSilModeOptions(null);
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

  const weekDates = getCurrentWeekDates(currentMonday);
  const isCurrentWeek =
    currentMonday.getTime() === getMonday(new Date()).getTime();
  const isPastWeek = currentMonday < getMonday(new Date());

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
                onSilClick={() => handleSilClick(day)}
                isCurrentDay={day === days[new Date().getDay() - 1]}
                number={numbers[day] || 0}
                isPastWeek={isPastWeek}
              />
            </Col>
          ))}
        </Row>
        <div className="text-center">
          {isPastWeek && !formVisible && (
            <p className="mt-3">Güncelleme ve Silme işlemleri mevcut değil.</p>
          )}
        </div>
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
