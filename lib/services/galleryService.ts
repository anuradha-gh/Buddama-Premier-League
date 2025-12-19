import { db } from "@/lib/firebase";
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, orderBy, Timestamp } from "firebase/firestore";
import { GalleryImage } from "@/lib/types";

const GALLERY_COLLECTION = "gallery";

// Get all gallery images
export async function getAllGalleryImages(): Promise<GalleryImage[]> {
    try {
        const q = query(
            collection(db, GALLERY_COLLECTION),
            orderBy("uploadDate", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as GalleryImage));
    } catch (error) {
        console.error("Error fetching gallery images:", error);
        return [];
    }
}

// Get single gallery image
export async function getGalleryImageById(id: string): Promise<GalleryImage | null> {
    try {
        const docRef = doc(db, GALLERY_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            } as GalleryImage;
        }
        return null;
    } catch (error) {
        console.error("Error fetching gallery image:", error);
        return null;
    }
}

// Create gallery image metadata (after upload to Storage)
export async function createGalleryImage(imageData: Omit<GalleryImage, 'id'>): Promise<GalleryImage | null> {
    try {
        // Remove undefined fields to avoid Firestore errors
        const cleanData: any = {
            title: imageData.title,
            imageUrl: imageData.imageUrl,
            uploadDate: imageData.uploadDate || new Date().toISOString(),
            uploadedBy: imageData.uploadedBy,
            tags: imageData.tags || []
        };

        // Only include optional fields if they have values
        if (imageData.description) cleanData.description = imageData.description;
        if (imageData.season) cleanData.season = imageData.season;
        if (imageData.thumbnailUrl) cleanData.thumbnailUrl = imageData.thumbnailUrl;

        const docRef = await addDoc(collection(db, GALLERY_COLLECTION), cleanData);

        return {
            id: docRef.id,
            ...imageData
        };
    } catch (error) {
        console.error("Error creating gallery image:", error);
        return null;
    }
}

// Update gallery image metadata
export async function updateGalleryImage(id: string, updates: Partial<GalleryImage>): Promise<GalleryImage | null> {
    try {
        const docRef = doc(db, GALLERY_COLLECTION, id);
        await updateDoc(docRef, updates);

        const updated = await getGalleryImageById(id);
        return updated;
    } catch (error) {
        console.error("Error updating gallery image:", error);
        return null;
    }
}

// Delete gallery image metadata
export async function deleteGalleryImage(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, GALLERY_COLLECTION, id));
        return true;
    } catch (error) {
        console.error("Error deleting gallery image:", error);
        return false;
    }
}

// Get images by season
export async function getGalleryImagesBySeason(season: string): Promise<GalleryImage[]> {
    try {
        const allImages = await getAllGalleryImages();
        return allImages.filter(img => img.season === season);
    } catch (error) {
        console.error("Error fetching gallery images by season:", error);
        return [];
    }
}

// Get all albums with metadata
export async function getAlbums(): Promise<{ name: string; cover: string; count: number; season?: string }[]> {
    try {
        const allImages = await getAllGalleryImages();
        const albumsMap = new Map<string, { cover: string; count: number; season?: string }>();

        allImages.forEach(img => {
            if (img.album) {
                if (!albumsMap.has(img.album)) {
                    albumsMap.set(img.album, {
                        cover: img.albumCover || img.imageUrl,
                        count: 0,
                        season: img.season
                    });
                }
                const album = albumsMap.get(img.album)!;
                album.count++;
            }
        });

        return Array.from(albumsMap.entries()).map(([name, data]) => ({
            name,
            ...data
        }));
    } catch (error) {
        console.error("Error fetching albums:", error);
        return [];
    }
}

// Get photos by album name
export async function getPhotosByAlbum(albumName: string): Promise<GalleryImage[]> {
    try {
        const allImages = await getAllGalleryImages();
        return allImages.filter(img => img.album === albumName);
    } catch (error) {
        console.error("Error fetching photos by album:", error);
        return [];
    }
}
