const HISTORY_KEY = 'walkaround_location_history';
const SESSION_KEY = 'walkaround_active_session';

export const getHistory = () => {
    try {
        const data = localStorage.getItem(HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const appendHistory = (point) => {
    // point: { lat, lng, timestamp, title? }
    const history = getHistory();
    history.push(point);
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.warn('Could not save history to localStorage', e);
    }
};

export const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
};

export const getActiveSession = () => {
    try {
        const data = localStorage.getItem(SESSION_KEY);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
};

export const saveActiveSession = (sessionData) => {
    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    } catch (e) {
        console.warn('Could not save session', e);
    }
};

export const clearActiveSession = () => {
    localStorage.removeItem(SESSION_KEY);
};
