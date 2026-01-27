import React from "react";
import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";

function Product({ product }) {
  // All product images are served from frontend/public/images
  // If an image is missing, fall back to a placeholder
  const imageSrc = product.image || "/images/placeholder.jpg";

  return (
    <Card className="product-card my-3 rounded">
      <Link to={`/product/${product._id}`}>
        <div className="product-image-wrap">
          <Card.Img
            src={imageSrc}
            variant="top"
            alt={product.name}
            className="product-image"
          />
        </div>
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
