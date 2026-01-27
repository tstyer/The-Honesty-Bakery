import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Rating from './Rating'

export default function FeaturedCarousel({ products = [] }) {
  const items = products.slice(0, 10) // choose how many in slider
  const trackRef = useRef(null)
  const cardRef = useRef(null)

  const [step, setStep] = useState(0) // how far to move per click (px)
  const [index, setIndex] = useState(0)

  // measure one card width + gap so we can move by exactly 1 card
  useEffect(() => {
    const measure = () => {
      if (!cardRef.current || !trackRef.current) return

      const cardWidth = cardRef.current.getBoundingClientRect().width
      const trackStyles = window.getComputedStyle(trackRef.current)
      const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0')

      setStep(cardWidth + gap)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  if (!items.length) return null

  const maxIndex = Math.max(0, items.length - 2) // because 2 are visible

  const prev = () => setIndex((i) => Math.max(0, i - 1))
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1))

  const translateX = step * index

  const getImageSrc = (img) => img || '/images/placeholder.jpg'

  return (
    <div className="featured-slider">
      <button
        type="button"
        className="featured-arrow featured-arrow-left"
        onClick={prev}
        disabled={index === 0}
        aria-label="Previous cakes"
      >
        ‹
      </button>

      <div className="featured-viewport">
        <div
          className="featured-track"
          ref={trackRef}
          style={{ transform: `translateX(-${translateX}px)` }}
        >
          {items.map((p, i) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="featured-card"
              ref={i === 0 ? cardRef : null}
            >
              <div className="featured-img-wrap">
                <img
                  src={getImageSrc(p.image)}
                  alt={p.name}
                  className="featured-img"
                />
              </div>

              <div className="featured-meta">
                <div className="featured-title">{p.name}</div>
                <div className="featured-rating">
                  <Rating value={p.rating} text={`${p.numReviews} reviews`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="featured-arrow featured-arrow-right"
        onClick={next}
        disabled={index === maxIndex}
        aria-label="Next cakes"
      >
        ›
      </button>
    </div>
  )
}
