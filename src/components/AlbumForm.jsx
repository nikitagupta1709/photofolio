import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

const AlbumForm = ({ onAlbumAdded, albumToEdit }) => {
    const [albumName, setAlbumName] = useState('');

    useEffect(() => {
        if (albumToEdit) {
            setAlbumName(albumToEdit.name);  // Pre-fill form with album data
        }
    }, [albumToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (albumToEdit) {
            // Update existing album
            await setDoc(doc(db, 'albums', albumToEdit.id), { name: albumName });
            toast.success("Album updated successfully!");
        } else {
            // Add new album
            const newAlbumRef = doc(db, 'albums', albumName);
            await setDoc(newAlbumRef, { name: albumName });
            toast.success("Album added successfully!");
        }

        onAlbumAdded();  // Reset form and trigger parent update
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
                <label htmlFor="albumName" className="form-label">
                    Album Name
                </label>
                <input
                    type="text"
                    id="albumName"
                    className="form-control"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">
                {albumToEdit ? 'Update Album' : 'Add Album'}
            </button>
        </form>
    );
};

export default AlbumForm;
