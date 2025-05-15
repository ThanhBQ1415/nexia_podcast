'use client'
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/Store';

interface SearchResult {
  id: string;
  contentId: number;
  image: string;
  name: string;
  birthday: string;
}

interface TrendingPublisher {
  id: number;
  name: string;
  image: string;
  audiobookCount: number;
  podcastCount: number;
}

interface ApiResponse {
  code: number;
  data: {
    searchResult?: SearchResult[];
    trendingPublisher?: TrendingPublisher[];
  };
  message: string;
}

const TacGia = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [trendingPublishers, setTrendingPublishers] = useState<TrendingPublisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const keyword = useSelector((state: RootState) => state.search.keyword);

  useEffect(() => {
    if (!keyword) return;
    
    const fetchAuthors = async () => {
      try {
        console.log(keyword);
        setLoading(true);
        const response = await fetch(`http://192.168.1.88:8386/nexia-service/v1/common/search/publisher?page=0&size=10&qrTxt=${keyword}`, {
          headers: {
            'userId': '1'
          }
        });
        const data: ApiResponse = await response.json();
        
        if (data.code === 200) {
          setSearchResults(data.data.searchResult || []);
          setTrendingPublishers(data.data.trendingPublisher || []);
        } else {
          setError(data.message || 'Có lỗi xảy ra khi tải danh sách tác giả');
        }
      } catch (err) {
        setError('Không thể kết nối đến server');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, [keyword]);

  if (loading) {
    return <div className="text-center text-gray-400">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (searchResults.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-center items-center py-8 space-y-1">
          <img src="/app.body/404.png" alt="404"  className="mb-4 w-32 h-32" />
          <p className="text-gray-400">Không tìm thấy mất rồi!</p>
          <p className="text-gray-400">Hãy thử với từ khoá khác</p>
        </div>
        
        {trendingPublishers.length > 0 && (
          <div>
            <h2 className="flex justify-between items-center mb-4 text-xl font-semibold text-white">
              Tác giả trending
              <span className="text-gray-400 cursor-pointer">&gt;</span>
            </h2>
            <div className="space-y-4">
              {trendingPublishers.map((publisher, index) => (
                <div key={publisher.id} className="flex items-center space-x-4 bg-[#1F222A] p-4 rounded-lg hover:bg-[#252832] cursor-pointer">
                  <div className="relative">
                    {index < 3 && (
                      <img
                        src={`/app.body/rank${index + 1}.png`}
                        alt={`Rank ${index + 1}`}
                        className="absolute -top-2 -left-2 z-10 w-6 h-6"
                      />
                    )}
                    <img 
                      src={publisher.image || '/default-author.png'}
                      alt={publisher.name}
                      className="object-cover w-12 h-12 rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{publisher.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{publisher.audiobookCount} audiobook</span>
                      {publisher.podcastCount > 0 && (
                        <>
                          <span>•</span>
                          <span>{publisher.podcastCount} podcast</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[343px]">
      {searchResults.map((author) => (
        <div key={author.id} className="flex gap-[12px] items-center w-[343px] h-[80px] py-[16px] border-b border-gray-700">
          <img 
            src={author.image || '/default-author.png'} 
            alt={author.name}
            className="object-cover w-12 h-12 rounded-full"
          />
          <div className="flex flex-col">
            <h3 className="text-base font-medium text-white">{author.name}</h3>
            <div className="flex gap-1 items-center">
              <img src="/app.body/dongho.png" alt="clock" className="w-5 h-5" />
              <span className="text-sm text-gray-400">{author.birthday}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TacGia;