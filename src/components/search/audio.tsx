'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/Redux/Store';
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
  name: string;
  image?: string;
  audiobooks: number;
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
          // Group by publisher and count their audiobooks
          const authorsMap = data.data.trendingAudiobook.reduce((acc: { [key: string]: Author }, book: TrendingAudiobook) => {
            if (!acc[book.publisherName]) {
              acc[book.publisherName] = {
                name: book.publisherName,
                audiobooks: 0
              };
            }
            acc[book.publisherName].audiobooks++;
            return acc;
          }, {});
          setTrendingAuthors(Object.values(authorsMap));
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
            src="app.body/404.png" 
            alt="Not Found"
            className="mb-4 w-32 h-32"
          />
          <p className="text-gray-400">Không tìm thấy mất rồi!</p>
          <p className="text-gray-400">Hãy thử với từ khoá khác</p>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Audio trending</h2>
          <div className="space-y-3">
            {trendingAuthors.map((author, index) => (
              <div key={index} className="bg-[#1F222A] p-3 rounded-lg flex items-center gap-3">
                <img 
                  src={author.image || '/default-author.png'} 
                  alt={author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-white">{author.name}</h3>
                  <p className="text-sm text-gray-400">{author.audiobooks} audiobook</p>
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