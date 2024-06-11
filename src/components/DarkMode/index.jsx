import { useDarkMode } from '../../context/DarkMode';
import light from '../../assets/mode.png'
import dark from '../../assets/mode-dark.png'
import './Dark.css'

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  //console.log(darkMode)
  return (
    <button onClick={toggleDarkMode} className='scheme_btn'>
      <img src={ darkMode ? dark : light }/>
    </button>
  );
};

export default DarkModeToggle;
