import React from "react";
import { Link as RouterLink } from "react-router-dom";
import "./Link.css";
const Link = ({ title, link, className }) => {
  return (
    <RouterLink to={link} className={className}>
      {title}
    </RouterLink>
  );
};

export default Link;
