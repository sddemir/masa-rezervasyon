import React from "react";

const Table = ({ position, size }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={0x8b4513} />
    </mesh>
  );
};

export default Table;
