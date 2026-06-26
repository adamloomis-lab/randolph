import { IMG_META } from "@/lib/imageMeta";

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement>;

/**
 * Image wrapper that auto-fills explicit width/height from the build-time
 * dimensions manifest (kills CLS) and lazy-loads by default.
 *
 * - For above-the-fold imagery, pass `loading="eager"` and `fetchPriority="high"`.
 * - You can override `width`/`height` per usage; defaults come from IMG_META.
 */
export default function Img({ src, loading = "lazy", decoding = "async", ...rest }: ImgProps) {
  const meta = typeof src === "string" ? IMG_META[src] : undefined;
  return (
    <img
      src={src}
      loading={loading}
      decoding={decoding}
      {...(meta ? { width: meta.width, height: meta.height } : null)}
      {...rest}
    />
  );
}
