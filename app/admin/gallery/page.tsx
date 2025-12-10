"use client";

import { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, Trash2, X, Loader } from "lucide-react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { getAllGalleryImages, createGalleryImage, deleteGalleryImage } from "@/lib/services/galleryService";
import { GalleryImage } from "@/lib/types";
import Image from "next/image";

export default function AdminGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Form state
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [season, setSeason] = useState("");

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
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !title) {
            alert("Please provide a file and title");
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            // Upload to Firebase Storage
            const timestamp = Date.now();
            const fileName = `gallery/${timestamp}_${selectedFile.name}`;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, selectedFile);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(Math.round(progress));
                },
                (error) => {
                    console.error("Upload error:", error);
                    alert("Error uploading image");
                    setUploading(false);
                },
                async () => {
                    // Get download URL
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // Save metadata to Firestore
                    const newImage = await createGalleryImage({
                        title,
                        description,
                        imageUrl: downloadURL,
                        uploadDate: new Date().toISOString(),
                        uploadedBy: "Admin",
                        season: season || undefined,
                        tags: []
                    });

                    if (newImage) {
                        setImages([newImage, ...images]);
                        resetForm();
                        setIsUploadModalOpen(false);
                    }
                    setUploading(false);
                }
            );
        } catch (error) {
            console.error("Error:", error);
            alert("Error uploading image");
            setUploading(false);
        }
    };

    const handleDelete = async (image: GalleryImage) => {
        if (!confirm(`Delete "${image.title}"?`)) return;

        try {
            // Delete from Firestore
            const success = await deleteGalleryImage(image.id);

            if (success) {
                // Delete from Storage
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
        setSelectedFile(null);
        setPreviewUrl("");
        setTitle("");
        setDescription("");
        setSeason("");
        setUploadProgress(0);
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
                        Upload Photo
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
                        <div className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-2xl shadow-2xl">
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <h3 className="text-xl font-bold text-white">Upload Photo</h3>
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
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Select Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white"
                                    />
                                    {previewUrl && (
                                        <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden">
                                            <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter photo title"
                                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Description (Optional)</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Add a description"
                                        rows={3}
                                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white resize-none"
                                    />
                                </div>

                                {/* Season */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Season (Optional)</label>
                                    <input
                                        type="text"
                                        value={season}
                                        onChange={(e) => setSeason(e.target.value)}
                                        placeholder="e.g., BPL Season 4 - 2025"
                                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white"
                                    />
                                </div>

                                {/* Progress Bar */}
                                {uploading && (
                                    <div>
                                        <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-400 text-center">{uploadProgress}% uploaded</p>
                                    </div>
                                )}

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
                                        onClick={handleUpload}
                                        disabled={uploading || !selectedFile || !title}
                                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-slate-950 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {uploading ? "Uploading..." : "Upload"}
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
