import Post from "@lib/models/Post";
import { connectToDB } from "@lib/mongodb/mongoose";
import { writeFile } from "fs/promises";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const post = await Post.findById(params.id)
      .populate("creator likes")
      .exec();

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Fail to get post by id", { status: 500 });
  }
};

export const POST = async (req, { params }) => {
  const path = require("path");
  const currentWorkingDirectory = process.cwd();

  try {
    await connectToDB();

    const data = await req.formData();

    let postPhoto = data.get("postPhoto");

    if (typeof postPhoto !== "string") {
      const dataimg = new FormData();
    dataimg.append("file", postPhoto);
    dataimg.append("upload_preset", "social");
    dataimg.append("cloud_name", "hritiksarraf");

    let url= await fetch("https://api.cloudinary.com/v1_1/hritiksarraf/image/upload", {
      method: "POST",
      body: dataimg,
    })

    let imgUrl= await url.json();
    
    postPhoto = imgUrl.url
    }

    const post = await Post.findByIdAndUpdate(
      params.id,
      {
        $set: {
          caption: data.get("caption"),
          tag: data.get("tag"),
          postPhoto: postPhoto,
        },
      },
      { new: true, useFindAndModify: false }
    );

    await post.save();

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to update the post", { status: 500 });
  }
};


