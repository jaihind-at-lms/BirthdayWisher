const DRIVE_FILE_ID = /[-\w]{25,}/;

export function getDriveThumbnail(url: string | null, size = 100): string | null {
  if (!url) return null;
  const id = url.match(DRIVE_FILE_ID)?.[0];
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=s${size}` : null;
}
