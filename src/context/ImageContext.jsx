import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ImageContext = createContext();

export const useImages = () => useContext(ImageContext);

export const ImageProvider = ({ children }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchImages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('images')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching images:', error.message);
        } else {
            setImages(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const addImage = async (name, number, file) => {
        try {
            // 1. Upload file to Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            // 3. Insert into Database
            const { data, error: dbError } = await supabase
                .from('images')
                .insert([{
                    name,
                    number,
                    url: publicUrl,
                    storage_path: filePath
                }])
                .select()
                .single();

            if (dbError) throw dbError;

            setImages(prev => [data, ...prev]);
            return { success: true };
        } catch (error) {
            console.error('Error adding image:', error.message);
            return { success: false, message: error.message };
        }
    };

    const updateImage = async (id, updatedData) => {
        try {
            const { error } = await supabase
                .from('images')
                .update(updatedData)
                .eq('id', id);

            if (error) throw error;

            setImages(prev => prev.map(img => img.id === id ? { ...img, ...updatedData } : img));
            return { success: true };
        } catch (error) {
            console.error('Error updating image:', error.message);
            return { success: false, message: error.message };
        }
    };

    const deleteImage = async (id, storagePath) => {
        try {
            // 1. Delete from Storage
            if (storagePath) {
                const { error: storageError } = await supabase.storage
                    .from('images')
                    .remove([storagePath]);
                if (storageError) console.warn('Storage delete error:', storageError.message);
            }

            // 2. Delete from DB
            const { error: dbError } = await supabase
                .from('images')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            setImages(prev => prev.filter(img => img.id !== id));
            return { success: true };
        } catch (error) {
            console.error('Error deleting image:', error.message);
            return { success: false, message: error.message };
        }
    };

    const getImageByNumber = (number) => {
        return images.find((img) => img.number === number);
    };

    return (
        <ImageContext.Provider value={{ images, loading, addImage, updateImage, deleteImage, getImageByNumber, refreshImages: fetchImages }}>
            {children}
        </ImageContext.Provider>
    );
};
