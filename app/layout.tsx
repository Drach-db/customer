import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intercom Clone",
  description: "Customer support platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('ui-storage');
                if (stored) {
                  var data = JSON.parse(stored);
                  if (data.state && !data.state.isNavbarExpanded) {
                    document.documentElement.classList.add('navbar-collapsed');
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
