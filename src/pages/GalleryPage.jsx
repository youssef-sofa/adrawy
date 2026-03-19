import React, { useState } from 'react';
import { useImages } from '../context/ImageContext';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, Search, Info, Edit, Trash2 } from 'lucide-react';

const GalleryPage = () => {
    const { images, loading, deleteImage, updateImage } = useImages();
    const [selectedQR, setSelectedQR] = useState(null);
    const [editingImage, setEditingImage] = useState(null);
    const [editName, setEditName] = useState('');
    const [editNumber, setEditNumber] = useState('');
    const [editError, setEditError] = useState('');

    const getQRLink = (number) => {
        return `${window.location.origin}/view/${number}`;
    };

    const handleDelete = (id, name, storagePath) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteImage(id, storagePath);
        }
    };

    const handleEditOpen = (img) => {
        setEditingImage(img);
        setEditName(img.name);
        setEditNumber(img.number);
        setEditError('');
    };

    const handleEditSave = (e) => {
        e.preventDefault();
        setEditError('');

        if (images.some(img => img.number === editNumber && img.id !== editingImage.id)) {
            setEditError('This image number already exists. Please use a unique number.');
            return;
        }

        updateImage(editingImage.id, { name: editName, number: editNumber });
        setEditingImage(null);
    };

    return (
        <div className="app-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Church Records</h1>
                    <p style={{ color: '#8b949e' }}>Manage your images and QR codes</p>
                </div>

                {images.length > 0 && (
                    <div style={{ background: 'rgba(56, 139, 253, 0.1)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid rgba(56, 139, 253, 0.4)', color: '#58a6ff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Info size={16} />
                        {images.length} Image{images.length !== 1 ? 's' : ''} stored
                    </div>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div className="loader"></div>
                    <p style={{ color: '#8b949e', marginTop: '1rem' }}>Loading church records...</p>
                </div>
            ) : images.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <Search size={64} color="#30363d" style={{ marginBottom: '1rem' }} />
                    <h3>No images found</h3>
                    <p style={{ color: '#8b949e' }}>Start by adding your first image to generate a QR code.</p>
                </div>
            ) : (
                <div className="gallery-grid">
                    {images.map((img) => (
                        <div key={img.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ height: '200px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                                <img
                                    src={img.url}
                                    alt={img.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
                                    <button
                                        onClick={() => handleEditOpen(img)}
                                        style={{ background: 'rgba(22, 27, 34, 0.8)', border: '1px solid #30363d', color: '#c9d1d9', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(img.id, img.name, img.storage_path)}
                                        style={{ background: 'rgba(248, 81, 73, 0.1)', border: '1px solid rgba(248, 81, 73, 0.4)', color: '#f85149', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div style={{ padding: '1.2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{img.name}</h3>
                                        <code style={{ fontSize: '0.8rem', color: '#8b949e' }}>#{img.number}</code>
                                    </div>
                                </div>
                                <button
                                    className="btn-primary"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    onClick={() => setSelectedQR(img.number)}
                                >
                                    <QrCode size={18} /> Get QR Code
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* QR Modal */}
            {selectedQR && (
                <div className="modal-overlay" onClick={() => setSelectedQR(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setSelectedQR(null)}>
                            <X size={24} />
                        </button>
                        <h3 style={{ marginBottom: '0.5rem' }}>QR Code for Image #{selectedQR}</h3>
                        <p style={{ color: '#8b949e', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            Scan this to open the image directly
                        </p>

                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', display: 'inline-block', boxShadow: '0 0 40px rgba(88, 166, 255, 0.2)' }}>
                            <QRCodeSVG
                                value={getQRLink(selectedQR)}
                                size={200}
                                level="H"
                                includeMargin={true}
                            />
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                            <p style={{ margin: '0 0 0.5rem 0', color: '#8b949e' }}>Encodes Link:</p>
                            <code style={{ wordBreak: 'break-all', color: '#58a6ff' }}>{getQRLink(selectedQR)}</code>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingImage && (
                <div className="modal-overlay" onClick={() => setEditingImage(null)}>
                    <div className="modal-content" style={{ width: '100%', maxWidth: '400px', textAlign: 'left' }} onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setEditingImage(null)}>
                            <X size={24} />
                        </button>
                        <h3 style={{ marginBottom: '1.5rem' }}>Edit Image Details</h3>

                        <form onSubmit={handleEditSave}>
                            <div className="form-group">
                                <label>Image Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Image Number</label>
                                <input
                                    type="text"
                                    value={editNumber}
                                    onChange={(e) => setEditNumber(e.target.value)}
                                    required
                                />
                            </div>

                            {editError && <p style={{ color: '#f85149', fontSize: '0.9rem', marginBottom: '1rem' }}>{editError}</p>}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setEditingImage(null)} className="btn-logout" style={{ flex: 1, borderColor: '#30363d', color: '#8b949e' }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
