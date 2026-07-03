"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, SearchIcon, MapIcon } from "@components/icons";
import Avatar from "@components/ui/Avatar";
import { focusSearch } from "@lib/focusSearch";

const Menu = ({ currentUser }) => {
  const pathname = usePathname();

  const itemClass = (active) =>
    `flex items-center gap-3.5 rounded-2xl py-3 px-3.5 font-extrabold text-[15px] mb-1 ${
      active
        ? "text-white"
        : "text-ink-2 hover:bg-white/[0.04]"
    }`;

  const itemStyle = (active) =>
    active
      ? {
          background: "linear-gradient(135deg, rgba(120,87,255,0.22), rgba(255,0,115,0.16))",
          border: "1px solid rgba(120,87,255,0.3)",
        }
      : undefined;

  return (
    <div className="flex flex-col">
      <Link href="/" className={itemClass(pathname === "/")} style={itemStyle(pathname === "/")}>
        <HomeIcon size={22} color={pathname === "/" ? "#fff" : "#8A8598"} />
        Home
      </Link>
      <button
        type="button"
        onClick={focusSearch}
        className={itemClass(pathname.startsWith("/search"))}
        style={itemStyle(pathname.startsWith("/search"))}
      >
        <SearchIcon size={22} color={pathname.startsWith("/search") ? "#fff" : "#8A8598"} />
        Search
      </button>
      <Link
        href="/locate"
        className={itemClass(pathname === "/locate")}
        style={itemStyle(pathname === "/locate")}
      >
        <MapIcon size={22} color={pathname === "/locate" ? "#fff" : "#8A8598"} />
        Map
      </Link>
      {currentUser && (
        <Link
          href={`/profile/${currentUser._id}/posts`}
          className={itemClass(pathname.startsWith("/profile"))}
          style={itemStyle(pathname.startsWith("/profile"))}
        >
          <Avatar src={currentUser.profilePhoto} name={currentUser.firstName} size="sm" />
          Profile
        </Link>
      )}
    </div>
  );
};

export default Menu;
