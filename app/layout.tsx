import "./globals.css";
import GoogleProvider from "../components/GoogleProvider";
import { CartProvider } from "../components/CartContext";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
        <GoogleProvider>
          <main>{children}</main>
        </GoogleProvider>
        </CartProvider>
      </body>
    </html>
  );
}
