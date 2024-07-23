import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

const Chair = ({ position, number, isSelected, onSelect }) => {
  const mesh = useRef(null);

  useFrame(() => {
    mesh.current.material.color.set(isSelected ? 0xff0000 : 0x00ff00);
  });

  useEffect(() => {
    mesh.current.material.color.set(isSelected ? 0xff0000 : 0x00ff00);
  }, [isSelected]);

  const handleOnClick = () => {
    onSelect(number);
  };

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={handleOnClick}
      scale={[2, 2, 2]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={isSelected ? 0xff0000 : 0x00ff00} />
    </mesh>
  );
};

export default Chair;
