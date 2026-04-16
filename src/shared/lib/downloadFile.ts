"use client";

type DownloadFileOptions = {
  filename?: string;
  defaultExtension?: string;
};

const FALLBACK_FILENAME = "kartochki-online-file";

export async function downloadFileFromUrl(url: string, options: DownloadFileOptions = {}) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status}`);
  }

  const blob = await response.blob();
  const filename = resolveFilename({
    blobType: blob.type,
    contentDisposition: response.headers.get("content-disposition"),
    defaultExtension: options.defaultExtension,
    suggestedFilename: options.filename,
    url,
  });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 0);
}

function resolveFilename({
  blobType,
  contentDisposition,
  defaultExtension,
  suggestedFilename,
  url,
}: {
  blobType: string;
  contentDisposition: string | null;
  defaultExtension?: string;
  suggestedFilename?: string;
  url: string;
}) {
  const contentDispositionName = parseContentDispositionFilename(contentDisposition);
  const urlFilename = getFilenameFromUrl(url);
  const extension = getExtension(contentDispositionName) || getExtension(urlFilename) || inferExtension(blobType) || defaultExtension;
  const rawFilename = suggestedFilename || contentDispositionName || urlFilename || FALLBACK_FILENAME;
  const sanitizedFilename = sanitizeFilename(rawFilename);

  if (getExtension(sanitizedFilename) || !extension) {
    return sanitizedFilename;
  }

  return `${sanitizedFilename}.${extension}`;
}

function parseContentDispositionFilename(header: string | null) {
  if (!header) {
    return "";
  }

  const utf8Match = header.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);

  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1].trim().replace(/^"(.*)"$/, "$1"));
  }

  const filenameMatch = header.match(/filename\s*=\s*("?)([^";]+)\1/i);

  return filenameMatch?.[2]?.trim() ?? "";
}

function getFilenameFromUrl(url: string) {
  try {
    const pathname = new URL(url, window.location.origin).pathname;
    const filename = pathname.split("/").filter(Boolean).pop();

    return filename ? decodeURIComponent(filename) : "";
  } catch {
    return "";
  }
}

function inferExtension(blobType: string) {
  if (blobType === "application/zip") return "zip";
  if (blobType === "image/png") return "png";
  if (blobType === "image/jpeg") return "jpg";
  if (blobType === "image/webp") return "webp";

  return "";
}

function getExtension(filename: string) {
  const match = filename.match(/\.([a-z0-9]+)$/i);

  return match?.[1]?.toLowerCase() ?? "";
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[<>:"/\\|?*\u0000-\u001F]+/g, "_").trim() || FALLBACK_FILENAME;
}
