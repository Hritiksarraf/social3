const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

export const POST = async (req) => {
  try {
    const data = await req.formData();
    const file = data.get("file");
    const type = data.get("type") === "audio" ? "video" : "image";

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", UPLOAD_PRESET);
    uploadData.append("cloud_name", CLOUD_NAME);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`,
      { method: "POST", body: uploadData }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload ${type} to Cloudinary`);
    }

    const result = await response.json();

    return new Response(JSON.stringify({ secure_url: result.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 });
  }
};
