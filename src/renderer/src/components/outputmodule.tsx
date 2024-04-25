import React, { useState, useEffect, useRef } from 'react'
import { Knob } from 'react-rotary-knob'


const OutputModule = ({ initialPosition, id, removeModule }) => {
  const [position, setPosition] = useState(initialPosition); // Starting position
  const [dragging, setDragging] = useState(false)
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 })


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

  return (
    <div
      className="bg-moduleBlue border border-white border-opacity-20 rounded-lg module-shadow flex flex-col p-1"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '200px',
        height: '100px',
        cursor: 'pointer',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      <h1 className="font-serif text-text1">Output Module</h1>

      <div className=" flex w-full h-full bg-white bg-opacity-10 rounded-md">
        <Knob
          min={20}
          max={2000}
          unlockDistance={0}
          className="rotate-180 absolute bottom-[-0.5rem] left-[1.5rem]"
        />
        <Knob
          min={0}
          max={1}
          step={0.01}
          unlockDistance={0}
          className="rotate-180 absolute bottom-[-0.5rem] left-[4rem]"
        />
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

export default OutputModule
