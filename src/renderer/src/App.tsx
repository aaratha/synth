import Versions from './components/Versions'
import React, { useState } from 'react'
import OscillatorModule from './components/oscillatormodule'
import Board from './components/board'

const ModuleManager = () => {
  const [modules, setModules] = useState([])

  const addModule = () => {
    // Create a new module with unique key (e.g., using the current timestamp)
    const newModule = {
      key: Date.now(), // Unique key for each module
      position: { x: 50, y: 50 } // Default position, can randomize or modify as needed
    }
    setModules((prevModules) => [...prevModules, newModule])
  }

  const removeModule = (key) => {
    // Remove a module by filtering out the module with the specific key
    setModules((prevModules) => prevModules.filter((module) => module.key !== key))
};

  return (
    <div>
      <button onClick={addModule} className="bg-blue-500 text-white p-2 rounded">
        Add Module
      </button>
      <div>
        {modules.map((module) => (
          <OscillatorModule
            key={module.key}
            id={module.key}
            initialPosition={module.position}
            removeModule={() => removeModule(module.key)}
          />
        ))}
      </div>
    </div>
  )
}

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [dragOffset, setDragOffset] = useState({ x: 30, y: 30 })

  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e) => {
    const dropArea = e.currentTarget
    const stylingAdjustment = { x: dropArea.clientLeft, y: dropArea.clientTop } // For borders
    const dropAreaRect = dropArea.getBoundingClientRect()

    const newPosX = e.clientX - dropAreaRect.left - dragOffset.x - stylingAdjustment.x
    const newPosY = e.clientY - dropAreaRect.top - dragOffset.y - stylingAdjustment.y
    setPosition({ x: newPosX, y: newPosY })
  }

  return (
    <div className="flex flex-col w-full h-[calc(100vh)] bg-background text-text1 rounded-[10px] p-4">
      <div className="text-xl ">Modular Synth</div>
      <ModuleManager />
      <Board onDrop={handleDrop} />
    </div>
  )
}

export default App
