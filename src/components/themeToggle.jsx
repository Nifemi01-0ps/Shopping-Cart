import { useTheme } from "../context/ThemeContext.jsx";
import styles from "../styles/themeToggle.module.css";
export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    return (
        <button onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} title={isDark ? 'Lightmode' : 'Dark mode'} className={styles.button}>
            {isDark ? '☀️' : '🌙'}
        </button>
    );
}