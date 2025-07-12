import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <Suspense fallback={<div>Loading...</div>}>
          <main>{children}</main>
          </Suspense>
      </body>
    </html>
  );
}
