/**
 * Image Optimization Utilities
 * Rewrites image URLs (especially Unsplash CDN) to optimal WebP formats and sizes,
 * significantly speeding up initial page load and rendering performance.
 */

export function optimizeImageUrl(
  url: string | undefined | null,
  width = 640,
  quality = 70
): string {
  if (!url) return '';

  // If it's a local asset or data URL, return as is
  if (url.startsWith('data:') || url.startsWith('/') || url.startsWith('blob:')) {
    return url;
  }

  try {
    // If it's an Unsplash URL, apply optimal query parameters
    if (url.includes('images.unsplash.com')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=format,compress&fit=crop&w=${width}&q=${quality}&fm=webp`;
    }

    return url;
  } catch {
    return url;
  }
}
