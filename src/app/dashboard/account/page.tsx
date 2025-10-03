import { UserProfile } from "@/components/dashboard/UserProfile";
import type { Metadata } from "next";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "Pengaturan Akun",
};

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan Akun</h1>
        <p className="text-muted-foreground">
          Kelola informasi akun dan keamanan Anda
        </p>
      </div>
      
      <UserProfile />
    </div>
  );
}