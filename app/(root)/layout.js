import '../globals.css'
import 'leaflet/dist/leaflet.css';

import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import LeftSideBar from "@/components/layout/LeftSideBar";
import TopBar from "@/components/layout/TopBar";
import MainContainer from "@/components/layout/MainContainer";
import RightSideBar from "@/components/layout/RightSideBar";
import BottomBar from "@components/layout/BottomBar";
import { ConvexClientProvider } from "../ConvexClientProvider";
import AuthGate from "@components/auth/AuthGate";
export const metadata = {
  title: 'Yuva Vaani',
  description: 'your campus, out loud',
}

export const dynamic = 'force-dynamic';

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

export default function RootLayout({ children }) {
  return (

    <html lang="en">
      <body className={`${bricolage.variable} ${plusJakarta.variable} font-sans bg-base-1 text-ink-1`}>
        <ConvexClientProvider>
        <AuthGate>
        <main className="flex flex-row">
        <LeftSideBar/>
          <MainContainer>
        {children}

        </MainContainer>

        </main>
        <BottomBar/>
        </AuthGate>
        </ConvexClientProvider>
        </body>

    </html>

  )
}
