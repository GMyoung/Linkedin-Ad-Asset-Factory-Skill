import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    title: "Harvey Yang | Harbor Network",
    description: "Harbor Network is a professional home feed with sponsored posts and a revision viewer.",
    icons: {
      icon: "/harbor-mark.svg",
      shortcut: "/harbor-mark.svg",
      apple: "/harbor-mark.svg",
    },
    openGraph: {
      title: "Harvey Yang | Harbor Network Feed",
      description: "A professional Harbor Network feed with sponsored posts and a revision viewer.",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1693, height: 929, alt: "Harvey Yang Harbor Network feed" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Harvey Yang | Harbor Network Feed",
      description: "A professional Harbor Network feed with sponsored posts and a revision viewer.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
