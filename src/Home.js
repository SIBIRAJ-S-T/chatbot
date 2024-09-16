import React, { useState, useEffect } from 'react';

function RotatingCube() {
  const [cubeRotation, setCubeRotation] = useState({ x: 30, y: 45 });
  const [cubeSize, setCubeSize] = useState(100);

  const moveCube = (direction) => {
    switch (direction) {
      case 'up':
        setCubeRotation((prev) => ({ ...prev, x: prev.x - 20 }));
        break;
      case 'down':
        setCubeRotation((prev) => ({ ...prev, x: prev.x + 20 }));
        break;
      case 'left':
        setCubeRotation((prev) => ({ ...prev, y: prev.y - 20 }));
        break;
      case 'right':
        setCubeRotation((prev) => ({ ...prev, y: prev.y + 20 }));
        break;
      default:
        break;
    }
  };

  const changeCubeSize = (operation) => {
    if (operation === 'increase') {
      setCubeSize((prev) => prev + 10);
    } else if (operation === 'decrease' && cubeSize > 10) {
      setCubeSize((prev) => prev - 10);
    }
  };

  return (
    <div>
      <div
        id="cube"
        style={{
          width: `${cubeSize}px`,
          height: `${cubeSize}px`,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg)`,
          transition: 'transform 0.3s ease',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          id="front"
          style={{
            position: 'absolute',
            width: `${cubeSize}px`,
            height: `${cubeSize}px`,
            opacity: 0.5,
            backgroundColor: 'blue',
            transform: `translateZ(${cubeSize / 2}px)`,
            transformStyle: 'preserve-3d',
          }}
        />
        <div
          id="back"
          style={{
            position: 'absolute',
            width: `${cubeSize}px`,
            height: `${cubeSize}px`,
            opacity: 0.5,
            backgroundColor: 'red',
            transform: `translateZ(-${cubeSize / 2}px) rotateY(180deg)`,
            transformStyle: 'preserve-3d',
          }}
        />
        <div
          id="right"
          style={{
            position: 'absolute',
            width: `${cubeSize}px`,
            height: `${cubeSize}px`,
            opacity: 0.5,
            backgroundColor: 'green',
            transform: `translateX(${cubeSize / 2}px) rotateY(90deg)`,
            transformStyle: 'preserve-3d',
          }}
        />
        <div
          id="left"
          style={{
            position: 'absolute',
            width: `${cubeSize}px`,
            height: `${cubeSize}px`,
            opacity: 0.5,
            backgroundColor: 'yellow',
            transform: `translateX(-${cubeSize / 2}px) rotateY(-90deg)`,
            transformStyle: 'preserve-3d',
          }}
        />
        <div
          id="top"
          style={{
            position: 'absolute',
            width: `${cubeSize}px`,
            height: `${cubeSize}px`,
            opacity: 0.5,
            backgroundColor: 'purple',
            transform: `translateY(-${cubeSize / 2}px) rotateX(90deg)`,
            transformStyle: 'preserve-3d',
          }}
        />
        <div
          id="bottom"
          style={{
            position: 'absolute',
            width: `${cubeSize}px`,
            height: `${cubeSize}px`,
            opacity: 0.5,
            backgroundColor: 'orange',
            transform: `translateY(${cubeSize / 2}px) rotateX(-90deg)`,
            transformStyle: 'preserve-3d',
          }}
        />
      </div>

      <button onClick={() => moveCube('up')}>⬆️</button>
      <button onClick={() => moveCube('down')}>⬇️</button>
      <button onClick={() => moveCube('left')}>⬅️</button>
      <button onClick={() => moveCube('right')}>➡️</button>

      <button onClick={() => changeCubeSize('increase')}>+</button>
      <button onClick={() => changeCubeSize('decrease')}>-</button>
    </div>
  );
}

export default RotatingCube;