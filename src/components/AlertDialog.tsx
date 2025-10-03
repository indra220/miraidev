"use client";

import {
  AlertDialog as AlertDialogPrimitive,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export function AlertDialog({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  variant = "default",
}: AlertDialogProps) {
  return (
    <AlertDialogPrimitive open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className={`${
              variant === "destructive" 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            }`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPrimitive>
  );
}

interface AlertDialogResultProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText?: string;
}

export function AlertDialogResult({
  isOpen,
  onClose,
  title,
  description,
  confirmText = "OK",
}: AlertDialogResultProps) {
  return (
    <AlertDialogPrimitive open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPrimitive>
  );
}