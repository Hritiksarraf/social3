"use client";

import Loader from "@components/Loader";
import { PersonAddAlt, PersonRemove } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

const UserCard = ({ userData, update }) => {
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const getUser = async () => {
    try {
      const response = await fetch(`/api/user/${user.id}`);
      const data = await response.json();
      setUserInfo(data);
      setLoading(false);
      setIsLoaded(true);

      // Check if the current user is following userData
      const following = data?.following?.some(
        (item) => String(item) == String(userData._id)
      );
      setIsFollowing(following); // Set the following state based on the check
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      const decodedUser = jwt.decode(token);
      setUser(decodedUser);
    }
  }, []); // Only run on the first render

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);
  const handleFollow = async () => {
    setIsFollowing(!isFollowing);
    const response = await fetch(
      `/api/user/${user.id}/follow/${userData._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setUserInfo(data);
    update();
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="flex justify-between items-center">
      <Link className="flex gap-4 items-center" href={`/profile/${userData._id}/posts`}>
        <img
          src={userData.profilePhoto}
          alt="profile photo"
          width={50}
          height={50}
          className="rounded-full"
        />
        <div className="flex flex-col gap-1">
          <p className="text-small-semibold text-light-1">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="text-subtle-medium text-light-3">
            @{userData.userName}
          </p>
        </div>
      </Link>

      {user.id !== userData.clerkId &&
        (isFollowing ? (
          <PersonRemove
            sx={{ color: "#7857FF", cursor: "pointer" }}
            onClick={() => handleFollow()}
          />
        ) : (
          <PersonAddAlt
            sx={{ color: "#7857FF", cursor: "pointer" }}
            onClick={() => {
              handleFollow();
            }}
          />
        ))}
    </div>
  );
};

export default UserCard;
