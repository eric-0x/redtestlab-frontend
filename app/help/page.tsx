import { Phone, Mail, MessageCircle, FileText, Calendar, CreditCard, Home, Users, Download, BookOpen } from 'lucide-react'

const HelpSupport = () => {
  const supportTopics = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "How to Book a Test Online",
      description: "Step-by-step guide to booking your lab tests online"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "How to Download Lab Reports",
      description: "Access and download your digital lab reports easily"
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "How to Schedule Home Sample Collection",
      description: "Book convenient home sample collection services"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Booking a Doctor or Hospital Appointment",
      description: "Schedule appointments with healthcare professionals"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Payment & Refund Queries",
      description: "Get help with payment issues and refund requests"
    }
  ]

  const helpServices = [
    {
      icon: <Calendar className="w-5 h-5" />,
      text: "Test and appointment bookings"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      text: "Online report access and downloads"
    },
    {
      icon: <Home className="w-5 h-5" />,
      text: "Home sample collection status"
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      text: "Payment issues or refund queries"
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Doctor/hospital consultation bookings"
    }
  ]

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      value: "+91-XXXXXXXXXX",
      description: "Available 24/7 for urgent queries",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      value: "support@redtestlab.com",
      description: "We'll respond within 24 hours",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      value: "Chat on Website",
      description: "Instant support during business hours",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Help & Support
            </h1>
            <p className="text-lg xs:text-xl sm:text-2xl text-blue-100 mb-3 sm:mb-4 px-2">
              We're Here for You
            </p>
            <div className="w-16 sm:w-24 h-1 bg-blue-300 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 mb-8 sm:mb-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              Welcome to the RedTest Lab Help & Support Center
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-2">
              Whether you're looking for guidance on booking a test, accessing your digital report, 
              or scheduling a home sample collection, we're just a click away.
            </p>
          </div>
        </div>

        {/* Help Services Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-10">
            <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight px-2">
              You can reach out to us for help with:
            </h3>
            <div className="w-16 sm:w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {helpServices.map((service, index) => (
              <div 
                key={index}
                className="flex items-center p-3 sm:p-4 md:p-6 bg-blue-50 rounded-lg sm:rounded-xl hover:bg-blue-100 transition-colors duration-300 border border-blue-100"
              >
                <div className="text-blue-600 mr-3 sm:mr-4 flex-shrink-0">
                  {service.icon}
                </div>
                <span className="text-gray-800 font-medium text-sm sm:text-base leading-snug">
                  {service.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight px-2">
              Need Further Help?
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 px-2">
              Choose your preferred way to get in touch with our support team
            </p>
            <div className="w-16 sm:w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {contactMethods.map((method, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 md:p-8 text-center border border-gray-100 hover:border-blue-200 group cursor-pointer"
              >
                <div className={`${method.bgColor} w-12 sm:w-16 h-12 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={method.iconColor}>
                    {method.icon}
                  </div>
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  {method.title}
                </h4>
                <p className="text-base sm:text-lg font-medium text-blue-600 mb-2 sm:mb-3 break-all sm:break-normal">
                  {method.value}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 text-center text-white">
          <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
            Still Need Help?
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            Our dedicated support team is always ready to assist you with any questions or concerns.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md mx-auto">
            <button className="w-full xs:w-auto bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300 shadow-lg text-sm sm:text-base">
              Contact Support
            </button>
            <button className="w-full xs:w-auto border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300 text-sm sm:text-base">
              Browse FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpSupport