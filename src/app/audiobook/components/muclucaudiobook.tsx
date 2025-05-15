'use client'
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { RootState } from '../../../Redux/Store';
import { setChapterId } from '../../../Redux/Features/audiobookSlice';

interface Chapter {
  id: number;
  idAudiobook: number;
  title: string;
  image: string;
  description: string;
  file: string;
  number: number;
  duration: number;
  totalListen: number;
  totalLike: number;
  totalDownload: number;
  status: number;
}

const MucLuc = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const bookId = useSelector((state: RootState) => state.audiobook.bookId);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!bookId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://192.168.1.88:8386/nexia-service/v1/common/toc?page=0&size=10&type=1&id=${bookId}`, {
          headers: {
            'userId': '1'
          }
        });
        const data = await response.json();
        
        if (data.code === 200) {
          setChapters(data.data);
        } else {
          setError(data.message || 'Có lỗi xảy ra khi tải mục lục');
        }
      } catch (err) {
        setError('Không thể kết nối đến server');
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [bookId]);

  if (loading) {
    return <div className="text-center text-gray-400">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (chapters.length === 0) {
    return <div className="text-center text-gray-400">Không có chương nào</div>;
  }

  const handleChapterClick = (chapterId: number) => {
    dispatch(setChapterId(chapterId));
    router.push('/audiobook/phat-audiobook');
  };

  return (
    <div className="space-y-2 divide-y divide-[#2F3443]">
      {chapters.map((chapter) => (
        <div 
          key={chapter.id} 
          className="flex items-center gap-3 text-[#BDBDBD] py-2 cursor-pointer hover:bg-[#2F3443]"
          onClick={() => handleChapterClick(chapter.id)}
        >
          <span className="flex-1 text-sm">
            {chapter.number.toString().padStart(2, '0')}. {chapter.title}
          </span>
          <div className="flex items-center gap-1 min-w-[80px] justify-end">
            <img 
              src="/app.body/dongho.png" 
              alt="clock" 
              className="w-3 h-3"
            />
            <span className="text-xs">
              {Math.floor(chapter.duration / 60)}:{Math.floor(chapter.duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <button className="p-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default MucLuc;