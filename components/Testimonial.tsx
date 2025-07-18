'use client'

import { useState, useRef, useEffect } from 'react'

// Define the testimonial data type
interface Testimonial {
  quote: string
  doctor: {
    name: string
    title: string
    location: string
    image: string
  }
}

const TestimonialMarquee = () => {
  const [isPaused, setIsPaused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Testimonial data with real doctor images
  const testimonials: Testimonial[] = [
    {
      quote:
        'Redcliffe Labs delivers exceptional and accurate diagnostic services with a knowledgeable and dedicated team.',
      doctor: {
        name: 'Dr. Vykunta Raju K. N',
        title: 'Pediatric Neurologist',
        location: 'Bengaluru',
        image:
          'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop'
      }
    },
    {
      quote:
        'Redcliffe Labs has been an invaluable diagnostic service provider for me and my patients. Their commitment to using the latest technologies and techniques to deliver quality & timely reports is commendable.',
      doctor: {
        name: 'Dr. Seneesh KV',
        title: 'Fetal Medicine Specialist',
        location: 'Kerala',
        image:
          'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&h=200&auto=format&fit=crop'
      }
    },
    {
      quote:
        'Redcliffe Labs is synonymous with trusted healthcare, delivering high-quality diagnostic services on time.',
      doctor: {
        name: 'Dr. Chitra Ganesh',
        title: 'Fetal Medicine Specialist',
        location: 'Bengaluru',
        image:
          'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&h=200&auto=format&fit=crop'
      }
    },
    {
      quote:
        'For reliable diagnostic services, I highly recommend Redcliffe Labs.',
      doctor: {
        name: 'Dr. Arun Kumar',
        title: 'Specialist',
        location: 'Bengaluru',
        image:
          'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&h=200&auto=format&fit=crop'
      }
    }
  ]

  // Duplicate testimonials for seamless looping
  const allTestimonials = [...testimonials, ...testimonials]

  // Handle dot navigation
  const scrollToTestimonial = (index: number) => {
    setActiveIndex(index)
    if (containerRef.current) {
      const scrollAmount = index * (window.innerWidth < 768 ? 320 : 420)
      containerRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Handle automatic scrolling
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % testimonials.length
      scrollToTestimonial(nextIndex)
    }, 5000)

    return () => clearInterval(interval)
  }, [activeIndex, isPaused, testimonials.length])

  // Handle scroll event to update active index
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollLeft
        const itemWidth = window.innerWidth < 768 ? 320 : 420
        const newIndex =
          Math.round(scrollPosition / itemWidth) % testimonials.length
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex)
        }
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [activeIndex, testimonials.length])

  return (
    <div className="w-full bg-gradient-to-b from-white to-blue-50 py-8 md:py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-3">
            What Doctors Are Saying
          </h2>
          <div className="w-16 md:w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Trusted by healthcare professionals across the country
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            ref={containerRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[400px] p-4 sm:p-6 md:p-8 mx-2 sm:mx-3 md:mx-4 
                           my-2 bg-white rounded-xl shadow-lg border border-gray-100 
                           transform transition-all duration-300 hover:shadow-xl 
                           flex flex-col h-auto md:h-[320px] snap-center"
              >
                <div className="flex-1 flex flex-col">
                  <div className="mb-2">
                    <svg
                      className="w-8 h-8 md:w-10 md:h-10 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                    >
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>
                  <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 flex-grow line-clamp-6 md:line-clamp-none">
                    {testimonial.quote}
                  </p>
                </div>

                <div className="pt-3 md:pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shadow-md border-2 border-blue-100">
                      <img
                        src={testimonial.doctor.image || '/placeholder.svg'}
                        alt={`Photo of ${testimonial.doctor.name}`}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 md:ml-4">
                      <h4 className="font-bold text-sm md:text-base text-blue-900">
                        {testimonial.doctor.name}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-600">
                        {testimonial.doctor.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {testimonial.doctor.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-6 md:mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${
                activeIndex === index
                  ? 'bg-blue-500'
                  : 'bg-blue-300 hover:bg-blue-400'
              }`}
              aria-label={`Scroll to testimonial ${index + 1}`}
              onClick={() => scrollToTestimonial(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestimonialMarquee
