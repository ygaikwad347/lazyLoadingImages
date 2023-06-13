import React, { useEffect, useState, useRef } from "react";

const App = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [images]);

  const fetchImages = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.unsplash.com/photos?page=${page}&client_id=uDGX6IglwICgKoCc4YemdDpzWBghvxzS-Tgw1vDVDw8`
      );
      const data = await response.json();
      setImages((prevImages) => [...prevImages, ...data]);
      setPage((prevPage) => prevPage + 1);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoading) {
      fetchImages();
    }
  };

  return (
    <div>
      <h1>Infinite Scrolling Lazy Loading Images</h1>
      <div className="image-container">
        {images.map((image, index) => (
          <img key={index} src={image.urls.thumb} alt={image.alt_description} />
        ))}
      </div>
      <div ref={containerRef} className="loader">
        {isLoading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default App;
