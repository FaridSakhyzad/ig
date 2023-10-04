import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import './LevelList.scss';
import classnames from 'classnames';

export default function LevelsList(props) {
  const {
    levels: levelsFromProps,
    onLevelClick,
  } = props;

  const { availableLevels, currentLevelIndex } = useSelector((state) => state.user);

  const availableLevelsMap = {};

  availableLevels.forEach(({ index }) => {
    availableLevelsMap[index] = true;
  });

  const levels = levelsFromProps.map((level, idx) => ({
    ...level,
    disabled: !availableLevelsMap[idx],
  }));

  const handleLevelClick = (idx, disabled) => {
    if (disabled) {
      return;
    }

    onLevelClick(idx);
  };

  return (
    <div className="levelList">
      {levels.map((level, idx) => (
        <div
          key={level.name}
          className={classnames('levelList-item', { disabled: level.disabled, current: currentLevelIndex === level.index })}
          onClick={() => handleLevelClick(idx, level.disabled)}
        >
          {level.name || level.id}
        </div>
      ))}
    </div>
  );
}

LevelsList.propTypes = {
  onLevelClick: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  levels: PropTypes.array,
};

LevelsList.defaultProps = {
  onLevelClick: () => {},
  levels: [],
};
