import Post from "@lib/models/Post"
import User from "@lib/models/User"
import { connectToDB } from "@lib/mongodb/mongoose"

export const POST = async (req, { params }) => {
  try {
    await connectToDB()

    const userId = params.id
    const postId = params.postId

    const user = await User.findOne({ clerkId: userId }).populate("posts savedPosts likedPosts following followers")
    const post = await Post.findById(postId).populate("creator likes")

    const isSaved = user.savedPosts.find((item) => item._id.toString() === postId)

    if (isSaved) {
      post.tape = post.tape.filter((item) => item._id.toString() !== user._id.toString());
      user.savedPosts = user.savedPosts.filter((item) => item._id.toString() !== postId)
    } else {
      user.savedPosts.push(post)
      post.tape.push(user._id);
    }

    await user.save()
    await post.save();

    return new Response(JSON.stringify(user), { status: 200 })
  } catch (err) {
    console.log(err)
    return new Response("Failed to save/unsave post", { status: 500 })
  }
}