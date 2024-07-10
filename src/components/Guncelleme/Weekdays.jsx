import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import Day from "./Day";
import FormComponent from "./Form";
import "./Weekdays.css";

const Weekdays = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const [numbers, setNumbers] = useState({});

  useEffect(() => {
    fetchNumbers();
  }, [currentMonday]);

  function getMonday(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
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
    prevMonday.setDate(currentMonday.getDate() - 7);
    setCurrentMonday(prevMonday);
  };

  const handleNextWeek = () => {
    const nextMonday = new Date(currentMonday);
    nextMonday.setDate(currentMonday.getDate() + 7);
    setCurrentMonday(nextMonday);
  };

  const weekDates = getCurrentWeekDates(currentMonday);

  const handleButtonClick1 = (day) => {
    console.log(`Button 1 clicked for ${day}`);
  };

  const handleButtonClick2 = (day) => {
    console.log(`Button 2 clicked for ${day}`);
  };

  const formatDateRange = (start, end) => {
    const options = { month: "2-digit", day: "2-digit", year: "2-digit" };
    return `${start.toLocaleDateString(
      undefined,
      options
    )} - ${end.toLocaleDateString(undefined, options)}`;
  };

  const handleFormSubmit = (data) => {
    console.log("Form submitted with data:", data);
    // Add your submission logic here
  };

  return (
    <Container>
      <Container className="weekdays-container">
        <div className="week-navigation text-center mb-4">
          <Button variant="outline-primary" onClick={handlePrevWeek}>
            &lt;
          </Button>
          <span className="mx-3">
            {formatDateRange(weekDates[0], weekDates[4])}
          </span>
          <Button variant="outline-primary" onClick={handleNextWeek}>
            &gt;
          </Button>
        </div>
        <Row className="justify-content-center">
          {days.map((day, index) => (
            <Col key={day} xs={12} sm={6} md={4} lg={2} className="mb-3">
              <Day
                dayName={day}
                date={weekDates[index]}
                onButtonClick1={() => handleButtonClick1(day)}
                onButtonClick2={() => handleButtonClick2(day)}
                isCurrentDay={day === days[new Date().getDay() - 1]}
                number={numbers[day] || 0}
              />
            </Col>
          ))}
        </Row>
      </Container>
      <FormComponent onSubmit={handleFormSubmit} />
    </Container>
  );
};

export default Weekdays;
