"use client";

import { useState, useEffect } from "react";
import { getAllGalleryImages } from "@/lib/services/galleryService";
import { GalleryImage } from "@/lib/types";
import Image from "next/image";
import { Loader, Image as ImageIcon, X } from "lucide-react";

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [filterSeason, setFilterSeason] = useState<string>("all");

    useEffect(() => {
        loadGallery();
    }, []);

    const loadGallery = async () => {
        setLoading(true);
        const data = await getAllGalleryImages();
        setImages(data);
        setLoading(false);
    };

    // Get unique seasons
    const seasons = Array.from(new Set(images.filter(img => img.season).map(img => img.season)));

    // Filter images
    const filteredImages = filterSeason === "all"
        ? images
        : images.filter(img => img.season === filterSeason);

    return (
        <div className="min-h-screen bg-slate-950 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="font-display text-5xl md:text-7xl text-white mb-4 tracking-wide">
                        BPL <span className="text-primary">GALLERY</span>
                    </h1>
                    <p className="text-xl text-gray-400">Moments from the Buddama Premier League</p>
                </div>

                {/* Season Filter */}
                {seasons.length > 0 && (
                    <div className="flex flex-wrap gap-3 justify-center mb-8">
                        <button
                            onClick={() => setFilterSeason("all")}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${filterSeason === "all"
                                    ? "bg-primary text-slate-950"
                                    : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                                }`}
                        >
                            All Photos
                        </button>
                        {seasons.map((season) => (
                            <button
                                key={season}
                                onClick={() => setFilterSeason(season!)}
                                className={`px-6 py-2 rounded-lg font-medium transition-colors ${filterSeason === season
                                        ? "bg-primary text-slate-950"
                                        : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                                    }`}
                            >
                                {season}
                            </button>
                        ))}
                    </div>
                )}

                {/* Gallery Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader className="animate-spin text-primary" size={40} />
                    </div>
                ) : filteredImages.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-white/5">
                        <ImageIcon className="mx-auto text-gray-500 mb-4" size={64} />
                        <h3 className="text-2xl font-bold text-white mb-2">No Photos Yet</h3>
                        <p className="text-gray-400">Check back soon for exciting moments from BPL!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredImages.map((image) => (
                            <div
                                key={image.id}
                                onClick={() => setSelectedImage(image)}
                                className="group relative bg-slate-900 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all cursor-pointer hover:scale-105"
                            >
                                <div className="aspect-square relative">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                                    <h3 className="text-white font-bold truncate">{image.title}</h3>
                                    {image.description && (
                                        <p className="text-gray-300 text-sm line-clamp-2 mt-1">{image.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Lightbox Modal */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        <div
                            className="max-w-5xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-[70vh]">
                                <Image
                                    src={selectedImage.imageUrl}
                                    alt={selectedImage.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="mt-6 bg-slate-900/80 rounded-xl p-6 backdrop-blur-sm">
                                <h2 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h2>
                                {selectedImage.description && (
                                    <p className="text-gray-300 mb-3">{selectedImage.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    {selectedImage.season && (
                                        <span className="text-primary font-medium">{selectedImage.season}</span>
                                    )}
                                    <span>{new Date(selectedImage.uploadDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
