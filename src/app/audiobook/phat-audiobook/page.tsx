'use client'
  import { useSelector } from 'react-redux';
  import { RootState } from '../../../Redux/Store';
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
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false); // Thêm state cho dialog feedback
    const [feedbackInputText, setFeedbackInputText] = useState('');
    const [starRating, setStarRating] = useState(4);
    const [reviewComment, setReviewComment] = useState('');

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
    





  // Component phụ trợ cho Icon Sao
  const StarIcon = ({ filled, onClick }: { filled: boolean; onClick: () => void }) => (
    <button type="button" onClick={onClick} className="focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 21 20" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.94341 17.4783L5.61528 19.8562C5.03065 20.1774 4.30756 19.9425 4.0002 19.3316C3.87781 19.0883 3.83558 18.8096 3.88004 18.5387L4.70664 13.5023C4.77318 13.0969 4.64455 12.6833 4.36269 12.3961L0.861159 8.82936C0.388187 8.34758 0.378509 7.55634 0.839542 7.06208C1.02313 6.86526 1.26368 6.73717 1.52396 6.69765L6.36296 5.96285C6.75249 5.9037 7.08922 5.64804 7.26342 5.27918L9.42749 0.69694C9.7198 0.0779898 10.4369 -0.176136 11.0292 0.129334C11.2651 0.250974 11.456 0.450471 11.5724 0.69694L13.7364 5.27918C13.9106 5.64804 14.2474 5.9037 14.6369 5.96285L19.4759 6.69765C20.1295 6.7969 20.5824 7.43109 20.4874 8.11414C20.4496 8.38613 20.327 8.63751 20.1387 8.82936L16.6372 12.3961C16.3553 12.6833 16.2267 13.0969 16.2932 13.5023L17.1198 18.5387C17.2315 19.219 16.7942 19.8651 16.1433 19.9818C15.884 20.0282 15.6174 19.9841 15.3846 19.8562L11.0564 17.4783C10.708 17.2869 10.2918 17.2869 9.94341 17.4783Z"
          fill={filled ? "#FFD300" : "#6B7280"} // Màu xám cho sao chưa chọn
        />
      </svg>
    </button>
  );

  const handleSendIconClick = () => {
    if (feedbackInputText.trim() !== '') { // Chỉ hiển thị dialog nếu có nội dung
      setShowFeedbackDialog(true);
    }
  };

  const handleCloseFeedbackDialog = () => {
    setShowFeedbackDialog(false);
    setReviewComment(''); // Reset textarea trong dialog
    setStarRating(4);     // Reset đánh giá sao về mặc định
  };

  const handleSubmitReview = async () => { // Make the function async
    if (reviewComment.trim() === '') {
      // Optionally show an error if comment is empty, although the send icon is hidden
      console.log('Comment is empty');
      return;
    }

    const accessToken = localStorage.getItem('accessToken'); // Get token from localStorage
    const contentId = bookId; // Use bookId as contentId
    const userName = 'hung'; // Hardcoded as per image, consider making this dynamic if needed
    const type = 1; // Hardcoded as per image

    const apiUrl = `http://192.168.1.88:8386/nexia-service/v1/secure/rate?type=${type}&userName=${userName}&contentId=${contentId}&rateStar=${starRating}&content=${encodeURIComponent(reviewComment)}`;

    const headers: HeadersInit = {
      'userId': '1', // As per existing code and image
      'Client-Type': 'Web', // As per image
      'Revision': '1', // As per image
      'Content-Type': 'application/json' // Standard header for POST requests, even with query params
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        // No body needed as per the image showing params in query
      });

      const data = await response.json();

      if (data.code === 200) {
        console.log('Đánh giá đã được gửi thành công:', data);
        // TODO: Cập nhật UI hoặc state nếu cần sau khi gửi thành công (ví dụ: hiển thị thông báo)
      } else {
        console.error('Lỗi khi gửi đánh giá:', data.message);
        // TODO: Xử lý lỗi, hiển thị thông báo lỗi cho người dùng
        setError(data.message || 'Có lỗi xảy ra khi gửi đánh giá');
      }
    } catch (err) {
      console.error('Lỗi kết nối khi gửi đánh giá:', err);
      // TODO: Xử lý lỗi kết nối
      setError('Không thể kết nối đến server để gửi đánh giá');
    } finally {
      // Always close dialog and reset state regardless of success or failure
      setShowFeedbackDialog(false);
      setFeedbackInputText(''); // Xóa nội dung ở thanh input dưới cùng
      setReviewComment('');     // Xóa nội dung textarea trong dialog
      setStarRating(4);         // Reset đánh giá sao
    }
  };



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
            <button onClick={() => router.push('/')} className="text-white">
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
              <div className="flex gap-x-6 justify-center items-center w-full max-w-lg">
                <button 
                  onClick={() => setShowChapterList(true)} 
                  className="flex flex-col gap-2 items-center"
                >
                  <Image
                    src="/app.body/mucluc.png"
                    alt="Mục lục"
                    width={18}
                    height={18}
                  />
                  <span className="text-xs text-[#BDBDBD] whitespace-nowrap">Mục lục</span>
                </button>

                <button 
                  onClick={() => setShowSpeedModal(true)} 
                  className="flex flex-col gap-2 items-center"
                >
                  <Image
                    src="/app.body/tocdo.png"
                    alt="Tốc độ"
                    width={18}
                    height={18}
                  />
                  <span className="text-xs text-[#BDBDBD] whitespace-nowrap">Tốc độ ({playbackSpeed}x)</span>
                </button>

                <button 
                      onClick={() => setShowTimerModal(true)} 
                className="flex flex-col gap-2 items-center">
                  <Image
                    src="/app.body/hengio.png"
                    alt="Hẹn giờ"
                    width={18}
                    height={18}
                  />
                  <span className="text-xs text-[#BDBDBD] whitespace-nowrap">Hẹn giờ</span>
                </button>

                <button className="flex flex-col gap-2 items-center">
                  <Image
                    src="/app.body/taixuong.png"
                    alt="Tải xuống"
                    width={18}
                    height={18}
                  />
                  <span className="text-xs text-[#BDBDBD] whitespace-nowrap">Tải xuống</span>
                </button>

                <button className="flex flex-col gap-2 items-center">
                  <Image
                    src="/app.body/chatluong.png"
                    alt="Chất lượng"
                    width={18}
                    height={18}
                  />
                  <span className="text-xs text-[#BDBDBD] whitespace-nowrap">Chất lượng</span>
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

     {/* New Feedback Section */}
     <div className="flex fixed right-0 bottom-0 left-0 z-20 gap-4 items-center p-4 w-full backdrop-blur-sm bg-white/10">
        <div className="overflow-hidden flex-shrink-0 w-8 h-8 rounded-full">
          <Image src="/app.body/phat-audiobook.png" alt="User Avatar" width={32} height={32} className="object-cover" />
        </div>
        <div className="flex flex-1 items-center gap-2.5 p-2 rounded-full bg-white/10"> {/* Hoặc bg-white/8 như code gốc*/}
          <input
            type="text"
            placeholder="Gửi góp ý cho nội dung này"
            className="flex-1 bg-transparent text-white placeholder-[#E0E0E0] focus:outline-none px-2 text-sm"
            value={feedbackInputText} // Liên kết với state
            onChange={(e) => setFeedbackInputText(e.target.value)} // Cập nhật state
          />
        </div>
        <button className="flex-shrink-0 w-7 h-7" onClick={handleSendIconClick}> {/* Gắn sự kiện click */}
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M26.5808 1.44248C25.9139 0.757968 24.9268 0.502953 24.0064 0.77139L2.54432 7.01254C1.57326 7.28231 0.884975 8.05675 0.699566 9.04057C0.510155 10.0418 1.17176 11.3129 2.03611 11.8444L8.74686 15.9689C9.43514 16.3917 10.3235 16.2857 10.8931 15.7112L18.5776 7.97891C18.9644 7.57625 19.6046 7.57625 19.9915 7.97891C20.3783 8.36814 20.3783 8.99897 19.9915 9.40162L12.2936 17.1353C11.7227 17.7084 11.616 18.6009 12.0362 19.2935L16.1366 26.0715C16.6167 26.8768 17.4438 27.3332 18.3508 27.3332C18.4575 27.3332 18.5776 27.3332 18.6843 27.3197C19.7247 27.1855 20.5517 26.4742 20.8585 25.4675L27.2211 4.03289C27.5012 3.12021 27.2478 2.12699 26.5808 1.44248" fill="#06C149"/>
          </svg>
        </button>
      </div>



