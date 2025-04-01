import { baseEmailLayout } from './baseLayout';

/**
 * Generates a notification email template for a new post.
 *
 * @param name - The name of the user who created the post.
 * @param postTitle - The title of the new post.
 * @param postUrl - The URL to view the post.
 * @returns HTML string for the post creation notification.
 */
export const postCreationTemplate = (
  name: string,
  postTitle: string,
  postUrl: string,
): string => {
  const content = `
    <h1>Your post is published ✨</h1>
    <p>Hello ${name},</p>
    <p>Your new post titled <strong>"${postTitle}"</strong> is now live on CraftCircle!</p>
    <p>Share your thoughts and connect with the community.</p>
    <p>
      <a href="${postUrl}" class="button">View Post</a>
    </p>
  `;

  return baseEmailLayout('Your Post is Live!', content);
};
