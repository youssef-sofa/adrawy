import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useImages } from '../context/ImageContext';
import { ArrowLeft, Share2, Calendar, Hash, FileText } from 'lucide-react';

const ImageViewPage = () => {
    const { number } = useParams();
    const { getImageByNumber } = useImages();
    const [image, setImage] = useState(null);

    useEffect(() => {
        const foundImage = getImageByNumber(number);
        setImage(foundImage);
    }, [number, getImageByNumber]);

    if (!image) {
        return (
            <div className="app-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2 style={{ color: '#f85149' }}>Image Not Found</h2>
                <p style={{ color: '#8b949e', marginBottom: '2rem' }}>
                    Could not find an image with number <strong>#{number}</strong>.
                </p>
                <Link to="/" className="btn-primary" style={{ padding: '0.8rem 2rem', textDecoration: 'none' }}>
                    Back to Gallery
                </Link>
            </div>
        );
    }

    return (
        <div className="app-container">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', textDecoration: 'none', marginBottom: '2rem', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#c9d1d9'} onMouseLeave={e => e.target.style.color = '#8b949e'}>
                <ArrowLeft size={20} /> Back to Gallery
            </Link>

            <div className="details-grid">
                <div className="card" style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: '0 0 50px rgba(0,0,0,0.4)' }}>
                    <img
                        src={image.url}
                        alt={image.name}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                </div>

                <div className="card">
                    <h2 style={{ margin: '0 0 1.5rem 0', borderBottom: '1px solid #30363d', pb: '1rem' }}>Image Details</h2>

                    <div style={{ mb: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#c9d1d9' }}>
                            <FileText size={18} color="#58a6ff" />
                            <span style={{ fontWeight: 600 }}>{image.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#c9d1d9' }}>
                            <Hash size={18} color="#58a6ff" />
                            <span>Number: <strong>{image.number}</strong></span>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <p style={{ margin: 0, color: '#8b949e' }}>
                            This image is protected. The URL you are currently visiting is the one encoded in the QR code.
                        </p>
                    </div>

                    <button
                        className="btn-primary"
                        style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        onClick={() => {
                            navigator.share ? navigator.share({
                                title: image.name,
                                url: window.location.href
                            }) : alert('URL copied to clipboard: ' + window.location.href)
                        }}
                    >
                        <Share2 size={18} /> Share Protected Link
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageViewPage;
