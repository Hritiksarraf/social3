"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import Avatar from "@components/ui/Avatar";
import ClubBadge, { CLUBS } from "@components/ui/ClubBadge";
import WaveformPlayer from "@components/ui/WaveformPlayer";
import { HeartIcon, CommentIcon, BookmarkIcon } from "@components/icons";

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

const PostCard = ({ post, currentUser }) => {
  const toggleLike = useMutation(api.users.toggleLike);
  const toggleSave = useMutation(api.users.toggleSave);
  const removePost = useMutation(api.posts.remove);
  const [popLike, setPopLike] = useState(false);

  if (!post.creator || !currentUser) return null;

  const isOwner = currentUser._id === post.creator._id;
  const liked = currentUser.likedPosts?.some((id) => id === post._id);
  const saved = currentUser.savedPosts?.some((id) => id === post._id);
  const club = CLUBS[post.tag];

  const handleLike = () => {
    if (!liked && currentUser.pinsCount <= 0) return;
    if (!liked) {
      setPopLike(true);
      setTimeout(() => setPopLike(false), 350);
    }
    toggleLike({ userId: currentUser._id, postId: post._id });
  };

  const handleSave = () => {
    toggleSave({ userId: currentUser._id, postId: post._id });
  };

  const handleDelete = () => {
    if (!confirm("Delete this post?")) return;
    removePost({ postId: post._id, creatorId: currentUser._id });
  };

  return (
    <div className="w-full max-w-xl rounded-[26px] bg-surface-1 border border-white/[0.06] overflow-hidden shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2.5 px-4 pt-3.5 pb-3">
        <Link href={`/profile/${post.creator._id}/posts`} className="flex items-center gap-2.5 flex-1 min-w-0">
          <Avatar src={post.creator.profilePhoto} name={post.creator.firstName} size="md" />
          <div className="min-w-0">
            <p className="font-extrabold text-[14px] truncate">
              {post.creator.firstName} {post.creator.lastName}
            </p>
            <p className="text-[11px] text-ink-3 truncate">
              {post.creator.collageName} · {timeAgo(post.createdAt)}
            </p>
          </div>
        </Link>
        {club && <ClubBadge club={post.tag} size="sm" />}
      </div>

      {post.postPhoto && (
        <img src={post.postPhoto} alt="post" className="w-full max-h-[420px] object-cover" />
      )}

      {post.postAudio && (
        <div className="px-3.5 py-3">
          <WaveformPlayer
            src={post.postAudio}
            gradientFrom={club?.from || "#7857FF"}
            gradientTo={club?.to || "#FF0073"}
          />
        </div>
      )}

      <div className="flex items-center gap-4 px-4 pt-3">
        <button
          type="button"
          onClick={handleLike}
          className="flex items-center gap-1.5 font-extrabold text-[13px]"
          style={{ color: liked ? "#FF0073" : "#C3BED2" }}
        >
          <HeartIcon size={21} filled={liked} className={popLike ? "animate-yv-pop" : ""} />
          {post.likesCount}
        </button>
        <span className="flex items-center gap-1.5 font-bold text-[13px] text-ink-4">
          <CommentIcon size={20} />
        </span>
        <button
          type="button"
          onClick={handleSave}
          className="ml-auto flex items-center gap-1.5 font-extrabold text-[13px]"
          style={{ color: saved ? "#7857FF" : "#C3BED2" }}
        >
          <BookmarkIcon size={20} filled={saved} />
          {post.tapeCount}
        </button>
      </div>

      <p className="px-4 pt-2 text-[14px] text-[#E8E5F0] leading-relaxed">
        <span className="font-extrabold">{post.creator.userName}</span> {post.caption}
      </p>

      {isOwner ? (
        <div className="flex gap-2 px-4 pt-3 pb-4">
          <Link
            href={`/edit-post/${post._id}`}
            className="flex-1 text-center py-2 rounded-xl bg-surface-2 border border-white/[0.06] text-ink-2 font-extrabold text-[12px]"
          >
            ✏️ Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 text-center py-2 rounded-xl bg-danger/10 border border-danger/25 text-danger font-extrabold text-[12px]"
          >
            🗑 Delete
          </button>
        </div>
      ) : (
        <div className="pb-4" />
      )}
    </div>
  );
};

export default PostCard;
