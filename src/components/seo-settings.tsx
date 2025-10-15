import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface SeoData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

interface SeoSettingsProps {
  initialData?: SeoData;
  onSave?: (data: SeoData) => void;
}

export default function SeoSettings({ 
  initialData = {
    title: '',
    description: '',
    keywords: '',
    canonicalUrl: '',
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: ''
  },
  onSave
}: SeoSettingsProps) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  // Fungsi untuk mengevaluasi kualitas SEO
  const getSeoScore = (): { score: number; issues: string[] } => {
    let score = 0;
    const issues: string[] = [];

    // Evaluasi title
    if (formData.title.length > 0 && formData.title.length <= 60) {
      score += 20;
    } else {
      issues.push("Judul sebaiknya antara 10-60 karakter");
    }

    // Evaluasi description
    if (formData.description.length > 0 && formData.description.length <= 160) {
      score += 20;
    } else {
      issues.push("Deskripsi sebaiknya antara 50-160 karakter");
    }

    // Evaluasi keywords
    if (formData.keywords.length > 0) {
      score += 15;
    } else {
      issues.push("Tambahkan kata kunci");
    }

    // Evaluasi Open Graph
    if (formData.ogTitle && formData.ogDescription && formData.ogImage) {
      score += 15;
    } else {
      issues.push("Lengkapi metadata Open Graph");
    }

    // Evaluasi Twitter Card
    if (formData.twitterTitle && formData.twitterDescription && formData.twitterImage) {
      score += 15;
    } else {
      issues.push("Lengkapi metadata Twitter Card");
    }

    return { score, issues };
  };

  const { score, issues } = getSeoScore();

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Analisis SEO</CardTitle>
          <CardDescription className="text-gray-400">
            Skor SEO saat ini: {score}/100
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  score >= 80 ? 'bg-green-500' : 
                  score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`} 
                style={{ width: `${score}%` }}
              ></div>
            </div>
            <span className="ml-4 text-sm font-medium text-gray-300">{score}/100</span>
          </div>
          {issues.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Masalah yang ditemukan:</h4>
              <ul className="space-y-1">
                {issues.map((issue, index) => (
                  <li key={index} className="flex items-center text-sm text-yellow-500">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {score >= 80 && (
            <div className="flex items-center text-green-500 text-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              SEO Anda terlihat bagus!
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Pengaturan Meta</CardTitle>
          <CardDescription className="text-gray-400">
            Informasi dasar untuk hasil pencarian
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Judul Halaman"
            id="title"
            type="text"
            value={formData.title}
            onChange={(value) => handleChange('title', value as string)}
            description="Judul yang akan muncul di hasil pencarian (sebaiknya 10-60 karakter)"
            className="w-full"
          />
          <FormField
            label="Deskripsi"
            id="description"
            type="textarea"
            value={formData.description}
            onChange={(value) => handleChange('description', value as string)}
            description="Deskripsi yang akan muncul di hasil pencarian (sebaiknya 50-160 karakter)"
            className="w-full"
          />
          <FormField
            label="Kata Kunci"
            id="keywords"
            type="text"
            value={formData.keywords}
            onChange={(value) => handleChange('keywords', value as string)}
            description="Kata kunci yang relevan dengan konten halaman (dipisahkan dengan koma)"
            className="w-full"
          />
          <FormField
            label="URL Kanonikal"
            id="canonicalUrl"
            type="text"
            value={formData.canonicalUrl}
            onChange={(value) => handleChange('canonicalUrl', value as string)}
            description="URL asli untuk mencegah konten duplikat"
            className="w-full"
          />
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="robotsIndex"
                checked={formData.robotsIndex}
                onChange={(e) => handleChange('robotsIndex', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded bg-gray-700 border-gray-600"
              />
              <label htmlFor="robotsIndex" className="text-gray-200">
                Index (muncul di hasil pencarian)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="robotsFollow"
                checked={formData.robotsFollow}
                onChange={(e) => handleChange('robotsFollow', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded bg-gray-700 border-gray-600"
              />
              <label htmlFor="robotsFollow" className="text-gray-200">
                Follow (ikuti tautan)
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Open Graph</CardTitle>
          <CardDescription className="text-gray-400">
            Metadata untuk berbagi di media sosial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Judul Open Graph"
            id="ogTitle"
            type="text"
            value={formData.ogTitle}
            onChange={(value) => handleChange('ogTitle', value as string)}
            className="w-full"
          />
          <FormField
            label="Deskripsi Open Graph"
            id="ogDescription"
            type="textarea"
            value={formData.ogDescription}
            onChange={(value) => handleChange('ogDescription', value as string)}
            className="w-full"
          />
          <FormField
            label="URL Gambar Open Graph"
            id="ogImage"
            type="text"
            value={formData.ogImage}
            onChange={(value) => handleChange('ogImage', value as string)}
            className="w-full"
          />
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Twitter Card</CardTitle>
          <CardDescription className="text-gray-400">
            Metadata khusus untuk Twitter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Judul Twitter"
            id="twitterTitle"
            type="text"
            value={formData.twitterTitle}
            onChange={(value) => handleChange('twitterTitle', value as string)}
            className="w-full"
          />
          <FormField
            label="Deskripsi Twitter"
            id="twitterDescription"
            type="textarea"
            value={formData.twitterDescription}
            onChange={(value) => handleChange('twitterDescription', value as string)}
            className="w-full"
          />
          <FormField
            label="URL Gambar Twitter"
            id="twitterImage"
            type="text"
            value={formData.twitterImage}
            onChange={(value) => handleChange('twitterImage', value as string)}
            className="w-full"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Simpan Pengaturan SEO
        </Button>
      </div>
    </div>
  );
}