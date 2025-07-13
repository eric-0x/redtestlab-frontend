"use client";
import React, { useState, useEffect } from 'react';
import { Code, Database, Search, Plus, X, Edit, Trash2, Save, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
// import { MetaTag, MetaTagsFormData } from './types/MetaTags';

export interface MetaTag {
    id?: number;
    filename: string;
    title: string;
    description: string;
    keywords: string;
    charset: string;
    author: string;
    canonicallink: string;
    favicon: string;
    opengraph: string;
    twitter: string;
    schema: string;
    viewport: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface MetaTagsFormData {
    filename: string;
    title: string;
    description: string;
    keywords: string;
    charset: string;
    author: string;
    canonicallink: string;
    favicon: string;
    opengraph: string;
    twitter: string;
    schema: string;
    viewport: string;
  }

const MetaTagsManagement: React.FC = () => {
  // State management
  const [metaTags, setMetaTags] = useState<MetaTag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success',
  });
  const [editingMetaTag, setEditingMetaTag] = useState<MetaTag | null>(null);
  
  // Initialize form data with default values
  const emptyFormData: MetaTagsFormData = {
    filename: '',
    title: '',
    description: '',
    keywords: '',
    charset: 'UTF-8',
    author: '',
    canonicallink: '',
    favicon: '',
    opengraph: '',
    twitter: '',
    schema: '',
    viewport: 'width=device-width, initial-scale=1.0',
  };
  
  const [formData, setFormData] = useState<MetaTagsFormData>(emptyFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof MetaTagsFormData, string>>>({});

  // Fetch meta tags
  const fetchMetaTags = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://redtestlab.com/api/metatags');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setMetaTags(data);
    } catch (error) {
      console.error('Error fetching meta tags:', error);
      showNotification('Failed to load meta tags', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Get admin token from local storage
  const getAdminToken = (): string | null => {
    return localStorage.getItem('adminToken');
  };

  // Initial data fetch
  useEffect(() => {
    fetchMetaTags();
  }, []);

  // Handle input change for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    if (formErrors[name as keyof MetaTagsFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof MetaTagsFormData, string>> = {};
    let isValid = true;

    if (!formData.filename.trim()) {
        errors.filename = 'Filename is required';
        isValid = false;
      }

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const token = getAdminToken();
    if (!token) {
      showNotification('Admin token not found. Please log in.', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      const url = editingMetaTag 
        ? `https://redtestlab.com/api/metatags/${editingMetaTag.id}`
        : 'https://redtestlab.com/api/metatags';
      
      const response = await fetch(url, {
        method: editingMetaTag ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      
      fetchMetaTags();
      setShowAddDialog(false);
      setFormData(emptyFormData);
      setEditingMetaTag(null);
      showNotification(
        editingMetaTag 
          ? `Meta tags for ${formData.filename} updated successfully`
          : `Meta tags for ${formData.filename} added successfully`, 
        'success'
      );
    } catch (error) {
      console.error('Error saving meta tags:', error);
      showNotification(
        `Failed to ${editingMetaTag ? 'update' : 'add'} meta tags: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Edit meta tag
  const handleEdit = (tag: MetaTag) => {
    setEditingMetaTag(tag);
    setFormData({
      filename: tag.filename,
      title: tag.title,
      description: tag.description,
      keywords: tag.keywords,
      charset: tag.charset,
      author: tag.author,
      canonicallink: tag.canonicallink,
      favicon: tag.favicon,
      opengraph: tag.opengraph,
      twitter: tag.twitter,
      schema: tag.schema,
      viewport: tag.viewport,
    });
    setShowAddDialog(true);
  };

  // Delete meta tag
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete these meta tags?')) {
      const token = getAdminToken();
      if (!token) {
        showNotification('Admin token not found. Please log in.', 'error');
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`https://redtestlab.com/api/metatags/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to delete: ${response.status}`);
        }
        
        fetchMetaTags();
        showNotification('Meta tags deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting meta tags:', error);
        showNotification('Failed to delete meta tags', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      show: true,
      message,
      type,
    });
    
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingMetaTag(null);
    setFormData(emptyFormData);
    setFormErrors({});
    setShowAddDialog(true);
  };

  // Filter meta tags based on search term
  const filteredMetaTags = metaTags.filter(tag => {
    const searchFields = [
      tag.filename,
      tag.title,
      tag.description,
      tag.keywords,
      tag.author
    ];
    
    return searchFields.some(field => 
      field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Toggle expanded view
  const toggleExpanded = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-[1400px]">
        {/* Header Section */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Code className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Meta Tags Management
              </h1>
              <p className="mt-1 text-gray-500">
                Manage SEO metadata for your websites
              </p>
            </div>
          </div>

          {/* Action Buttons and Search */}
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
            <div className="w-full sm:w-[50%]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search meta tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
            </div>
            <button 
              onClick={handleAddNew}
              className="w-full sm:w-auto flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Meta Tags
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div 
            className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg max-w-md transition-all duration-500 ease-in-out transform ${
              notification.type === 'success' 
                ? 'bg-green-100 text-green-800 border-l-4 border-green-500' 
                : 'bg-red-100 text-red-800 border-l-4 border-red-500'
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === 'success' ? (
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              )}
              <p>{notification.message}</p>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {isLoading && !filteredMetaTags.length ? (
            <div className="p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p>Loading meta tags...</p>
              </div>
            </div>
          ) : filteredMetaTags.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <Database className="h-8 w-8 text-gray-400" />
                <p>No meta tags found</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMetaTags.map((tag) => (
                <div key={tag.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">{tag.filename}</h3>
                      <p className="text-gray-600">{tag.title}</p>
                      <p className="text-gray-500">{tag.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(tag)}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => tag.id && handleDelete(tag.id)}
                        className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-lg"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => tag.id && toggleExpanded(tag.id)}
                    className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <ChevronDown className={`h-5 w-5 transform transition-transform ${expandedId === tag.id ? 'rotate-180' : ''}`} />
                    {expandedId === tag.id ? 'Show Less' : 'View Details'}
                  </button>

                  {expandedId === tag.id && (
                    <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700">Keywords</h4>
                          <p className="text-gray-600">{tag.keywords || 'None'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Author</h4>
                          <p className="text-gray-600">{tag.author || 'None'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Charset</h4>
                          <p className="text-gray-600">{tag.charset}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Viewport</h4>
                          <p className="text-gray-600">{tag.viewport}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Canonical Link</h4>
                          <p className="text-gray-600">{tag.canonicallink || 'None'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Favicon</h4>
                          <p className="text-gray-600">{tag.favicon || 'None'}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700">Open Graph</h4>
                          <pre className="mt-2 p-3 bg-gray-100 rounded-lg overflow-x-auto">
                            <code>{tag.opengraph || 'None'}</code>
                          </pre>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Twitter Card</h4>
                          <pre className="mt-2 p-3 bg-gray-100 rounded-lg overflow-x-auto">
                            <code>{tag.twitter || 'None'}</code>
                          </pre>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Schema</h4>
                          <pre className="mt-2 p-3 bg-gray-100 rounded-lg overflow-x-auto">
                            <code>{tag.schema || 'None'}</code>
                          </pre>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        <p>Created: {new Date(tag.createdAt || '').toLocaleString()}</p>
                        <p>Last Updated: {new Date(tag.updatedAt || '').toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <Code className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingMetaTag ? 'Edit Meta Tags' : 'Add Meta Tags'}
                  </h2>
                </div>
                <button 
                  onClick={() => {
                    setShowAddDialog(false);
                    setEditingMetaTag(null);
                    setFormErrors({});
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Meta Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filename*
                          </label>
                          <input
                            type="text"
                            name="filename"
                            value={formData.filename}
                            onChange={handleInputChange}
                            placeholder="e.g., about-us.html"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            ${formErrors.filename 
                              ? 'border-red-500 bg-red-50' 
                              : 'border-gray-300 bg-white'}`}
                          />
                          {formErrors.filename && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.filename}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title*
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Page Title"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            ${formErrors.title 
                              ? 'border-red-500 bg-red-50' 
                              : 'border-gray-300 bg-white'}`}
                          />
                          {formErrors.title && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description*
                          </label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Meta description for the page"
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            ${formErrors.description 
                              ? 'border-red-500 bg-red-50' 
                              : 'border-gray-300 bg-white'}`}
                          />
                          {formErrors.description && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Keywords
                          </label>
                          <input
                            type="text"
                            name="keywords"
                            value={formData.keywords}
                            onChange={handleInputChange}
                            placeholder="keyword1, keyword2, keyword3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Author
                          </label>
                          <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            placeholder="Page author"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Advanced Meta Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Advanced Settings</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Charset
                          </label>
                          <input
                            type="text"
                            name="charset"
                            value={formData.charset}
                            onChange={handleInputChange}
                            placeholder="UTF-8"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Canonical Link
                          </label>
                          <input
                            type="text"
                            name="canonicallink"
                            value={formData.canonicallink}
                            onChange={handleInputChange}
                            placeholder="https://example.com/page"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Favicon
                          </label>
                          <input
                            type="text"
                            name="favicon"
                            value={formData.favicon}
                            onChange={handleInputChange}
                            placeholder="https://example.com/favicon.ico"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Viewport
                          </label>
                          <input
                            type="text"
                            name="viewport"
                            value={formData.viewport}
                            onChange={handleInputChange}
                            placeholder="width=device-width, initial-scale=1.0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Social Media and Structured Data */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media & Structured Data</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Open Graph (Facebook/LinkedIn)
                        </label>
                        <textarea
                          name="opengraph"
                          value={formData.opengraph}
                          onChange={handleInputChange}
                          placeholder='<meta property="og:title" content="Page Title" />'
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Twitter Card
                        </label>
                        <textarea
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleInputChange}
                          placeholder='<meta name="twitter:title" content="Page Title" />'
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        JSON-LD Schema
                      </label>
                      <textarea
                        name="schema"
                        value={formData.schema}
                        onChange={handleInputChange}
                        placeholder='{ "@context": "http://schema.org", "@type": "WebPage", "name": "Page Name" }'
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="border-t border-gray-200 p-6 flex flex-col sm:flex-row gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => {
                    setShowAddDialog(false);
                    setEditingMetaTag(null);
                    setFormErrors({});
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>{editingMetaTag ? 'Update Meta Tags' : 'Save Meta Tags'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaTagsManagement;