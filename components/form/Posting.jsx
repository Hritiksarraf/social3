"use client";

import { AddPhotoAlternateOutlined, Mic, Stop } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import jwt from "jsonwebtoken";

const Posting = ({ post, apiEndpoint, userDatas }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: post,
  });

  const router = useRouter();
  const [collage, setCollage] = useState("");
  const [collageForm, setCollageForm] = useState(false);
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);

  // States for recording functionality
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handlePublish = async (data) => {
    try {
      const postForm = new FormData();

      // Append form data
      postForm.append("creatorId", data.creatorId);
      postForm.append("caption", data.caption);
      postForm.append("tag", data.tag);

      // Handle image file input
      if (data.postPhoto && data.postPhoto.length > 0) {
        postForm.append("postPhoto", data.postPhoto[0]);
      }

      // Append recorded audio if available
      if (audioBlob) {
        postForm.append("postAudio", audioBlob, "recording.mp3");
      } else if (data.postAudio && data.postAudio.length > 0) {
        postForm.append("postAudio", data.postAudio[0]);
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: postForm,
      });

      if (response.ok) {
        router.push(`/`);
      } else {
        console.error("Failed to publish post:", response.statusText);
      }
    } catch (err) {
      console.log("Error while publishing post:", err);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        setAudioBlob(audioBlob);
        audioChunksRef.current = []; // Reset the chunks for next recording
      };

      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing the microphone", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCollage = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/user/${userDatas.clerkId}/collage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collage }),
      });

      if (response.ok) {
        setCollageForm(false);
        router.push(`/create-post`);
      } else {
        console.error("Failed to update collage:", response.statusText);
      }
    } catch (err) {
      console.error("Error updating collage:", err);
    }
  };

  const getUser = async () => {
    try {
      const response = await fetch(`/api/user/${user.clerkId}`);
      const data = await response.json();
      setUserData(data);

      if (data.collage !== "") {
        setCollageForm(false);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
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

  useEffect(() => {
    if (userData && userData.collageName !== "") {
      setCollageForm(false);
    }
  }, [userData]);

  return (
    <>
      {collageForm ? (
        <form className="flex flex-col gap-7 pb-24" onSubmit={handleCollage}>
          <div>
            <label htmlFor="collage" className="text-light-1">
              Update your collage to make a post
            </label>
            <textarea
              onChange={(e) => setCollage(e.target.value)}
              value={collage}
              rows={1}
              placeholder="Collage name"
              className="w-full input"
              id="collage"
              name="collage"
            />
          </div>
          <button
            type="submit"
            className="py-2.5 rounded-lg mt-10 bg-purple-1 hover:bg-pink-1 text-light-1"
          >
            Update
          </button>
        </form>
      ) : (
        <form className="flex flex-col gap-7 pb-24" onSubmit={handleSubmit(handlePublish)}>
          <label
            htmlFor="photo"
            className="flex gap-4 items-center text-light-1 cursor-pointer"
          >
            {watch("postPhoto") ? (
              typeof watch("postPhoto") === "string" ? (
                <img
                  src={watch("postPhoto")}
                  alt="post"
                  width={250}
                  height={200}
                  className="object-cover rounded-lg"
                />
              ) : (
                <img
                  src={URL.createObjectURL(watch("postPhoto")[0])}
                  alt="post"
                  width={250}
                  height={200}
                  className="object-cover rounded-lg"
                />
              )
            ) : (
              <AddPhotoAlternateOutlined sx={{ fontSize: "100px", color: "white" }} />
            )}
            <p>Upload a photo</p>
          </label>
          <input
            {...register("postPhoto")}
            id="photo"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
          />

          <label className="flex gap-4 items-center text-light-1 cursor-pointer">
            {isRecording ? (
              <Stop sx={{ fontSize: "40px", color: "red" }} onClick={stopRecording} />
            ) : (
              <Mic sx={{ fontSize: "40px", color: "white" }} onClick={startRecording} />
            )}
            <p>{isRecording ? "Recording..." : "Start Recording"}</p>
          </label>

          {audioBlob && <p className="text-green-500">Audio Recorded!</p>}

          <div>
            <label htmlFor="caption" className="text-light-1">
              Caption
            </label>
            <textarea
              {...register("caption", {
                required: "Caption is required",
                validate: (value) => value.length >= 3 || "Caption must be more than 2 characters",
              })}
              rows={3}
              placeholder="What's on your mind?"
              className="w-full input"
              id="caption"
            />
            {errors.caption && (
              <p className="text-red-500">{errors.caption.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="tag" className="text-light-1">
              Club
            </label>
            <select
              {...register("tag", { required: "Tag is required" })}
              className="w-full input"
            >
              <option value="fire">Fire</option>
              <option value="ice">Ice</option>
              <option value="water">Water</option>
              <option value="earth">Earth</option>
              <option value="cloud">Cloud</option>
            </select>
            {errors.tag && <p className="text-red-500">{errors.tag.message}</p>}
          </div>

          <button
            type="submit"
            className="py-2.5 rounded-lg mt-10 bg-purple-1 hover:bg-pink-1 text-light-1"
          >
            Publish
          </button>
        </form>
      )}
    </>
  );
};

export default Posting;
