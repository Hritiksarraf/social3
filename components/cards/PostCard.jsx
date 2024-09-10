import {
  Bookmark,
  BookmarkBorder,
  BorderColor,
  Delete,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import Link from "next/link";
import { useEffect, useState } from "react";
import PushPinIcon from '@mui/icons-material/PushPin';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import PlaceIcon from '@mui/icons-material/Place';

const PostCard = ({ post, creator, loggedInUser, update }) => {
  const [like, setLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userData, setUserData] = useState(null); // Initial state is null


  //for collage
  


  // Fetch user data function
  const getUser = async () => {
    try {
      const response = await fetch(`/api/user/${loggedInUser.id}`);
      const data = await response.json();
      console.log("Fetched user data:", data); // Log the fetched user data for debugging
      setUserData(data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // Use useEffect to fetch the user data on component mount
  useEffect(() => {
    getUser();
  }, []);

  // Set the like and saved states based on the fetched userData
  useEffect(() => {
    if (userData) {
      if (userData.likedPosts?.some((item) => String(item) === String(post._id))) {
        setLike(true);
      }
      if (userData.savedPosts?.some((item) => String(item) === String(post._id))) {
        setSaved(true);
      }
    }
  }, [userData, post._id]);

  // Handle Save Post
  const handleSave = async () => {
    setSaved(!saved)
    try {
      const response = await fetch(
        `/api/user/${loggedInUser.id}/save/${post._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setUserData(data);
      update();
    } catch (error) {
      console.error("Failed to save the post:", error);
    }
  };

  // Handle Like Post
  const handleLike = async () => {
    
    if(userData.pinsCount>0){
      setLike(!like);
    try {
      const response = await fetch(
        `/api/user/${loggedInUser.id}/like/${post._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setUserData(data);
      update();
    } catch (error) {
      console.error("Failed to like the post:", error);
    }
  }
  };

  // Handle Delete Post
  const handleDelete = async () => {
    try {
      await fetch(`/api/post/${post._id}/${loggedInUser.id}`, {
        method: "DELETE",
      });
      update();
    } catch (error) {
      console.error("Failed to delete the post:", error);
    }
  };

  // Check if userData is still null or undefined, show a loading state if it is
  if (!userData) {
    return <p>Loading...</p>; // Show loading while data is being fetched
  }

  console.log("Is liked:", like); // Log the like state
  console.log("Is saved:", saved); // Log the saved state

  return (
    <div className="w-full max-w-xl rounded-lg flex flex-col gap-4 bg-dark-1 p-5 max-sm:gap-2">
      <div className="flex justify-between">
        <Link href={`/profile/${creator._id}/posts`}>
          <div className="flex gap-3 items-center">
            <img
              src={creator.profilePhoto}
              alt="profile photo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="flex flex-col gap-1">
              <p className="text-small-semibold text-light-1">
                {creator.firstName} {creator.lastName}
              </p>
              <p className="text-subtle-medium text-light-3">
                @{creator.username}
              </p>
              
            </div>
            
          </div>
        </Link>

        {loggedInUser.id === creator.clerkId && (
          <Link href={`/edit-post/${post._id}`}>
            <BorderColor sx={{ color: "white", cursor: "pointer" }} />
          </Link>
        )}
      </div>

      <p className="text-body-normal text-light-1 max-sm:text-small-normal">
        {post.caption}
      </p>

      <img
        src={post.postPhoto}
        alt="post photo"
        width={200}
        height={150}
        className="rounded-lg w-full"
      />

        <audio controls className="w-full mt-4">
          <source src={post.postAudio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

      <p className="text-base-semibold text-purple-1 max-sm:text-small-normal">
        #{post.tag} <span className="text-xl m-4 text-bold">
                <span><PlaceIcon
              sx={{ color: "white", cursor: "pointer", fontSize:"5" }}
              onClick={handleSave}
            /></span>
                {creator.collage}
              </span>
      </p>
      

      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          {!like ? (
            <PushPinIcon
              sx={{ color: "white", cursor: "pointer" }}
              onClick={handleLike}
            />
          ) : (
            <PushPinIcon
              sx={{ color: "red", cursor: "pointer" }}
              onClick={handleLike}
            />
          )}
          <p className="text-light-1">{post.likes.length}</p>
        </div>
        {loggedInUser.id === creator.clerkId && (
          <Delete
            sx={{ color: "white", cursor: "pointer" }}
            onClick={handleDelete}
          />
        )}
        <div className="flex gap-2 items-center">
          {(saved ?(
            <LocalHospitalOutlinedIcon
            sx={{ color: "purple", cursor: "pointer" }}
            onClick={handleSave}
          />
          ) : (
            <LocalHospitalOutlinedIcon
              sx={{ color: "white", cursor: "pointer" }}
              onClick={handleSave}
            />
          ))}
          <p className="text-light-1">{post.tape.length}</p>
        </div>

        

       
      </div>
    </div>
  );
};

export default PostCard;
