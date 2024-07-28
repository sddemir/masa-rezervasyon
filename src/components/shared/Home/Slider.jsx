import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Slider.css";

const Slider = () => {
  const [index, setIndex] = useState(0);
  const [slides] = useState([
    {
      id: 1,
      image: "https://nitda.gov.ng/wp-content/uploads/2020/06/Department.jpg",
      caption: "Departman",
    },
    {
      id: 2,
      image:
        "https://bigredcloud.com/wp-content/uploads/2016/06/Tthree-ways-your-company-can-benefit-from-collaborating-with-other-companies.jpg",
      caption: "Şirket",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="slider">
      <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
        {slides.map((slide) => (
          <Carousel.Item key={slide.id}>
            <img
              className="d-block w-100 slider-image"
              src={slide.image}
              alt={slide.caption}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;
