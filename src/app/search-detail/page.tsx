'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setKeyword } from '../Redux/Features/searchSlice';
import { RootState } from  '../Redux/Store';
import Audio from '../../components/search/audio';
import TacGia from '../../components/search/tacgia';
interface SearchResult {
  id: string;
  contentId: number;
  image: string;
  name: string;
  description: string;
  publisher: string;
  score: number;
  typeEarn: number;
}

interface Audiobook {
  id: number;
  name: string;
  image: string;
  publisherName: string;
  totalListen: number;
  scoreContent: number;
}

export default function SearchDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const searchTerm = useSelector((state: RootState) => state.search.keyword);
  const [activeTab, setActiveTab] = useState('audio');
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);

  useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword) {
      dispatch(setKeyword(keyword));
      fetchAudiobooks(keyword);
    }
  }, [searchParams, dispatch]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchAudiobooks(searchTerm);
    }
  };

  const fetchAudiobooks = async (keyword: string) => {
    try {
      const response = await fetch(
        `http://192.168.1.88:8386/nexia-service/v1/common/search/audiobook?page=0&size=10&qrTxt=${keyword}`,
        {
          headers: {
            'userId': '1'
          }
        }
      );
      const data = await response.json();
      if (data.code === 200) {
        // Check if we have search results
        if (data.data.searchResult && data.data.searchResult.length > 0) {
          const formattedResults = data.data.searchResult.map((item: SearchResult) => ({
            id: item.contentId,
            name: item.name,
            image: item.image,
            publisherName: item.publisher,
            totalListen: 0, // Not available in search results
            scoreContent: item.score
          }));
          setAudiobooks(formattedResults);
        } else {
          // Use trending audiobooks if no search results
          setAudiobooks(data.data.trendingAudiobook || []);
        }
      }
    } catch (error) {
      console.error('Error fetching audiobooks:', error);
      setAudiobooks([]);
    }
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
            value={searchTerm}
            onChange={(e) => dispatch(setKeyword(e.target.value))}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Tìm kiếm..."
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

      {/* Filter tabs */}
      <div className="flex gap-[10px] mb-6">
        <button 
          className={`w-[106.33px] h-[32px] rounded-full px-[12px] py-[10px] flex items-center justify-center
            ${activeTab === 'audio' 
              ? 'bg-white text-[#212121]' 
              : 'bg-[#1F222A] text-[#9E9E9E]'}`}
          onClick={() => setActiveTab('audio')}
        >
          Audio
        </button>
        <button 
          className={`w-[106.33px] h-[32px] rounded-full px-[12px] py-[10px] flex items-center justify-center
            ${activeTab === 'author' 
              ? 'bg-white text-[#212121]' 
              : 'bg-[#1F222A] text-[#9E9E9E]'}`}
          onClick={() => setActiveTab('author')}
        >
          Tác giả
        </button>
        <button 
          className={`w-[106.33px] h-[32px] rounded-full px-[12px] py-[10px] flex items-center justify-center
            ${activeTab === 'podcast' 
              ? 'bg-white text-[#212121]' 
              : 'bg-[#1F222A] text-[#9E9E9E]'}`}
          onClick={() => setActiveTab('podcast')}
        >
          Podcast
        </button>
      </div>

      <div className="py-4 space-y-4">
          {activeTab === 'audio' && <div><Audio /></div>}
          {activeTab === 'author' && <div><TacGia /></div>}
          {activeTab === 'podcast' && <div><Audio /></div>}
        </div>

    </div>
  );
}