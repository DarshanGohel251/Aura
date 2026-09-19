import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProfileProvider } from "@/components/profile-provider";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { SystemStatusPill } from "@/components/system-status-pill";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura | Adaptive Learning",
  description: "Learning should adapt to the learner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-neutral-950 text-neutral-50 min-h-screen antialiased selection:bg-purple-500/30`}
      >
        <ProfileProvider>
          <SystemStatusPill />
          {children}
          <AccessibilityPanel />
        </ProfileProvider>
      </body>
    </html>
  );
}
