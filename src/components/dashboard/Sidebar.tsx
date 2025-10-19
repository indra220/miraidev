import { cn } from "@/lib/utils";
import Link from "next/link";
import { dashboardNavItems } from "@/constants/dashboard";

interface SidebarProps {
  pathname: string;
}

export function Sidebar({ pathname }: SidebarProps) {
  return (
    <div className="hidden border-r border-slate-700 bg-slate-900 md:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2 overflow-y-hidden">
        <div className="flex h-14 items-center border-b border-slate-700 px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-white">
            <span className="text-lg">MiraiDev</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-100px)] hide-scrollbar">
          <nav className="grid items-start gap-1 px-2 text-sm">
            {dashboardNavItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-slate-800",
                    pathname === item.href ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  {ItemIcon && <ItemIcon className="h-4 w-4" />}
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4 text-xs text-slate-500">
          © {new Date().getFullYear()} MiraiDev. Hak Cipta Dilindungi.
        </div>
      </div>
    </div>
  );
}