'use client';

import { useState, useEffect, useCallback } from 'react';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, RotateCcw } from 'lucide-react';

interface FormWithDraftProps {
  title: string;
  description?: string;
  fields: {
    id: string;
    label: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';
    options?: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
  }[];
  initialData?: Record<string, string | number>;
  onSubmit: (data: Record<string, string | number>) => void;
  formKey: string; // Key untuk menyimpan draft di localStorage
  autoSaveInterval?: number; // Interval auto-save dalam milidetik (default: 5000ms)
}

export default function FormWithDraft({ 
  title, 
  description, 
  fields, 
  initialData = {},
  onSubmit,
  formKey,
  autoSaveInterval = 5000
}: FormWithDraftProps) {
  const [formData, setFormData] = useState<Record<string, string | number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`form-draft-${formKey}`);
      return saved ? JSON.parse(saved) : initialData;
    }
    return initialData;
  });
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showRestore, setShowRestore] = useState(false);

  // Cek apakah ada draft sebelumnya saat komponen dimuat
  useEffect(() => {
    const draft = localStorage.getItem(`form-draft-${formKey}`);
    if (draft && Object.keys(JSON.parse(draft)).length > 0) {
      setShowRestore(true);
    }
  }, [formKey]);

  // Auto-save ke localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && Object.keys(formData).length > 0) {
        setIsSaving(true);
        localStorage.setItem(`form-draft-${formKey}`, JSON.stringify(formData));
        setLastSaved(new Date().toLocaleTimeString());
        setTimeout(() => setIsSaving(false), 500); // Beri sedikit waktu untuk feedback
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [formData, formKey, autoSaveInterval]);

  const handleChange = useCallback((id: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    
    // Hapus draft setelah submit berhasil
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`form-draft-${formKey}`);
    }
  };

  const handleRestoreDraft = () => {
    const draft = localStorage.getItem(`form-draft-${formKey}`);
    if (draft) {
      setFormData(JSON.parse(draft));
      setShowRestore(false);
    }
  };

  const handleClearDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`form-draft-${formKey}`);
      setFormData(initialData);
      setShowRestore(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white">{title}</CardTitle>
            {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
          </div>
          <div className="flex items-center space-x-2">
            {isSaving ? (
              <div className="text-xs text-blue-400 flex items-center">
                <Save className="h-3 w-3 mr-1 animate-spin" />
                Menyimpan...
              </div>
            ) : lastSaved ? (
              <div className="text-xs text-green-400">
                Tersimpan: {lastSaved}
              </div>
            ) : (
              <div className="text-xs text-gray-500">
                Siap menyimpan
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showRestore && (
          <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-300">Ditemukan draft formulir sebelumnya</p>
              <p className="text-xs text-yellow-400">Data formulir Anda sebelumnya tersimpan</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestoreDraft}
                className="text-xs border-yellow-700 text-yellow-300 hover:bg-yellow-900/30"
              >
                Pulihkan
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearDraft}
                className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Hapus
              </Button>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <FormField
              key={field.id}
              label={field.label}
              id={field.id}
              type={field.type}
              options={field.options}
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(value) => handleChange(field.id, value)}
              required={field.required}
              className="w-full"
            />
          ))}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearDraft}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Hapus Draft
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Simpan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}