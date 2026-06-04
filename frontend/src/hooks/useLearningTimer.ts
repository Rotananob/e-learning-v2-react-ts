import { useEffect, useRef, useCallback } from 'react';

// Helper: Cambodia UTC+7
function getCambodiaNow(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 7 * 3600000);
}

function getMondayKey(): string {
  const now = getCambodiaNow();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
}

function getStorageKey(username?: string): string {
  const weekKey = getMondayKey();
  return username ? `learningTime_${username}_${weekKey}` : `learningTime_guest_${weekKey}`;
}

export function formatSeconds(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatKhmer(secs: number): string {
  const KH = '០១២៣៤៥៦៧៨៩';
  const toKh = (n: number) => String(n).replace(/[0-9]/g, (d) => KH[+d]);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${toKh(h).padStart(2, '០')}:${toKh(m).padStart(2, '០')}:${toKh(s).padStart(2, '០')}`;
}

export function useLearningTimer(username?: string) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSaveRef = useRef(0);

  const getSeconds = useCallback((): number => {
    const key = getStorageKey(username);
    return parseInt(localStorage.getItem(key) || '0', 10);
  }, [username]);

  const saveSeconds = useCallback((secs: number) => {
    const key = getStorageKey(username);
    localStorage.setItem(key, String(secs));
  }, [username]);

  useEffect(() => {
    let learningTime = getSeconds();
    let lastTick = Date.now();

    intervalRef.current = setInterval(() => {
      const key = getStorageKey(username);
      if (!localStorage.getItem(key)) {
        learningTime = 0;
        saveSeconds(0);
      }
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const delta = Math.round((now - lastTick) / 1000);
        if (delta > 0 && delta < 10) {
          learningTime += delta;
          lastTick = now;
          if (learningTime - lastSaveRef.current >= 10) {
            saveSeconds(learningTime);
            lastSaveRef.current = learningTime;
          }
        } else {
          lastTick = now;
        }
      } else {
        lastTick = Date.now();
      }
    }, 1000);

    const handleUnload = () => saveSeconds(learningTime);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('beforeunload', handleUnload);
      saveSeconds(learningTime);
    };
  }, [username, getSeconds, saveSeconds]);

  return { getSeconds };
}
