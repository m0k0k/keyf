import { z } from "zod";

export const Model = z.enum([
  "google/nano-banana",
  "google/nano-banana-edit",
  "google/imagen4",
  "google/imagen4-fast",
  "google/imagen4-ultra",
  "bytedance/seedream-v4-text-to-image",
  "bytedance/seedream-v4-edit",
  "qwen/image-edit",
  "sora-2-text-to-video",
]);

export const modelNameSchema = z.enum([
  "google/nano-banana",
  "google/nano-banana-edit",
  "google/imagen4",
  "google/imagen4-fast",
  "google/imagen4-ultra",
  "bytedance/seedream-v4-text-to-image",
  "bytedance/seedream-v4-edit",
  "qwen/image-edit",
  "sora-2-text-to-video",
]);
export type ModelName = z.infer<typeof modelNameSchema>;

const OutputFormatSchema = z.enum(["png", "jpeg"]);
const ImageSizeSchema = z.enum([
  "1:1",
  "9:16",
  "16:9",
  "3:4",
  "4:3",
  "3:2",
  "2:3",
  "5:4",
  "4:5",
  "21:9",
  "auto",
]);

const NanoBananaInputSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(5000, "Prompt too long"),
  output_format: OutputFormatSchema.optional().default("png"),
  image_size: ImageSizeSchema.optional().default("1:1"),
});

const NanoBananaEditInputSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(5000, "Prompt too long"),
  image_urls: z
    .array(z.string().url("Invalid URL"))
    .min(1, "At least one image URL required")
    .max(10, "Maximum 10 images allowed"),
  output_format: OutputFormatSchema.optional().default("png"),
  image_size: ImageSizeSchema.optional().default("1:1"),
});

const NanoBananaSchema = z.object({
  model: z.literal("google/nano-banana"),
  input: NanoBananaInputSchema,
  callBackUrl: z.string().url("Invalid callback URL").optional(),
});

const NanoBananaEditSchema = z.object({
  model: z.literal("google/nano-banana-edit"),
  input: NanoBananaEditInputSchema,
  callBackUrl: z.string().url("Invalid callback URL").optional(),
});

// Imagen4 schemas
const Imagen4InputSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(5000, "Prompt too long"),
  negative_prompt: z.string().optional().default(""),
  aspect_ratio: z
    .enum(["1:1", "16:9", "9:16", "3:4", "4:3"])
    .optional()
    .default("1:1"),
  num_images: z.enum(["1", "2", "3", "4"]).optional().default("1"),
  seed: z.string().optional().default(""),
});

const Imagen4FastInputSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(5000, "Prompt too long"),
  negative_prompt: z.string().optional().default(""),
  aspect_ratio: z
    .enum(["1:1", "16:9", "9:16", "3:4", "4:3"])
    .optional()
    .default("16:9"),
  num_images: z.enum(["1", "2", "3", "4"]).optional().default("1"),
  seed: z.number().optional(),
});

const Imagen4UltraInputSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(5000, "Prompt too long"),
  negative_prompt: z.string().optional().default(""),
  aspect_ratio: z
    .enum(["1:1", "16:9", "9:16", "3:4", "4:3"])
    .optional()
    .default("1:1"),
  seed: z.string().optional().default(""),
});

const Imagen4Schema = z.object({
  model: z.literal("google/imagen4"),
  input: Imagen4InputSchema,
  callBackUrl: z.string().url("Invalid callback URL").optional(),
});

const Imagen4FastSchema = z.object({
  model: z.literal("google/imagen4-fast"),
  input: Imagen4FastInputSchema,
  callBackUrl: z.string().url("Invalid callback URL").optional(),
});

const Imagen4UltraSchema = z.object({
  model: z.literal("google/imagen4-ultra"),
  input: Imagen4UltraInputSchema,
  callBackUrl: z.string().url("Invalid callback URL").optional(),
});

// ByteDance Seedream V4 schemas
const SeedreamImageSizeSchema = z.enum([
  "square",
  "square_hd",
  "portrait_4_3",
  "portrait_3_2",
  "portrait_16_9",
  "landscape_4_3",
  "landscape_3_2",
  "landscape_16_9",
  "landscape_21_9",
]);

const SeedreamImageResolutionSchema = z.enum(["1K", "2K", "4K"]);

