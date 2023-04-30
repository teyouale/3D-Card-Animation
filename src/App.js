import React, { useRef, forwardRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { a } from "@react-spring/three";
import { useSpring } from "react-spring";
import { Mesh } from "three";
import { useTexture } from "@react-three/drei";

const Card = forwardRef(({ position, rotation, texture }, ref) => {
  const imageTexture = useTexture(texture);

  return (
    <a.mesh ref={ref} position={position} rotation={rotation}>
      <boxBufferGeometry args={[2, 4, 0.2]} />
      <meshStandardMaterial map={imageTexture} />
    </a.mesh>
  );
});

const Carousel = () => {
  const numCards = 8;
  const radius = 7;
  const cardsRef = useRef([]);
  const groupRef = useRef();

  const { angle } = useSpring({
    angle: 1,
    config: {
      duration: 5000
    },
    from: {
      angle: 0
    },
    loop: { reverse: true }
  });

  const { bounce } = useSpring({
    bounce: [0, 1, 0],
    config: {
      duration: 1000
    },
    from: {
      bounce: [0, 0, 0]
    },
    loop: { reverse: true }
  });

  // const { rotation } = useSpring({
  //   rotation: [0, 2 * Math.PI, 0],
  //   config: {
  //     duration: 5000
  //   },
  //   from: {
  //     rotation: [0, 0, 0]
  //   },
  //   loop: { reverse: true }
  // });

  useFrame(() => {
    for (let i = 0; i < numCards; i++) {
      const currentAngle =
        (2 * Math.PI * i) / numCards + angle.get() * 2 * Math.PI;
      const x = radius * Math.cos(currentAngle);
      const z = radius * Math.sin(currentAngle);
      cardsRef.current[i].position.set(x, 0, z);
      cardsRef.current[i].rotation.set(0, -currentAngle, 0);
    }
  });

  const cards = [];
  for (let i = 0; i < numCards; i++) {
    const angle = (2 * Math.PI * i) / numCards;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    cards.push(
      <Card
        key={i}
        ref={(el) => {
          cardsRef.current[i] = el;
        }}
        texture={"/card-image.jpg"}
        position={[x, 0, z]}
      />
    );
  }

  return (
    <a.group ref={groupRef} position={bounce}>
      {cards}
    </a.group>
  );
};

const App = () => {
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh" }}
      camera={{ position: [0, 0, 25], fov: 50 }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Carousel />
    </Canvas>
  );
};

export default App;
