import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ThemeProvider from "@/theme/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { AlertProvider } from "@/context/AlertContext";
import AlertPopup from "@/components/AlertPopup";

export const metadata = {
  title: "Huutokauppa",
  description: "Huutokauppa sivusto tehty käyttäen NextJs,MUI,MongoDB,Express",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <AlertProvider>
        <html lang="en">
          <body className={""}>
            <AppRouterCacheProvider>
              <ThemeProvider>
                <AlertPopup />
                {children}
              </ThemeProvider>
            </AppRouterCacheProvider>
          </body>
        </html>
      </AlertProvider>
    </AuthProvider>
  );
}
