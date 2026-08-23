"use client";

import { useRef, useState } from "react";
import { upload } from "@imagekit/next";
import {
  UploadSimple,
  CheckCircle,
  XCircle,
  CircleNotch,
  ArrowsClockwise,
} from "@phosphor-icons/react";

const URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

// Uploads directly from the browser to ImageKit (signed by /api/upload-auth,
// which checks the admin session) and exposes the resulting file path via a
// *controlled* hidden input, so this drops into any <form action={serverAction}>
// without extra plumbing — the server action just reads formData.get(name).
export default function ImageUploader({ name, label, defaultValue, onUploadingChange }) {
  const [filePath, setFilePath] = useState(defaultValue || "");
  const [previewUrl, setPreviewUrl] = useState(
    defaultValue ? `${URL_ENDPOINT}${defaultValue}` : "",
  );
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | uploading | error
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);
  const isUploading = status === "uploading";

  async function authenticator() {
    const res = await fetch("/api/upload-auth");
    if (!res.ok) throw new Error("unauthorized");
    return res.json();
  }

  async function handleFile(file) {
    if (!file) return;

    setStatus("uploading");
    setProgress(0);
    onUploadingChange?.(true);

    try {
      const { signature, expire, token, publicKey } = await authenticator();
      const result = await upload({
        file,
        fileName: file.name,
        signature,
        expire,
        token,
        publicKey,
        folder: "/artist-site",
        useUniqueFileName: true,
        onProgress: (evt) =>
          setProgress(Math.round((evt.loaded / evt.total) * 100)),
      });

      setFilePath(result.filePath);
      setPreviewUrl(result.url);
      setStatus("idle");
    } catch {
      setStatus("error");
    } finally {
      onUploadingChange?.(false);
    }
  }

  function openPicker() {
    if (!isUploading) inputRef.current?.click();
  }

  function handleKeyDown(e) {
    if ((e.key === "Enter" || e.key === " ") && !isUploading) {
      e.preventDefault();
      openPicker();
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    if (isUploading) return;
    handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <span className="mb-2 block font-label text-xs tracking-[0.1em] text-muted">
        {label}
      </span>

      <input type="hidden" name={name} value={filePath} readOnly />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Custom dropzone/button — replaces the raw native file input, which
          renders as an inconsistent, unstyled OS button across browsers. */}
      <div
        role="button"
        tabIndex={0}
        aria-label={label}
        onClick={openPicker}
        onKeyDown={handleKeyDown}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isUploading) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`group relative aspect-[4/5] w-40 overflow-hidden border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
          isUploading ? "cursor-default" : "cursor-pointer"
        } ${
          status === "error"
            ? "border-clay/50"
            : isDragOver
              ? "border-gold bg-gold/5"
              : "border-white/15 hover:border-gold/40"
        }`}
      >
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
            {!isUploading && (
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-bg/80 py-2 backdrop-blur-sm transition-colors group-hover:bg-bg/90">
                <ArrowsClockwise size={13} className="text-gold" />
                <span className="font-label text-[0.65rem] tracking-[0.08em] text-gold">
                  تغيير الصورة
                </span>
              </div>
            )}
          </>
        ) : (
          !isUploading && (
            <div className="flex h-full flex-col items-center justify-center gap-2.5 bg-surface px-3 text-center">
              <UploadSimple
                size={22}
                className="text-muted transition-colors group-hover:text-gold"
              />
              <span className="font-label text-[0.65rem] leading-relaxed tracking-[0.03em] text-muted">
                اضغطي أو اسحبي صورة هنا
              </span>
            </div>
          )
        )}

        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg/90 px-5">
            <CircleNotch size={22} className="animate-spin text-gold" />
            <div className="w-full">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gold transition-[width] duration-200 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1.5 text-center font-label text-[0.65rem] tracking-[0.05em] text-muted">
                جارٍ الرفع… {progress}%
              </p>
            </div>
          </div>
        )}
      </div>

      {status === "error" && (
        <p className="mt-2 flex items-center gap-1.5 font-label text-xs text-clay">
          <XCircle size={14} weight="fill" />
          فشل الرفع، حاولي مرة أخرى.
        </p>
      )}
      {status === "idle" && filePath && (
        <p className="mt-2 flex items-center gap-1.5 font-label text-xs text-muted">
          <CheckCircle size={14} weight="fill" className="text-gold" />
          الصورة جاهزة، تقدرين تضغطين «حفظ»
        </p>
      )}
    </div>
  );
}
