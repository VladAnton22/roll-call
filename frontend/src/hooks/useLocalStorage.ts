import { useState, useEffect } from 'react';

const PREFIX = "rollcall:";

function getSavedValue<T>(key: string, initialValue: T | (() => T)): T {
    try {
        const savedValue = localStorage.getItem(key);
        if (savedValue !== null) return JSON.parse(savedValue) as T;
    } catch {
        console.warn(`Failed to read localStorage key ${key}`);
    }
    if (initialValue instanceof Function) return initialValue();
    return initialValue;
}

export default function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
    const prefixedKey = `${PREFIX}${key}`;
    const [value, setValue] = useState<T>(() => getSavedValue(prefixedKey, initialValue));

    useEffect(() => {
        localStorage.setItem(prefixedKey, JSON.stringify(value));
    }, [prefixedKey, value]);

    return [value, setValue] as const;
}