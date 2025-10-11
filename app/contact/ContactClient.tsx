"use client";

import { SetStateAction, useState } from 'react'
import {
  ChevronLeft,
  Phone,
  MessageCircle,
  Mail,
  HelpCircle,
  MessageSquare,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HelpAndSupport() {
  const [activeSection, setActiveSection] = useState('main')
  const navigate = useRouter()

  const handleSectionChange = (section: SetStateAction<string>) => {
    setActiveSection(section)
  }

  const renderMainSection = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={() => console.log('Go back')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" onClick={() => navigate.push('/')} />
          <span className="text-xl font-bold text-gray-800">
            Help & Support
          </span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-blue-50 rounded-xl p-8 shadow-sm">
            <div className="flex items-center">
              <div className="bg-white p-4 rounded-full mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  We're here to help!
                </h2>
              </div>
            </div>
            <p className="text-gray-700 mt-2">
              If you have any queries related to any of our tests or packages,
              you can contact us on the below mentioned phone number or email.
              Our support team is available 24/7 to assist you.
            </p>

            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-2">
                Common Questions
              </h3>
              <ul className="space-y-2">
                <li className="text-blue-600 hover:text-blue-800 cursor-pointer">
                  How do I track my test status?
                </li>
                <li className="text-blue-600 hover:text-blue-800 cursor-pointer">
                  What payment methods do you accept?
                </li>
                <li className="text-blue-600 hover:text-blue-800 cursor-pointer">
                  How long do test results take?
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <div className="text-gray-500">Call</div>
                <div className="font-semibold text-lg">+91-8804789764</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <div className="text-gray-500">Message</div>
                <div className="font-semibold text-lg">Chat On WhatsApp</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <div className="text-gray-500">Email</div>
                <div className="font-semibold text-lg">care@hospital.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-center my-10 text-gray-800">
        For specific questions, get in touch below
      </h2>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div
          onClick={() => handleSectionChange('faq')}
          className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer border border-gray-100 flex flex-col items-center"
        >
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="font-bold text-lg text-gray-800">Check FAQ</h3>
          <p className="text-gray-500 text-center mt-2">
            Find answers to commonly asked questions
          </p>
        </div>

        <div
          onClick={() => handleSectionChange('query')}
          className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer border border-gray-100 flex flex-col items-center"
        >
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="font-bold text-lg text-gray-800">Have a Query?</h3>
          <p className="text-gray-500 text-center mt-2">
            Submit your question for quick assistance
          </p>
        </div>

        <div
          onClick={() => handleSectionChange('contact')}
          className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer border border-gray-100 flex flex-col items-center"
        >
          <div className="bg-yellow-100 p-4 rounded-full mb-4">
            <Users className="w-8 h-8 text-yellow-500" />
          </div>
          <h3 className="font-bold text-lg text-gray-800">Contact Us</h3>
          <p className="text-gray-500 text-center mt-2">
            Reach our team directly for personal support
          </p>
        </div>
      </div>
    </div>
  )

  const renderFAQSection = () => (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={() => handleSectionChange('main')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-xl font-bold text-gray-800">
            Frequently Asked Questions
          </span>
        </button>
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-gray-800">
              How long does it take to receive test results?
            </h3>
            <p className="text-gray-600 mt-2">
              Most test results are available within 24-48 hours after the
              sample reaches our laboratory. Some specialty tests may take
              longer. You can check the status of your test through your online
              account.
            </p>
          </div>
        ))}
      </div>
    </div>
  )

  const renderQuerySection = () => (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={() => handleSectionChange('main')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-xl font-bold text-gray-800">
            Submit a Query
          </span>
        </button>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm">
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="subject">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Query subject"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="message">
              Your Message
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Describe your query in detail"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors w-full"
          >
            Submit Query
          </button>
        </form>
      </div>
    </div>
  )

  const renderContactSection = () => (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={() => handleSectionChange('main')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-xl font-bold text-gray-800">
            Contact Information
          </span>
        </button>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Customer Support
              </h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-blue-600 mr-2" />
                  <span>+91-8804789764</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-blue-600 mr-2" />
                  <span>care@redcliffelabs.com</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Business Hours
              </h3>
              <p className="mt-2 text-gray-600">Monday - Friday: 9 AM - 6 PM</p>
              <p className="text-gray-600">Saturday: 9 AM - 1 PM</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">Head Office</h3>
            <p className="mt-2 text-gray-600">
              Redcliffe Labs Headquarters
              <br />
              123 Healthcare Avenue
              <br />
              Medical District
              <br />
              New Delhi - 110001
              <br />
              India
            </p>

            <div className="mt-6 bg-gray-100 h-48 w-full rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Map View</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Determine which section to render
  const renderContent = () => {
    switch (activeSection) {
      case 'faq':
        return renderFAQSection()
      case 'query':
        return renderQuerySection()
      case 'contact':
        return renderContactSection()
      default:
        return renderMainSection()
    }
  }

  return <div className="min-h-screen bg-gray-50">{renderContent()}</div>
}
