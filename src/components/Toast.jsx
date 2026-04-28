import { useStore } from "../store/useStore";
import styles from "../styles/Toast.module.css";
export default function Toast() {
    const toast = useStore(s => s.toast);
    if (toast) return null;

    const typeClass = toast.type === 'error' ? styles.error : styles.success
    return (
        <div key={toast.id} className={styles.wrapper}>
            <div className={`${styles.toast} ${typeClass}`}>
                {toast.message}
            </div>
        </div>
    );
}