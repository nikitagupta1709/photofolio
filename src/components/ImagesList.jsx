import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import ImageForm from './ImageForm';
import Carousel from './Carousel';
import Spinner from 'react-spinner-material';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ImagesList = ({ album, onBack }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [imageToEdit, setImageToEdit] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(null);
    const [search, setSearch] = useState('');
    const dummyImage = "/dummy-image.png"
    useEffect(() => {
        const q = query(collection(db, 'images'), where('albumId', '==', album.id));
        const unsub = onSnapshot(q, (snapshot) => {
            const imgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setImages(imgs);
            setLoading(false);
        });

        return () => unsub();
    }, [album.id]);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'images', id));
            toast.success("Image deleted!");
        } catch (err) {
            toast.error("Failed to delete image.");
        }
    };

    const filteredImages = images.filter(img =>
        img.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="mt-4">
            <button className="btn btn-outline-primary mb-3" onClick={onBack}>← Back to Albums</button>
            <h4 className="mb-3">{album.name}</h4>

            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search images..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-success" onClick={() => {
                    setShowForm(!showForm);
                    setImageToEdit(null);
                }}>
                    {showForm ? "Hide Form" : "Add Image"}
                </button>
            </div>

            {showForm && (
                <ImageForm
                    albumId={album.id}
                    imageToEdit={imageToEdit}
                    onImageSaved={() => setShowForm(false)}
                    onCancelEdit={() => {
                        setShowForm(false);
                        setImageToEdit(null);
                    }}
                />
            )}

            {loading ? (
                <div className="spinner-center">
                    <Spinner />
                </div>
            ) : filteredImages.length === 0 ? (
                <p>No images found.</p>
            ) : (
                <div className="row">
                    {filteredImages.map((img, index) => (
                        <div key={img.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                            <div className="card image-card h-100" onClick={() => setCarouselIndex(index)}>
                                <div className="image-overlay">
                                    <button
                                        className="btn btn-sm btn-light border shadow-sm"
                                        title="Edit"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImageToEdit(img);
                                            setShowForm(true);
                                        }}
                                    >
                                        <FaEdit className="text-primary" />
                                    </button>
                                    <button
                                        className="btn btn-sm btn-light border shadow-sm"
                                        title="Delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(img.id);
                                        }}
                                    >
                                        <FaTrash className="text-danger" />
                                    </button>

                                </div>
                                <img src={img.url || dummyImage} alt={img.title} className="card-img-top" onError={(e) => e.target.src = dummyImage} />
                                <div className="card-body p-2">
                                    <h6 className="card-title text-truncate mb-0">{img.title}</h6>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {carouselIndex !== null && (
                <Carousel
                    images={filteredImages}
                    index={carouselIndex}
                    onClose={() => setCarouselIndex(null)}
                    onNext={() => setCarouselIndex((carouselIndex + 1) % filteredImages.length)}
                    onPrev={() => setCarouselIndex((carouselIndex - 1 + filteredImages.length) % filteredImages.length)}
                />
            )}
        </div>

    );
};

export default ImagesList;
