import { Link } from 'react-router-dom';
import SearchForm from '../SearchForm';
import styles from './Navbar.module.css';
import logo from '../../assets/logo.png';
import night from '../../assets/logo_night.png';
import DarkModeToggle from '../DarkMode';
import { useDarkMode } from '../../context/DarkMode';

const Navbar = () => {
    const { darkMode } = useDarkMode();

    return (
        <nav className={styles.navbar_wrapper}>
            <Link to="/" className={styles.nav_logo}>
                <img src={darkMode ? night : logo} alt='Logo'/>
                <h1>Pokémon Center</h1>
            </Link>
            <div className={styles.nav_items}>
                <ul>
                    <li><Link to="/"> Home </Link></li>
                    <li><Link to="/teams">Teams </Link></li>
                    <li><Link to="/listing">Listing</Link></li>
                    <li><SearchForm/></li>
                    <li><DarkModeToggle/></li>
              
                </ul>

            </div>
        </nav>
    )
}

export default Navbar