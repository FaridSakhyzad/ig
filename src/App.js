import React from 'react';

import './App.scss';
import './Playground/Playground.scss';
import './Components/Unit/Unit.scss';
import './Components/Projectile/Projectile.scss';

import Playground from './Playground';

function App() {
  return (
    <div className="app">
      <Playground />
    </div>
  );
}

export default App;
