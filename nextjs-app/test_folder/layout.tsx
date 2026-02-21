// @START_MF0SQMYG
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { ErrorProviders, HeadersProviders, Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import ErrorModal from "@/components/errorModal";
import { KeyPairString } from "@/utils/data";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
// @END_BYFL2IWP
// @START_VMJLQNC5

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersState: KeyPairString = {
  };
  
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={`${fontSans.variable} min-h-screen bg-background font-sans antialiased`}>
        <HeadersProviders headers={headersState}>
          <ErrorProviders>
            <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
              <div className="relative flex flex-col h-screen">
                <Navbar />
                <main className="container max-w-full w-full pt-3 mx-0 flex-grow debug-border">
                  {children}
                </main>
                <footer className="w-full flex items-center justify-center py-3 debug-border">
                </footer>
// @END_3SUTEME8
              </div>
              <ErrorModal/>
            </Providers>
          </ErrorProviders>
        </HeadersProviders>
      </body>
    </html>
  );
}
