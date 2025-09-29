import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
}

export interface Session {
  user?: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  };
  expires_at?: number;
}