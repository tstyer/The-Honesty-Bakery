import React from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from './Rating'

export default function featuredCarousel({products = []}) {
    // I am choosing a small selection of photos/products
    const featured = products.slice(0, 5);

    if (!featured.length)
        return null;

    // Otherwise, if true... 

    return (
        <Carousel className="mb-4" variant="dark">
      {featured.map((p) => (
        <Carousel.Item key={p._id}>
          <Link to={`/product/${p._id}`} className="carousel-link">
            <div className="carousel-image-wrap">
              <img
                src={p.image?.startsWith('/') ? p.image : `/${p.image}`}
                alt={p.name}
                className="carousel-image"
              />
            </div>

            <Carousel.Caption className="carousel-caption-custom">
              <h3 className="mb-2">{p.name}</h3>
              <div className="d-flex justify-content-center">
                <Rating value={p.rating} text={`${p.numReviews} reviews`} />
              </div>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
    )
}