import type React from "react"
import Image from 'next/image'
const AppDownloadSection: React.FC = () => {
  return (
    <section className="bg-white py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Phone Mockup */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <div className="relative">
              <Image
                src="/phone-mockup.png"
                alt="Health app interface on mobile phone"
                className="w-full max-w-md h-auto object-contain transform -rotate-12 lg:-rotate-6"
                width={0}
                height={0}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 text-center lg:text-left max-w-xl">
            <h2 className="text-4xl lg:text-5xl font-bold text-blue-600 mb-6 leading-tight">Launching soon!</h2>

            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Tracking health status made easy with the app. Now available on both Google Play Store and App Store. Book
              health tests and access your smart reports and health trackers anytime anywhere.
            </p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Google Play Store Button */}
              <a
                href="#"
                className="inline-block transition-transform hover:scale-105"
                aria-label="Download on Google Play Store"
              >
                <div className="bg-gray-900 rounded-lg px-6 py-3 flex items-center gap-3 min-w-[180px]">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.61 3 21.09 3 20.5Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M16.81 15.12L6.05 21.34C5.79 21.5 5.50 21.5 5.21 21.4L13.69 12L16.81 15.12Z"
                      fill="#FBBC04"
                    />
                    <path d="M16.81 8.88L13.69 12L5.21 2.6C5.50 2.5 5.79 2.5 6.05 2.66L16.81 8.88Z" fill="#4285F4" />
                    <path
                      d="M16.81 8.88L20.16 10.83C20.78 11.17 20.78 12.83 20.16 13.17L16.81 15.12L13.69 12L16.81 8.88Z"
                      fill="#34A853"
                    />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-gray-300 uppercase tracking-wide">Get it on</div>
                    <div className="text-white font-semibold text-lg leading-tight">Google Play</div>
                  </div>
                </div>
              </a>

              {/* App Store Button */}
              <a
                href="#"
                className="inline-block transition-transform hover:scale-105"
                aria-label="Download on App Store"
              >
                <div className="bg-gray-900 rounded-lg px-6 py-3 flex items-center gap-3 min-w-[180px]">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09 22C7.85 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.19 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-gray-300 uppercase tracking-wide">Download on the</div>
                    <div className="text-white font-semibold text-lg leading-tight">App Store</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppDownloadSection
