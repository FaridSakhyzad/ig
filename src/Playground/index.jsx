import React, { useState } from 'react';

const Playground = () => {
  const [ playground, setPlayground ] = useState([
    [{ value: 11 }, { value: 12 }, { value: 13 }],
    [{ value: 21 }, { value: 22 }, { value: 23 }],
    [{ value: 31 }, { value: 32 }, { value: 33 }]
  ]);

  const onClick = ({ target }) => {
    console.log(target);
  }

  return (
    <div className="playground" onClick={onClick}>
      {playground.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((col, colIndex) => (
            <div className="col" key={`${rowIndex}-${colIndex}`}>{col.value}</div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Playground;