'use client'
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

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

export default function PhatAudiobook() {
  const bookId = useSelector((state: RootState) => state.audiobook.bookId);
  const chapterId = useSelector((state: RootState) => state.audiobook.chapterId);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [audiobook, setAudiobook] = useState<AudioBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showChapterList, setShowChapterList] = useState(false);
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showtimemodal, setShowTimerModal] = useState(false);
  const router = useRouter();
  const [selectedTimer, setSelectedTimer] = useState<string | number>('Không hẹn giờ');
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





  // Remove or comment out the audio element and its related code
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const fetchChapters = async () => {
      if (!bookId) return;
      
      try {
        const response = await fetch(`http://192.168.1.88:8386/nexia-service/v1/common/toc?page=0&size=10&type=1&id=${bookId}`, {
          headers: {
            'userId': '1'
          }
        });
        const data = await response.json();
        
        if (data.code === 200) {
          setChapters(data.data);
          // Set current chapter based on chapterId from Redux
          const selectedChapter = chapterId 
            ? data.data.find((chapter: Chapter) => chapter.id === chapterId)
            : data.data[0];
          
          setCurrentChapter(selectedChapter);
        } else {
          setError(data.message || 'Có lỗi xảy ra khi tải danh sách chapter');
        }
      } catch (err) {
        setError('Không thể kết nối đến server');
      }
    };

    fetchChapters();
  }, [bookId, chapterId]);

  // Update title and duration when current chapter changes
  useEffect(() => {
    if (currentChapter) {
      setCurrentTime(0);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.src = currentChapter.file;
        audioRef.current.load();
      }
    }
  }, [currentChapter]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (currentChapter && prevTime < currentChapter.duration) {
            return prevTime + 1;
          } else {
            clearInterval(interval);
            setIsPlaying(false);
            return prevTime;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentChapter]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // In the JSX, remove the audio element
  return (
    <div className="relative min-h-screen bg-[#181A20] text-white pb-16">
      {/* Remove this:
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      /> */}
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
          <button onClick={() => router.push(`/audiobook/audiobookdetail?id=${bookId}`)} className="text-white">
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
              alt={audiobook?.name || 'Audiobook'}
              fill
              className="object-cover"
            />
          </div>

          {/* Title and Author */}
          <div className="flex gap-4 items-center w-full max-w-md">
            <div className="flex-1">
              <h1 className="text-[#FFFFFF] text-xl font-bold mb-1">
                {currentChapter?.title || audiobook?.name}
              </h1>
              <p className="text-[#E0E0E0] text-sm">{audiobook?.publisherName}</p>
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
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ 
                  width: `${(currentTime / (currentChapter?.duration || 1)) * 100}%` 
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-[#E0E0E0]">
              <span>{new Date(currentTime * 1000).toISOString().substr(14, 5)}</span>
              <span>{new Date((currentChapter?.duration || 0) * 1000).toISOString().substr(14, 5)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex gap-8 justify-center items-center mt-8">
            {/* Nút tập trước */}
            <button onClick={() => audiobook?.id && router.push(`/audiobook-detail?id=${audiobook.id}`)} className="text-white">
       
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
            <button onClick={() => setCurrentTime((prevTime) => Math.min(prevTime + 15, audiobook?.duration || 0))} className="text-white">
              <Image
                src="/app.body/gos15s.png"
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

          {/* Function Buttons */}
          <div className="flex justify-center items-center mt-8 w-full max-w-lg">
            <div className="flex gap-x-14 justify-center items-center w-full max-w-lg">
              <button 
                onClick={() => setShowChapterList(true)} 
                className="flex flex-col gap-2 items-center"
              >
                <Image
                  src="/app.body/mucluc.png"
                  alt="Mục lục"
                  width={20}
                  height={20}
                />
                <span className="text-xs text-[#BDBDBD]">Mục lục</span>
              </button>

              <button 
                onClick={() => setShowSpeedModal(true)} 
                className="flex flex-col gap-2 items-center"
              >
                <Image
                  src="/app.body/tocdo.png"
                  alt="Tốc độ"
                  width={20}
                  height={20}
                />
                <span className="text-xs text-[#BDBDBD]">Tốc độ ({playbackSpeed}x)</span>
              </button>

              <button 
                    onClick={() => setShowTimerModal(true)} 
              className="flex flex-col gap-2 items-center">
                <Image
                  src="/app.body/hengio.png"
                  alt="Hẹn giờ"
                  width={20}
                  height={20}
                />
                <span className="text-xs text-[#BDBDBD]">Hẹn giờ</span>
              </button>

              <button className="flex flex-col gap-2 items-center">
                <Image
                  src="/app.body/taixuong.png"
                  alt="Tải xuống"
                  width={20}
                  height={20}
                />
                <span className="text-xs text-[#BDBDBD]">Tải xuống</span>
              </button>

              <button className="flex flex-col gap-2 items-center">
                <Image
                  src="/app.body/chatluong.png"
                  alt="Chất lượng"
                  width={20}
                  height={20}
                />
                <span className="text-xs text-[#BDBDBD]">Chất lượng</span>
              </button>
            </div>
          </div>
          

          <div className="flex justify-center items-center mt-4 w-full max-w-lg">
            <div className="flex gap-4 items-center">
              <Image
                src="/app.body/phat-audiobook.png"  // Updated image source
                alt={currentChapter?.title || 'Chapter Image'}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <span className="text-lg text-white">{currentChapter?.title}</span>
                <div className="flex items-center text-[#E0E0E0] mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span className="ml-2">{audiobook?.totalFollow || 0} Đánh dấu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Speed Modal */}
      {showSpeedModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300">
          <div 
            className="fixed bottom-0 left-0 right-0 bg-[#35383F] rounded-t-[20px] transition-transform duration-300 transform translate-y-0"
            style={{ maxHeight: '70vh', overflowY: 'auto' }}
          >
            <div className="flex justify-between items-center p-4 border-b border-[#2F3443] pt-6">
              <span className="text-[#E0E0E0] text-sm">Tốc độ phát</span>
              <button onClick={() => setShowSpeedModal(false)} className="text-[#E0E0E0]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-4">
              {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                <div
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className="flex justify-between items-center p-3 cursor-pointer hover:bg-[#2F3443] rounded-lg border-b border-[#2F3443]"
                >
                  <span className="text-sm text-white">{speed}X</span>
                  <Image
                    src={playbackSpeed === speed ? '/app.body/checkbox2.png' : '/app.body/checkbox.png'}
                    alt="Checkbox"
                    width={20}
                    height={20}
                  />
                </div>
              ))}
              <button
                onClick={() => setShowSpeedModal(false)}
                className="w-full mt-4 py-3 bg-[#06C149] text-white rounded-full font-medium"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}


{showtimemodal && (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300">
      <div 
        className="fixed bottom-0 left-0 right-0 bg-[#35383F] rounded-t-[20px] transition-transform duration-300 transform translate-y-0"
        style={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <div className="flex justify-between items-center p-4 border-b border-[#2F3443] pt-6">
          <span className="text-[#E0E0E0] text-sm">Hẹn giờ</span>
          <button onClick={() => setShowTimerModal(false)} className="text-[#E0E0E0]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="p-4">
          {['Không hẹn giờ', 5, 10, 20, 30, 60].map((option, index) => (
            <div
              key={index}
              onClick={() => setSelectedTimer(option)}
              className="flex justify-between items-center p-3 cursor-pointer hover:bg-[#2F3443] rounded-lg border-b border-[#2F3443]"
            >
              <span className="text-sm text-white">{typeof option === 'number' ? `${option} phút` : option}</span>
              <Image
                src={selectedTimer === option ? '/app.body/checkbox2.png' : '/app.body/checkbox.png'}
                alt="Checkbox"
                width={20}
                height={20}
              />
            </div>
          ))}
          <button
            onClick={() => setShowTimerModal(false)}
            className="w-full mt-4 py-3 bg-[#06C149] text-white rounded-full font-medium"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  )}



      {/* Chapter List Modal */}
      {showChapterList && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300">
          <div 
            className="fixed bottom-0 left-0 right-0 bg-[#181A20] rounded-t-[20px] transition-transform duration-300 transform translate-y-0"
            style={{ maxHeight: '70vh' }}
          >
            <div className="flex justify-between items-center p-4 border-b border-[#2F3443] pt-6">
              <span className="text-[#E0E0E0] text-sm">{chapters.length} tập</span>
              <h2 className="text-lg font-semibold text-white">Danh sách tập</h2>
              <button className="text-[#E0E0E0]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(70vh - 60px)' }}>
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  onClick={() => {
                    setCurrentChapter(chapter);
                    setShowChapterList(false);
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#2F3443] ${currentChapter?.id === chapter.id ? 'bg-[#2F3443]' : ''}`}
                >
                  <span className="text-sm text-white">
                    {chapter.number.toString().padStart(2, '0')}. {chapter.title}
                  </span>
                  <div className="flex items-center gap-1 ml-auto text-[#BDBDBD]">
                    <Image
                      src="/app.body/dongho.png"
                      alt="clock"
                      width={12}
                      height={12}
                    />
                    <span className="text-xs">
                      {Math.floor(chapter.duration / 60)}:{Math.floor(chapter.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
