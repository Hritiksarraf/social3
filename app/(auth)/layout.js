
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import 'leaflet/dist/leaflet.css';
import { ConvexClientProvider } from "../ConvexClientProvider";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Yuva Vaani",
  description: "your campus, out loud",
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }) {
  return (
        <html lang="en">
            <body className={`${bricolage.variable} ${plusJakarta.variable} font-sans bg-base-1 text-ink-1`}>
              <ConvexClientProvider>
                {children}
              </ConvexClientProvider>
            </body>
        </html>
  );
}
