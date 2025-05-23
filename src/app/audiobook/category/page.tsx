'use client'
import { useState, useEffect } from 'react'; // Import useEffect
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  title: string; // Changed from 'name' to 'title' to match API
}

export default function CategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]); // Initialize as empty array

  // Define border colors to cycle through
  const borderColors = [
    'border-green-500',
    'border-orange-500',
    'border-yellow-500',
    'border-blue-500',
    'border-purple-500',
    'border-gray-500',
  ];


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://192.168.1.88:8386/nexia-service/v1/common/list-category?type=1&page=0&size=10');
        const data = await response.json();
        if (data.code === 200) {
          setCategories(data.data); // Set categories state with fetched data
        } else {
          console.error('Error fetching categories:', data.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this runs once on mount


  const handleBack = () => {
    router.push('/')
  };

  const handleCategoryClick = (category: Category) => { // Pass the category object
    // Truyền categoryId và title qua URL
    router.push(`/audiobook/category-list?categoryId=${category.id}&name=${encodeURIComponent(category.title)}`);
  };

  return (
    <main className="w-screen min-h-screen bg-[#1a1a1a] text-white">
      <div className="flex items-center justify-between p-4 bg-[#0f0f0f]">
        <button onClick={handleBack} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-medium">Thể loại</h1>
        <button className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 rounded-category">
        {categories.map((category, index) => ( // Map over fetched categories
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)} // Pass the category object
            className={`flex items-center bg-[#1a1a1a] rounded-category text-white text-sm px-3 py-2 rounded-md border-l-4 ${borderColors[index % borderColors.length]}`} // Use index for color cycling
          >
            {category.title} {/* Use category.title */}
          </button>
        ))}
      </div>
    </main>
  );
}