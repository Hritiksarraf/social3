"use client";

import Loader from "@components/Loader";
import ProfileCard from "@components/cards/ProfileCard";
import EmptyState from "@components/ui/EmptyState";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useCurrentUser } from "@lib/hooks/useCurrentUser";

const ProfilePosts = () => {
  const { id } = useParams();
  const userData = useQuery(api.users.getProfile, { userId: id });
  const { currentUser, currentUserLoading } = useCurrentUser();

  if (userData === undefined || currentUserLoading || !currentUser) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-6">
      <ProfileCard userData={userData} activeTab="Posts" currentUser={currentUser} />

      {userData.posts.length === 0 ? (
        <EmptyState emoji="📸" title="No posts yet" subtitle={`${userData.firstName} hasn't shared anything yet.`} />
      ) : (
        <div className="grid grid-cols-3 gap-1.5">
          {userData.posts.map((post) => (
            <div key={post._id} className="relative aspect-square rounded-xl overflow-hidden bg-surface-2">
              {post.postPhoto && (
                <img src={post.postPhoto} alt="" className="w-full h-full object-cover" />
              )}
              {post.postAudio && (
                <span className="absolute top-1.5 right-1.5 text-xs drop-shadow">🔊</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePosts;
