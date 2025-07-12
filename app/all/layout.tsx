import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <Header />
          <Suspense fallback={<div>Loading...</div>}>
          <main>{children}</main>
          </Suspense>
          <Footer />
      </body>
    </html>
  );
}
