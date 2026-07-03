"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HomeIcon, SearchIcon, MapIcon, PlusIcon } from "@components/icons";
import Avatar from "@components/ui/Avatar";
import { focusSearch } from "@lib/focusSearch";
import { useCurrentUser } from "@lib/hooks/useCurrentUser";

const BottomBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useCurrentUser();

  return (
    <div className="sticky flex bottom-0 z-20 w-full bg-base-1/95 backdrop-blur-lg border-t border-white/[0.06] px-4 py-2.5 items-center justify-around md:hidden">
      <Link href="/" aria-label="Home">
        <HomeIcon size={24} strokeWidth={2.2} color={pathname === "/" ? "#fff" : "#5C5869"} />
      </Link>
      <button type="button" onClick={focusSearch} aria-label="Search">
        <SearchIcon size={24} strokeWidth={2.2} color={pathname.startsWith("/search") ? "#fff" : "#5C5869"} />
      </button>
      <button
        type="button"
        onClick={() => router.push("/create-post")}
        aria-label="Create post"
        className="w-[46px] h-[46px] rounded-2xl flex items-center justify-center -mt-3.5 -rotate-3"
        style={{
          background: "linear-gradient(135deg, #7857FF, #FF0073)",
          boxShadow: "0 12px 24px -8px rgba(120,87,255,0.9)",
        }}
      >
        <PlusIcon size={24} strokeWidth={2.6} color="#fff" />
      </button>
      <Link href="/locate" aria-label="Map">
        <MapIcon size={24} strokeWidth={2.2} color={pathname === "/locate" ? "#fff" : "#5C5869"} />
      </Link>
      {currentUser && (
        <Link href={`/profile/${currentUser._id}/posts`} aria-label="Profile">
          <Avatar src={currentUser.profilePhoto} name={currentUser.firstName} size="xs" />
        </Link>
      )}
    </div>
  );
};

export default BottomBar;
