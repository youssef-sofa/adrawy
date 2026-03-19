import React, { createContext, useContext, useState, useEffect } from 'react';

const ImageContext = createContext();

export const useImages = () => useContext(ImageContext);

export const ImageProvider = ({ children }) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const savedImages = localStorage.getItem('qr_gallery_images');
        if (savedImages) {
            setImages(JSON.parse(savedImages));
        }
    }, []);

    const addImage = (imageData) => {
        setImages(prevImages => {
            const newImages = [...prevImages, { ...imageData, id: Date.now().toString() }];
            localStorage.setItem('qr_gallery_images', JSON.stringify(newImages));
            return newImages;
        });
    };

    const updateImage = (id, updatedData) => {
        setImages(prevImages => {
            const newImages = prevImages.map(img => img.id === id ? { ...img, ...updatedData } : img);
            localStorage.setItem('qr_gallery_images', JSON.stringify(newImages));
            return newImages;
        });
    };

    const deleteImage = (id) => {
        setImages(prevImages => {
            const newImages = prevImages.filter(img => img.id !== id);
            localStorage.setItem('qr_gallery_images', JSON.stringify(newImages));
            return newImages;
        });
    };

    const getImageByNumber = (number) => {
        return images.find((img) => img.number === number);
    };

    return (
        <ImageContext.Provider value={{ images, addImage, updateImage, deleteImage, getImageByNumber }}>
            {children}
        </ImageContext.Provider>
    );
};
