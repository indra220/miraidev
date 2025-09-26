"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect ke halaman login user karena hanya ada satu form login
    router.push("/user/login");
  }, [router]);

  return null;
}