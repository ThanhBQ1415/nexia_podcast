'use client'
import { useSearchParams, useRouter } from 'next/navigation'; // Added useRouter
import { useState, useEffect } from 'react';
import Image from 'next/image';
import MucLuc from '../components/muclucaudiobook';
import { useDispatch } from 'react-redux';
import { setBookId,setChapterId } from '../../../Redux/Features/audiobookSlice';

interface Episode {
    id: number;
    idPodcast: number;
    title: string;
    image: string; // This will be used for the main episode image in the overlay
    description: string;
    file: string;
    number: number;
    duration: number;
    publisherDate: string; // Make sure this is a formatted date string
    totalListen: number;
    totalLike: number;
    totalDownload: number;
    status: number; // This might be used for VIP logic if applicable
    // Add other fields if your API provides them and they are needed for the new layout
    // e.g., authorName, score, typeEarn (for VIP)
}

// Helper function to format duration (optional, based on your needs)
const formatDuration = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "N/A";
    const minutes = Math.floor(seconds / 60);
    // const remainingSeconds = Math.floor(seconds % 60);
    // return `${minutes} phút ${remainingSeconds} giây`; // Or just minutes
    return `${minutes} phút`;
};

export default function PodcastChapter() {
    const searchParams = useSearchParams();
    const router = useRouter(); // Initialize router
    const [episodes, setEpisodes] = useState<Episode[]>([]); // Still fetching all, though only current is displayed in detail
    const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('mucluc'); // Set default active tab to 'mucluc'
    // State for bookmark feature
    const dispatch = useDispatch();
    const [isMarked, setIsMarked] = useState(false);

    // Handler for bookmark (dummy implementation)
    const handleMarkBook = () => {
        setIsMarked(!isMarked);
        // Here you would typically make an API call to save the bookmark status
        console.log(isMarked ? "Unmarked" : "Marked");
    };
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };


    const handlePlayClick = () => {
        const bookId = searchParams.get('id');
        const chapterId = searchParams.get('chapterId');
        
        if (bookId && chapterId) {
            dispatch(setBookId(Number(bookId)));
            dispatch(setChapterId(Number(chapterId)));
            router.push('/pod_cast/phat-podcast')
        }
    };

    useEffect(() => {
        const fetchEpisodes = async () => {
            const bookId = searchParams.get('id');
            const chapterId = searchParams.get('chapterId');
            
            if (!bookId || !chapterId) {
                setError('Không tìm thấy thông tin chapter');
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                dispatch(setBookId(Number(bookId)));
                const response = await fetch(
                    `http://192.168.1.88:8386/nexia-service/v1/common/toc?page=0&size=10&type=0&id=${bookId}`,
                    {
                        headers: {
                            'userId': '1'
                        }
                    }
                );
                const data = await response.json();

                if (data.code === 200 && data.data) {
                    setEpisodes(data.data);
                    const episode = data.data.find((ep: Episode) => ep.id === Number(chapterId));
                    if (episode) {
                        setCurrentEpisode(episode);
                    } else {
                        setError('Không tìm thấy tập này trong danh sách trả về');
                    }
                } else {
                    setError(data.message || 'Có lỗi xảy ra khi tải danh sách tập');
                }
            } catch (err) {
                setError('Không thể kết nối đến server');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEpisodes();
    }, [searchParams]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen text-center text-gray-400 bg-black">Đang tải...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-center text-red-500 bg-black">{error}</div>;
    }

    if (!currentEpisode) {
        return <div className="flex justify-center items-center min-h-screen text-center text-gray-400 bg-black">Không tìm thấy thông tin tập này.</div>;
    }

    // Placeholder for product.typeEarn logic for VIP badge
    // You can replace this with actual logic based on currentEpisode.status or other fields
    const isVipEpisode = currentEpisode.status === 1; // Example: if status 1 means VIP

    // Placeholder for publisher name and score as they are not in Episode interface
    const publisherNamePlaceholder = "Tên tác giả/NXB";
    const scorePlaceholder = "4.5"; // Example score

    return (
        <main className="min-h-screen text-white bg-black">
            {/* Header with background image */}
            <div className="relative h-[300px]">
                {/* Back and Share buttons */}
                <div className="flex absolute top-4 right-4 left-4 z-10 justify-between">
                    <button onClick={() => router.back()} className="p-2 text-white rounded-full bg-black/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button className="p-2 text-white rounded-full bg-black/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                    </button>
                </div>

                {/* Background image - hiển thị toàn bộ */}
                <div className="overflow-hidden absolute inset-0">
                    <Image
                        src="/app.body/podcast-bg.png"
                        alt={currentEpisode.title}
                        fill
                        sizes="100vw"
                        priority
                        className="object-cover w-full h-full brightness-50"
                    />
                </div>

                {/* Phần nền đen bo góc tròn */}
                <div className="absolute top-[120px] left-0 right-0 bottom-0 bg-black/80 rounded-t-[30px]"></div>

                {/* Book info overlay */}
                <div className="flex absolute inset-0 items-center p-6">
                    <div className="relative w-[120px] h-[160px] rounded-lg overflow-hidden">
                        <Image
                            src="/app.body/echoes.png"
                            alt={currentEpisode.title}
                            fill
                            className="object-cover"
                        />
                        {currentEpisode.number === 1 && (
                            <div className="absolute top-2 right-2 px-2 py-1 text-xs text-white bg-orange-500 rounded-md">
                                VIP
                            </div>
                        )}
                    </div>

                    <div className="flex-1 ml-4">
                        <div className="flex mb-2">
                            <button
                                onClick={handleMarkBook}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm ${isMarked ? 'text-white bg-green-500' : 'text-green-500 bg-white'}`}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src="/app.body/danhdau.png"
                                        alt="Đánh dấu"
                                        width={16}
                                        height={16}
                                    />
                                    <span className="ml-1">Đánh dấu</span>
                                </div>
                            </button>
                        </div>

                        <h1 className="mb-2 text-[14px] font-bold leading-[21px] tracking-[0%] text-[#FFFFFF] font-['Inter']">{currentEpisode.title}</h1>

                        <div className="flex gap-2 items-center mb-2">
                            <div className="flex overflow-hidden justify-center items-center w-6 h-6 bg-gray-700 rounded-full">
                                <Image
                                    src="/app.body/tacgia.png"
                                    alt="Author"
                                    width={24}
                                    height={24}
                                />
                            </div>
                            <span className="text-sm text-gray-300">{'Keith D.Harrell'}</span>
                        </div>
                    </div>
                </div>

                {/* Stats and Action Icons */}
                <div className="flex absolute right-0 left-0 bottom-4 justify-between items-center px-6">
                    {/* Rating and Listen Count */}
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center text-yellow-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span className="ml-1">{scorePlaceholder}/5</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                            </svg>
                            <span className="ml-1">{currentEpisode.totalListen}</span>
                        </div>
                    </div>

                    {/* Action Icons */}
                    <div className="flex gap-4 items-center">
                        {/* Heart Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10.6379 3.91857L10.0003 4.60352L9.36278 3.91857C7.60227 2.02714 4.7479 2.02714 2.98738 3.91857C1.22686 5.81 1.22686 8.87662 2.98738 10.768L8.72524 16.9326C9.42945 17.6891 10.5712 17.6891 11.2754 16.9326L17.0133 10.768C18.7738 8.87661 18.7738 5.81 17.0133 3.91857C15.2527 2.02714 12.3984 2.02714 10.6379 3.91857Z" stroke="white" stroke-width="1.66667" stroke-linejoin="round"/>
                        </svg>

                        {/* Download Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M14.1667 14.1668H14.175M14.5 11.6668H15C15.7766 11.6668 16.1649 11.6668 16.4711 11.7937C16.8795 11.9629 17.204 12.2873 17.3731 12.6957C17.5 13.002 17.5 13.3903 17.5 14.1668C17.5 14.9434 17.5 15.3317 17.3731 15.638C17.204 16.0463 16.8795 16.3708 16.4711 16.54C16.1649 16.6668 15.7766 16.6668 15 16.6668H5C4.22343 16.6668 3.83515 16.6668 3.52886 16.54C3.12048 16.3708 2.79602 16.0463 2.62687 15.638C2.5 15.3317 2.5 14.9434 2.5 14.1668C2.5 13.3903 2.5 13.002 2.62687 12.6957C2.79602 12.2873 3.12048 11.9629 3.52886 11.7937C3.83515 11.6668 4.22343 11.6668 5 11.6668H5.5M10 12.5002V3.3335M10 12.5002L7.5 10.0002M10 12.5002L12.5 10.0002" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                        {/* Play Icon */}
                        <div onClick={handlePlayClick} className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <g clip-path="url(#clip0_2099_6540)">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28ZM12.1062 7.76284L20.8854 12.6401C21.9522 13.2328 21.9522 14.7671 20.8854 15.3597L12.1062 20.2371C10.862 20.9283 9.33301 20.0286 9.33301 18.6053V9.3946C9.33301 7.97129 10.862 7.07162 12.1062 7.76284Z" fill="#06C149"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_2099_6540">
                                    <rect width="28" height="28" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                </div>
                </div>
            </div>

            {/* Book Details */}
            <div className="px-4 pb-4">
            </div>
                {/* Description */}
                {currentEpisode.description && (
                    <div className="mt-4 text-sm text-gray-300">
                        <p>{currentEpisode.description}</p>
                    </div>
                )}

                {/* Navigation tabs */}
                <div className="flex mt-4 w-full border-b border-gray-800">
                    <button
                        onClick={() => handleTabChange('mucluc')}
                        className={`flex-1 px-2 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap ${
                            activeTab === 'mucluc'
                                ? 'font-medium text-green-500 border-b-2 border-green-500'
                                : 'text-gray-400'
                        }`}
                    >
                        Các tập khác
                    </button>
                 
                </div>

                {/* Details content */}
                <div className="py-4 space-y-4">
                    {activeTab === 'mucluc' && <div><MucLuc /></div>}
                 

              
            </div>
        </main>
    );
}