import { cn } from "@/lib/utils";
import Link from "next/link";
import { dashboardNavItems } from "@/constants/dashboard";

interface SidebarProps {
  pathname: string;
}

export function Sidebar({ pathname }: SidebarProps) {
  return (
    <div className="hidden border-r bg-muted/40 md:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">MiraiDev</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start gap-1 px-2 text-sm">
            {dashboardNavItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted",
                    pathname === item.href ? "bg-muted" : "text-muted-foreground hover:text-accent-foreground"
                  )}
                >
                  {ItemIcon && <ItemIcon className="h-4 w-4" />}
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} MiraiDev. Hak Cipta Dilindungi.
        </div>
      </div>
    </div>
  );
}