import React from "react";
import { Card, Button } from "react-bootstrap";
import "./Day.css";

const Day = ({
  dayName,
  date,
  onButtonClick1,
  onButtonClick2,
  isCurrentDay,
  number,
}) => {
  const formattedDate = date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <Card
      className={`day-card text-center ${isCurrentDay ? "current-day" : ""}`}
    >
      <Card.Body>
        <Card.Title>
          {dayName} - {formattedDate}
        </Card.Title>
        <Card.Text>
          <strong>Number: {number}</strong>
        </Card.Text>
        <Button variant="primary" onClick={onButtonClick1} className="mr-2">
          Güncelle
        </Button>
        <Button variant="danger" onClick={onButtonClick2}>
          Sil
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Day;
