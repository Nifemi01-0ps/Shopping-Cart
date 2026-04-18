import { useState, useEffect } from "react";
import { collections, FALLBACK_IMAGES } from "../data/product.js";
import styles from "../styles/FallbackImg.module.css";
// Inline SVG Data-Url placeholder - zero network, always renders
const makePlaceholder = (collection = 'default') => {
    const labels = {
        'sneakers': '👟', "men's fashion": '👔', "women's fashion": '👗',
        'electronics': '💻', 'jewellery': '💍', 'wristwatches': '⌚',
        'oriamo': '🎧', 'nivea': '✨', 'beauty & care': '💄',
        'sports': '⚽', 'home & living': '🏠', 'accessories': '🕶️',
        'default': '📦',
    };
    const emoji = labels[collection] || labels.default;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'>
            <rect width='400' height='400' fill='%23f2f0eb'/>
            <text x='200' y='200' font-size='80' text-anchor='middle' dominant-baseline='central'>${emoji}</text>
         </svg>`;
         return `data:image/svg+sml,${svg}`;
};

export default function ImageWithFallback({ src, alt, collection, fallbackSrc, className, style, width, height, loading = 'lazy' }) {
    const collFallback = FALLBACK_IMAGES[collection] || FALLBACK_IMAGES.default;
    const placeholder = makePlaceholder(collection);
    
    const buildChain = () => 
        [src,  fallbackSrc, collFallback, placeholder].filter(Boolean);
    const [chain, setChain] = useState(buildChain);
    const [idx, setIdx] = useState(0);
    const [loaded, setLoaded] = useState(false);

    // Reset idx and loaded when the src changes 
    useEffect(() => {
        setChain(buildChain());
        setIdx(0);
        setLoaded(false);
    }, [src]);

    const currentSrc = chain[Math.min(idx, chain.length - 1)];

    const handleError = () => {
        if (idx < chain.length -1 ) setIdx(i => i + 1);
    };

    return (
        <div className={styles.wrapper}>
            {!loaded && <div className={styles.skeleton} />}

            <img src={currentSrc} alt={alt || ''} className={`${styles.image} ${loaded ? styles.imageLoaded : ''} ${className || ''}`}
            width={width}
            height={height}
            loading={loading}
            onError={handleError}
            onLoad={() => setLoaded(true)}
            />
        </div>
    )
}