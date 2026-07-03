"use client";

import { tabs } from "@constants";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import Avatar from "@components/ui/Avatar";
import ClubBadge from "@components/ui/ClubBadge";
import Button from "@components/ui/Button";

const ProfileCard = ({ userData, activeTab, currentUser }) => {
  const toggleFollow = useMutation(api.users.toggleFollow);

  const isFollowing = currentUser?.following?.some((id) => id === userData._id);
  const isOwnProfile = currentUser?._id === userData._id;

  const handleFollow = () => {
    toggleFollow({ userId: currentUser._id, followId: userData._id });
  };

  return (
    <div className="flex flex-col -mt-6 -mx-4 md:-mx-10 lg:-mx-4 xl:-mx-20">
      <div
        className="h-[130px]"
        style={{ background: "linear-gradient(135deg, #7857FF, #FF0073)" }}
      />
      <div className="px-4 md:px-10 lg:px-4 xl:px-20 -mt-11">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <Avatar
              src={userData.profilePhoto}
              name={userData.firstName}
              size="xl"
              className="border-4 border-base-1"
            />
          </div>
          {!isOwnProfile && (
            <Button size="sm" variant={isFollowing ? "secondary" : "primary"} onClick={handleFollow} className="mb-1.5">
              {isFollowing ? "✓ Following" : "Follow"}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2.5 mt-4">
          <p className="font-display font-extrabold text-2xl tracking-tight">
            {userData.firstName} {userData.lastName}
          </p>
          {userData.homeClub && <ClubBadge club={userData.homeClub} size="sm" />}
        </div>
        <p className="text-ink-3 text-[13px] font-semibold mt-0.5">
          @{userData.userName} · {userData.collageName}
        </p>

        <div className="flex gap-7 mt-4">
          <div>
            <span className="font-display font-extrabold text-lg">{userData.posts.length}</span>{" "}
            <span className="text-ink-3 text-[13px] font-semibold">posts</span>
          </div>
          <div>
            <span className="font-display font-extrabold text-lg">{userData.followers.length}</span>{" "}
            <span className="text-ink-3 text-[13px] font-semibold">followers</span>
          </div>
          <div>
            <span className="font-display font-extrabold text-lg">{userData.following.length}</span>{" "}
            <span className="text-ink-3 text-[13px] font-semibold">following</span>
          </div>
        </div>

        <div className="flex gap-6 mt-5 border-b border-white/[0.08]">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              className={`pb-3 text-[14px] font-bold ${
                activeTab === tab.name
                  ? "text-white border-b-[2.5px] border-pink-1"
                  : "text-ink-3"
              }`}
              href={`/profile/${userData._id}/${tab.link}`}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
