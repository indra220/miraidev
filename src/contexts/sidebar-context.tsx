import { createContext } from 'react';

export interface SidebarContextType {
  width: number;
  setWidth: (width: number) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export default SidebarContext;