/**
 * ImageReveal — horizontal wipe as the frame enters the viewport.
 * The resting state is visible. The wipe is CSS, so a missed
 * intersection observer cannot leave the image clipped shut.
 */

import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ImageRevealBaseProps {
  className?: string;
  children?: ReactNode;
  priority?: boolean;
  sizes?: string;
}

type ImageRevealProps = ImageRevealBaseProps &
  ({ src: string; alt: string } | { src?: undefined; alt?: string });

export function ImageReveal({
  className,
  children,
  src,
  alt = "",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: ImageRevealProps) {
  return (
    <div
      className={cn("image-reveal relative overflow-hidden", className)}
      data-motion-reveal
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : null}
      {children}
    </div>
  );
}
