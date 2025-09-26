import { ReactNode } from 'react';

export default function LoginLayout({ 
  children 
}: { 
  children: ReactNode 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {children}
    </div>
  );
}