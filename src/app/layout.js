"use client"; // Mark this as a Client Component

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser, // Add this hook
} from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; // Use `next/navigation` for App Router
import { useEffect } from 'react'; // Add this hook
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap"
          />
        </head>
        <body>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

function Header() {
  const { isSignedIn } = useUser(); // Check if the user is signed in
  const router = useRouter(); // Use the router for navigation

  // Redirect to /dashboard when the user signs in
  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard'); // Redirect to the dashboard page
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/'); // Redirect to the layout page
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex justify-between px-[50px] py-[25px] border-b border-black items-center">
      <p>MyInterface</p>
      <div className="flex gap-[25px] items-center">
        <a href="#">About</a>
        <a href="#">Contact</a>
          <SignedOut>
            <SignInButton className="px-[20px] py-[10px] bg-black text-white rounded-[8px]"/>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
      </div>
    </div>
  );
}