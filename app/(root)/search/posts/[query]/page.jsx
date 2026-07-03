"use client"

import Loader from "@components/Loader";
import PostCard from "@components/cards/PostCard";
import SearchTabs from "@components/ui/SearchTabs";
import EmptyState from "@components/ui/EmptyState";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useCurrentUser } from "@lib/hooks/useCurrentUser";

const SearchPost = () => {
  const { query } = useParams();
  const searchedPosts = useQuery(api.posts.search, { queryText: query });
  const { currentUser, currentUserLoading } = useCurrentUser();

  if (searchedPosts === undefined || currentUserLoading || !currentUser) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-6">
      <SearchTabs query={query} active="posts" />

      <div className="flex flex-col gap-8 items-center">
        {searchedPosts.length === 0 ? (
          <EmptyState emoji="🔍" title="Nothing found" subtitle={`No posts match "${decodeURIComponent(query)}".`} />
        ) : (
          searchedPosts.map((post) => (
            <PostCard key={post._id} post={post} currentUser={currentUser} />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPost;