const SeedreamV4TextToImageInputSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(5000, "Prompt too long"),
  image_size: SeedreamImageSizeSchema.optional().default("square_hd"),
  image_resolution: SeedreamImageResolutionSchema.optional().default("1K"),
  max_images: z.number().min(1).max(6).optional().default(1),
  seed: z.number().optional(),
});

const SeedreamV4EditInputSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(5000, "Prompt too long"),
  image_urls: z
    .array(z.string().url("Invalid URL"))
    .min(1, "At least one image URL required")
    .max(10, "Maximum 10 images allowed"),
  image_size: SeedreamImageSizeSchema.optional().default("square_hd"),
  image_resolution: SeedreamImageResolutionSchema.optional().default("1K"),
  max_images: z.number().min(1).max(6).optional().default(1),
  seed: z.number().optional(),
});

const SeedreamV4TextToImageSchema = z.object({
  model: z.literal("bytedance/seedream-v4-text-to-image"),
  input: SeedreamV4TextToImageInputSchema,
  callBackUrl: z.string().url("Invalid callback URL").optional(),
});

const SeedreamV4EditSchema = z.object({
  model: z.literal("bytedance/seedream-v4-edit"),
  input: SeedreamV4EditInputSchema,
  callBackUrl: z.string().url("Invalid callback URL").optional(),
});

// Qwen schemas
const QwenImageSizeSchema = z.enum([
  "square",
  "square_hd",
  "portrait_4_3",
  "portrait_16_9",
  "landscape_4_3",
  "landscape_16_9",
]);

const QwenAccelerationSchema = z.enum(["none", "regular", "high"]);

const QwenImageEditInputSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(2000, "Prompt too long"),
  image_url: z.string().url("Invalid image URL"),
  acceleration: QwenAccelerationSchema.optional().default("none"),
  image_size: QwenImageSizeSchema.optional().default("landscape_4_3"),
  num_inference_steps: z.number().min(2).max(49).optional().default(25),
  seed: z.number().optional(),
  guidance_scale: z.number().min(0).max(20).optional().default(4),
  sync_mode: z.boolean().optional().default(false),
  num_images: z.enum(["1", "2", "3", "4"]).optional(),
  enable_safety_checker: z.boolean().optional().default(true),
  output_format: OutputFormatSchema.optional().default("png"),
  negative_prompt: z
    .string()
    .max(500, "Negative prompt too long")
    .optional()
    .default("blurry, ugly"),
});

const QwenImageEditSchema = z.object({
  model: z.literal("qwen/image-edit"),
  input: QwenImageEditInputSchema,
  callBackUrl: z.string().url("Invalid callback URL").optional(),
});

// Klucz: "discriminatedUnion" po polu `model`
export const FormSchema = z.discriminatedUnion("model", [
  NanoBananaSchema,
  NanoBananaEditSchema,
  Imagen4Schema,
  Imagen4FastSchema,
  Imagen4UltraSchema,
  SeedreamV4TextToImageSchema,
  SeedreamV4EditSchema,
  QwenImageEditSchema,
]);

export type FormValues = z.infer<typeof FormSchema>;
export type Model = z.infer<typeof Model>;
export type NanoBananaInput = z.infer<typeof NanoBananaInputSchema>;
export type NanoBananaEditInput = z.infer<typeof NanoBananaEditInputSchema>;
export type Imagen4Input = z.infer<typeof Imagen4InputSchema>;
export type Imagen4FastInput = z.infer<typeof Imagen4FastInputSchema>;
export type Imagen4UltraInput = z.infer<typeof Imagen4UltraInputSchema>;
export type SeedreamV4TextToImageInput = z.infer<
  typeof SeedreamV4TextToImageInputSchema
>;
export type SeedreamV4EditInput = z.infer<typeof SeedreamV4EditInputSchema>;
export type QwenImageEditInput = z.infer<typeof QwenImageEditInputSchema>;
export type OutputFormat = z.infer<typeof OutputFormatSchema>;
export type ImageSize = z.infer<typeof ImageSizeSchema>;
export type SeedreamImageSize = z.infer<typeof SeedreamImageSizeSchema>;
export type SeedreamImageResolution = z.infer<
  typeof SeedreamImageResolutionSchema
>;
export type QwenImageSize = z.infer<typeof QwenImageSizeSchema>;
export type QwenAcceleration = z.infer<typeof QwenAccelerationSchema>;
