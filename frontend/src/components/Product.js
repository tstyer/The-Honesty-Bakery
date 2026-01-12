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

  // ✅ SIMPLE MODE (React serves images)
  // We only want paths like: "/images/birthday_cake.jpg"
  // because React serves files from: frontend/public/images/...

  const rawImage = product?.image || "";

  // If you accidentally saved Django-ish paths, we "convert" them to React public.
  // Examples:
  //   "/static/images/x.jpg"  -> "/images/x.jpg"
  //   "media/images/x.jpg"    -> "/images/x.jpg"
  //   "/images/x.jpg"         -> "/images/x.jpg"
  //   "images/x.jpg"          -> "/images/x.jpg"
  const normalisedImage = rawImage
    ? `/${rawImage}`.replace(/\/+/, "/") // ensure it starts with ONE slash
    : "";

  const reactImage = normalisedImage
    .replace(/^\/static\/images\//, "/images/")
    .replace(/^\/media\/images\//, "/images/")
    .replace(/^\/media\//, "/images/") // handles "/media/filename.jpg"
    .replace(/^\/static\//, "/images/"); // handles "/static/filename.jpg"

  // Final image source:
  // - React public images (/images/...) → use as-is
  // - If image is missing → fallback placeholder
  const imageSrc = reactImage || "/images/placeholder.jpg";

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        {/*
          I use imageSrc instead of product.image directly.
          This keeps image paths consistent and avoids broken links.
        */}
        <Card.Img src={imageSrc} variant="top" alt={product.name} />
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
