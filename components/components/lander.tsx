"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";

export function Lander() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-start p-8">
        <h1 className="z-50 w-[100%] pt-20 text-center text-5xl leading-tight font-extralight">
          <span className="font-normal">Scale your </span> campaigns with{" "}
          <span className="bg-[linear-gradient(135deg,_#a259ff_00%,_#ff6f3c_50%,_#1fa2ff_100%)] bg-clip-text font-normal text-transparent">
            creatives
          </span>{" "}
          powered by AI.
        </h1>
        <h2 className="w-[90%] pt-4 text-center text-lg font-extralight tracking-tight">
          <span className="font-extralight">
            The AI Video Generator made for marketers.{" "}
          </span>
        </h2>
        <div className="mt-8 mb-8 flex w-full flex-col items-center justify-start gap-4">
          <Link href="/app">
            <Button
              variant="outline"
              className="w-full rounded-full px-8 py-5 text-lg font-light text-white"
            >
              Get started now
              <ArrowRightIcon className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="mx-auto flex flex-row items-center justify-center gap-1.5 px-8">
        <div className="">
          <video
            width="240"
            height="180"
            controls
            preload="auto"
            className="rounded-2xl shadow-2xl outline-black"
          >
            <source
              src="https://nv1dv7hclpfwr6xk.public.blob.vercel-storage.com/Ad%205%20%E2%80%94%20Primary%20Explainer.mp4"
              type="video/mp4"
            />
            <track
              src="/path/to/captions.vtt"
              kind="subtitles"
              srcLang="en"
              label="English"
            />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="">
          <video
            width="240"
            height="180"
            controls
            preload="auto"
            className="rounded-2xl shadow-2xl outline-black"
          >
            <source
              src="https://nv1dv7hclpfwr6xk.public.blob.vercel-storage.com/Triton-001-Experimental2.mp4"
              type="video/mp4"
            />
            <track
              src="/path/to/captions.vtt"
              kind="subtitles"
              srcLang="en"
              label="English"
            />
            Your browser does not support the video tag.
          </video>
        </div>{" "}
        <div className="">
          <video
            width="760"
            height="180"
            controls
            preload="auto"
            className="rounded-2xl shadow-2xl outline-black"
          >
            <source
              src="https://nv1dv7hclpfwr6xk.public.blob.vercel-storage.com/Triton-Local-Horizontal-001.mp4"
              type="video/mp4"
            />
            <track
              src="/path/to/captions.vtt"
              kind="subtitles"
              srcLang="en"
              label="English"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </>
  );
}

export function VideoSamplesSection() {
  return <div></div>;
}
