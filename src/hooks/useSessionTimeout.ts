"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 menit
const WARNING_TIME = 1 * 60 * 1000; // 1 menit sebelum timeout
const CHANNEL_NAME = 'session-timeout-channel';

export const useSessionTimeout = () => {
  const [isWarningModalOpen, setWarningModalOpen] = useState(false);
  // const [lastActivity, setLastActivity] = useState(Date.now()); // <-- HAPUS BARIS INI

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/auth/login?timeout=true';
  }, []);

  useEffect(() => {
    let activityTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;
    const channel = new BroadcastChannel(CHANNEL_NAME);

    const resetTimer = () => {
      // setLastActivity(Date.now()); // <-- HAPUS BARIS INI
      setWarningModalOpen(false);
      clearTimeout(activityTimer);
      clearTimeout(warningTimer);

      warningTimer = setTimeout(() => {
        setWarningModalOpen(true);
      }, IDLE_TIMEOUT - WARNING_TIME);

      activityTimer = setTimeout(() => {
        channel.postMessage('logout');
        handleLogout();
      }, IDLE_TIMEOUT);
    };

    const handleActivity = () => {
      channel.postMessage('activity');
      resetTimer();
    };

    // Menangani pesan dari tab lain
    channel.onmessage = (event) => {
      if (event.data === 'activity') {
        resetTimer();
      }
      if (event.data === 'logout') {
        handleLogout();
      }
    };
    
    // Event listener untuk aktivitas di tab saat ini
    const events: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    events.forEach(event => window.addEventListener(event, handleActivity));

    // Inisialisasi timer
    resetTimer();

    // Cleanup
    return () => {
      clearTimeout(activityTimer);
      clearTimeout(warningTimer);
      events.forEach(event => window.removeEventListener(event, handleActivity));
      channel.close();
    };
  }, [handleLogout]);

  const stayActive = () => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage('activity');
    // setLastActivity(Date.now()); // <-- HAPUS BARIS INI
    setWarningModalOpen(false);
    channel.close();
  };

  return { isWarningModalOpen, stayActive, handleLogout };
};