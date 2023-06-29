import React, {useEffect, useRef, useState} from 'react';
import './grd.scss';

const Tempgrid = () => {
  const gridWidth = 15;
  const gridHeight = 15;

  const [ cursorTop, setCursorTop ] = useState(0);
  const [ cursorLeft, setCursorLeft ] = useState(0);

  const cursorTopRef = useRef(cursorTop);
  cursorTopRef.current = cursorTop;

  const cursorLeftRef = useRef(cursorLeft);
  cursorLeftRef.current = cursorLeft;

  const [ selectedGridIndex, setSelectedGridIndex ] = useState(0);

  const selectedGridIndexRef = useRef(selectedGridIndex);
  selectedGridIndexRef.current = selectedGridIndex;

  const commons = [
    cursorLeft - 1 >= 0 ? cursorTop * gridWidth + cursorLeft - 1 : null,
    cursorLeft + 1 < gridWidth ? cursorTop * gridWidth + cursorLeft + 1 : null,

    (cursorTop - 1) * gridWidth + cursorLeft,
    (cursorTop + 1) * gridWidth + cursorLeft,

    cursorLeft % 2 && cursorLeft > 0 ? (cursorTop + 1) * gridWidth + cursorLeft - 1 : null,
    cursorLeft % 2 && cursorLeft + 1 < gridWidth ? (cursorTop + 1) * gridWidth + cursorLeft + 1 : null,

    !(cursorLeft % 2) && cursorLeft > 0 ? (cursorTop - 1) * gridWidth + cursorLeft - 1 : null,
    !(cursorLeft % 2) && cursorLeft + 1 < gridWidth ? (cursorTop - 1) * gridWidth + cursorLeft + 1 : null,
  ];

  const onKeypress = ({ key }) => {
    if (key === 'ArrowUp') {
      if (cursorTopRef.current > 0) {
        setCursorTop(cursorTopRef.current - 1);
      }
    }

    if (key === 'ArrowDown') {
      if (cursorTopRef.current < (gridHeight - 1)) {
        setCursorTop(cursorTopRef.current + 1);
      }
    }

    if (key === 'ArrowRight') {
      if (cursorLeftRef.current < (gridWidth - 1)) {
        setCursorLeft(cursorLeftRef.current + 1);
      }
    }

    if (key === 'ArrowLeft') {
      if (cursorLeftRef.current > 0) {
        setCursorLeft(cursorLeftRef.current - 1);
      }
    }
  };

  const getCellOffsetTop = (row, col) => {
    return col % 2 ? 0 : 6.25 * (50 / 100);
  }

  const generateCoordinates = (gridWidth, gridHeight) => {
    const grid = [];

    for (let i = 0; i < gridHeight; ++i) {
      const row = [];

      for (let j = 0; j < gridWidth; ++j) {
        row[j] = {
          id: Math.random().toString(16).substring(2),
          left: j / gridWidth * 100,
          top: i / gridHeight * 100 + getCellOffsetTop(i, j, gridHeight),
        };
      }

      grid.push(row);
    }

    return grid;
  };

  const grid = generateCoordinates(gridWidth, gridHeight);

  const units = (() => {
    return [
      {
        id: Math.random().toString(16).substring(2),
        topCell: 1,
        leftCell: 1,
      },
      {
        id: Math.random().toString(16).substring(2),
        topCell: 2,
        leftCell: 2,
      },
      {
        id: Math.random().toString(16).substring(2),
        topCell: 3,
        leftCell: 3,
      }
    ]
  })()

  useEffect(() => {
    document.addEventListener('keydown', onKeypress);
    return () => document.removeEventListener('keydown', onKeypress);
  }, []);

  const unitWidth = 100 / gridWidth;
  const unitHeight = 100 / gridHeight;

  return (
    <div
      className="ig-map"
      style={{
        '--grid-width': gridWidth,
        '--grid-height': gridHeight
      }}
    >
      <div className="ig-unist-layer">
        {units.map(({ id, topCell, leftCell }, index) => (
          <div
            key={id}
            className={`ig-unit ${index === (cursorTop * gridHeight + cursorLeft) ? 'selected' : ''} ${commons.includes(index) ? 'highlighted' : ''}`}
            style={{
              top: `${grid[topCell][leftCell].top}%`,
              left: `${grid[topCell][leftCell].left}%`,
              width: `${unitWidth}%`,
              height: `${unitHeight}%`,
            }}
          />
        ))}
      </div>
      <div className="ig-grid-layer">
        {grid.flat().map(({ id, top, left }, index) => (
          <div
            key={id}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${100 / gridWidth}%`,
              height: `${100 / gridHeight}%`,
            }}
            data-index={index}
            className={`ig-grid-item ${index === (cursorTop * gridHeight + cursorLeft) ? 'selected' : ''} ${commons.includes(index) ? 'highlighted' : ''}`}
          >{1 + index}</div>
        ))}
      </div>
    </div>
  )
}

export default Tempgrid
