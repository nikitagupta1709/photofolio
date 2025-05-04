import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import AlbumForm from './AlbumForm';
import ImagesList from './ImagesList';
import Spinner from 'react-spinner-material';
import { FaEdit, FaTrash } from 'react-icons/fa';  // Importing icons

const AlbumsList = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loadingAlbumId, setLoadingAlbumId] = useState(null);
    const [albumToEdit, setAlbumToEdit] = useState(null);  // State to handle album edit

    const handleSelectAlbum = (album) => {
        setSelectedAlbum(album);
        setLoadingAlbumId(album.id);

        // simulate or wait for image fetch to complete
        setTimeout(() => {
            setLoadingAlbumId(null);
        }, 800); // Adjust based on actual async time
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'albums'), (snapshot) => {
            const albumData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAlbums(albumData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAlbumAdded = () => {
        setShowForm(false);
        setAlbumToEdit(null);  // Reset the edit state when a new album is added
    };

    const handleEditAlbum = (album) => {
        setAlbumToEdit(album);  // Set album to edit
        setShowForm(true);  // Show the form to edit
    };

    const handleDeleteAlbum = async (albumId) => {
        try {
            await deleteDoc(doc(db, 'albums', albumId));
            setSelectedAlbum(null);  // Deselect album after deletion
            alert("Album deleted successfully!");
        } catch (error) {
            alert("Error deleting album.");
        }
    };

    if (loading) {
        return (
            <div className="spinner-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h3 className="mb-3">Photo Albums</h3>
            <button className="btn btn-success mb-3" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Hide Form' : 'Add Album'}
            </button>
            {showForm && (
                <AlbumForm
                    onAlbumAdded={handleAlbumAdded}
                    albumToEdit={albumToEdit}  // Pass albumToEdit to pre-fill the form
                />
            )}

            <div className="album-list-scrollable p-2">
                <div className="row g-3">
                    {albums.map((album) => (
                        <div key={album.id} className="col-12">
                            <div
                                className={`card album-card shadow-sm ${selectedAlbum?.id === album.id ? 'selected-album' : ''}`}
                                onClick={() => handleSelectAlbum(album)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0 text-truncate">{album.name}</h6>
                                    {loadingAlbumId === album.id && (
                                        <div className="spinner-border spinner-border-sm text-primary ms-2" />
                                    )}
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-sm btn-light border shadow-sm"
                                            title="Edit"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditAlbum(album);  // Open the form for editing
                                            }}
                                        >
                                            <FaEdit className="text-primary" />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-light border shadow-sm"
                                            title="Delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteAlbum(album.id);  // Delete the album
                                            }}
                                        >
                                            <FaTrash className="text-danger" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedAlbum && (
                <ImagesList
                    album={selectedAlbum}
                    onBack={() => setSelectedAlbum(null)}
                />
            )}
        </div>
    );
};

export default AlbumsList;
