"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div
      className={cn(
        "absolute top-0 right-0 bottom-0 left-0 z-50 bg-black/10 backdrop-blur-sm",
        isOpen ? "" : "hidden",
      )}
    >
      <div
        className={cn(
          "absolute top-2 right-0 bottom-2 left-0 z-50 mx-auto flex max-w-6xl flex-col items-start justify-start overflow-auto rounded-3xl border-2 bg-black shadow",
          isOpen ? "" : "hidden",
        )}
      >
        <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Close" : "Open"}
        </Button>
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-start p-8">
          <h1 className="z-50 w-[100%] pt-20 text-center text-5xl leading-tight font-extralight">
            Boost your{" "}
            <span className="font-corp-extended font-normal italic">ROAS</span>{" "}
            with fine-tuned{" "}
            <span className="font-corp-extended font-normal">AI-UGC</span>{" "}
            <span className="font-extralight"> that converts.</span>
          </h1>
          <h2 className="w-[90%] pt-4 text-center text-2xl font-extralight tracking-tight">
            Powered by{" "}
            <span className="bg-gradient-to-r from-neutral-200 via-neutral-200 to-neutral-200 bg-clip-text font-normal text-transparent">
              AI agents
            </span>
            <span className="font-extralight">
              {" "}
              tailored to{" "}
              <span className="font-normal underline underline-offset-2">
                your brand.
              </span>
            </span>
          </h2>
          <div className="mt-8 mb-8 flex w-full flex-col items-center justify-start gap-4">
            <Link href="/app">
              <Button className="w-full rounded-full bg-orange-600 px-6 py-5 text-lg font-light text-white hover:bg-black/70">
                Generate ai video ad
              </Button>
            </Link>
          </div>
        </div>
        <div className="mx-auto flex flex-row gap-1.5 px-8">
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
      </div>
    </div>
  );
}

export function VideoSamplesSection() {
  return <div></div>;
}
