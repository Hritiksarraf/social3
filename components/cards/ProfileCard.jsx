import Loader from "@components/Loader";
import { PersonAddAlt, PersonRemove } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { tabs } from "@constants";
import Link from "next/link";
import jwt from "jsonwebtoken";

const ProfileCard = ({ userData, activeTab }) => {
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
    try {
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

      // Toggle following state
      
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="flex flex-col gap-9">
      <div className="flex justify-between items-start">
        <div className="flex gap-5 items-start">
          <img
            src={userData.profilePhoto}
            alt="profile photo"
            width={100}
            height={100}
            className="rounded-full md:max-lg:hidden"
          />

          <div className="flex flex-col gap-3">
            <p className="text-light-1 text-heading3-bold max-sm:text-heading4-bold">
              {userData.firstName} {userData.lastName}
            </p>
            <p className="text-light-3 text-subtle-semibold">
              @{userData.userName}
            </p>
            <div className="flex gap-7 text-small-bold max-sm:gap-4">
              <div className="flex max-sm:flex-col gap-2 items-center max-sm:gap-0.5">
                <p className="text-purple-1">{userData.posts.length}</p>
                <p className="text-light-1">Posts</p>
              </div>
              <div className="flex max-sm:flex-col gap-2 items-center max-sm:gap-0.5">
                <p className="text-purple-1">{userData.followers.length}</p>
                <p className="text-light-1">Followers</p>
              </div>
              <div className="flex max-sm:flex-col gap-2 items-center max-sm:gap-0.5">
                <p className="text-purple-1">{userData.following.length}</p>
                <p className="text-light-1">Following</p>
              </div>
            </div>
          </div>
        </div>

        {user?.id !== userData.clerkId && (
          isFollowing ? (
            <PersonRemove
              sx={{ color: "#7857FF", cursor: "pointer", fontSize: "40px" }}
              onClick={handleFollow}
            />
          ) : (
            <PersonAddAlt
              sx={{ color: "#7857FF", cursor: "pointer", fontSize: "40px" }}
              onClick={handleFollow}
            />
          )
        )}
      </div>

      <div className="flex gap-6">
        {tabs.map((tab) => (
          <Link
            key={tab.name} // Add key to prevent React warnings
            className={`tab ${activeTab === tab.name ? "bg-purple-1" : "bg-dark-2"}`}
            href={`/profile/${userData._id}/${tab.link}`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;
