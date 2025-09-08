import { useEffect } from "react";

interface KeyboardShortcutsProps {
  onPageChange: (page: string) => void;
}

const shortcuts = {
  '1': 'dashboard',
  '2': 'agenda',
  '3': 'analytics', 
  '4': 'conversas',
  '5': 'playbooks',
  '6': 'configuracoes'
};

export const useKeyboardShortcuts = ({ onPageChange }: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + Number for navigation
      if (event.altKey && event.key in shortcuts) {
        event.preventDefault();
        const page = shortcuts[event.key as keyof typeof shortcuts];
        onPageChange(page);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPageChange]);
};