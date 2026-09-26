import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProfileProvider } from "@/components/profile-provider";
import { ThemeProvider } from "@/components/theme-provider";
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('aura-theme');
                if (stored === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                } else {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} bg-neutral-950 text-neutral-50 min-h-screen antialiased selection:bg-purple-500/30 transition-colors duration-200`}
      >
        <ThemeProvider>
          <ProfileProvider>
            <SystemStatusPill />
            {children}
            <AccessibilityPanel />
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
