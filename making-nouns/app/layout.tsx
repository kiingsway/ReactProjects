import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ConfigProvider, theme } from "antd";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Making Nouns App",
  description: "App criado para estudar francês",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          {children}
        </ConfigProvider>
      </body>
    </html >
  );
}
