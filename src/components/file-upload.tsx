import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Paperclip, X, File, Image as ImageIcon, FileText, XCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  allowedTypes?: string[];
  maxFileSize?: number; // dalam MB
  multiple?: boolean;
}

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export default function FileUpload({ 
  onFileUpload, 
  allowedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt'],
  maxFileSize = 10, // 10MB default
  multiple = false
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidFileType = (file: File) => {
    return allowedTypes.some(type => {
      if (type.startsWith('.')) {
        // Cek berdasarkan ekstensi
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      } else if (type.endsWith('/*')) {
        // Cek berdasarkan jenis MIME
        const mainType = type.slice(0, -1); // hilangkan *
        return file.type.startsWith(mainType);
      } else {
        // Cek tipe MIME persis
        return file.type === type;
      }
    });
  };

  const isValidFileSize = (file: File) => {
    return file.size <= maxFileSize * 1024 * 1024; // Convert MB ke bytes
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  const processFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = [];

    for (const file of files) {
      if (!isValidFileType(file)) {
        newFiles.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          status: 'error',
          error: `Tipe file tidak didukung: ${file.type || 'unknown'}`
        });
        continue;
      }

      if (!isValidFileSize(file)) {
        newFiles.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          status: 'error',
          error: `Ukuran file terlalu besar (maksimal ${maxFileSize}MB)`
        });
        continue;
      }

      // Buat preview untuk file gambar
      let preview: string | undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }

      newFiles.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        preview,
        status: 'uploading'
      });
    }

    setUploadedFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);

    // Proses upload untuk file yang valid
    newFiles.forEach(item => {
      if (item.status !== 'error') {
        // Simulasikan proses upload
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === item.id ? { ...f, status: 'success' } : f
            )
          );
          
          // Panggil callback saat upload selesai
          if (item.status !== 'error') {
            onFileUpload(item.file);
          }
        }, 1000);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-4 w-4" />;
    } else {
      return <File className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip className="h-8 w-8 mx-auto text-gray-400" />
        <p className="mt-2 text-sm text-gray-400">
          Seret & lepas file di sini, atau klik untuk memilih
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Mendukung: {allowedTypes.join(', ')} | Maksimal {maxFileSize}MB
        </p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple={multiple}
        />
      </div>

      {/* Daftar file yang diupload */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((item) => (
            <Card 
              key={item.id} 
              className={`p-3 flex items-center justify-between ${
                item.status === 'error' 
                  ? 'bg-red-900/20 border-red-700' 
                  : 'bg-gray-750 border-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2 overflow-hidden">
                <div className="text-gray-400">
                  {item.status === 'error' ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    getFileIcon(item.file)
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {item.status === 'uploading' && (
                  <div className="text-xs text-blue-400">Mengunggah...</div>
                )}
                {item.status === 'error' && (
                  <div className="text-xs text-red-400">{item.error}</div>
                )}
                {item.status === 'success' && (
                  <div className="text-xs text-green-400">Selesai</div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(item.id)}
                  className="h-7 w-7 p-0 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}