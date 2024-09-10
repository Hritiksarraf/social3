import Post from "@lib/models/Post";
import User from "@lib/models/User";
import { connectToDB } from "@lib/mongodb/mongoose";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();

    const userId = params.id;
    const postId = params.postId;

    // Find the user by clerkId and populate relevant fields
    const user = await User.findOne({ clerkId: userId })
      .populate("posts savedPosts following followers")
      .populate({
        path: "likedPosts",
        model: "Post",
        populate: {
          path: "creator",
          model: "User",
        },
      });

    // Find the post by ID and populate relevant fields
    const post = await Post.findById(postId).populate("creator likes");

    // Check if the post is already liked by the user
    const isLiked = user.likedPosts.find((item) => item._id.toString() === postId);

    if (isLiked) {
      // If already liked, unlike the post
      user.likedPosts = user.likedPosts.filter((item) => item._id.toString() !== postId);
      post.likes = post.likes.filter((item) => item._id.toString() !== user._id.toString());
      user.pinsCount += 1;
    } else {
      // If not liked yet, like the post and decrement pinsCount
      if (user.pinsCount > 0) {
      user.likedPosts.push(post._id);
      post.likes.push(user._id);

      // Decrease pinsCount by 1 if it's greater than 0
      
        user.pinsCount -= 1;
      }
    }

    // Save the updated user and post
    await user.save();
    await post.save();

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to like/dislike post", { status: 500 });
  }
};
