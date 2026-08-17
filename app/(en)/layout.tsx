import type { ReactNode } from "react";
import "../globals.css";

export default function EnglishLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#073c2c" />
        <link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
