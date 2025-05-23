'use client'
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  color: string;
}

export default function CategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Tâm linh', color: 'border-green-500' },
    { id: 2, name: 'Hồi ký và tiểu sử', color: 'border-orange-500' },
    { id: 3, name: 'Kinh tế', color: 'border-yellow-500' },
    { id: 4, name: 'Tài chính, đầu tư', color: 'border-blue-500' },
    { id: 5, name: 'Lịch sử, Văn hoá', color: 'border-purple-500' },
    { id: 6, name: 'Quản lý công ty', color: 'border-blue-500' },
  ]);

  const handleBack = () => {
    router.push('/')
  };

  const handleCategoryClick = (categoryId: number) => {
    // Truyền categoryId qua URL
    router.push(`/audiobook/category-list?categoryId=${categoryId}&name=${encodeURIComponent(categories.find(c => c.id === categoryId)?.name || '')}`);
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

      <div className="grid grid-cols-2 gap-3 p-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center bg-[#1a1a1a] text-white text-sm px-3 py-2 rounded-md border-l-4 ${category.color}`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </main>
  );
}