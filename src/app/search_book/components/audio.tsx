'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/Store';
import { useRouter } from 'next/navigation';


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

interface TrendingAudiobook {
  id: number;
  name: string;
  image: string;
  publisherName: string;
  totalListen: number;
  scoreContent: number;
}

interface Author {
    id: number;
    name: string;
    image: string;
    publisherName: string;
    totalListen: number;
    scoreContent: number;
}

export default function Audio() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [trendingAuthors, setTrendingAuthors] = useState<Author[]>([]);
  const keyword = useSelector((state: RootState) => state.search.keyword);
  const router = useRouter();

  useEffect(() => {
    if (keyword) {
      fetchAudiobooks();
    }
  }, [keyword]);

  const fetchAudiobooks = async () => {
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
        if (data.data.searchResult && data.data.searchResult.length > 0) {
          setSearchResults(data.data.searchResult);
          setTrendingAuthors([]);
        } else if (data.data.trendingAudiobook && data.data.trendingAudiobook.length > 0) {
          setSearchResults([]);
          // Map trending audiobooks directly
          const trendingBooks = data.data.trendingAudiobook.map((book: TrendingAudiobook) => ({
            id: book.id,
            name: book.name,
            image: book.image,
            publisherName: book.publisherName,
            totalListen: book.totalListen,
            scoreContent: book.scoreContent
          }));
          setTrendingAuthors(trendingBooks);
        }
      }
    } catch (error) {
      console.error('Error fetching audiobooks:', error);
      setSearchResults([]);
      setTrendingAuthors([]);
    }
  };

  const handleBookClick = (bookId: number) => {
    router.push(`audiobookdetail?id=${bookId}`);
  };

  if (searchResults.length > 0) {
    return (
      <div className="flex flex-col w-[375px]">
        {searchResults.map((book) => (
          <div 
            key={book.id} 
            className="flex gap-[10px] p-4 border-b border-gray-700 min-h-[126px] cursor-pointer hover:bg-[#252832]"
            onClick={() => handleBookClick(book.contentId)}
          >
            <img 
              src="/app.body/sach3.png" 
              alt={book.name}
              className="w-[94px] h-[94px] rounded-[6px] object-cover flex-shrink-0"
            />
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-white">
                {book.name}
              </h3>
              <div className="flex gap-2 items-center">
                <img 
                  src="/app.body/tacgia.png" 
                  alt="Author"
                  className="w-6 h-6"
                />
                <span className="text-sm text-gray-400">{book.publisher}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-yellow-400">⭐ {book.score.toFixed(1)}</span>
              </div>
              <p className="text-sm text-gray-400">
                {book.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (trendingAuthors.length > 0) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/app.body/404.png" 
            alt="Not Found"
            className="mb-4 w-32 h-32"
          />
          <p className="text-gray-400">Không tìm thấy mất rồi!</p>
          <p className="text-gray-400">Hãy thử với từ khoá khác</p>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Audio trending</h2>
          <div className="space-y-3">
            {trendingAuthors.map((book, index) => (
              <div 
                key={index} 
                className="bg-[#1F222A] p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-[#252832]"
                onClick={() => handleBookClick(book.id)}
              >
                <div className="relative">
                  {index < 3 && (
                    <img 
                      src={`/app.body/rank${index + 1}.png`}
                      alt={`Rank ${index + 1}`}
                      className="absolute -top-3 -left-3 z-10 w-8 h-8"
                    />
                  )}
                  <img 
                    src={book.image || '/default-author.png'} 
                    alt={book.name}
                    className="w-[94px] h-[94px] rounded-[6px] object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-medium text-white">{book.name}</h3>
                  <div className="flex gap-2 items-center mb-1">
                    <img 
                      src="/app.body/tacgia.png" 
                      alt="Author"
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-400">{book.publisherName}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-yellow-400">⭐ {book.scoreContent.toFixed(1)}</span>
                    <span className="text-sm text-gray-400">({book.totalListen} lượt nghe)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 text-center text-gray-400">
      No results found
    </div>
  );
}