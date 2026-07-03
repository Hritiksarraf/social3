"use client";

import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import Avatar from "@components/ui/Avatar";
import Button from "@components/ui/Button";

const UserCard = ({ userData, currentUser }) => {
  const toggleFollow = useMutation(api.users.toggleFollow);

  const isFollowing = currentUser?.following?.some((id) => id === userData._id);
  const isOwnProfile = currentUser?._id === userData._id;

  const handleFollow = () => {
    toggleFollow({ userId: currentUser._id, followId: userData._id });
  };

  return (
    <div className="flex justify-between items-center py-1 w-full max-w-xl">
      <Link className="flex gap-3 items-center min-w-0" href={`/profile/${userData._id}/posts`}>
        <Avatar src={userData.profilePhoto} name={userData.firstName} size="md" />
        <div className="min-w-0">
          <p className="font-extrabold text-[14px] truncate">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="text-[12px] text-ink-3 truncate">@{userData.userName}</p>
        </div>
      </Link>

      {!isOwnProfile && (
        <Button size="sm" variant={isFollowing ? "secondary" : "primary"} onClick={handleFollow}>
          {isFollowing ? "✓ Following" : "Follow"}
        </Button>
      )}
    </div>
  );
};

export default UserCard;
