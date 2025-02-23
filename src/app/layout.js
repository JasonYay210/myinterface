import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
export default function RootLayout({
  children,
}) {
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
            <div className = "flex justify-between px-[50px] py-[25px] border-b border-black items-center">
            <p>MyInterface</p>
            <div className = "flex gap-[25px] items-center">
              <a href = "#">About</a>
              <a href = "#">Contact</a>
              <div className="px-[20px] py-[10px] bg-black text-white rounded-[8px]">
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}