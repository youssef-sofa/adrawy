import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImages } from '../context/ImageContext';
import { Upload, FileImage, Tag } from 'lucide-react';

const AddImagePage = () => {
    const [name, setName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { addImage, images } = useImages();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 2 * 1024 * 1024) {
                setError('Image size should be less than 2MB');
                return;
            }
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!file) {
            setError('Please select an image.');
            return;
        }

        setLoading(true);
        const result = await addImage(name, file);
        setLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Error uploading image. Please try again.');
        }
    };

    return (
        <div className="app-container">
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Upload size={24} color="#58a6ff" /> Add New Image
                </h2>

                <form onSubmit={handleSubmit}>
                    <label className={`image-preview-container ${imagePreview ? 'has-image' : ''}`}>
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Preview" />
                                <div className="upload-overlay">
                                    <Upload size={18} />
                                    <span>Click to Change Image</span>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#8b949e' }}>
                                <FileImage size={48} strokeWidth={1} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                <p>Click to choose an image file</p>
                                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Limit: 2MB</span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden-file-input"
                        />
                    </label>

                    <div className="form-group">
                        <label>Image Name / Label</label>
                        <div className="input-with-icon">
                            <Tag size={18} />
                            <input
                                type="text"
                                placeholder="e.g. Profile Picture"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>


                    {error && <p style={{ color: '#f85149', marginBottom: '1rem' }}>{error}</p>}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Uploading...' : 'Save Image & Generate QR'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddImagePage;
