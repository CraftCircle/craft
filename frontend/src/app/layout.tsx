import './globals.css';
import Link from 'next/link'; // Import the Link component

export const metadata = {
  title: 'CraftCircle',
  description: 'Your platform for crafting amazing experiences.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: '1rem', backgroundColor: '#f4f4f4' }}>
          <h1>CraftCircle</h1>
          <nav>
            <Link href="/" style={{ marginRight: '1rem' }}>
              Home
            </Link>
            <Link href="/about">About</Link>
          </nav>
        </header>
        {children}
        <footer
          style={{
            padding: '1rem',
            marginTop: '2rem',
            backgroundColor: '#f4f4f4',
          }}
        >
          <p>&copy; 2024 CraftCircle. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
