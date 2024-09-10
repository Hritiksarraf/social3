import User from "@lib/models/User";
import { connectToDB } from "@lib/mongodb/mongoose";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();

    const userId = params.id;

    // Check and log the request body
    const { collage } = await req.json();
    console.log("Received collage:", collage); // Log to verify

    if (!collage) {
      return new Response("Collage field is required", { status: 400 });
    }

    // Find and update the user
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { collage: collage } }, // Update the collage field
      { new: true } // Return the updated document
    ).populate("posts savedPosts following followers")
      .populate({
        path: "likedPosts",
        model: "Post",
        populate: {
          path: "creator",
          model: "User",
        },
      });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    console.log("Updated user:", user); // Log updated user

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to update user", { status: 500 });
  }
};
