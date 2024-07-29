import React from "react";
import { Card, Button } from "react-bootstrap";
import "./Day.css";

const Day = ({
  dayName,
  date,
  onGuncelleClick,
  onSilClick,
  isCurrentDay,
  number,
  disableButtons,
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
          <strong>Rezervasyon Sayısı: {number}</strong>
        </Card.Text>
        <Button
          variant="primary"
          onClick={() => onGuncelleClick(dayName)}
          className="mr-2"
          disabled={disableButtons}
        >
          Güncelle
        </Button>
        <Button
          variant="danger"
          onClick={() => onSilClick(dayName)}
          disabled={disableButtons}
        >
          Sil
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Day;
