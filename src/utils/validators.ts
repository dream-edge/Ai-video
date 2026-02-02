export const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const isValidInstagramUrl = (url: string) => {
    return isValidUrl(url) && url.includes('instagram.com');
};

export const generateIdFromUrl = (url: string) => {
    // Simple extraction logic, might need refinement based on actual IG URL formats
    // e.g., https://www.instagram.com/p/CoU5jX/ -> CoU5jX
    const match = url.match(/\/p\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
};
