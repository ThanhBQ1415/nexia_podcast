'use client';

import { useRouter} from 'next/navigation';
import { useState } from 'react';
export default function SearchPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('audiobook');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (keyword: string) => {
    router.push(`/search-detail?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="min-h-screen bg-[#181A20] text-white p-4">
      {/* Search header */}
      <div className="flex gap-4 items-center mb-6">
        <button onClick={() => router.back()}>
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
              src="/app.header/search-icon.png"
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
          <button onClick={() => router.push(`/search-detail?keyword=Yêu thích`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Yêu thích</button>
          <button onClick={() => router.push(`/search-detail?keyword=Podcast`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Podcast</button>
          <button onClick={() => router.push(`/search-detail?keyword=Hay nhất`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Hay nhất</button>
          <button onClick={() => router.push(`/search-detail?keyword=Audio`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Audio</button>
          <button onClick={() => router.push(`/search-detail?keyword=Sách mới nhất`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Sách mới nhất</button>
        </div>
      </div>

      {/* Popular keywords */}
      <div className="mb-6">
        <h2 className="mb-3 text-xl font-bold text-white" style={{ fontFamily: 'Inter' }}>
          Từ khoá phổ biến
        </h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => router.push(`/search-detail?keyword=Nguyễn Nhật Ánh`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Nguyễn Nhật Ánh</button>
          <button onClick={() => router.push(`/search-detail?keyword=Triết học`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Triết học</button>
          <button onClick={() => router.push(`/search-detail?keyword=Thay đổi tư duy`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Thay đổi tư duy</button>
          <button onClick={() => router.push(`/search-detail?keyword=Cách sống`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Cách sống</button>
          <button onClick={() => router.push(`/search-detail?keyword=Marketing toàn cầu`)} className="px-2.5 py-1 bg-[#1F222A] text-[#9E9E9E] rounded-full text-ks hover:opacity-80">Marketing toàn cầu</button>
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

        <div className="grid grid-cols-2 gap-[10px]">
          <button className="w-[165.5px] h-[40px] bg-[#1F222A] rounded-[4px] hover:opacity-80">
            <div className="flex gap-2 items-center h-full px-[10px] py-[8px]">
              <div className="w-[3px] h-6 bg-purple-500 rounded"></div>
              <span className="text-white truncate">Tâm linh</span>
            </div>
          </button>
          <button className="w-[165.5px] h-[40px] bg-[#1F222A] rounded-[4px] hover:opacity-80">
            <div className="flex gap-2 items-center h-full px-[10px] py-[8px]">
              <div className="w-[3px] h-6 bg-orange-500 rounded"></div>
              <span className="text-white truncate">Hồi ký và tiểu sử</span>
            </div>
          </button>
          <button className="w-[165.5px] h-[40px] bg-[#1F222A] rounded-[4px] hover:opacity-80">
            <div className="flex gap-2 items-center h-full px-[10px] py-[8px]">
              <div className="w-[3px] h-6 bg-yellow-500 rounded"></div>
              <span className="text-white truncate">Kinh tế</span>
            </div>
          </button>
          <button className="w-[165.5px] h-[40px] bg-[#1F222A] rounded-[4px] hover:opacity-80">
            <div className="flex gap-2 items-center h-full px-[10px] py-[8px]">
              <div className="w-[3px] h-6 bg-blue-500 rounded"></div>
              <span className="text-white truncate">Tài chính, đầu tư</span>
            </div>
          </button>
          <button className="w-[165.5px] h-[40px] bg-[#1F222A] rounded-[4px] hover:opacity-80">
            <div className="flex gap-2 items-center h-full px-[10px] py-[8px]">
              <div className="w-[3px] h-6 bg-red-500 rounded"></div>
              <span className="text-white truncate">Lịch sử, Văn hoá</span>
            </div>
          </button>
          <button className="w-[165.5px] h-[40px] bg-[#1F222A] rounded-[4px] hover:opacity-80">
            <div className="flex gap-2 items-center h-full px-[10px] py-[8px]">
              <div className="w-[3px] h-6 bg-green-500 rounded"></div>
              <span className="text-white truncate">Quản lý công ty</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}