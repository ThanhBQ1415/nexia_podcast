'use client'
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

interface CateItem {
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
    score: number;
    duration: number;
    demoLink: string;
    isLike: number;
    isMarked: number;
}


import MucLuc from '../components/muclucaudiobook';
import TuongTu from '../components/tuongtuaudiobook';

import { setBookId } from '../../../Redux/Features/audiobookSlice';

export default function AudiobookDetail() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [product, setProduct] = useState<CateItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMarked, setIsMarked] = useState(false);
    const [activeTab, setActiveTab] = useState('mucluc'); // Set default active tab to 'mucluc'
    const dispatch = useDispatch();

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchBookDetail = async () => {
            try {
                const id = searchParams.get('id');
                if (id) {
                    dispatch(setBookId(Number(id))); // Dispatch action để lưu bookId vào Redux store
                    const response = await fetch(`http://192.168.1.88:8386/nexia-service/v1/common/detail?type=0&id=${id}`, {
                        headers: {
                            'userId': '1'
                        }
                    });
                    const data = await response.json();
                    if (data.code === 200) {
                        setProduct(data.data);
                        setIsMarked(data.data.isMarked === 1);
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching book details:', error);
                setLoading(false);
            }
        };

        fetchBookDetail();
    }, [searchParams, dispatch]);




    const handleMarkBook = () => {
        setIsMarked(!isMarked);
        // Implement API call to mark/unmark book
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen text-white bg-black">Đang tải...</div>;
    if (!product) return <div className="flex justify-center items-center min-h-screen text-white bg-black">Không tìm thấy sách</div>;

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
                        alt={product.name}
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
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                        {product.typeEarn === 1 && (
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

                        <h1 className="mb-2 text-[14px] font-bold leading-[21px] tracking-[0%] text-[#FFFFFF] font-['Inter']">{product.name}</h1>

                        <div className="flex gap-2 items-center mb-2">
                            <div className="flex overflow-hidden justify-center items-center w-6 h-6 bg-gray-700 rounded-full">
                                <Image
                                    src="/app.body/tacgia.png"
                                    alt="Author"
                                    width={24}
                                    height={24}
                                />
                            </div>
                            <span className="text-sm text-gray-300">{product.publisherName || 'Keith D.Harrell'}</span>
                        </div>
                         {/* Rating and stats - moved closer to book info */}
                        <div className="flex gap-4 items-center">
                            <div className="flex items-center text-yellow-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                                <span className="ml-1">{product.score}/5</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                                </svg>
                                <span className="ml-1">{product.totalListen }</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Book Details */}
            <div className="px-4 pb-4">
                {/* Description */}
                {product.description && (
                    <div className="mt-4 text-sm text-gray-300">
                        <p>{product.description}</p>
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
                        Danh sách tập
                    </button>
                    <button
                        onClick={() => handleTabChange('tuongtu')}
                        className={`flex-1 px-2 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap ${
                            activeTab === 'tuongtu'
                                ? 'font-medium text-green-500 border-b-2 border-green-500'
                                : 'text-gray-400'
                        }`}
                    >
                        Tương tự
                    </button>
                </div>

                {/* Details content */}
                <div className="py-4 space-y-4">
                    {activeTab === 'mucluc' && <div><MucLuc /></div>}
                    {activeTab === 'tuongtu' && <div><TuongTu /></div>}
                </div>
            </div>
        </main>
    );
}