'use client'
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface AudioBook {
  id: number;
  name: string;
  image: string;
  description: string;
  publisher: number;
  publisherName: string;
  publisherDate: string;
  reader: number;
  readerName: string;
  typeEarn: number;
  typeEarnName: string;
  numberFreeChap: number;
  priceOrCoin: number;
  totalListen: number;
  totalLike: number;
  totalFollow: number;
  totalDownload: number;
  totalShare: number;
  isHot: number;
  scoreVoice: number;
  scoreContent: number;
  duration: number;
  demoLink: string;
  isLike: number;
  isMarked: number;
}

export default function PhatAudiobook() {
  const bookId = useSelector((state: RootState) => state.audiobook.bookId);
  const [audiobook, setAudiobook] = useState<AudioBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const fetchAudiobookDetail = async () => {
      if (!bookId) {
        setError('Không tìm thấy ID sách');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://192.168.1.88:8386/nexia-service/v1/common/detail?type=1&id=${bookId}`, {
          headers: {
            'userId': '1'
          }
        });
        const data = await response.json();

        if (data.code === 200) {
          setAudiobook(data.data);
        } else {
          setError(data.message || 'Có lỗi xảy ra khi tải thông tin sách');
        }
      } catch (err) {
        setError('Không thể kết nối đến server');
      } finally {
        setLoading(false);
      }
    };

    fetchAudiobookDetail();
  }, [bookId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
            if (audiobook && prevTime < audiobook.duration) {
            return prevTime + 1;
          } else {
            clearInterval(interval);
            return prevTime;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, audiobook]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-white bg-black">Đang tải...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-white bg-black">{error}</div>;
  }

  if (!audiobook) {
    return <div className="flex justify-center items-center min-h-screen text-white bg-black">Không tìm thấy thông tin sách</div>;
  }

  return (
    <div className="relative min-h-screen bg-[#181A20] text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/app.body/phat-audiobook.png"
          alt="Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <button onClick={() => useRouter().back()} className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center px-4 pt-8">
          {/* Album Art */}
          <div className="overflow-hidden relative mb-6 w-40 h-40 rounded-lg">
            <Image
              src="/app.body/phat-audiobook.png"
              alt={audiobook.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Title and Author */}
          <div className="flex gap-4 items-center w-full max-w-md">
            <div className="flex-1">
              <h1 className="text-[#FFFFFF] text-xl font-bold mb-1">{audiobook.name}</h1>
              <p className="text-[#E0E0E0] text-sm">{audiobook.publisherName}</p>
            </div>
            <button className="p-2">
              <Image
                src="/app.body/share.png"
                alt="Share"
                width={24}
                height={24}
              />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 w-full max-w-lg">
            <div className="h-1 bg-gray-600 rounded-full">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(currentTime / audiobook.duration) * 100}%` }}></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-[#E0E0E0]">
              <span>{new Date(currentTime * 1000).toISOString().substr(14, 5)}</span>
              <span>{new Date(audiobook.duration * 1000).toISOString().substr(14, 5)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex gap-8 justify-center items-center mt-8">
            {/* Nút tập trước */}
            <button className="text-white">
              <Image
                src="/app.body/taptruoc1.png"
                alt="Tập trước"
                width={26}
                height={26}
              />
            </button>

            {/* Nút tua 15 giây về trước */}
            <button onClick={() => setCurrentTime((prevTime) => Math.max(prevTime - 15, 0))} className="text-white">
              <Image
                src="/app.body/back15s.png"
                alt="Tua 15 giây về trước"
                width={26}
                height={26}
              />
            </button>

            {/* Nút dừng/phát */}
            <button onClick={handlePlayPause} className="flex justify-center items-center w-16 h-16 bg-green-500 rounded-full">
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </button>

            {/* Nút tua 15 giây về sau */}
            <button onClick={() => setCurrentTime((prevTime) => Math.min(prevTime + 15, audiobook.duration))} className="text-white">
              <Image
                src="/app.body/go15s.png"
                alt="Tua 15 giây về sau"
                width={26}
                height={26}
              />
            </button>

            {/* Nút tập sau */}
            <button className="text-white">
              <Image
                src="/app.body/tapsau.png"
                alt="Tập sau"
                width={26}
                height={26}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}