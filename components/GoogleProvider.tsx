'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function GoogleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId="1068518430509-hel79vdde86pr2kpmlqbivfr3mk85756.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
