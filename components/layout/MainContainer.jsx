"use client"

import TopBar from "./TopBar";
import { pageTitles } from "@constants";
import { usePathname } from "next/navigation";

const MainContainer = ({ children }) => {
  // Get the current url path
  const currentPath = usePathname();

  const regex = /^\/([^\/]+)/;
  const firstPath = currentPath.match(regex)
    ? currentPath.match(regex)[0]
    : currentPath;

  // Get title of current path
  const title = pageTitles.find((page) => page.url === firstPath)?.title || "";

  return (
    <section className="flex flex-col flex-1 max-w-3xl 2xl:max-w-7xl px-4 md:px-10 lg:px-4 xl:px-20"
    style={{
      backgroundImage: "url('https://res.cloudinary.com/dtyombve3/image/upload/v1726915802/p9nltuloqxn5edeftgyg.webp')",
      backgroundSize: "cover", // Ensures the image covers the whole area
      backgroundPosition: "center", // Centers the image in the container
      backgroundRepeat: "no-repeat", // Prevents the image from repeating
    }}
    >
      <TopBar />
      <div className="mb-20">
        <h1 className="mb-5 text-heading2-bold max-sm:text-heading3-bold text-light-1">
          {title}
        </h1>
        <div className="h-screen overflow-y-scroll custom-scrollbar">
          {children}
        </div>
      </div>
    </section>
  );
};

export default MainContainer;
