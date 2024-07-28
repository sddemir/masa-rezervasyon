import React from "react";

const ReservationDisplay = ({ numbers }) => {
  // Calculate the current week's Monday
  const today = new Date();
  const currentDay = today.getDay();
  const daysUntilMonday = (currentDay + 6) % 7; // Calculate days until Monday
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - daysUntilMonday);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div>
      <h2>Rezervasyon Sayısı:</h2>
      <ul>
        {daysOfWeek.map((day, index) => {
          const dateKey = new Date(currentMonday);
          dateKey.setDate(dateKey.getDate() + index);
          const dateString = dateKey.toISOString().split("T")[0]; // "YYYY-MM-DD"
          return (
            <li key={day}>
              {day}: {numbers[dateString] || 0}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ReservationDisplay;
