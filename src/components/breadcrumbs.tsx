'use client';

import { Slash } from 'lucide-react';
import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-400">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <Slash className="h-4 w-4 mx-1" />}
          {item.href ? (
            <Link 
              href={item.href} 
              className="hover:text-gray-200 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-300">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}