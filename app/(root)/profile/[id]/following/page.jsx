"use client"

import Loader from "@components/Loader";
import ProfileCard from "@components/cards/ProfileCard";
import UserCard from "@components/cards/UserCard";
import EmptyState from "@components/ui/EmptyState";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useCurrentUser } from "@lib/hooks/useCurrentUser";
import { focusSearch } from "@lib/focusSearch";

const Following = () => {
  const { id } = useParams();
  const userData = useQuery(api.users.getProfile, { userId: id });
  const { currentUser, currentUserLoading } = useCurrentUser();

  if (userData === undefined || currentUserLoading || !currentUser) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-6">
      <ProfileCard userData={userData} activeTab="Following" currentUser={currentUser} />

      <div className="flex flex-col gap-4">
        {userData.following.length === 0 ? (
          <EmptyState emoji="👥" title="Not following anyone yet" actionLabel="Find people" onAction={focusSearch} />
        ) : (
          userData.following.map((person) => (
            <UserCard key={person._id} userData={person} currentUser={currentUser} />
          ))
        )}
      </div>
    </div>
  );
};

export default Following;
