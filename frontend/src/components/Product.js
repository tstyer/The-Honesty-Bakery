import React from "react";
import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";

function Product({ product }) {

  // ADD TO README:
  // In development, React runs on http://localhost:3000
  // Django backend (and static images) run on http://127.0.0.1:8000
  //
  // If we use an image path like "/static/images/..." or "/media/..."
  // the browser will try to load it from *React's* server (3000),
  // NOT Django — and it will fail.
  //
  // This logic checks:
  // 1. Are we in development mode?
  // 2. Does the image path start with "/static/" OR "/media/"?
  //
  // If yes → explicitly prefix the Django backend URL.
  // In production, this condition is false, so the image path is used as-is.

  const needsBackendPrefix =
    process.env.NODE_ENV === "development" &&
    (product.image?.startsWith("/static/") ||
     product.image?.startsWith("/media/"));

  // Final image source:
  // - Dev + Django-served paths → prefix backend
  // - Frontend public images (/images/...) → use as-is
  // - If image is missing → fallback placeholder
  const imageSrc = needsBackendPrefix
    ? `http://127.0.0.1:8000${product.image}`
    : product.image || "/images/placeholder.jpg";

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        {/* 
          I use imageSrc instead of product.image directly.
          This ensures images load correctly in development ONLY,
          while keeping production URLs clean.
        */}
        <Card.Img
          src={imageSrc}
          variant="top"
          alt={product.name}
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <div className="my-3">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
              color="#f8e825"
            />
          </div>
        </Card.Text>

        <Card.Text as="h3">£{product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Product;
