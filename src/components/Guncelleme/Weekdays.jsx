import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Day from "./Day";
import "./Weekdays.css";

const Weekdays = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));

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
  const currentDay = weekDates[new Date().getDay() - 1];

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

  return (
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
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Weekdays;
