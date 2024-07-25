import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

const Chair = ({ position, number, isSelected, isDisabled, onSelect }) => {
  const mesh = useRef(null);

  useFrame(() => {
    mesh.current.material.color.set(
      isSelected ? 0xff0000 : isDisabled ? 0x888888 : 0x00ff00
    );
  });

  useEffect(() => {
    mesh.current.material.color.set(
      isSelected ? 0xff0000 : isDisabled ? 0x888888 : 0x00ff00
    );
  }, [isSelected, isDisabled]);

  const handleOnClick = () => {
    if (!isDisabled) {
      onSelect(number);
    }
  };

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={handleOnClick}
      scale={[2, 2, 2]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={isSelected ? 0xff0000 : isDisabled ? 0x888888 : 0x00ff00}
      />
    </mesh>
  );
};

export default Chair;
