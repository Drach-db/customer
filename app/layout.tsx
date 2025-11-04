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
                // Handle navbar state
                var uiStored = localStorage.getItem('ui-storage');
                if (uiStored) {
                  var uiData = JSON.parse(uiStored);
                  if (uiData.state && !uiData.state.isNavbarExpanded) {
                    document.documentElement.classList.add('navbar-collapsed');
                  }
                }

                // Handle user state - store in window for initial render
                var userStored = localStorage.getItem('user-storage');
                if (userStored) {
                  var userData = JSON.parse(userStored);
                  if (userData.state) {
                    window.__USER_DATA__ = userData.state;
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
