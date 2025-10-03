"use client";

import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { IdleTimeoutModal } from '@/components/IdletimeoutModal';

export default function SessionTimeoutHandler() {
  const { isWarningModalOpen, stayActive, handleLogout } = useSessionTimeout();

  return (
    <IdleTimeoutModal
      isOpen={isWarningModalOpen}
      onStay={stayActive}
      onLogout={handleLogout}
    />
  );
}