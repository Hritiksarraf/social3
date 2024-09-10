"use client";

import Loader from "@components/Loader";
import PostCard from "@components/cards/PostCard";
import ProfileCard from "@components/cards/ProfileCard";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

const ProfilePosts = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState({});

  const [user, setUser] = useState(null);

  const getUser = async () => {
    const response = await fetch(`/api/user/profile/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setUserData(data);
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = jwt.decode(token); // Decode user from token
      setUser(decodedUser); // Set user
    }
    getUser();
  }, [id]);


  return loading ? (
    <Loader />
  ) : (
    <div className="flex flex-col gap-9">
      <ProfileCard userData={userData} activeTab="Posts" />

      <div className="flex flex-col gap-9">
        {userData?.posts?.map((post) => (
          <PostCard key={post._id} post={post} creator={post.creator} loggedInUser={user} update={getUser}/>
        ))}
      </div>
    </div>
  );
};

export default ProfilePosts;
