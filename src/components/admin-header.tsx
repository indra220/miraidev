'use client';

import NotificationPanel from './notification-panel';
import Breadcrumbs from './breadcrumbs';
import BookmarkManager from './bookmark-manager';
import QuickSearch from './quick-search';

interface AdminHeaderProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  userRole?: string;
}

export default function AdminHeader({ title = "Dashboard", breadcrumbs = [], userRole = "admin" }: AdminHeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-700 shadow-lg">
      <div className="flex flex-col p-4">
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          <div className="flex items-center space-x-4">
            <QuickSearch userRole={userRole} />
            <BookmarkManager />
            <NotificationPanel />
          </div>
        </div>
      </div>
    </header>
  );
}