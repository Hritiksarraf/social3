"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { uploadToCloudinary } from "@lib/uploadToCloudinary";
import { CLUBS, CLUB_KEYS } from "@components/ui/ClubBadge";
import WaveformPlayer from "@components/ui/WaveformPlayer";
import Button from "@components/ui/Button";
import { MicIcon } from "@components/icons";

const MAX_RECORDING_SECONDS = 60;
const LIVE_BAR_COUNT = 12;

const Posting = ({ post, mode, postId, currentUser }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: post });

  const router = useRouter();
  const [collage, setCollage] = useState("");
  const [collageForm, setCollageForm] = useState(!currentUser?.collageName);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(mode === "edit" ? "details" : "photo");

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [liveLevels, setLiveLevels] = useState(Array(LIVE_BAR_COUNT).fill(0.15));

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);

  const createPost = useMutation(api.posts.create);
  const updatePost = useMutation(api.posts.update);
  const updateCollege = useMutation(api.users.updateCollege);

  const photoValue = watch("postPhoto");
  const captionValue = watch("caption") || "";
  const tagValue = watch("tag");

  const photoPreviewSrc = !photoValue
    ? null
    : typeof photoValue === "string"
    ? photoValue
    : URL.createObjectURL(photoValue[0]);

  const stopTicking = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    rafRef.current = null;
    timerRef.current = null;
  };

  const teardownStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    analyserRef.current = null;
    audioCtxRef.current?.close?.();
    audioCtxRef.current = null;
  };

  const tickLevels = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    const chunk = Math.max(1, Math.floor(dataArrayRef.current.length / LIVE_BAR_COUNT));
    const levels = Array.from({ length: LIVE_BAR_COUNT }, (_, i) => {
      let sum = 0;
      for (let j = 0; j < chunk; j++) sum += dataArrayRef.current[i * chunk + j] || 0;
      return Math.min(1, Math.max(0.12, sum / chunk / 160));
    });
    setLiveLevels(levels);
    rafRef.current = requestAnimationFrame(tickLevels);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        setAudioBlob(blob);
        setAudioPreviewUrl(URL.createObjectURL(blob));
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      setElapsed(0);
      setIsRecording(true);
      tickLevels();
      timerRef.current = setInterval(() => {
        setElapsed((e) => {
          const next = e + 1;
          if (next >= MAX_RECORDING_SECONDS) finishRecording();
          return next;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing the microphone", error);
    }
  };

  const finishRecording = () => {
    mediaRecorderRef.current?.stop();
    stopTicking();
    teardownStream();
    setIsRecording(false);
    setStep("details");
  };

  const discardRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    stopTicking();
    teardownStream();
    setIsRecording(false);
    setAudioBlob(null);
    setAudioPreviewUrl(null);
    setStep("photo");
  };

  useEffect(() => {
    if (step === "recording" && !isRecording) startRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => stopTicking, []);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleCollage = async (event) => {
    event.preventDefault();
    try {
      await updateCollege({ userId: currentUser._id, collageName: collage });
      setCollageForm(false);
    } catch (err) {
      console.error("Error updating collage:", err);
    }
  };

  const handlePublish = async (data) => {
    setSubmitting(true);
    try {
      let postPhotoUrl = data.postPhoto;
      if (data.postPhoto && data.postPhoto.length > 0 && typeof data.postPhoto !== "string") {
        postPhotoUrl = await uploadToCloudinary(data.postPhoto[0], "image");
      }

      if (mode === "create") {
        let postAudioUrl = null;
        if (audioBlob) {
          postAudioUrl = await uploadToCloudinary(audioBlob, "audio");
        }

        await createPost({
          creatorId: currentUser._id,
          caption: data.caption,
          tag: data.tag,
          postPhoto: postPhotoUrl,
          postAudio: postAudioUrl,
        });
      } else {
        await updatePost({
          postId,
          caption: data.caption,
          tag: data.tag,
          postPhoto: typeof postPhotoUrl === "string" ? postPhotoUrl : undefined,
        });
      }

      router.push(`/`);
    } catch (err) {
      console.error("Error while publishing post:", err);
      setSubmitting(false);
    }
  };

  if (collageForm) {
    return (
      <form className="flex flex-col gap-5 pb-24 max-w-md" onSubmit={handleCollage}>
        <div>
          <label htmlFor="collage" className="block text-[11px] font-extrabold tracking-[0.12em] uppercase text-purple-1 mb-2">
            Update your college to make a post
          </label>
          <input
            onChange={(e) => setCollage(e.target.value)}
            value={collage}
            placeholder="College name"
            className="w-full bg-surface-1 border border-white/[0.09] rounded-2xl px-4 py-3 text-[15px] font-semibold outline-none focus:border-purple-1"
            id="collage"
            name="collage"
          />
        </div>
        <Button type="submit">Update</Button>
      </form>
    );
  }

  return (
    <form className="max-w-[420px]" onSubmit={handleSubmit(handlePublish)}>
      {step === "photo" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => router.push("/")} className="text-ink-3 font-bold text-[15px]">
              Cancel
            </button>
            <p className="font-display font-extrabold text-lg">New post</p>
            <button
              type="button"
              disabled={!photoValue}
              onClick={() => setStep(mode === "create" ? "recording" : "details")}
              className={`font-extrabold text-[15px] ${photoValue ? "text-white" : "text-ink-4"}`}
            >
              Next
            </button>
          </div>

          <label
            htmlFor="photo"
            className="relative flex items-center justify-center h-[320px] rounded-[22px] overflow-hidden cursor-pointer"
            style={{ background: "linear-gradient(135deg, #3a2a55, #7a3a5a)" }}
          >
            {photoPreviewSrc ? (
              <img src={photoPreviewSrc} alt="selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white/60 text-sm font-bold">Tap to choose a photo</span>
            )}
          </label>
          <input
            {...register("postPhoto", { required: mode === "create" })}
            id="photo"
            type="file"
            accept="image/*"
            className="hidden"
          />
          {errors.postPhoto && <p className="text-danger text-sm">A photo is required</p>}
        </div>
      )}

      {step === "recording" && (
        <div className="flex flex-col items-center gap-6 py-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[#FF4DA0] font-extrabold text-xs uppercase tracking-widest bg-[#FF0073]/[0.16] border border-[#FF0073]/40">
            <span className="w-2 h-2 rounded-full bg-pink-1 animate-yv-breathe" />
            Recording
          </span>

          <div className="relative w-32 h-32 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-pink-1/40 animate-yv-pulse" />
            <span
              className="w-24 h-24 rounded-full flex items-center justify-center animate-yv-breathe"
              style={{ background: "linear-gradient(135deg, #FF0073, #7857FF)" }}
            >
              <MicIcon size={34} color="#fff" strokeWidth={2.2} />
            </span>
          </div>

          <div className="text-center">
            <p className="font-display font-extrabold text-4xl tabular-nums">{formatTime(elapsed)}</p>
            <p className="text-ink-3 text-xs font-bold mt-1">max {MAX_RECORDING_SECONDS} seconds</p>
          </div>

          <div className="flex items-end gap-[3px] h-11 w-full px-6">
            {liveLevels.map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm bg-[#FF4DA0]"
                style={{ height: `${h * 100}%` }}
              />
            ))}
          </div>

          <div className="flex items-center gap-8 mt-2">
            <button type="button" onClick={discardRecording} className="text-ink-3 font-extrabold text-sm">
              Delete
            </button>
            <button
              type="button"
              onClick={finishRecording}
              className="w-[60px] h-[60px] rounded-2xl bg-white flex items-center justify-center shadow-[0_0_0_4px_rgba(255,255,255,0.15)]"
            >
              <span className="w-[22px] h-[22px] rounded-md bg-pink-1" />
            </button>
            <button type="button" onClick={finishRecording} className="text-white font-extrabold text-sm">
              Done
            </button>
          </div>
        </div>
      )}

      {step === "details" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep("photo")}
              className="text-ink-3 font-bold text-[15px]"
            >
              Back
            </button>
            <p className="font-display font-extrabold text-lg">Details</p>
            <span className="w-9" />
          </div>

          <div className="flex gap-3 items-center">
            {photoPreviewSrc && (
              <img src={photoPreviewSrc} alt="post" className="w-[72px] h-[72px] rounded-2xl object-cover shrink-0" />
            )}
            {audioPreviewUrl && (
              <div className="flex-1">
                <WaveformPlayer src={audioPreviewUrl} />
              </div>
            )}
          </div>

          <div className="bg-surface-1 border border-white/[0.07] rounded-2xl p-3.5 min-h-[88px]">
            <textarea
              {...register("caption", {
                required: "Caption is required",
                validate: (value) => value.length >= 3 || "Caption must be more than 2 characters",
              })}
              rows={3}
              placeholder="What's on your mind?"
              className="w-full bg-transparent outline-none text-[15px] text-[#E8E5F0] placeholder:text-ink-4 resize-none"
            />
          </div>
          {errors.caption && <p className="text-danger text-sm">{errors.caption.message}</p>}

          <div>
            <p className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-ink-3 mb-2.5">Tag a club</p>
            <input type="hidden" {...register("tag", { required: "Tag is required" })} />
            <div className="flex flex-wrap gap-2">
              {CLUB_KEYS.map((key) => {
                const c = CLUBS[key];
                const selected = tagValue === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setValue("tag", key, { shouldValidate: true })}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-extrabold -rotate-2 ${
                      selected ? "" : "bg-surface-2 text-ink-2 border border-white/[0.08]"
                    }`}
                    style={
                      selected
                        ? {
                            background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
                            color: c.ink,
                            boxShadow: "0 0 0 2px rgba(255,255,255,0.9)",
                          }
                        : undefined
                    }
                  >
                    <span>{c.emoji}</span>
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.tag && <p className="text-danger text-sm mt-2">{errors.tag.message}</p>}
          </div>

          <Button type="submit" disabled={submitting} className="w-full mt-4">
            {submitting ? "Publishing…" : mode === "create" ? "Share to campus" : "Save changes"}
          </Button>
        </div>
      )}
    </form>
  );
};

export default Posting;
