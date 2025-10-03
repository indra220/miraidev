import { useState } from 'react';

interface AlertDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
  onConfirm?: () => void;
}

interface AlertDialogResultState {
  isOpen: boolean;
  title: string;
  description: string;
}

interface UseDialogReturn {
  alertDialogState: AlertDialogState;
  showAlertDialog: (title: string, description: string, onConfirm: () => void, variant?: 'default' | 'destructive') => void;
  closeAlertDialog: () => void;
  alertResultState: AlertDialogResultState;
  showAlertResult: (title: string, description: string) => void;
  closeAlertResult: () => void;
}

export function useDialog(): UseDialogReturn {
  const [alertDialogState, setAlertDialogState] = useState<AlertDialogState>({
    isOpen: false,
    title: '',
    description: '',
    variant: 'default',
  });

  const [alertResultState, setAlertResultState] = useState<AlertDialogResultState>({
    isOpen: false,
    title: '',
    description: '',
  });

  const showAlertDialog = (
    title: string,
    description: string,
    onConfirm: () => void,
    variant: 'default' | 'destructive' = 'default'
  ) => {
    setAlertDialogState({
      isOpen: true,
      title,
      description,
      variant,
      onConfirm,
    });
  };

  const closeAlertDialog = () => {
    setAlertDialogState({
      isOpen: false,
      title: '',
      description: '',
      variant: 'default',
      onConfirm: undefined,
    });
  };

  const showAlertResult = (title: string, description: string) => {
    setAlertResultState({
      isOpen: true,
      title,
      description,
    });
  };

  const closeAlertResult = () => {
    setAlertResultState({
      isOpen: false,
      title: '',
      description: '',
    });
  };

  return {
    alertDialogState,
    showAlertDialog,
    closeAlertDialog,
    alertResultState,
    showAlertResult,
    closeAlertResult,
  };
}