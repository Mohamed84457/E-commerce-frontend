import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// providers
import Snackbarprovider from "./context/snackbarcontext";
import Loadingprovider from "./context/loadingcontext";
import Userdataprovider from "./context/userdatacontext";
import Sidebarprovider from "./context/sidebarcontext";
import Isuserschangeprovider from "./context/isuserschangescontext";
import Customizedwebsidefeedback from "./website/feedback/page";
import Cartitemsnumberprovider from "./website/context/cartitemsnumber";
// global feedback
import { GlobalSnackbar } from "./website/feedback/globalsnackbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Metadata replaces <Head> in App Router
export const metadata = {
  title: "DMT commerce",
  description: "Welcome to DMT commerce",
  icons: {
    icon: "/favicon.png", // must be in /public
    shortcut: "/favicon.png", // optional
    apple: "/favicon.png", // optional for Apple devices
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Cartitemsnumberprovider>
          <Customizedwebsidefeedback>
            <Isuserschangeprovider>
              <Sidebarprovider>
                <Userdataprovider>
                  <Loadingprovider>
                    <Snackbarprovider>
                      {children}
                      <GlobalSnackbar />
                    </Snackbarprovider>
                  </Loadingprovider>
                </Userdataprovider>
              </Sidebarprovider>
            </Isuserschangeprovider>
          </Customizedwebsidefeedback>
        </Cartitemsnumberprovider>
      </body>
    </html>
  );
}
