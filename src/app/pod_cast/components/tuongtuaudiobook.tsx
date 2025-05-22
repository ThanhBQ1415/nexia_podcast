'use client'
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/Store';

interface RelatedBook {
  id: number;
  name: string;
  image: string;
  isHot: number;
  description?: string; // Thêm trường description nếu API trả về
}

const TuongTu = () => {
  const bookId = useSelector((state: RootState) => state.audiobook.bookId);
  const [relatedBooks, setRelatedBooks] = useState<RelatedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedBooks = async () => {
      if (!bookId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://192.168.1.88:8386/nexia-service/v1/common/related?type=0&id=${bookId}&page=0&size=10`, {
          headers: {
            'userId': '1'
          }
        });
        const data = await response.json();
        
        if (data.code === 200) {
          setRelatedBooks(data.data);
        } else {
          setError(data.message || 'Có lỗi xảy ra khi tải danh sách tương tự');
        }
      } catch (err) {
        setError('Không thể kết nối đến server');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedBooks();
  }, [bookId]);

  if (loading) {
    return <div className="text-center text-gray-400">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (relatedBooks.length === 0) {
    return <div className="text-center text-gray-400">Không có sách tương tự</div>;
  }

  return (
    <div className="flex flex-col w-full divide-y divide-gray-700">
      {relatedBooks.map((book) => (
        <div key={book.id} className="flex items-start py-4 w-full transition-colors cursor-pointer hover:bg-gray-800">
          <div className="relative flex-shrink-0 w-24 h-32">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN9S58F0ntsuZu2iiLHHp_AvWbNhdJQ7zp-w&s"
              alt={book.name}
              className="object-cover w-full h-full rounded-lg"
            />
            {book.isHot === 1 && (
              <span className="absolute top-2 right-2 px-2 py-1 text-xs text-white bg-red-500 rounded">
                Hot
              </span>
            )}
          </div>
          <div className="flex-1 ml-4">
            <h3 className="text-[#FFFFFF] text-base font-medium hover:text-green-500 transition-colors">
              {book.name}
            </h3>
            <p className="mt-2 text-sm text-gray-400 line-clamp-2">
              {book.description || 'Không có mô tả cho cuốn sách này.'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TuongTu;