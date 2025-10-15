'use client';

import React, { useState } from 'react';
import SidebarContext from '@/contexts/sidebar-context';

export function SidebarProvider({ 
  children, 
  initialWidth = 256 
}: { 
  children: React.ReactNode; 
  initialWidth?: number; 
}) {
  const [width, setWidth] = useState(initialWidth);

  return (
    <SidebarContext.Provider value={{ width, setWidth }}>
      {children}
    </SidebarContext.Provider>
  );
}