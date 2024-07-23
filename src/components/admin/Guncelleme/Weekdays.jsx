import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { listReservations } from "../../../services/userService"; // Import listReservations
import Day from "../../shared/Day";
import axios from "axios";
import FormComponent from "../../shared/Form";
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
  const [odalar, setOdalar] = useState([]);

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
      setCalisanlar([]); // Set empty array in case of error
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
      setOdalar([]); // Set empty array in case of error
    }
  };

  useEffect(() => {
    const today = new Date();
    if (today.getDay() === 6 || today.getDay() === 0) {
      setCurrentMonday(getNextMonday(today));
    } else {
      setCurrentMonday(getMonday(today));
    }
  }, []);

  useEffect(() => {
    fetchCalisanlar();
    fetchOdalar();
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
      const startDate = new Date(currentMonday);
      const endDate = new Date(currentMonday);
      endDate.setDate(endDate.getDate() + 6); // Set end date to 6 days after the start date

      const response = await listReservations({
        startDate: startDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        endDate: endDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      });

      const reservations = response.data;
      const reservationCounts = {};

      // Initialize reservation counts for each day of the week
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
    setFormVisible(true); // Show FormComponent if Sil is clicked
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
                onButtonClick1={() => handleButtonClick1(day)}
                onButtonClick2={() => handleButtonClick2(day)}
                onGuncelleClick={() => handleGuncelleClick(day)}
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
          onSubmit={handleFormSubmit}
          silMode={silMode}
          includeCalisanSelect={true}
          calisanlar={calisanlar}
          odalar={odalar}
          selectedDay={selectedDay}
          onSelectChange={handleSelectChange}
          onDelete={handleDeleteReservation}
        />
      )}
    </Container>
  );
};

export default Weekdays;
