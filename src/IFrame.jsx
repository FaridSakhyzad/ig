import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

export function IFrame({ children, ...props }) {
  const [contentRef, setContentRef] = useState(null);
  const mountNode = contentRef?.contentWindow?.document?.body;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <iframe title="iframe" {...props} ref={setContentRef}>
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
}

IFrame.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any,
};

IFrame.defaultProps = {
  children: null,
};
