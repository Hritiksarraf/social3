"use client";

import Loader from "@components/Loader";
import Posting from "@components/form/Posting";
import { useCurrentUser } from "@lib/hooks/useCurrentUser";

const CreatePost = () => {
  const { currentUser, currentUserLoading } = useCurrentUser();

  if (currentUserLoading || !currentUser) {
    return <Loader />;
  }

  const postData = {
    caption: "",
    tag: "",
    postPhoto: null,
  };

  return (
    <div className="pt-6">
      <Posting post={postData} mode="create" currentUser={currentUser} />
    </div>
  );
};

export default CreatePost;
