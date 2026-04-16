import { Component } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles/ErrorBoundary.module.css";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        console.error('[ShopFlow Error]', error, info.componentStack);
    }
    render() {
        if (!this.state.hasError) return this.props.children;

        const { fallback, minimal } = this.props;

        if (fallback) return fallback

        if (minimal) 
            return (
                <div className={styles.minimalBox}>
                    <p>Something went wrong loading this section.</p>
                    <button onClick={() => this.setState({ hasError: false, error: null })} className={styles.minimalBtn}>
                        Try Again
                    </button>
                </div>
            );
            return (
                <div className={styles.wrapper}>
                    <div className={styles.container}>
                        <p className={styles.icon}>⚠️</p>
                        <h2 className={styles.title}>Something went wrong</h2>
                        <p className={styles.message}>An unexpected error occur on this page. Your cart and account are safe</p>
                        {import.meta.env.Dev && this.state.error && (
                            <pre className={styles.errorBox}>{this.state.error.message}</pre>
                        )}
                        <div className={styles.actions}>
                            <button onClick={() => this.setState({ hasError: false, error: null })} className={styles.primaryBtn}>Try Again</button>
                            <Link to="/" className={styles.secondaryBtn}>Go Home</Link>
                        </div>
                    </div>
                </div>
            );
    }
}