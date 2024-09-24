"use client";

import Loader from "@components/Loader";
import PostCard from "@components/cards/PostCard";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from 'next/navigation';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [feedPost, setFeedPost] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const getFeedPost = async () => {
    const response = await fetch("/api/post");
    const data = await response.json();
    setFeedPost(data);
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = jwt.decode(token); // Decode user from token
      setUser(decodedUser); // Set user
    }
    else{
      router.push('/sign-in')
    }
    getFeedPost();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="flex flex-col gap-10">
      {feedPost.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          creator={post.creator}
          loggedInUser={user} // Pass user to PostCard
          update={getFeedPost}
        />
      ))}
    </div>
  );
};

export default Home;
