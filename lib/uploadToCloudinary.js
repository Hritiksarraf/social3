export async function uploadToCloudinary(file, type) {
  const form = new FormData();
  form.append("file", file);
  form.append("type", type);
  const response = await fetch("/api/upload", { method: "POST", body: form });
  if (!response.ok) throw new Error(`Failed to upload ${type}`);
  const { secure_url } = await response.json();
  return secure_url;
}
