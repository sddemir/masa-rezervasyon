import { useState, useEffect } from "react";

const OfficeLayoutUrl = "/src/assets/Untitled.svg"; // Update with your SVG file path

const Home = () => {
  const [deskStatus, setDeskStatus] = useState({}); // State to hold desk statuses

  useEffect(() => {
    const fetchDeskStatus = async () => {
      try {
        // Fetch SVG content
        const response = await fetch(OfficeLayoutUrl);
        const svgText = await response.text();

        // Parse SVG content
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

        // Get all rect elements with cell-id, x, and y attributes
        const rectElements = svgDoc.querySelectorAll("rect[cell-id]");
        const desks = Array.from(rectElements).map((rect) => ({
          id: rect.getAttribute("cell-id"),
          x: parseFloat(rect.getAttribute("x")),
          y: parseFloat(rect.getAttribute("y")),
          width: parseFloat(rect.getAttribute("width")),
          height: parseFloat(rect.getAttribute("height")),
        }));

        // Simulate desk status (replace with your fetched data)
        const fetchedDeskStatus = {
          "46S0XoWyPmuPGEp5HEQX-30": true,
          "46S0XoWyPmuPGEp5HEQX-35": false,
          "46S0XoWyPmuPGEp5HEQX-40": true,
          "46S0XoWyPmuPGEp5HEQX-45": true,
          "46S0XoWyPmuPGEp5HEQX-55": false,
        };

        // Update desk status state
        setDeskStatus(fetchedDeskStatus);

        // Render circles based on desk status
        desks.forEach((desk) => {
          const status = fetchedDeskStatus[desk.id];

          const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          circle.setAttribute("cx", desk.x + desk.width / 2);
          circle.setAttribute("cy", desk.y + desk.height / 2);
          circle.setAttribute("r", "20");
          circle.setAttribute("fill", status ? "red" : "green");

          svgDoc.documentElement.appendChild(circle);
        });

        // Replace SVG content in the DOM
        const svgContainer = document.querySelector(".office-layout");
        svgContainer.innerHTML = "";
        svgContainer.appendChild(svgDoc.documentElement);
      } catch (error) {
        console.error("Error fetching or parsing SVG:", error);
      }
    };

    fetchDeskStatus();
  }, []);

  return (
    <div className="home">
      <div className="office-layout"></div>
    </div>
  );
};

export default Home;
