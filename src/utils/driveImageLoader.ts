export const getGoogleDriveImageUrl = (fileId: string, size: number = 1000): string => {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
};

export const getGoogleDriveViewUrl = (fileId: string): string => {
  return `https://drive.google.com/file/d/${fileId}/view`;
};

export const getGoogleDriveDirectUrl = (fileId: string): string => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};
