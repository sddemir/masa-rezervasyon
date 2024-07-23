import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Table from "./Table";
import Chair from "./Chair";

const Scene = ({ selectedOda, onChairSelect }) => {
  const [selectedChair, setSelectedChair] = useState(null);

  const handleChairClick = (chairId) => {
    setSelectedChair(chairId);
    onChairSelect(chairId);
  };

  const chairsPerTable = (tablePosition, startNumber, chairPositions) => {
    return chairPositions.map((positionOffset, index) => (
      <Chair
        key={startNumber + index}
        position={[
          tablePosition[0] + positionOffset[0],
          tablePosition[1] + positionOffset[1],
          tablePosition[2] + positionOffset[2],
        ]}
        number={startNumber + index}
        isSelected={selectedChair === startNumber + index}
        onSelect={handleChairClick}
      />
    ));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "20px",
      }}
    >
      <Canvas
        style={{
          height: "calc(100vh - 40px)",
          width: "75%",
          marginRight: "20px",
        }}
        camera={{ position: [0, 50, 40], fov: 60 }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} />

        <Table position={[-10, 15, 15]} size={[6, 1, 4]} />
        {chairsPerTable([-10, 15, 15], 1, [
          [-2.5, 0, 2.5],
          [2.5, 0, 2.5],
          [-2.5, 0, -2.5],
          [2.5, 0, -2.5],
        ])}

        <Table position={[10, 15, 15]} size={[6, 1, 4]} />
        {chairsPerTable([10, 15, 15], 5, [
          [-2.5, 0, 2.5],
          [2.5, 0, 2.5],
          [-2.5, 0, -2.5],
          [2.5, 0, -2.5],
        ])}

        <Table position={[-10, 15, -10]} size={[6, 1, 4]} />
        {chairsPerTable([-10, 15, -10], 9, [
          [-2.5, 0, 2.5],
          [2.5, 0, 2.5],
          [-2.5, 0, -2.5],
          [2.5, 0, -2.5],
        ])}

        <Table position={[10, 15, -10]} size={[6, 1, 4]} />
        {chairsPerTable([10, 15, -10], 13, [
          [-2.5, 0, 2.5],
          [2.5, 0, 2.5],
          [-2.5, 0, -2.5],
          [2.5, 0, -2.5],
        ])}

        <Table position={[0, 15, -5]} size={[6, 1, 4]} />
        {chairsPerTable([0, 15, -5], 17, [
          [-2.5, 0, 0],
          [2.5, 0, 0],
        ])}

        <Table position={[0, 15, 5]} size={[6, 1, 4]} />
        {chairsPerTable([0, 15, 5], 19, [
          [-2.5, 0, 0],
          [2.5, 0, 0],
        ])}

        <Table position={[0, 15, 15]} size={[6, 1, 4]} />
        {chairsPerTable([0, 15, 15], 21, [
          [-2.5, 0, 0],
          [2.5, 0, 0],
        ])}
      </Canvas>

      <div
        style={{
          padding: "20px",
          backgroundColor: "#f0f0f0",
          flex: "0 0 auto",
          minWidth: "25%",
          maxWidth: "25%",
        }}
      >
        <div className="kroki-component" style={{ textAlign: "center" }}>
          <h4 style={{ marginTop: 0, marginBottom: "10px" }}>
            Seçilen Oda: {selectedOda}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Scene;
