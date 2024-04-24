import Versions from './components/Versions'
import React, { useState } from 'react';
import Module from './components/module'
import Board from './components/board'


function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [dragOffset, setDragOffset] = useState({ x: 30, y: 30 });

  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    const dropArea = e.currentTarget;
    const stylingAdjustment = { x: dropArea.clientLeft, y: dropArea.clientTop };  // For borders
    const dropAreaRect = dropArea.getBoundingClientRect();
  
    const newPosX = e.clientX - dropAreaRect.left - dragOffset.x - stylingAdjustment.x;
    const newPosY = e.clientY - dropAreaRect.top - dragOffset.y - stylingAdjustment.y;
    setPosition({ x: newPosX, y: newPosY });
  };
  


  return (
    <div className="flex flex-col w-full h-[calc(100vh)] bg-background text-text1 rounded-[10px] p-4">
      <div className="text-xl ">Modular Synth</div>
      <Module position={position} setPosition={setPosition} setDragging={setDragging} />
      <Board onDrop={handleDrop} />
    </div>
  )
}

export default App
