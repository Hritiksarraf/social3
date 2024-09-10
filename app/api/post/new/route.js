import Post from "@lib/models/Post";
import User from "@lib/models/User";
import { connectToDB } from "@lib/mongodb/mongoose";

export const POST = async (req) => {
  try {
    await connectToDB();

    // Read form data only once
    const data = await req.formData();

    let postPhoto = data.get("postPhoto");
    let postAudio = data.get("postAudio");

    // Upload the image to Cloudinary
    const imgData = new FormData();
    imgData.append("file", postPhoto);
    imgData.append("upload_preset", "social");
    imgData.append("cloud_name", "hritiksarraf");

    const imgResponse = await fetch("https://api.cloudinary.com/v1_1/hritiksarraf/image/upload", {
      method: "POST",
      body: imgData,
    });

    if (!imgResponse.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const imgUrl = await imgResponse.json();
    const postPhotoUrl = imgUrl.url; // Assign image URL

    // Upload the audio to Cloudinary
    const audioData = new FormData();
    audioData.append("file", postAudio);
    audioData.append("upload_preset", "social");
    audioData.append("cloud_name", "hritiksarraf");

    const audioResponse = await fetch("https://api.cloudinary.com/v1_1/hritiksarraf/video/upload", {
      method: "POST",
      body: audioData,
    });

    if (!audioResponse.ok) {
      throw new Error("Failed to upload audio to Cloudinary");
    }

    const audioUrl = await audioResponse.json();
    const postAudioUrl = audioUrl.url; // Assign audio URL

    // Make sure the required fields are properly set
    const creatorId = data.get("creatorId");
    const caption = data.get("caption");
    const tag = data.get("tag");

    if (!creatorId || !caption) {
      throw new Error("Missing required fields: creator or caption");
    }

    // Create a new post in the database
    const newPost = await Post.create({
      creator: creatorId, // Make sure this is correctly set
      caption: caption,
      tag: tag,
      postPhoto: postPhotoUrl,
      tape: [],
      postAudio: postAudioUrl,
    });

    // Update the user's posts array
    await User.findByIdAndUpdate(
      creatorId,
      { $push: { posts: newPost._id } },
      { new: true, useFindAndModify: false }
    );

    return new Response(JSON.stringify(newPost), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to create a new post", { status: 500 });
  }
};
