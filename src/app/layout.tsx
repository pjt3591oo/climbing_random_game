import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import KakaoInit from "@/components/KakaoInit";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Climbing Random - 클라이밍 장소 랜덤 선택",
  description: "미니게임으로 오늘의 클라이밍 장소를 정하자!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <KakaoInit />
      </body>
    </html>
  );
}
