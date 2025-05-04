import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

const ImageForm = ({ albumId, onImageSaved, imageToEdit, onCancelEdit }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (imageToEdit) {
            setTitle(imageToEdit.title);
            setUrl(imageToEdit.url);
        } else {
            setTitle('');
            setUrl('');
        }
    }, [imageToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !url) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            if (imageToEdit) {
                await updateDoc(doc(db, 'images', imageToEdit.id), { title, url });
                toast.success("Image updated!");
            } else {
                await addDoc(collection(db, 'images'), { title, url, albumId });
                toast.success("Image added!");
            }
            onImageSaved();
            setTitle('');
            setUrl('');
        } catch (err) {
            toast.error("Error saving image");
        }
    };

    return (
        <form className="mb-3 p-3 border rounded bg-light" onSubmit={handleSubmit}>
            <h5>{imageToEdit ? "Edit Image" : "Add New Image"}</h5>
            <div className="mb-2">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Image Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Image URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
            </div>
            <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit">
                    {imageToEdit ? 'Update' : 'Submit'}
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => {
                    setTitle('');
                    setUrl('');
                    onCancelEdit?.();
                }}>Clear</button>
            </div>
        </form>
    );
};

export default ImageForm;
