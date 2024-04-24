import React, { useState, useEffect, useRef } from 'react'
import { Knob } from 'react-rotary-knob'
import WaveformVisualizer from './waveformvisualizer'




const OscillatorModule = ({ initialPosition, id, removeModule }) => {
  const [position, setPosition] = useState(initialPosition); // Starting position
  const [dragging, setDragging] = useState(false)
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 })
  const [frequency, setFrequency] = useState(440) // Default frequency: A4 note
  const [volume, setVolume] = useState(0.5) // Default volume

  const audioContextRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainNodeRef = useRef(null)
  
  const [selection, setSelection] = useState('sin')

  const DropdownMenu = ({ selection, setSelection }) => {
    // State to manage dropdown visibility
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle dropdown visibility
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    return (
      <div className="dropdown absolute left-[3.6rem]" >
        {/* Button to toggle dropdown */}
        <button
          className="dropdown-toggle bg-black  bg-opacity-15 border w-[5rem] border-t-0 border-moduleGreen text-text1  rounded-md rounded-t-none"
          onClick={toggleDropdown}
        >
          {selection.replace(/^\w/, (c) => c.toUpperCase())}
        </button>

        {/* Dropdown content */}
        {isOpen && (
          <div className="dropdown-menu bg-[#133b2e] rounded-md p-1 border border-white border-opacity-20 mt-1">
            <ul>
              <li
                className="hover:bg-[rgba(248,255,252,0.12)] bg-opacity-15 transition-all rounded-md pl-1 pr-1"
                onClick={() => setSelection('sin')}
              >
                Sine
              </li>
              <li
                className="hover:bg-[rgba(248,255,252,0.12)] bg-opacity-15 transition-all rounded-md pl-1 pr-1"
                onClick={() => setSelection('sawtooth')}
              >
                Sawtooth
              </li>
              <li
                className="hover:bg-[rgba(248,255,252,0.12)] bg-opacity-15 transition-all rounded-md pl-1 pr-1"
                onClick={() => setSelection('square')}
              >
                Square
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.AudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = selection
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()

    audioContextRef.current = audioContext
    oscillatorRef.current = oscillator
    gainNodeRef.current = gainNode

    return () => {
      oscillator.stop()
      oscillator.disconnect()
      gainNode.disconnect()
      audioContext.close()
    }
  }, [selection])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        const deltaX = e.clientX - lastMousePosition.x
        const deltaY = e.clientY - lastMousePosition.y
        setPosition((prevPosition) => ({
          x: prevPosition.x + deltaX,
          y: prevPosition.y + deltaY
        }))
        setLastMousePosition({ x: e.clientX, y: e.clientY })
      }
    }

    const handleMouseUp = (e) => {
      if (e.button === 2) {
        // Right mouse button
        setDragging(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, lastMousePosition])

  const handleMouseDown = (e) => {
    if (e.button === 2) {
      // Right mouse button
      e.preventDefault() // Prevent the context menu
      setDragging(true)
      setLastMousePosition({ x: e.clientX, y: e.clientY })
    }
  }

  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    }
  }, [frequency]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    }
  }, [volume]);

  return (
    <div
      className="bg-moduleGreen border border-white border-opacity-20 rounded-lg module-shadow flex flex-col p-1"
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
      <h1 className="font-serif text-text1">Oscillator Module</h1>

      <div className=" flex bg-black inset-shadow bg-opacity-60 rounded-md mb-1 w-full h-full overflow-hidden">
        {oscillatorRef.current && <WaveformVisualizer waveType={selection} frequency={frequency} />}
      </div>
      <div className=" flex w-full h-full bg-white bg-opacity-10 rounded-md">
        <Knob
          value={frequency}
          onChange={(value: React.SetStateAction<number>) => {
            setFrequency(value)
            if (oscillatorRef.current) {
              oscillatorRef.current.frequency.setValueAtTime(
                value,
                audioContextRef.current.currentTime
              )
            }
          }}
          min={20}
          max={2000}
          unlockDistance={0}
          className="rotate-180 absolute bottom-[-1.4rem] left-[1rem]"
        />
        <Knob
          value={volume}
          onChange={(value) => {
            setVolume(value)
            if (gainNodeRef.current) {
              gainNodeRef.current.gain.setValueAtTime(value, audioContextRef.current.currentTime)
            }
          }}
          min={0}
          max={1}
          step={0.01}
          unlockDistance={0}
          className="rotate-180 absolute bottom-[-1.4rem] left-[4.5rem]"
        />
        <DropdownMenu selection={selection} setSelection={setSelection} />
        <button className=" absolute rounded-full w-[1rem] h-[1rem] bg-black bg-opacity-50 bottom-[10px] left-[10px]"></button>
        <button className=" absolute rounded-full w-[1rem] h-[1rem] bg-black bg-opacity-50 bottom-[10px] right-[10px]"></button>
        <button
          onClick={removeModule}
          className="flex pl-[4px] pt-[1px] rounded-full w-4 h-4 text-black bg-white bg-opacity-25 text-xs font-bold font-mono absolute top-[7px] right-[6px]"
        >
          X
        </button>
        </div>
    </div>
  )
}

export default OscillatorModule
