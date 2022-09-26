import './App.scss';
import './Components/Unit/Unit.scss';
import './Components/Projectile/Projectile.scss';

import Playground from './Playground';

function App() {
  const computedStyle = getComputedStyle(document.documentElement);

  console.log('--projectile-hitBox--width', computedStyle.getPropertyValue('--projectile-hitBox--width'));
  console.log('--projectile-hitBox--height', computedStyle.getPropertyValue('--projectile-hitBox--height'));

  return (
    <div className="App">
      <Playground />
    </div>
  );
}

export default App;
