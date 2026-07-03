"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, PlusIcon, MapIcon } from "@components/icons";

const TopBar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const submitSearch = () => {
    if (!search.trim()) return;
    router.push(`/search/posts/${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="flex justify-between items-center gap-3 mt-6">
      <div className="flex-1 flex items-center gap-2.5 bg-surface-1 border border-white/[0.09] rounded-full px-4 py-3 focus-within:border-purple-1 transition-colors">
        <SearchIcon size={17} strokeWidth={2.4} color="#8A8598" />
        <input
          id="yv-search-input"
          type="text"
          className="flex-1 bg-transparent outline-none text-[14px] font-semibold text-white placeholder:text-ink-3"
          placeholder="Search posts, people..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitSearch()}
        />
      </div>

      <button
        className="max-md:hidden flex items-center gap-2 rounded-full py-3 px-5 font-extrabold text-[14px] text-white shrink-0"
        style={{
          background: "linear-gradient(135deg, #7857FF, #FF0073)",
          boxShadow: "0 12px 24px -10px rgba(120,87,255,0.9)",
        }}
        onClick={() => router.push("/create-post")}
      >
        <PlusIcon size={16} strokeWidth={2.8} color="#fff" />
        Create post
      </button>

      <button
        className="max-md:hidden flex items-center gap-2 rounded-full py-3 px-5 font-extrabold text-[14px] text-ink-2 bg-surface-2 border border-white/10 shrink-0"
        onClick={() => router.push("/locate")}
      >
        <MapIcon size={16} strokeWidth={2.4} color="#C3BED2" />
        Locate
      </button>
    </div>
  );
};

export default TopBar;
