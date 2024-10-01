
import { Inter } from "next/font/google";
import "../globals.css";
import 'leaflet/dist/leaflet.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Auth",
  description: "collage connect",
};

export default function RootLayout({ children }) {
  return (
    
        <html lang="en">
            <body className={`${inter.className} bg-purple-2`}>
            
          {children}
        </body>
        </html>
    
  );
}
