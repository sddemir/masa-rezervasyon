// DisableButtons.js
import React from "react";

const DisableButtons = ({ date, children }) => {
  const today = new Date();
  const isPastWeek = today > new Date(date) && today.getDay() !== 6; // Disable if the date has passed and it's not Saturday
  return React.Children.map(children, (child) =>
    React.cloneElement(child, { disableButtons: isPastWeek })
  );
};

export default DisableButtons;
