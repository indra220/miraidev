"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IdleTimeoutModalProps {
  isOpen: boolean;
  onStay: () => void;
  onLogout: () => void;
}

export function IdleTimeoutModal({
  isOpen,
  onStay,
  onLogout,
}: IdleTimeoutModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sesi Anda Akan Segera Berakhir</DialogTitle>
          <DialogDescription>
            Untuk keamanan, Anda akan dikeluarkan secara otomatis karena tidak
            ada aktivitas.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Pilih "Tetap Masuk" untuk melanjutkan sesi Anda.
        </p>
        <DialogFooter className="sm:justify-start gap-2">
          <Button type="button" onClick={onStay}>
            Tetap Masuk
          </Button>
          <Button type="button" variant="destructive" onClick={onLogout}>
            Keluar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}