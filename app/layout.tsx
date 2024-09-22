import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import Nav from "@/components/navigation/nav";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Toaster from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-primary/10" , roboto.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex-grow px-6 md:px-12 mx-auto max-w-8xl">
            <Nav />
            <Toaster />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
