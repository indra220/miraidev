import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Session } from "@/types/dashboard";

interface HeaderProps {
  session: Session | null;
}

export function Header({ session }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <nav className="grid gap-6 text-lg font-medium">
                <a href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                  <span className="sr-only">MiraiDev</span>
                  MiraiDev
                </a>
                <a href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                  Ringkasan
                </a>
                <a href="/dashboard/projects" className="text-muted-foreground transition-colors hover:text-foreground">
                  Proyek
                </a>
                <a href="/dashboard/services" className="text-muted-foreground transition-colors hover:text-foreground">
                  Layanan
                </a>
                <a href="/dashboard/messages" className="text-muted-foreground transition-colors hover:text-foreground">
                  Pesan
                </a>
                <a href="/dashboard/reports" className="text-muted-foreground transition-colors hover:text-foreground">
                  Laporan
                </a>
                <a href="/dashboard/support" className="text-muted-foreground transition-colors hover:text-foreground">
                  Dukungan
                </a>
              </nav>
            </SheetContent>
          </Sheet>
          <a href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold">MiraiDev</span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          <UserNav session={session} />
        </div>
      </div>
    </header>
  );
}