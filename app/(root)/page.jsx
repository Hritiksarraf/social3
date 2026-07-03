"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PostCard from "@components/cards/PostCard";
import SkeletonCard from "@components/ui/SkeletonCard";
import EmptyState from "@components/ui/EmptyState";
import { CLUBS, CLUB_KEYS } from "@components/ui/ClubBadge";
import { usePaginatedQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useCurrentUser } from "@lib/hooks/useCurrentUser";

const Home = () => {
  const { currentUser, currentUserLoading } = useCurrentUser();
  const { results: feedPost, status, loadMore } = usePaginatedQuery(
    api.posts.getFeed,
    {},
    { initialNumItems: 12 }
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeClub, setActiveClub] = useState(searchParams.get("club") || "all");

  const loading = currentUserLoading || status === "LoadingFirstPage";
  let posts = [];
  if (!loading) {
    posts = activeClub === "all" ? feedPost : feedPost.filter((p) => p.tag === activeClub);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => setActiveClub("all")}
          className={`shrink-0 px-4 py-2 rounded-full font-extrabold text-[13px] ${
            activeClub === "all" ? "bg-white text-base-1" : "bg-surface-2 text-ink-2"
          }`}
        >
          All
        </button>
        {CLUB_KEYS.map((key) => {
          const c = CLUBS[key];
          const active = activeClub === key;
          return (
            <button
              key={key}
              onClick={() => setActiveClub(key)}
              className="shrink-0 px-3.5 py-2 rounded-full font-extrabold text-[13px] flex items-center gap-1.5"
              style={{
                background: active ? `linear-gradient(135deg, ${c.from}, ${c.to})` : "#241F30",
                color: active ? c.ink : "#C3BED2",
                boxShadow: active ? "0 0 0 2px rgba(255,255,255,0.85)" : "none",
              }}
            >
              <span>{c.emoji}</span>
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-8 items-center">
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
        {!loading && posts.length === 0 && (
          <EmptyState
            emoji="✦"
            title="Silence… for now"
            subtitle={
              activeClub === "all"
                ? "No posts yet — be the first to turn it up."
                : `No ${CLUBS[activeClub]?.label} posts yet.`
            }
            actionLabel="＋ Create a post"
            onAction={() => router.push("/create-post")}
          />
        )}
        {!loading &&
          posts.length > 0 &&
          posts.map((post) => <PostCard key={post._id} post={post} currentUser={currentUser} />)}
        {status === "LoadingMore" && <SkeletonCard />}
        {status === "CanLoadMore" && (
          <button
            onClick={() => loadMore(12)}
            className="px-5 py-2.5 rounded-full font-extrabold text-[13px] bg-surface-2 text-ink-2"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
