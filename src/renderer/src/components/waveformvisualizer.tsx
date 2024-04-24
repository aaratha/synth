import React, { useRef, useEffect } from 'react';

const WaveformVisualizer = ({ audioContext, oscillator }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!audioContext || !oscillator) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = audioContext.createAnalyser();

    // Connect the oscillator to the analyser
    oscillator.connect(analyser);
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Setup the canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = 200;

    const drawWaveform = () => {
      requestAnimationFrame(drawWaveform);

      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(0, 0, 0)';

      ctx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    drawWaveform();

    return () => {
      // Clean up the canvas when the component unmounts
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      analyser.disconnect();
      oscillator.disconnect(analyser);
    };
  }, [audioContext, oscillator]);

  return <canvas ref={canvasRef}></canvas>;
};

export default WaveformVisualizer;
