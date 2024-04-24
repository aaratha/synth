
import React, { useRef, useEffect } from 'react';

const WaveformVisualizer = ({ waveType, frequency }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);  // Clear previous drawing
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(146, 255, 255)';

    let x = 0;
    const sliceWidth = width * 1.0 / 500;

    for (let i = 0; i <= 1000; i++) {
      x = sliceWidth * i;
      let y = height / 2;
      const t = i / 1000;
      const theta = t * frequency * 0.1 * Math.PI * 2; // Scale frequency for drawing

      switch (waveType) {
        case 'sin':
          y += (height / 4) * Math.sin(theta); // Scale for canvas size
          break;
        case 'square':
          y += (height / 4) * (Math.sign(Math.sin(theta)) * 0.5 + 0.5);
          break;
        case 'triangle':
          y += (height / 4) * (1 - 4 * Math.abs(Math.round(theta / (2 * Math.PI)) - (theta / (2 * Math.PI))));
          break;
        case 'sawtooth':
          y += (height / 4) * (2 * (theta / (2 * Math.PI) - Math.floor(0.5 + theta / (2 * Math.PI))));
          break;
        default:
          break;
      }

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }, [waveType, frequency]);  // Redraw when these props change

  return <canvas ref={canvasRef} width="300" height="80"></canvas>;
};

export default WaveformVisualizer;
