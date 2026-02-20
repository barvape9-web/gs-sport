import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "GS • Sport – Premium Sportswear",
  description:
    "Discover the ultimate sportswear collection at GS • Sport. Premium quality Men's and Women's athletic wear with cutting-edge design.",
  keywords: ["sportswear", "athletic", "men", "women", "GS Sport", "performance"],
  openGraph: {
    title: "GS • Sport – Premium Sportswear",
    description: "Premium athletic wear for peak performance",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#0a0a0a] text-white min-h-screen w-full overflow-x-clip`}
      >
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(20, 20, 20, 0.9)",
                color: "#fff",
                border: "1px solid rgba(249, 115, 22, 0.3)",
                backdropFilter: "blur(20px)",
              },
              success: { iconTheme: { primary: "#f97316", secondary: "#fff" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
