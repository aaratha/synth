import React from 'react';

const Board = ({ onDrop }) => {
  const handleDragOver = (e) => {
    e.preventDefault();  // Necessary to allow dropping
  };

  return (
    <div
      className="w-full h-full bg-board rounded-lg cursor-pointer overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={onDrop}
    >
      Drop Anywhere
    </div>
  );
};

export default Board;
