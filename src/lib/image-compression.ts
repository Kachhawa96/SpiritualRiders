import imageCompression from "browser-image-compression";

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  initialQuality?: number;
  maxFileSizeAllowedMB?: number;
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxSizeMB: 1.2, // Target compressed size ~1.2MB (well under 5MB)
  maxWidthOrHeight: 1920, // Standard Full HD limit (keeps photos sharp and crisp)
  initialQuality: 0.85, // Premium quality retention
  maxFileSizeAllowedMB: 5.0, // Hard upper limit
};

/**
 * Format bytes into human-readable string (e.g. "720 KB", "2.1 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${Math.round(kb)} KB`;
  }
  return `${(kb / 1024).toFixed(1)} MB`;
}

/**
 * HTML5 Canvas fallback compressor in case WebWorker or external library fails.
 */
async function compressWithCanvas(
  file: File,
  maxWidthOrHeight: number,
  quality: number
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // Scale down proportionally if larger than maximum dimension
      if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
        if (width > height) {
          height = Math.round((height * maxWidthOrHeight) / width);
          width = maxWidthOrHeight;
        } else {
          width = Math.round((width * maxWidthOrHeight) / height);
          height = maxWidthOrHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const outputName = file.name.replace(/\.hei(c|f)$/i, ".jpg");
          const compressedFile = new File([blob], outputName, {
            type: mimeType,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to decode image"));
    };

    img.src = objectUrl;
  });
}

/**
 * Detects whether a file is an iPhone HEIC/HEIF photo.
 */
export function isHeicImage(file: File): boolean {
  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();
  return (
    type === "image/heic" ||
    type === "image/heif" ||
    type === "image/heic-sequence" ||
    type === "image/heif-sequence" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

/**
 * Converts an iPhone HEIC/HEIF image to a universal JPEG File.
 * - On Apple Safari / iOS: uses native canvas rendering (hardware-accelerated, zero lag).
 * - On Chrome / Firefox / Edge / PC: falls back to heic2any WebAssembly decoding.
 */
export async function convertHeicToJpeg(file: File): Promise<File> {
  if (!isHeicImage(file)) return file;

  const targetName = file.name.replace(/\.hei(c|f)$/i, ".jpg");

  // Strategy 1: Attempt native canvas decoding (native support in Safari iOS/macOS)
  if (typeof window !== "undefined") {
    try {
      const canvasFile = await compressWithCanvas(file, 1920, 0.88);
      if (canvasFile && canvasFile.type === "image/jpeg" && canvasFile.size > 0 && canvasFile !== file) {
        return canvasFile;
      }
    } catch {
      // Non-Safari browser or decode error; fall through to heic2any
    }
  }

  // Strategy 2: heic2any WebAssembly decoder for cross-browser compatibility
  if (typeof window !== "undefined") {
    try {
      const heic2anyModule = await import("heic2any");
      const heic2any = heic2anyModule.default || heic2anyModule;
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.88,
      });

      const singleBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      if (singleBlob) {
        return new File([singleBlob], targetName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
      }
    } catch (err) {
      console.warn("heic2any fallback conversion error:", err);
    }
  }

  return file;
}

/**
 * Automatically compress an image file on the client side.
 * - Converts iPhone HEIC/HEIF photos to standard high-resolution JPEG.
 * - Shrinks high-res camera photos to ~800KB-1.2MB.
 * - Retains clean visual details.
 * - Safe fallback to Canvas if WebWorker is unsupported.
 */
export async function compressImage(
  inputFile: File,
  customOptions?: CompressionOptions
): Promise<{
  file: File;
  originalSize: number;
  compressedSize: number;
  isCompressed: boolean;
  error?: string;
}> {
  const options = { ...DEFAULT_OPTIONS, ...customOptions };
  const originalSize = inputFile.size;

  // Non-compressible or vector images
  if (inputFile.type === "image/svg+xml" || inputFile.name.toLowerCase().endsWith(".svg")) {
    return {
      file: inputFile,
      originalSize,
      compressedSize: originalSize,
      isCompressed: false,
    };
  }

  // Convert iPhone HEIC/HEIF photo to standard JPEG first if needed
  let file = inputFile;
  let wasConvertedFromHeic = false;
  if (isHeicImage(inputFile)) {
    try {
      const converted = await convertHeicToJpeg(inputFile);
      if (converted && converted !== inputFile) {
        file = converted;
        wasConvertedFromHeic = true;
      }
    } catch (err) {
      console.warn("Could not convert HEIC before compression:", err);
    }
  }

  // Already tiny (under 400KB) and not a converted HEIC file
  if (!wasConvertedFromHeic && originalSize <= 400 * 1024) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      isCompressed: false,
    };
  }

  try {
    const isWorkerAvailable =
      typeof window !== "undefined" && typeof Worker !== "undefined";

    const compressed = await imageCompression(file, {
      maxSizeMB: options.maxSizeMB,
      maxWidthOrHeight: options.maxWidthOrHeight,
      initialQuality: options.initialQuality,
      useWebWorker: isWorkerAvailable,
      fileType: file.type === "image/png" ? "image/png" : "image/jpeg",
    });

    // If compression produced a smaller file, use it
    if (compressed && compressed.size < originalSize) {
      return {
        file: compressed,
        originalSize,
        compressedSize: compressed.size,
        isCompressed: true,
      };
    }

    return {
      file,
      originalSize,
      compressedSize: originalSize,
      isCompressed: false,
    };
  } catch (err) {
    // Graceful fallback to HTML5 Canvas
    try {
      const fallbackFile = await compressWithCanvas(
        file,
        options.maxWidthOrHeight,
        options.initialQuality
      );
      if (fallbackFile && fallbackFile.size < originalSize) {
        return {
          file: fallbackFile,
          originalSize,
          compressedSize: fallbackFile.size,
          isCompressed: true,
        };
      }
    } catch {
      // Both compression methods failed, return original
    }

    return {
      file,
      originalSize,
      compressedSize: originalSize,
      isCompressed: false,
    };
  }
}
