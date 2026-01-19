import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StaggeredMenu from "@/components/StaggeredMenu";
import Preload from "@/components/Preload";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Avishkar 26",
  description: "The National Level Techno - Cultural Fest",
};

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Events', ariaLabel: 'View our events', link: '/events' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

const socialItems = [
  { label: 'Instagram', link: 'https://www.instagram.com/avishkar_.26' },
  { label: 'Website', link: 'https://musaliarcollege.com' },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Preload />

        {/* IMPORTANT FIX: pointer-events-none */}
        <div className="h-[100dvh] fixed inset-0 z-20 pointer-events-none">
          <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
            menuButtonColor="#FFFFE0"
            openMenuButtonColor="#000000"
            changeMenuColorOnOpen={true}
            colors={['#FFFFE0', '#FED700']}
            logoUrl="/images/star.svg"
            accentColor="#FED700"
          />
        </div>

        {children}
      </body>
    </html>
  );
}
