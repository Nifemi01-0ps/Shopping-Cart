const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1');

// Use proxy routes when on localhost, direct URLs otherwise
export const API = {
  dummyjson: (path) =>
    isLocalhost
      ? `/api/dummyjson/${path}`
      : `https://dummyjson.com/${path}`,

  fakestore: (path) =>
    isLocalhost
      ? `/api/fakestore/${path}`
      : `https://fakestoreapi.com/${path}`,

  // For images
  image: (url) => {
    if (!url) return url;
    if (!isLocalhost) return url;
    
    if (url.startsWith('http') && !url.includes('localhost')) {
      return `/api/image?url=${encodeURIComponent(url)}`;
    }
    return url;
  },
};
