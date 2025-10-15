import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface MetaTagPreviewProps {
  title: string;
  description: string;
  url: string;
}

export function MetaTagPreview({ title, description, url }: MetaTagPreviewProps) {
  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-white">Preview Meta Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-600 rounded-lg p-4 bg-gray-900">
          <div className="text-sm text-blue-400 truncate">{url}</div>
          <div className="text-lg text-blue-600 font-medium mt-1 truncate">{title}</div>
          <div className="text-gray-300 mt-1 line-clamp-2">{description}</div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SearchResultPreviewProps {
  title: string;
  description: string;
  url: string;
}

export function SearchResultPreview({ title, description, url }: SearchResultPreviewProps) {
  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-white">Preview Hasil Pencarian</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-600 rounded-lg p-4 bg-gray-900">
          <div className="text-blue-500 text-sm truncate">{url}</div>
          <div className="text-lg text-blue-400 font-medium mt-1 hover:underline cursor-pointer">
            {title}
          </div>
          <div className="text-gray-400 mt-1">{description}</div>
        </div>
      </CardContent>
    </Card>
  );
}

interface OpenGraphPreviewProps {
  title: string;
  description: string;
  imageUrl: string;
  siteName: string;
}

export function OpenGraphPreview({ title, description, imageUrl, siteName }: OpenGraphPreviewProps) {
  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-white">Preview Open Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-600 rounded-lg overflow-hidden">
          <div className="h-48 bg-gray-700 relative">
            {imageUrl ? (
              <Image 
                src={imageUrl} 
                alt="Open Graph Preview" 
                width={400}
                height={200}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                Gambar tidak tersedia
              </div>
            )}
          </div>
          <div className="p-3 bg-white text-gray-900">
            <div className="text-sm text-gray-500">{siteName}</div>
            <div className="font-medium mt-1 line-clamp-1">{title}</div>
            <div className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TwitterCardPreviewProps {
  title: string;
  description: string;
  imageUrl: string;
  username: string;
}

export function TwitterCardPreview({ title, description, imageUrl, username }: TwitterCardPreviewProps) {
  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-white">Preview Twitter Card</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-600 rounded-lg overflow-hidden max-w-md">
          <div className="h-32 bg-gray-700 relative">
            {imageUrl ? (
              <Image 
                src={imageUrl} 
                alt="Twitter Card Preview" 
                width={400}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                Gambar tidak tersedia
              </div>
            )}
          </div>
          <div className="p-3 bg-gray-900 text-gray-100">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                <span className="text-xs font-bold">@</span>
              </div>
              <div className="text-sm font-medium">{username}</div>
            </div>
            <div className="font-medium mt-1 line-clamp-1">{title}</div>
            <div className="text-sm text-gray-400 mt-1 line-clamp-2">{description}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SeoPreviewProps {
  title: string;
  description: string;
  url: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  siteName: string;
  twitterUsername: string;
}

export default function SeoPreview({ 
  title, 
  description, 
  url, 
  ogTitle, 
  ogDescription, 
  ogImage, 
  twitterTitle, 
  twitterDescription, 
  twitterImage,
  siteName = 'MiraiDev',
  twitterUsername = '@mirai_dev'
}: SeoPreviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MetaTagPreview 
        title={title} 
        description={description} 
        url={url} 
      />
      <SearchResultPreview 
        title={title} 
        description={description} 
        url={url} 
      />
      <OpenGraphPreview 
        title={ogTitle || title} 
        description={ogDescription || description} 
        imageUrl={ogImage} 
        siteName={siteName} 
      />
      <TwitterCardPreview 
        title={twitterTitle || title} 
        description={twitterDescription || description} 
        imageUrl={twitterImage} 
        username={twitterUsername} 
      />
    </div>
  );
}