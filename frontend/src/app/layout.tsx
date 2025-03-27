import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import ApolloWrapper from "./client-layout";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ApolloWrapper>{children}</ApolloWrapper>
        </body>
      </html>
    </ThemeProvider>
  );
}
