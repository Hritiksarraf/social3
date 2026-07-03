"use client"

import Loader from "@components/Loader";
import UserCard from "@components/cards/UserCard";
import SearchTabs from "@components/ui/SearchTabs";
import EmptyState from "@components/ui/EmptyState";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useCurrentUser } from "@lib/hooks/useCurrentUser";

const SearchPeople = () => {
  const { query } = useParams();
  const searchedPeople = useQuery(api.users.searchUsers, { queryText: query });
  const { currentUser, currentUserLoading } = useCurrentUser();

  if (searchedPeople === undefined || currentUserLoading || !currentUser) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-6">
      <SearchTabs query={query} active="people" />

      <div className="flex flex-col gap-4">
        {searchedPeople.length === 0 ? (
          <EmptyState emoji="🔍" title="Nothing found" subtitle={`No one matches "${decodeURIComponent(query)}".`} />
        ) : (
          searchedPeople.map((person) => (
            <UserCard key={person._id} userData={person} currentUser={currentUser} />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPeople;
