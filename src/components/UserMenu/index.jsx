import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { setMode, setSelectedUnitId } from '../../redux/playground/actions';
import { GAMEPLAY_MODE, SELECT_MODE } from '../../constants/constants';
import './UserMenu.scss';
import PropTypes from 'prop-types';

const UserMenu = ({ onRotate }) => {
  const dispatch = useDispatch();

  const { playground: { mode } }  = useSelector(state => state);

  const handleToolButtonClick = () => {
    dispatch(setMode(SELECT_MODE));
  }

  const handleOkButtonClick = () => {
    dispatch(setSelectedUnitId(null));
    dispatch(setMode(GAMEPLAY_MODE));
  }

  const handleRotateClick = (direction) => {
    onRotate(direction);
  }

  return (
    <div className="userMenu">
      <div className="userMenu-row">
        <button onClick={handleToolButtonClick} className="button userMenu-button">Swap</button>
        <button onClick={handleToolButtonClick} className="button userMenu-button">Rotate</button>
      </div>
      {mode === SELECT_MODE && (
        <div className="userMenu-row">
          <button onClick={() => handleRotateClick('ccv')} className="button userMenu-button">&lt;-</button>
          <button onClick={() => handleRotateClick('cv')} className="button userMenu-button">-&gt;</button>
        </div>
      )}
      <div className="userMenu-row">
        <button onClick={handleOkButtonClick} className="button userMenu-button">Ok</button>
      </div>
    </div>
  );
}

UserMenu.propTypes = {
  onRotate: PropTypes.func,
}

export default UserMenu;
