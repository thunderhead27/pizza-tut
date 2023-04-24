import { useEffect } from "react";

export const useSaveToStorage = (key, value) => {
    useEffect(() => {
        localStorage.setItem(key, value);
    }, []);
}

// get from storage
export const useGetFromStorage = (key) => {
    useEffect(() => {
        localStorage.getItem(key);
    }, []);
}