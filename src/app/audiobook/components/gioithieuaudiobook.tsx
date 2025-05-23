'use client'
import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/Store';
import useSWR from 'swr'

interface BookDetail {
  id: number;
  name: string;
  publisherName: string;
  duration: number; 
  priceOrCoin: number;
  description: string;
  scoreContent: number;
}

interface RatingData {
  ratings: Array<{
    userId: string;
    avatar: string;
    name: string;
    contentId: number;
    content: string;
    type: number;
    rateStar: number;
    rateAt: string;
  }>;
  totalRatings: number;
}

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: { 'userId': '1' }
  });
  const data = await response.json();
  if (data.code === 200) {
    return data.data;
  }
  throw new Error('Không thể kết nối đến server');
};

export default function GioiThieu() {
  const bookId = useSelector((state: RootState) => state.audiobook.bookId);
  
  const { data: bookDetail, error: detailError } = useSWR<BookDetail>(
    bookId ? `http://192.168.1.88:8386/nexia-service/v1/common/detail?type=1&id=${bookId}` : null,
    fetcher
  );

  const { data: ratingData, error: ratingError } = useSWR<RatingData>(
    bookId ? `http://192.168.1.88:8386/nexia-service/v1/common/rating?type=1&id=${bookId}&page=0&size=10` : null,
    fetcher
  );

  const isLoading = !bookDetail && !detailError;
  const error = detailError || ratingError;

  if (isLoading) {
    return <div className="text-center text-gray-400">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Không thể kết nối đến server</div>;
  }

  if (!bookDetail) {
    return <div className="text-center text-gray-400">Không có thông tin sách</div>;
  }

  const renderStars = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    const totalStars = 5;
    
    return (
      <div className="flex gap-1 items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" opacity="0.5"/>
            <path d="M12 2v15.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )}
        {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <span className="text-[#FFFFFF] text-sm w-20">Tác giả</span>
        <span className="text-[#BDBDBD] text-sm">{bookDetail.publisherName}</span>
      </div>
      
      <div className="flex items-center">
        <span className="text-[#FFFFFF] text-sm w-20">Thời lượng</span>
        <span className="text-[#BDBDBD] text-sm">
          {Math.floor(bookDetail.duration / 60)} giờ {Math.floor(bookDetail.duration % 60)} phút {Math.floor((bookDetail.duration % 1) * 60)} giây
        </span>
      </div>
      
      <div className="flex items-center">
        <span className="text-[#FFFFFF] text-sm w-20">Giá bán lẻ</span>
        <span className="text-[#FFD300] text-sm">{bookDetail.priceOrCoin.toLocaleString()} xu</span>
      </div>

      <div className="flex items-start">
        <span className="text-[#FFFFFF] text-sm w-20">Lời tựa</span>
        <span className="text-[#BDBDBD] text-sm flex-1">{bookDetail.description}</span>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#FFFFFF] text-sm">Đánh giá</span>
          <button className="flex items-center gap-1 text-[#FFFFFF] text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Viết đánh giá
          </button>
        </div>
        <div className="flex gap-2 items-center mb-4">
          <span className="text-[#FFFFFF] text-sm font-medium">{bookDetail.scoreContent}/5</span>
          {renderStars(bookDetail.scoreContent)}
          <span className="text-[#BDBDBD] text-sm">{ratingData?.totalRatings || 0} Đánh giá</span>
        </div>

        <div className="space-y-3">
          {ratingData?.ratings.map((rating, index) => (
            <div key={`${rating.userId}-${index}`} className="bg-[#1F222A] p-4 rounded-lg">
              <div className="flex gap-3 items-center mb-2">
                <img 
                  src={rating.avatar} 
                  alt={rating.name} 
                  className="object-cover w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[#FFFFFF] text-sm">{rating.name}</span>
                  </div>
                  <div className="flex gap-1 items-center mt-1">
                    <img 
                      src="/app.body/dongho.png" 
                      alt="clock" 
                      className="w-3 h-3"
                    />
                    <span className="text-[#BDBDBD] text-xs">{rating.rateAt}</span>
                  </div>
                </div>
              </div>
              <div className="text-[#BDBDBD] text-sm relative">
                {rating.content.length > 150 ? (
                  <>
                    <p>{rating.content.slice(0, 150)}...</p>
                    <button className="text-[#00FF85] text-xs mt-1">Xem thêm</button>
                  </>
                ) : (
                  <p>{rating.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}