{/* Feedback Dialog - MỚI */}
{showFeedbackDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100] p-4"> {/* Đảm bảo z-index cao nhất */}
          <div className="flex flex-col items-center gap-4 rounded-xl bg-[#35383F] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-4 w-[321px]">
            <h2 className="mt-2 text-xl font-semibold text-white">Đánh giá và nhận xét</h2>
            <div className="flex gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  filled={star <= starRating}
                  onClick={() => setStarRating(star)}
                />
              ))}
            </div>
            <textarea
              className="w-full h-28 p-3 rounded-lg bg-[#4A4D57] text-white placeholder-gray-300 focus:outline-none resize-none text-sm"
              placeholder="Hãy cho chúng mình một vài nhận xét & đóng góp ý kiến nhé! Ví dụ : Cảm nhận về nội dung, góp ý nhạc nền,...."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
            <div className="flex gap-3 justify-between mt-2 w-full">
              <button
                onClick={handleCloseFeedbackDialog}
                className="flex-1 py-3 rounded-full bg-[#4A4D57] text-white text-base font-medium hover:bg-[#5f626d] transition-colors"
              >
                Bỏ qua
              </button>
              <button
                onClick={handleSubmitReview}
                className="flex-1 py-3 rounded-full bg-[#06C149] text-white text-base font-medium hover:bg-green-600 transition-colors"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}

        
      </div>
    );
  }
