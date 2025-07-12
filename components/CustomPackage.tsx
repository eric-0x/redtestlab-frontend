
   "use client"
   import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import {useRouter} from "next/navigation"
import Image from 'next/image'
    import img from '../public/custompackage.jpeg'

    const PackageCustomiseCard = () => {
        const navigate = useRouter();
    return (
        <div className="max-w-7xl mx-auto relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/40 rounded-3xl border border-gray-100 shadow-2xl">
        <div className="relative flex flex-col lg:flex-row items-center justify-between p-6 sm:p-8 lg:p-12 xl:p-16 gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl z-10 text-center lg:text-left">
            {/* Enhanced Customise Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="tracking-wide">CUSTOMISE</span>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            
            {/* Enhanced Heading with Gradient */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
                Create your Own
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Package
                </span>
            </h2>
            
            {/* Enhanced Description */}
            <div className="mb-8 sm:mb-10">
                <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed mb-4">
                Customise your package based on test you choose and get extra 
                <span className="font-bold text-emerald-600 mx-2 px-2 py-1 bg-emerald-50 rounded-lg">
                    10% OFF
                </span>
                </p>
                
                {/* Feature List */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
                    <span>Flexible Testing</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
                    <span>Instant Savings</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
                    <span>Personalized Care</span>
                </div>
                </div>
            </div>
            
            {/* Enhanced CTA Button with Glow Effect */}
            <div className="relative group"
            onClick={()=> navigate.push('/custom') }>
            
                <button className="relative inline-flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1">
                <span className="tracking-wide">Create Now</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
            </div>
            </div>
            
            {/* Enhanced Right Illustration */}
          
            <div className="relative transform hover:scale-105 transition-transform duration-500">
                {/* Glow Effect */}
             
                {/* Character Container */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl">
                {/* Decorative Elements */}
           
       <Image src={img} alt="" />
                </div>
            </div>
            
            {/* Additional Floating Elements */}
            <div className="absolute -bottom-3 -left-3 lg:-bottom-4 lg:-left-4 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-20 animate-pulse"></div>
            </div>
        </div>
     
    );
    };

    export default PackageCustomiseCard;