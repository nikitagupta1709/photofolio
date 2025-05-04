import React, { useEffect } from 'react';

const Carousel = ({ images, index, onClose, onNext, onPrev }) => {
    const image = images[index];
    const dummyImage = "/dummy-image.png"

    // Keyboard navigation effect
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                onNext();
            } else if (e.key === 'ArrowLeft') {
                onPrev();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNext, onPrev, onClose]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="carousel-container" onClick={(e) => e.stopPropagation()}>
                {/* Close button */}
                {/* <button className="btn btn-close btn-lg position-absolute top-0 end-0 m-3" onClick={onClose}></button> */}

                {/* Caption in the top-left corner */}
                <h4 className="text-white">{image.title}</h4>

                {/* Carousel with Bootstrap classes */}
                <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {/* Carousel item */}
                        <div className={`carousel-item active`}>
                            <img src={image.url || dummyImage} alt={image.title} className="carousel-image img-fluid shadow-lg" onError={(e) => e.target.src = dummyImage} />
                        </div>
                    </div>

                    {/* Carousel controls */}
                    <div className="carousel-controls">
                        <button className="btn btn-outline-light btn-lg me-3" onClick={onPrev}>⟨</button>
                        <button className="btn btn-outline-light btn-lg" onClick={onNext}>⟩</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carousel;
