"use client"

import Loader from "@components/Loader";
import Posting from "@components/form/Posting";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useCurrentUser } from "@lib/hooks/useCurrentUser";

const EditPost = () => {
  const { id } = useParams();
  const post = useQuery(api.posts.getById, { postId: id });
  const { currentUser, currentUserLoading } = useCurrentUser();

  if (post === undefined || currentUserLoading || !currentUser) {
    return <Loader />;
  }

  const postInfo = {
    caption: post?.caption,
    tag: post?.tag,
    postPhoto: post?.postPhoto,
  };

  return (
    <div className="pt-6">
      <Posting post={postInfo} mode="edit" postId={id} currentUser={currentUser} />
    </div>
  );
};

export default EditPost;
