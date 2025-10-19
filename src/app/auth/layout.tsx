import { ReactNode } from 'react';

export default function AuthLayout({ 
  children 
}: { 
  children: ReactNode 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}