"use client";

import { useState, useEffect } from "react";
import { getAlbums, getPhotosByAlbum, getAllGalleryImages } from "@/lib/services/galleryService";
import { GalleryImage } from "@/lib/types";
import Image from "next/image";
import { Folder, Image as ImageIcon, X, ArrowLeft } from "lucide-react";

interface Album {
    name: string;
    cover: string;
    count: number;
    season?: string;
}

export default function GalleryPage() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [ungroupedPhotos, setUngroupedPhotos] = useState<GalleryImage[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
    const [albumPhotos, setAlbumPhotos] = useState<GalleryImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGallery();
    }, []);

    const loadGallery = async () => {
        setLoading(true);
        const albumData = await getAlbums();
        setAlbums(albumData);

        // Also get photos without albums
        const allPhotos = await getAllGalleryImages();
        const ungrouped = allPhotos.filter(photo => !photo.album);
        setUngroupedPhotos(ungrouped);

        setLoading(false);
    };

    const openAlbum = async (albumName: string) => {
        setSelectedAlbum(albumName);
        setLoading(true);
        const photos = await getPhotosByAlbum(albumName);
        setAlbumPhotos(photos);
        setLoading(false);
    };

    const closeAlbum = () => {
        setSelectedAlbum(null);
        setAlbumPhotos([]);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    {selectedAlbum ? (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={closeAlbum}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div>
                                <h1 className="font-display text-4xl md:text-5xl">{selectedAlbum}</h1>
                                <p className="text-gray-400 mt-2">{albumPhotos.length} photos</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h1 className="font-display text-4xl md:text-5xl text-white mb-4">PHOTO GALLERY</h1>
                            <p className="text-gray-400">Browse BPL photo albums and moments</p>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : selectedAlbum ? (
                    /* Album Photos Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {albumPhotos.map((photo) => (
                            <div
                                key={photo.id}
                                onClick={() => setSelectedImage(photo)}
                                className="group relative bg-slate-900 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all cursor-pointer hover:scale-105"
                            >
                                <div className="aspect-square relative">
                                    <Image
                                        src={photo.imageUrl}
                                        alt={photo.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-white font-bold text-sm">{photo.title}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Albums and Ungrouped Photos */
                    <div>
                        {albums.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-4">Photo Albums</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {albums.map((album) => (
                                        <div
                                            key={album.name}
                                            onClick={() => openAlbum(album.name)}
                                            className="group relative bg-slate-900 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all cursor-pointer hover:scale-105"
                                        >
                                            <div className="aspect-square relative">
                                                <Image
                                                    src={album.cover}
                                                    alt={album.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                                {/* Folder Icon Overlay */}
                                                <div className="absolute top-4 right-4">
                                                    <div className="p-2 bg-black/50 backdrop-blur-sm rounded-lg">
                                                        <Folder className="text-primary" size={24} />
                                                    </div>
                                                </div>

                                                {/* Album Info */}
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <h3 className="text-white font-bold text-lg mb-1">{album.name}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                                        <ImageIcon size={16} />
                                                        <span>{album.count} photos</span>
                                                        {album.season && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="text-primary">{album.season}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {ungroupedPhotos.length > 0 && (
                            <div>
                                {albums.length > 0 && (
                                    <h2 className="text-2xl font-bold text-white mb-4">All Photos</h2>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {ungroupedPhotos.map((photo) => (
                                        <div
                                            key={photo.id}
                                            onClick={() => setSelectedImage(photo)}
                                            className="group relative bg-slate-900 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all cursor-pointer hover:scale-105"
                                        >
                                            <div className="aspect-square relative">
                                                <Image
                                                    src={photo.imageUrl}
                                                    alt={photo.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <h3 className="text-white font-bold text-sm">{photo.title}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {albums.length === 0 && ungroupedPhotos.length === 0 && (
                            <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-white/5">
                                <ImageIcon className="mx-auto text-gray-500 mb-4" size={64} />
                                <h3 className="text-2xl font-bold text-white mb-2">No Photos Yet</h3>
                                <p className="text-gray-400">Upload photos to get started</p>
                            </div>
                        )}
                    </div>
                )

                {/* Lightbox Modal */}
                {selectedImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <div className="max-w-6xl w-full">
                            <div className="relative aspect-video">
                                <Image
                                    src={selectedImage.imageUrl}
                                    alt={selectedImage.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="mt-4 text-center">
                                <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
                                {selectedImage.description && (
                                    <p className="text-gray-400">{selectedImage.description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
