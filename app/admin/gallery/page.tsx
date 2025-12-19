"use client";

import { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, Trash2, X, Loader, CheckCircle } from "lucide-react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { getAllGalleryImages, createGalleryImage, deleteGalleryImage } from "@/lib/services/galleryService";
import { GalleryImage } from "@/lib/types";
import Image from "next/image";

interface UploadingFile {
    file: File;
    preview: string;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
}

export default function AdminGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Form state for bulk upload
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<UploadingFile[]>([]);
    const [commonTitle, setCommonTitle] = useState("");
    const [commonDescription, setCommonDescription] = useState("");
    const [commonSeason, setCommonSeason] = useState("");

    useEffect(() => {
        loadGallery();
    }, []);

    const loadGallery = async () => {
        setLoading(true);
        const data = await getAllGalleryImages();
        setImages(data);
        setLoading(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newFiles: UploadingFile[] = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            status: 'pending'
        }));
        setSelectedFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleBulkUpload = async () => {
        if (selectedFiles.length === 0) {
            alert("Please select at least one image");
            return;
        }

        setUploading(true);

        const uploadPromises = selectedFiles.map(async (fileObj, index) => {
            try {
                // Update status to uploading
                setSelectedFiles(prev => prev.map((f, i) =>
                    i === index ? { ...f, status: 'uploading' as const } : f
                ));

                // Upload to Firebase Storage
                const timestamp = Date.now();
                const fileName = `gallery/${timestamp}_${index}_${fileObj.file.name}`;
                const storageRef = ref(storage, fileName);
                const uploadTask = uploadBytesResumable(storageRef, fileObj.file);

                return new Promise<void>((resolve, reject) => {
                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setSelectedFiles(prev => prev.map((f, i) =>
                                i === index ? { ...f, progress: Math.round(progress) } : f
                            ));
                        },
                        (error) => {
                            console.error("Upload error:", error);
                            setSelectedFiles(prev => prev.map((f, i) =>
                                i === index ? { ...f, status: 'error' as const } : f
                            ));
                            reject(error);
                        },
                        async () => {
                            // Get download URL
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                            // Save metadata to Firestore
                            const title = commonTitle || `Photo ${index + 1}`;
                            const newImage = await createGalleryImage({
                                title,
                                description: commonDescription,
                                imageUrl: downloadURL,
                                uploadDate: new Date().toISOString(),
                                uploadedBy: "Admin",
                                season: commonSeason || undefined,
                                tags: []
                            });

                            if (newImage) {
                                setImages(prev => [newImage, ...prev]);
                                setSelectedFiles(prev => prev.map((f, i) =>
                                    i === index ? { ...f, status: 'success' as const } : f
                                ));
                            }
                            resolve();
                        }
                    );
                });
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        });

        await Promise.all(uploadPromises);
        setUploading(false);

        // Auto-close after 2 seconds if all successful
        setTimeout(() => {
            const allSuccess = selectedFiles.every(f => f.status === 'success');
            if (allSuccess) {
                resetForm();
                setIsUploadModalOpen(false);
            }
        }, 2000);
    };

    const handleDelete = async (image: GalleryImage) => {
        if (!confirm(`Delete "${image.title}"?`)) return;

        try {
            const success = await deleteGalleryImage(image.id);

            if (success) {
                const imageRef = ref(storage, image.imageUrl);
                try {
                    await deleteObject(imageRef);
                } catch (e) {
                    console.warn("Could not delete from storage:", e);
                }

                setImages(images.filter(img => img.id !== image.id));
            }
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Error deleting image");
        }
    };

    const resetForm = () => {
        selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
        setSelectedFiles([]);
        setCommonTitle("");
        setCommonDescription("");
        setCommonSeason("");
    };

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-display text-5xl text-white mb-2">GALLERY MANAGEMENT</h1>
                        <p className="text-gray-400">Upload and manage BPL photos</p>
                    </div>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-slate-950 font-bold rounded-lg transition-colors"
                    >
                        <Upload size={20} />
                        Upload Photos
                    </button>
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader className="animate-spin text-primary" size={40} />
                    </div>
                ) : images.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-white/5">
                        <ImageIcon className="mx-auto text-gray-500 mb-4" size={64} />
                        <h3 className="text-2xl font-bold text-white mb-2">No Photos Yet</h3>
                        <p className="text-gray-400">Upload your first photo to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {images.map((image) => (
                            <div key={image.id} className="group relative bg-slate-900 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all">
                                <div className="aspect-square relative">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-white font-bold mb-1 truncate">{image.title}</h3>
                                    {image.description && (
                                        <p className="text-gray-400 text-sm line-clamp-2">{image.description}</p>
                                    )}
                                    {image.season && (
                                        <p className="text-primary text-xs mt-2">{image.season}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDelete(image)}
                                    className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload Modal */}
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-auto">
                            <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
                                <h3 className="text-xl font-bold text-white">Upload Multiple Photos</h3>
                                <button
                                    onClick={() => {
                                        setIsUploadModalOpen(false);
                                        resetForm();
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Select Images (Multiple)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white"
                                        disabled={uploading}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Select multiple images to upload at once
                                    </p>
                                </div>

                                {/* Selected Files Preview */}
                                {selectedFiles.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-white font-bold">
                                            Selected Files ({selectedFiles.length})
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-64 overflow-y-auto p-2 bg-slate-950/50 rounded-lg">
                                            {selectedFiles.map((file, index) => (
                                                <div key={index} className="relative group">
                                                    <div className="aspect-square relative rounded-lg overflow-hidden border border-white/10">
                                                        <Image
                                                            src={file.preview}
                                                            alt={`Preview ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        {file.status === 'uploading' && (
                                                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                                                <div className="text-center">
                                                                    <Loader className="animate-spin text-primary mx-auto mb-1" size={20} />
                                                                    <p className="text-xs text-white">{file.progress}%</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {file.status === 'success' && (
                                                            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                                                <CheckCircle className="text-green-400" size={32} />
                                                            </div>
                                                        )}
                                                        {file.status === 'error' && (
                                                            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                                                <X className="text-red-400" size={32} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {!uploading && file.status === 'pending' && (
                                                        <button
                                                            onClick={() => removeFile(index)}
                                                            className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Common Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Title Prefix (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={commonTitle}
                                        onChange={(e) => setCommonTitle(e.target.value)}
                                        placeholder="e.g., BPL 2025 Finals"
                                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white"
                                        disabled={uploading}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Leave blank to auto-number photos
                                    </p>
                                </div>

                                {/* Common Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Description (Optional, applies to all)
                                    </label>
                                    <textarea
                                        value={commonDescription}
                                        onChange={(e) => setCommonDescription(e.target.value)}
                                        placeholder="Add a common description for all photos"
                                        rows={3}
                                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white resize-none"
                                        disabled={uploading}
                                    />
                                </div>

                                {/* Common Season */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Season (Optional, applies to all)
                                    </label>
                                    <input
                                        type="text"
                                        value={commonSeason}
                                        onChange={(e) => setCommonSeason(e.target.value)}
                                        placeholder="e.g., BPL Season 4 - 2025"
                                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white"
                                        disabled={uploading}
                                    />
                                </div>

                                {/* Submit */}
                                <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                                    <button
                                        onClick={() => {
                                            setIsUploadModalOpen(false);
                                            resetForm();
                                        }}
                                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                                        disabled={uploading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleBulkUpload}
                                        disabled={uploading || selectedFiles.length === 0}
                                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-slate-950 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader className="animate-spin" size={20} />
                                                Uploading {selectedFiles.filter(f => f.status === 'success').length}/{selectedFiles.length}...
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={20} />
                                                Upload {selectedFiles.length} Photo{selectedFiles.length !== 1 ? 's' : ''}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
