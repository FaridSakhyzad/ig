import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMusic, setSound, setVibration } from '../../redux/settings/actions';
import './Settings.scss';
import { saveSettings } from '../../api/settings';

function Settings() {
  const dispatch = useDispatch();

  const { music, sound, vibration } = useSelector((state) => state.settings);

  const handleSoundClick = () => {
    const state = sound === 0 ? 1 : 0;

    dispatch(setSound(state));

    saveSettings({ sound: state });
  };

  const handleMusicClick = () => {
    const state = music === 0 ? 1 : 0;

    dispatch(setMusic(state));

    saveSettings({ music: state });
  };

  const handleVibrationClick = () => {
    const state = !vibration;

    dispatch(setVibration(state));

    saveSettings({ vibration: state });
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      <hr />
      <button type="button" className="button settingsButton" onClick={handleSoundClick}>Sound {sound ? <span>On</span> : <span>Off</span>}</button>
      <button type="button" className="button settingsButton" onClick={handleMusicClick}>Music {music ? <span>On</span> : <span>Off</span>}</button>
      <button type="button" className="button settingsButton" onClick={handleVibrationClick}>Vibration {vibration ? <span>On</span> : <span>Off</span>}</button>
      <hr />
      <button type="button" className="button settingsButton">Support</button>
      <button type="button" className="button settingsButton">About</button>
    </div>
  );
}

export default Settings;
