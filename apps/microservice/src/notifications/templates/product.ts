import { baseEmailLayout } from './baseLayout';

export const productCreationTemplate = (
  name: string,
  productName: string,
  productUrl: string,
): string => {
  const content = `
    <h1>Your product is live 🚀</h1>
    <p>Hey ${name},</p>
    <p>Your product <strong>"${productName}"</strong> has been successfully listed.</p>
    <p>
      <a href="${productUrl}" class="button">View Product</a>
    </p>
  `;

  return baseEmailLayout('Your Product is Live', content);
};
