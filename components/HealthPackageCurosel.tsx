"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/components/CartContext"; // Updated import path
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Changed from react-router-dom

// Parameter interface
interface Parameter {
  id: number;
  name: string;
  unit: string;
  referenceRange: string;
  productId: number;
}

// Test Product interface (for tests within packages)
interface TestProduct {
  id: number;
  name: string;
  reportTime: number;
  tags: string;
  actualPrice: number;
  discountedPrice: number;
  categoryId: number;
  productType: string;
  category: Category;
  Parameter: Parameter[];
}

// Package Link interface
interface ProductPackageLink {
  id: number;
  packageId: number;
  testId: number;
  Product_ProductPackageLink_testIdToProduct: TestProduct;
}

// Notification component
interface NotificationProps {
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "success" | "error" | "info";
}

const Notification = ({
  title,
  message,
  isVisible,
  onClose,
  type = "success",
}: NotificationProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "error":
        return "bg-gradient-to-r from-red-500 to-pink-500";
      case "info":
        return "bg-gradient-to-r from-sky-500 to-indigo-500";
      default:
        return "bg-gradient-to-r from-sky-500 to-indigo-500";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50 w-80 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className={`h-1 ${getBgColor()} w-full`} />
          <div className="p-4">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-slate-800">{title}</h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>
            <p className="text-slate-500 text-sm mt-1">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Product interface
interface Product {
  id: number;
  name: string;
  reportTime: string;
  parameters?: string;
  tags: string;
  actualPrice: number;
  discountedPrice: number;
  categoryId: number;
  description?: string;
  category?: Category;
  productType: string;
  ProductPackageLink_ProductPackageLink_packageIdToProduct?: ProductPackageLink[];
}

// Category interface
interface Category {
  id: number;
  name: string;
  products?: Product[];
}

const HealthPackagesCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    title: "",
    message: "",
    type: "success" as "success" | "error" | "info",
  });
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  const [buyingProductId, setBuyingProductId] = useState<number | null>(null);
  const { addToCart, loading: cartLoading } = useCart();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://redtestlab.com/api/product/type/packages");
        if (!response.ok) {
          throw new Error("Failed to fetch packages");
        }
        const data = await response.json();
        
        // Filter for category ID 1 (Top Health Packages)
        const healthPackages = data.filter((product: Product) => product.categoryId === 1);
        
        // Create a mock category structure for compatibility
        const topHealthCategory: Category = {
          id: 1,
          name: "Top Health Packages",
          products: healthPackages
        };
        
        setCategories([topHealthCategory]);
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 340; // Width of a card plus margin
      const newPosition =
        direction === "left"
          ? Math.max(scrollPosition - scrollAmount, 0)
          : Math.min(
              scrollPosition + scrollAmount,
              carouselRef.current.scrollWidth - carouselRef.current.clientWidth
            );
      carouselRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setScrollPosition(newPosition);
    }
  };

  const router = useRouter(); // Changed from useNavigate()

  const handleAddToCart = async (productId: number) => {
    try {
      router.push("/cart"); // Changed from navigate()
      setAddingProductId(productId);
      await addToCart(productId, 1);
      setNotification({
        show: true,
        title: "Added to Cart",
        message: "Product has been added to your cart.",
        type: "success",
      });
    } catch (err) {
      setNotification({
        show: true,
        title: "Error",
        message: "Failed to add product to cart.",
        type: "error",
      });
    } finally {
      setAddingProductId(null);
    }
  };
  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = carouselRef.current
    ? scrollPosition <
      carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 10
    : true;

  // Find category with ID 1 (Top Health Packages)
  const healthPackagesCategory = categories.find(
    (category) => category.id === 1
  );
  const healthPackages = healthPackagesCategory?.products || [];

  // Function to parse parameters string to object
  const parseParameters = (parametersString?: string): any => {
    try {
      return parametersString ? JSON.parse(parametersString) : {};
    } catch (e) {
      return {};
    }
  };

  // Function to parse tags into an array
  const parseTags = (tags: string): string[] => {
    return tags ? tags.split(",") : [];
  };

  if (loading) {
    return (
      <div className="w-full max-w-full mx-auto px-3 md:px-12 py-8 bg-gray-50 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 md:px-[74px] py-8 bg-gray-50">
      <Notification
        title={notification.title}
        message={notification.message}
        isVisible={notification.show}
        onClose={closeNotification}
        type={notification.type}
      />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-3xl font-bold text-blue-700">
          Top Health Packages
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll("left")}
            className={`rounded-full p-2 ${
              canScrollLeft
                ? "bg-blue-100 hover:bg-blue-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            } transition-all duration-300`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft
              size={24}
              className={canScrollLeft ? "text-blue-700" : "text-gray-400"}
            />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`rounded-full p-2 ${
              canScrollRight
                ? "bg-blue-100 hover:bg-blue-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            } transition-all duration-300`}
            disabled={!canScrollRight}
          >
            <ChevronRight
              size={24}
              className={canScrollRight ? "text-blue-700" : "text-gray-400"}
            />
          </button>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div
          ref={carouselRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {healthPackages.length > 0 ? (
            healthPackages.map((product) => {
              const tags = parseTags(product.tags);
              const discountPercentage = Math.round(
                ((product.actualPrice - product.discountedPrice) /
                  product.actualPrice) *
                  100
              );
              return (
                <div
                  key={product.id}
                  className="min-w-[320px] max-w-[320px] bg-white rounded-lg shadow-md border border-blue-100 flex flex-col transition-transform duration-300 hover:shadow-lg transform hover:-translate-y-1"
                >
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-blue-50">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-blue-800 pr-8">
                          {product.name}
                        </h3>
                        <span className="bg-blue-50 px-2 py-1 rounded-full text-xs text-blue-700">
                          Top Health
                        </span>
                      </div>
                      <div className="mt-3 flex text-sm text-gray-600 space-x-4">
                        <div>
                          Reports in{" "}
                          <span className="font-semibold text-blue-700">
                            {product.reportTime} hours
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex-1 overflow-y-auto">
                      {/* Display Tests in Package */}
                      {product.ProductPackageLink_ProductPackageLink_packageIdToProduct && 
                       product.ProductPackageLink_ProductPackageLink_packageIdToProduct.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Tests Included:</h4>
                          <div className="space-y-2">
                            {product.ProductPackageLink_ProductPackageLink_packageIdToProduct.slice(0, 2).map((link) => (
                              <div key={link.id} className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                                <div className="font-medium text-blue-800 text-sm">
                                  {link.Product_ProductPackageLink_testIdToProduct.name}
                                </div>
                                {link.Product_ProductPackageLink_testIdToProduct.Parameter && 
                                 link.Product_ProductPackageLink_testIdToProduct.Parameter.length > 0 && (
                                  <div className="mt-1">
                                    <div className="flex flex-wrap gap-1">
                                      {link.Product_ProductPackageLink_testIdToProduct.Parameter.slice(0, 3).map((param) => (
                                        <span key={param.id} className="bg-white px-2 py-0.5 rounded text-xs text-gray-700 border">
                                          {param.name}
                                        </span>
                                      ))}
                                      {link.Product_ProductPackageLink_testIdToProduct.Parameter.length > 3 && (
                                        <span className="bg-gray-50 px-2 py-0.5 rounded text-xs text-gray-600">
                                          +{link.Product_ProductPackageLink_testIdToProduct.Parameter.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                            {product.ProductPackageLink_ProductPackageLink_packageIdToProduct.length > 2 && (
                              <div className="text-xs text-gray-600 text-center">
                                +{product.ProductPackageLink_ProductPackageLink_packageIdToProduct.length - 2} more tests
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 px-3 py-1 rounded-full text-xs text-blue-700"
                            >
                              {tag}
                            </span>
                          ))}
                          {tags.length > 3 && (
                            <span className="bg-gray-50 px-3 py-1 rounded-full text-xs text-gray-600">
                              +{tags.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          Complete health package with comprehensive testing
                        </div>
                      )}
                      
                      {product.description && (
                        <div className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</div>
                      )}
                    </div>
                    <div className="p-4 mt-auto border-t border-blue-50 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline">
                          <span className="text-xl font-bold text-blue-800">
                            ₹{product.discountedPrice}
                          </span>
                          <span className="ml-2 text-sm line-through text-gray-500">
                            ₹{product.actualPrice}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="text-green-600 font-semibold">
                            {discountPercentage}% off
                          </span>{" "}
                          Hurry!
                        </div>
                      </div>

                      <button
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-300 font-medium flex items-center justify-center"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingProductId === product.id || cartLoading}
                      >
                        {addingProductId === product.id ? (
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          "Book Now"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full text-center py-8 text-gray-500">
              No health packages found in category
            </div>
          )}
        </div>
        {/* Gradient fade effects on sides for smooth scroll indication */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        ></div>
        <div
          className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none ${
            canScrollRight ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        ></div>
      </div>
      {/* Scroll progress indicator */}
      <div className="mt-4 h-1 bg-blue-100 rounded-full w-full">
        <div
          className="h-1 bg-blue-600 rounded-full transition-all duration-300"
          style={{
            width: carouselRef.current
              ? `${
                  (scrollPosition /
                    (carouselRef.current.scrollWidth -
                      carouselRef.current.clientWidth)) *
                  100
                }%`
              : "0%",
          }}
        ></div>
      </div>
    </div>
  );
};

export default HealthPackagesCarousel;
