'use client'

type Review = {
  quote: string
  author: string
  handle?: string
}

const reviews: Review[] = [
  {
    quote: "Ed's content strategy completely transformed how we approach UGC. Views up 3x in two months.",
    author: 'Alex Chen',
    handle: '@alexchen',
  },
  {
    quote: "Best creator we've worked with. Nailed the brief every single time and then some.",
    author: 'Sarah Mitchell',
    handle: '@sarahm',
  },
  {
    quote: "Ed doesn't just make videos — he understands conversion. Our best performing ads.",
    author: 'Jordan Lee',
    handle: '@jordanlee',
  },
  {
    quote: "Came in with zero brand knowledge, left with a content library that actually sells.",
    author: 'Sam Wright',
    handle: '@samwright',
  },
  {
    quote: "The strategy sessions alone were worth the deal. Genuinely thinking about content differently now.",
    author: 'Maria Santos',
    handle: '@mariasantos',
  },
]

export default function ReviewsTicker() {
  const loopItems = [...reviews, ...reviews]

  return (
    <section className="reviews-ticker-wrap" aria-label="Client reviews">
      <div className="reviews-ticker-track" role="presentation">
        {loopItems.map((review, index) => (
          <div className="review-card" key={`${review.author}-${index}`}>
            <div className="review-stars" aria-label="5 stars">
              {'★ ★ ★ ★ ★'.split(' ').map((star, i) => (
                <span key={i} className="review-star">{star}</span>
              ))}
            </div>
            <blockquote className="review-quote">"{review.quote}"</blockquote>
            <div className="review-author">
              <span className="review-name">{review.author}</span>
              {review.handle && <span className="review-handle">{review.handle}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
