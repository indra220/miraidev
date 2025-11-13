import { Metadata } from "next";
import { t } from "@/i18n/t";

export async function generateMetadata(): Promise<Metadata> {
  // Dapatkan terjemahan untuk title dan description
  const title = await t('contact.title', 'en', 'Contact Us');
  const description = await t('contact.description', 'en', 'Have questions or want to discuss a project? We\'re ready to help you.');

  return {
    title: `${title} | MiraiDev`,
    description: description,
  };
}