import React, {useEffect, useRef, useState} from 'react';
import './grd.scss';

const Tempgrid = () => {
  const gridWidth = 16;
  const gridHeight = 16;

  const grid = [...Array(gridWidth * gridHeight)].map(() => ({ id: Math.random().toString(16).substring(2) }));

  const [ selectedGridIndex, setSelectedGridIndex ] = useState(0);

  const selectedGridIndexRef = useRef(selectedGridIndex);
  selectedGridIndexRef.current = selectedGridIndex;

  const left = selectedGridIndex % gridWidth;
  const top = (selectedGridIndex - left) / gridWidth;

  console.log('left', left);
  console.log('top', top);

  const highlighted = [
    left - 1 >= 0 ? top * gridWidth + left - 1 : null,
    left + 1 < gridWidth ? top * gridWidth + left + 1 : null,

    (top - 1) * gridWidth + left,
    (top + 1) * gridWidth + left,

    left % 2 && left > 0 ? (top + 1) * gridWidth + left - 1 : null,
    left % 2 && left + 1 < gridWidth ? (top + 1) * gridWidth + left + 1 : null,

    !(left % 2) && left > 0 ? (top - 1) * gridWidth + left - 1 : null,
    !(left % 2) && left + 1 < gridWidth ? (top - 1) * gridWidth + left + 1 : null,
  ];

  const onKeypress = ({ key }) => {
    if (key === 'ArrowUp') {
      if (selectedGridIndexRef.current - gridWidth >= 0) {
        setSelectedGridIndex(selectedGridIndexRef.current - gridWidth);
      }
    }

    if (key === 'ArrowDown') {
      if (selectedGridIndexRef.current + gridWidth < grid.length) {
        setSelectedGridIndex(selectedGridIndexRef.current + gridWidth);
      }
    }

    if (key === 'ArrowRight') {
      if (selectedGridIndexRef.current < (grid.length - 1) && selectedGridIndexRef.current % gridWidth + 1 < gridWidth) {
        setSelectedGridIndex(1 + selectedGridIndexRef.current);
      }
    }

    if (key === 'ArrowLeft') {
      if (selectedGridIndexRef.current > 0 && selectedGridIndexRef.current % gridWidth - 1 >= 0) {
        setSelectedGridIndex(selectedGridIndexRef.current - 1);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeypress);
    return () => document.removeEventListener('keydown', onKeypress);
  }, []);

  return (
    <div className="ig-grid-box">
      <div
        className="ig-unit"
        style={{
          left: `${100 / gridWidth * left}%`,
          top: `${100 / gridHeight * top}%`,
          transform: `${left % 2 ? 'translateY(50%)' : 'none'}`
        }}
      />
      <div className="ig-grid">
        {grid.map(({id}, index) => (
          <div
            key={id}
            className={`ig-grid-item ${index === selectedGridIndex ? 'selected' : ''} ${highlighted.includes(index) ? 'highlighted' : ''}`}
          >{1 + index}</div>
        ))}
      </div>
    </div>
  )
}

export default Tempgrid
