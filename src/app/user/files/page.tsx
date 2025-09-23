"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  FileText, 
  Image, 
  File, 
  Folder, 
  Upload, 
  Download, 
  Trash2, 
  Search,
  Filter,
  FolderPlus,
  FilePlus
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface FileItem {
  id: number;
  name: string;
  type: "folder" | "document" | "image" | "other";
  size: string;
  modified: string;
  projectId?: number;
  projectName?: string;
}

export default function FileManager() {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: 1,
      name: "Dokumen Proyek",
      type: "folder",
      size: "-",
      modified: "2024-03-15",
      projectId: 1,
      projectName: "Website Kedai Kopi"
    },
    {
      id: 2,
      name: "Logo_Kedai_Kopi.png",
      type: "image",
      size: "2.4 MB",
      modified: "2024-03-10",
      projectId: 1,
      projectName: "Website Kedai Kopi"
    },
    {
      id: 3,
      name: "Brief_Proyek_Kedai_Kopi.docx",
      type: "document",
      size: "156 KB",
      modified: "2024-03-05",
      projectId: 1,
      projectName: "Website Kedai Kopi"
    },
    {
      id: 4,
      name: "Referensi_Design",
      type: "folder",
      size: "-",
      modified: "2024-03-12",
      projectId: 2,
      projectName: "Portofolio Fotografer"
    },
    {
      id: 5,
      name: "Mockup_Website_Fotografer.sketch",
      type: "other",
      size: "8.2 MB",
      modified: "2024-03-08",
      projectId: 2,
      projectName: "Portofolio Fotografer"
    },
    {
      id: 6,
      name: "Database_Backup.sql",
      type: "document",
      size: "5.1 MB",
      modified: "2024-03-20",
      projectId: 3,
      projectName: "Website PPDB Sekolah"
    }
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  const filteredFiles = files.filter(file => {
    const matchesFilter = filter === "all" || file.type === filter;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "folder": return <Folder className="h-5 w-5 text-blue-500" />;
      case "document": return <FileText className="h-5 w-5 text-red-500" />;
      case "image": return <Image className="h-5 w-5 text-green-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleUpload = () => {
    // Implement file upload logic here
    console.log("Upload file clicked");
    alert("Fitur upload file akan terbuka dalam dialog pemilihan file.");
  };

  const handleDownload = (id: number) => {
    // Implement file download logic here
    console.log("Download file clicked for ID:", id);
    alert("Mengunduh file...");
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus file ini?")) {
      setFiles(files.filter(file => file.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">File Manager</h1>
          <p className="text-gray-600 mt-2">Kelola semua file dan dokumen proyek Anda</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <Card className="p-4">
        <div className="flex items-center">
          <Button variant="link" className="p-0 text-blue-600 hover:text-blue-800" onClick={() => setCurrentPath([])}>
            Home
          </Button>
          {currentPath.map((folder, index) => (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <Button 
                key={index} 
                variant="link" 
                className="p-0 text-blue-600 hover:text-blue-800"
                onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
              >
                {folder}
              </Button>
            </>
          ))}
        </div>
      </Card>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari file..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <Filter className="h-4 w-4 mr-1" />
              Semua
            </Button>
            <Button 
              variant={filter === "folder" ? "default" : "outline"}
              onClick={() => setFilter("folder")}
              className={filter === "folder" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <Folder className="h-4 w-4 mr-1" />
              Folder
            </Button>
            <Button 
              variant={filter === "document" ? "default" : "outline"}
              onClick={() => setFilter("document")}
              className={filter === "document" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <FileText className="h-4 w-4 mr-1" />
              Dokumen
            </Button>
            <Button 
              variant={filter === "image" ? "default" : "outline"}
              onClick={() => setFilter("image")}
              className={filter === "image" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <Image className="h-4 w-4 mr-1" />
              Gambar
            </Button>
          </div>
        </div>
      </Card>

      {/* Files List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proyek
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ukuran
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Terakhir Diubah
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <File className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada file</h3>
                    <p className="mt-1 text-gray-500">
                      Tidak ada file yang sesuai dengan kriteria pencarian Anda.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFileIcon(file.type)}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          {file.type === "folder" && (
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="p-0 text-blue-600 hover:text-blue-800"
                              onClick={() => setCurrentPath([...currentPath, file.name])}
                            >
                              Buka folder
                            </Button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{file.projectName}</div>
                      <div className="text-sm text-gray-500">ID: {file.projectId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.modified}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {file.type !== "folder" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownload(file.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Storage Info */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Penyimpanan</h3>
            <p className="mt-1 text-sm text-gray-500">
              2.4 GB dari 5 GB digunakan
            </p>
          </div>
          <div className="w-1/2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: "48%" }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 GB</span>
              <span>5 GB</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}