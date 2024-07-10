import React from "react";
import { Card, Button } from "react-bootstrap";
import "./Day.css";

const Day = ({
  dayName,
  date,
  onButtonClick1,
  onButtonClick2,
  isCurrentDay,
}) => {
  const formattedDate = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <Card
      className={`day-card text-center ${isCurrentDay ? "current-day" : ""}`}
    >
      <Card.Body>
        <Card.Title>{dayName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {formattedDate}
        </Card.Subtitle>
        <Button
          variant="primary"
          onClick={onButtonClick1}
          className="day-button mr-2"
        >
          Button 1
        </Button>
        <Button
          variant="secondary"
          onClick={onButtonClick2}
          className="day-button"
        >
          Button 2
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Day;
