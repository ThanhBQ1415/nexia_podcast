'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Interface for the structure of a category item from the API
interface ApiCategoryItem {
  id: number;
  title: string;
}

// Interface for the expected API response structure
interface ApiResponse {
  code: number;
  data: ApiCategoryItem[];
  message: string;
}

// Updated local Category interface for frontend use
interface Category {
  id: string; // Keep as string for consistency with existing router.push
  name: string;
  // icon: string; // Removed as not provided by this API
  color: string; // Will be assigned programmatically
}

export default function SearchPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('audiobook');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  // Predefined colors to cycle through for categories
  const predefinedColors = [
    'bg-purple-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-cyan-500',
  ];

  useEffect(() => {
    async function fetchCategories() {
      setLoadingCategories(true);
      setErrorCategories(null);
      try {
        // Fetch categories from the API
        const response = await fetch('http://192.168.1.88:8386/nexia-service/v1/common/list-category?type=1&page=0&size=10');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ApiResponse = await response.json();

        if (result.code === 200 && result.data) {
          const transformedCategories: Category[] = result.data.map((apiCat, index) => ({
            id: String(apiCat.id), // Convert API's number id to string
            name: apiCat.title,    // Map title to name
            color: predefinedColors[index % predefinedColors.length], // Assign color
          }));
          setApiCategories(transformedCategories);
        } else {
          throw new Error(result.message || 'Failed to fetch categories');
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setErrorCategories(error instanceof Error ? error.message : String(error));
        // setApiCategories([]); // Optionally clear categories or set to a default
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleSearch = (keyword: string) => {
    router.push(`/search_book/search-detail?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="min-h-screen bg-[#181A20] text-white p-4">
      {/* Search header */}
      <div className="flex gap-4 items-center mb-6">
        <button onClick={() => router.push('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19.5L7.5 12L15 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
            className="w-full bg-[#1F222A] text-white pl-12 pr-4 py-2 rounded-lg focus:outline-none"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <img 
              src="/app.header/search-icon.png" // Ensure this path is correct in your public folder
              alt="Search"
              className="w-5 h-5 opacity-60"
            />
          </div>
        </div>
      </div>

      {/* Search history */}
      <div className="mb-6">
        <h2 className="mb-3 text-xl font-bold text-white" style={{ fontFamily: 'Inter' }}>
          Lịch sử tìm kiếm
        </h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => router.push(`/search_book/search-detail?keyword=Yêu thích`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Yêu thích</button>
          <button onClick={() => router.push(`/search_book/search-detail?keyword=Podcast`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Podcast</button>
          <button onClick={() => router.push(`/search_book/search-detail?keyword=Hay nhất`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Hay nhất</button>
          <button onClick={() => router.push(`/search_book/search-detail?keyword=Audio`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Audio</button>
          <button onClick={() => router.push(`/search_book/search-detail?keyword=Sách mới nhất`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Sách mới nhất</button>
        </div>
      </div>

      {/* Popular keywords */}
      <div className="mb-6">
        <h2 className="mb-3 text-xl font-bold text-white" style={{ fontFamily: 'Inter' }}>
          Từ khoá phổ biến
        </h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => router.push(`/search_book/search-detail?keyword=Nguyễn Nhật Ánh`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Nguyễn Nhật Ánh</button>
          <button onClick={() => router.push(`/search_book/search-detail?keyword=Triết học`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Triết học</button>
          <button onClick={() => router.push(`/search_book/search-detail?keyword=Thay đổi tư duy`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Thay đổi tư duy</button>
          <button onClick={() => router.push(`/search_book/search-detail?keyword=Cách sống`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Cách sống</button>
          <button onClick={() => router.push(`/search_book/search-detail?keyword=Marketing toàn cầu`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Marketing toàn cầu</button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="flex gap-2 mb-4">
          <button 
            className={`px-2 py-1 text-sm whitespace-nowrap ${activeTab === 'audiobook' ? 'text-[#06C149] border-b-2 border-[#06C149]' : 'text-[#9E9E9E]'}`}
            onClick={() => setActiveTab('audiobook')}
          >
            Audiobook
          </button>
          <button 
            className={`px-2 py-1 text-sm whitespace-nowrap ${activeTab === 'podcast' ? 'text-[#06C149] border-b-2 border-[#06C149]' : 'text-[#9E9E9E]'}`}
            onClick={() => setActiveTab('podcast')}
          >
            Podcast
          </button>
        </div>

        {loadingCategories && <p>Loading categories...</p>}
        {errorCategories && <p className="text-red-500">Error loading categories: {errorCategories}</p>}
        {!loadingCategories && !errorCategories && (
          <div className="grid grid-cols-2 gap-[10px]">
            {apiCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => router.push(`/audiobook/category-list?categoryId=${category.id}&name=${encodeURIComponent(category.name)}`)}
                className="w-[165.5px] h-[40px] bg-[#1F222A] rounded-[4px] hover:opacity-80"
              >
                <div className="flex gap-2 items-center h-full px-[10px] py-[8px]">
                  <div className={`w-[3px] h-6 ${category.color} rounded`}></div>
                  <span className="text-white truncate">{category.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
         {!loadingCategories && !errorCategories && apiCategories.length === 0 && (
            <p>No categories found.</p>
        )}
      </div>
    </div>
  );
}