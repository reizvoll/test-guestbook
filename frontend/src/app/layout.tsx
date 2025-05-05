import TQProvider from "@/lib/providers/TQProvider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const pretendard = localFont({
  src: "../assets/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard"
});

export const metadata: Metadata = {
  title: "Guestbook",
  description: "A full-stack guestbook application built with Next.js, Express, and PostgreSQL.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={pretendard.className}>
        <TQProvider>
          {children}
          <ToastContainer />
        </TQProvider>
      </body>
    </html>
  );
}
