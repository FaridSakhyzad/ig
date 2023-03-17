import React from 'react';
import { useDispatch } from 'react-redux';
import './UserMenu.scss';
import { setMode } from '../../redux/playground/actions';

const UserMenu = () => {
  const dispatch = useDispatch();
  const handleButtonClick = (mode) => {
    console.log('mode:',  mode);

    dispatch(setMode(mode));
  }

  return (
    <div className="userMenu">
      <button onClick={() => handleButtonClick('swap')} className="button userMenu-button">Swap</button>
      <button onClick={() => handleButtonClick('rotateCv')} className="button userMenu-button">Rotate CV</button>
      <button onClick={() => handleButtonClick('rotateCvv')} className="button userMenu-button">Rotate CCV</button>
    </div>
  );
}

export default UserMenu;
