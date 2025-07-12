import { FileText, Shield, CreditCard, Download, Lock, AlertCircle } from 'lucide-react'

const Terms = () => {
  const termsData = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Use of Service",
      content: "You agree to use the RedTest services (test booking, reports, doctor appointments) for lawful purposes only."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Booking & Payment",
      content: "All bookings must be made in advance. Payments are to be made securely through our authorized gateways."
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Cancellations & Refunds",
      content: "Cancellations must be made at least 24 hours in advance. Refunds will be processed as per our refund policy."
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Digital Reports",
      content: "All test results are made available online. You are responsible for the confidentiality of your login credentials."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Privacy",
      content: "We respect your data. Personal and medical information is handled as per our privacy policy."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Limitation of Liability",
      content: "RedTest Lab is not liable for delays or disruptions caused by external factors like internet or third-party platforms."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Terms & Conditions
            </h1>
            <p className="text-lg xs:text-xl sm:text-2xl text-blue-100 mb-3 sm:mb-4 px-2">
              RedTest Lab
            </p>
            <div className="w-16 sm:w-24 h-1 bg-blue-300 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Introduction */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 mb-8 sm:mb-12">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-2">
              These Terms & Conditions govern your use of the RedTest Lab website and services. 
              By using our platform, you agree to comply with the following:
            </p>
          </div>
        </div>

        {/* Terms List */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 mb-12 sm:mb-16">
          <div className="space-y-6 sm:space-y-8">
            {termsData.map((term, index) => (
              <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 sm:pb-8 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="text-blue-600">
                      {term.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      {index + 1}. {term.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {term.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 text-center text-white">
          <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
            Have Questions?
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            For queries regarding these terms and conditions, please contact us
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 max-w-md mx-auto">
            <p className="text-lg sm:text-xl font-semibold mb-2">
              Email Support
            </p>
            <p className="text-blue-100 break-all sm:break-normal">
              support@redtestlab.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms