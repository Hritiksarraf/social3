"use client";

import Loader from "@components/Loader";
import Posting from "@components/form/Posting";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

const CreatePost = () => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState({});

  const getUser = async () => {
    try {
        const response = await fetch(`/api/user/${user.id}`);
        const data = await response.json();
        setUserData(data);
        setLoading(false);
        setIsLoaded(true);
        console.log(data);
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
        const decodedUser = jwt.decode(token);
        setUser(decodedUser);
        console.log(decodedUser);
    }
}, []); // Only run on the first render

useEffect(() => {
    if (user) {
        getUser();
    }
}, [user]);

  const postData = {
    creatorId: userData?._id,
    caption: "",
    tag: "",
    postPhoto: null,
  };

  return loading || !isLoaded ? (
    <Loader />
  ) : (
    <div className="pt-6">
      <Posting post={postData} apiEndpoint={"/api/post/new"} userDatas={userData} />
    </div>
  );
};

export default CreatePost;
