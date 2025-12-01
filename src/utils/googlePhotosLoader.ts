/**
 * Extract images from a Google Photos shared link
 * Google Photos shared links format: https://photos.app.goo.gl/xxxxx
 */

export interface PhotoItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
}

export async function loadGooglePhotosAlbum(sharedLink: string): Promise<PhotoItem[]> {
  try {
    // For Google Photos, we need to fetch the album page and parse it
    // Since we can't directly access the API without authentication,
    // we'll use a proxy approach or embed approach
    
    // This is a simplified version - you may need to adjust based on the actual structure
    const response = await fetch(sharedLink);
    const html = await response.text();
    
    // Extract image URLs from the HTML
    // Google Photos embeds image data in the page
    const imageRegex = /\["(https:\/\/lh3\.googleusercontent\.com\/[^"]+)"/g;
    const matches = [...html.matchAll(imageRegex)];
    
    const photos: PhotoItem[] = matches.map((match, index) => {
      const url = match[1];
      return {
        id: `photo-${index}`,
        url: url,
        thumbnailUrl: url.replace(/=w\d+-h\d+/, '=w400-h400'),
        title: `Photo ${index + 1}`
      };
    });
    
    // Remove duplicates
    const uniquePhotos = Array.from(
      new Map(photos.map(photo => [photo.url, photo])).values()
    );
    
    return uniquePhotos;
  } catch (error) {
    console.error('Failed to load Google Photos album:', error);
    return [];
  }
}

// Alternative approach: Use embedded viewer
export function getGooglePhotosEmbedUrl(sharedLink: string): string {
  // Convert share link to embed URL
  // Extract the album ID from the share link
  const albumId = sharedLink.split('/').pop();
  return `https://photos.google.com/share/${albumId}`;
}
