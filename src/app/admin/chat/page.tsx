import { Suspense } from "react";
import AdminChatPageContent from "./page-content";

export default function AdminChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>}>
      <AdminChatPageContent />
    </Suspense>
  );
}