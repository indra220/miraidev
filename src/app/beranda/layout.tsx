import { ReactNode } from "react";

export default function BerandaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div>{children}</div>;
}