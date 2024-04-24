
import React, { useState, useEffect, useRef } from 'react';
import { Knob } from 'react-rotary-knob';
import WaveformVisualizer from './waveformvisualizer';

const Module = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Starting position
  const [dragging, setDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [frequency, setFrequency] = useState(440); // Default frequency: A4 note
  const [volume, setVolume] = useState(0.5); // Default volume

  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    audioContextRef.current = audioContext;
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    return () => {
      oscillator.stop();
      oscillator.disconnect();
      gainNode.disconnect();
      audioContext.close();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        const deltaX = e.clientX - lastMousePosition.x;
        const deltaY = e.clientY - lastMousePosition.y;
        setPosition(prevPosition => ({
          x: prevPosition.x + deltaX,
          y: prevPosition.y + deltaY
        }));
        setLastMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 2) { // Right mouse button
        setDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    };

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, lastMousePosition]);

  const handleMouseDown = (e) => {
    if (e.button === 2) { // Right mouse button
      e.preventDefault(); // Prevent the context menu
      setDragging(true);
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleFrequencyChange = (e) => {
    const newFrequency = parseFloat(e.target.value);
    setFrequency(newFrequency);
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(newFrequency, audioContextRef.current.currentTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVolume, audioContextRef.current.currentTime);
    }
  };

  return (
    <div
      className="bg-moduleGreen rounded-lg module-shadow flex flex-col p-1"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '200px',
        height: '200px',
        cursor: 'pointer',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      <h1>Oscillator Module</h1>
      <div className='flex bg-black bg-opacity-60 rounded-md mb-1 w-full h-full'>
      </div>
      <div className=' flex w-full h-full bg-white bg-opacity-15 rounded-md'>
        <Knob
            value={frequency}
            onChange={value => {
              setFrequency(value);
              if (oscillatorRef.current) {
                oscillatorRef.current.frequency.setValueAtTime(value, audioContextRef.current.currentTime);
              }
            }}
            min={20}
            max={2000}
            unlockDistance={0}
            className="rotate-180 absolute bottom-[-0.6rem] left-[1.8rem]"
          />
          <Knob
            value={volume}
            onChange={value => {
              setVolume(value);
              if (gainNodeRef.current) {
                gainNodeRef.current.gain.setValueAtTime(value, audioContextRef.current.currentTime);
              }
            }}
            min={0}
            max={1}
            step={0.01}
            unlockDistance={0}
            className="rotate-180 absolute bottom-[-0.6rem] left-[4.0rem]"
          />
          <button className=' absolute rounded-full w-[1rem] h-[1rem] bg-black bg-opacity-50 bottom-[10px] left-[10px]'></button>
          <button className=' absolute rounded-full w-[1rem] h-[1rem] bg-black bg-opacity-50 bottom-[10px] right-[10px]'></button>
      </div>
    </div>
  );
};

export default Module;
