import { Users, TrendingUp, Calendar, Home, Clock, CreditCard, Shield, Zap, Building2, Stethoscope, FlaskConical, Smartphone, Mail, Phone, CheckCircle, Star } from 'lucide-react'

const Partner = () => {
  const partnerTypes = [
    {
      icon: <FlaskConical className="w-8 h-8" />,
      title: "Diagnostic Labs & Pathology Centers",
      description: "Expand your reach with our lab test booking platform & real-time report integration.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Doctors & Clinics",
      description: "Enable online appointment bookings and increase patient retention through our trusted platform.",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Hospitals",
      description: "Digitize your test booking system and offer online and home collection options.",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Healthcare Startups & Aggregators",
      description: "Integrate our APIs to offer lab test booking and health report access.",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ]

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Increased Online Visibility",
      description: "Be discoverable under searches like 'RedTest Lab near me', 'RedTest Lab Vaishali', and more."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Online Bookings & Home Collections",
      description: "Enable RedTest Lab online booking and home sample collection to attract busy customers."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Timely Payments & Transparent Processes",
      description: "Get paid on time and access detailed reports of bookings and collections."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast, Reliable Report Delivery",
      description: "Deliver reports within 24–48 hours through our secure RedTest Lab online report portal."
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Marketing & Branding Support",
      description: "Leverage our regional marketing campaigns and digital promotions."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Partner with RedTest Lab
            </h1>
            <p className="text-lg xs:text-xl sm:text-2xl text-blue-100 mb-3 sm:mb-4 px-2">
              Together, Let's Revolutionize Diagnostic Healthcare
            </p>
            <p className="text-base sm:text-lg text-blue-200 px-2">
              Across Bihar & Beyond
            </p>
            <div className="w-16 sm:w-24 h-1 bg-blue-300 mx-auto rounded-full mt-4"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Introduction Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 mb-8 sm:mb-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              Why Partner with RedTest Lab?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-5xl mx-auto leading-relaxed px-2">
              RedTest Lab is one of Bihar's fastest-growing healthcare diagnostic platforms, offering cutting-edge lab testing, 
              online report access, doctor consultations, and home sample collection. We invite clinics, hospitals, doctors, 
              pathology labs, and healthcare professionals to join hands and grow together.
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 md:p-8">
            <p className="text-gray-700 text-center text-base sm:text-lg leading-relaxed">
              Whether you're a small diagnostic center in Vaishali or a hospital in Patna, RedTest Lab empowers your facility 
              with digital tools, visibility, and a broader patient base.
            </p>
          </div>
        </div>

        {/* Partner Types Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight px-2">
              Who Can Partner?
            </h3>
            <div className="w-16 sm:w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {partnerTypes.map((partner, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border border-gray-100 hover:border-blue-200 group"
              >
                <div className={`${partner.bgColor} w-16 sm:w-20 h-16 sm:h-20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={partner.iconColor}>
                    {partner.icon}
                  </div>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  {partner.title}
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight px-2">
              Benefits of Partnering with RedTest Lab
            </h3>
            <div className="w-16 sm:w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
              >
                <div className="bg-blue-600 w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Message */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 text-center text-white mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-6">
            <Users className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
          <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
            Let's Grow Together
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-green-100 max-w-4xl mx-auto leading-relaxed px-2">
            At RedTest Lab, we believe in building strong, lasting partnerships that enhance patient care and diagnostic 
            efficiency across Bihar. With seamless technology and a shared commitment to health, we can scale your 
            operations while delivering real value to patients.
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
            Become a Partner Today
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            Fill out our quick interest form or contact our team directly. Let's simplify healthcare together.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
              <Mail className="w-8 h-8 mx-auto mb-3 text-blue-200" />
              <p className="font-semibold mb-2 text-lg">Email Us</p>
              <p className="text-blue-100 break-all sm:break-normal text-sm sm:text-base">
                partner@redtestlab.com
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
              <Phone className="w-8 h-8 mx-auto mb-3 text-blue-200" />
              <p className="font-semibold mb-2 text-lg">Call Us</p>
              <p className="text-blue-100 text-sm sm:text-base">
                +91-XXXXXXXXXX
              </p>
            </div>
          </div>

          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md mx-auto">
            <button className="w-full xs:w-auto bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300 shadow-lg text-sm sm:text-base">
              Partner Interest Form
            </button>
            <button className="w-full xs:w-auto border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300 text-sm sm:text-base">
              Download Partnership Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Partner