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
    publisherDate: string;
    totalDownload: number;
    status: number; // Assuming status can indicate VIP or some other property
}

const MucLuc = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const bookId = useSelector((state: RootState) => state.audiobook.bookId);
    const idbook=bookId;
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChapters = async () => {
            if (!bookId) return;

            try {
                setLoading(true);
                const response = await fetch(`http://192.168.1.88:8386/nexia-service/v1/common/toc?page=0&size=10&type=0&id=${bookId}`, {
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
console.log(idbook)
    const handleChapterClick = (chapterId: number) => {
        dispatch(setChapterId(chapterId));
        router.push(`/pod_cast/podcastdetailchapter?id=${idbook}&chapterId=${chapterId}`);
    };

 

    return (
        <div className="flex flex-col px-4 w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">Bộ lọc</h2>
                <button className="flex items-center text-sm text-gray-400 bg-[#2F3443] px-3 py-1.5 rounded-full">
                    {/* New SVG icon for "Mới nhất" */}
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.6583 2.78392C5.6583 4.18392 4.50414 5.31866 3.07915 5.31866C1.65499 5.31866 0.5 4.18392 0.5 2.78392C0.5 1.38474 1.65499 0.25 3.07915 0.25C4.50414 0.25 5.6583 1.38474 5.6583 2.78392ZM14.37 1.67374C14.9933 1.67374 15.5 2.17152 15.5 2.78392C15.5 3.39714 14.9933 3.89492 14.37 3.89492H9.43837C8.8142 3.89492 8.30754 3.39714 8.30754 2.78392C8.30754 2.17152 8.8142 1.67374 9.43837 1.67374H14.37ZM1.63083 9.96846H6.56247C7.18663 9.96846 7.69329 10.4662 7.69329 11.0795C7.69329 11.6919 7.18663 12.1905 6.56247 12.1905H1.63083C1.00666 12.1905 0.5 11.6919 0.5 11.0795C0.5 10.4662 1.00666 9.96846 1.63083 9.96846ZM12.9208 13.5833C14.3458 13.5833 15.5 12.4486 15.5 11.0494C15.5 9.64941 14.3458 8.51467 12.9208 8.51467C11.4967 8.51467 10.3417 9.64941 10.3417 11.0494C10.3417 12.4486 11.4967 13.5833 12.9208 13.5833Z" fill="#BDBDBD"/>
                    </svg>
                    Mới nhất
                </button>
            </div>
            <div className="divide-y divide-[#2F3443]">
                {chapters.map((chapter) => (
                    <div
                        key={chapter.id}
                        className="py-3 cursor-pointer hover:bg-gray-800/50"
                        onClick={() => handleChapterClick(chapter.id)}
                    >
                        {/* Row 1: Image, Chapter Title, VIP tag */}
                        <div className="flex items-center mb-2">
                            <div className="overflow-hidden relative flex-shrink-0 w-16 h-16 rounded-md">
                                <img
                                    src={ '/app.body/echoes.png'}
                                    alt={chapter.title}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <h3 className="flex-1 ml-3 text-base font-semibold text-white">
                                Tập {chapter.number}: {chapter.title}
                            </h3>
                            {chapter.id % 2 === 0 && ( // Example condition for VIP, replace with actual VIP logic
                                <div className="flex-shrink-0 px-2 py-1 text-xs text-white bg-orange-500 rounded-md">
                                    VIP
                                </div>
                            )}
                        </div>

                        {/* Row 2: Description */}
                        <p className="mb-2 text-sm text-gray-400 line-clamp-2">
                            {chapter.description || "To Kill a Mockingbird is a novel set in the 1930s Deep South, following young Scout Finch as her father, Atticus, defends..."}
                        </p>

                        {/* Row 3: Icon, Time, Date, Play icon */}
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className="mr-1">
                                    <path d="M8.99957 3.4873C5.41457 3.4873 2.49707 6.4048 2.49707 9.9898C2.49707 13.5748 5.41457 16.4998 8.99957 16.4998C12.5846 16.4998 15.5021 13.5823 15.5021 9.9973C15.5021 6.4123 12.5846 3.4873 8.99957 3.4873ZM9.56207 9.7498C9.56207 10.0573 9.30707 10.3123 8.99957 10.3123C8.69207 10.3123 8.43707 10.0573 8.43707 9.7498V5.9998C8.43707 5.6923 8.69207 5.4373 8.99957 5.4373C9.30707 5.4373 9.56207 5.6923 9.56207 5.9998V9.7498Z" fill="#9E9E9E"/>
                                    <path d="M11.167 2.5875H6.83199C6.53199 2.5875 6.29199 2.3475 6.29199 2.0475C6.29199 1.7475 6.53199 1.5 6.83199 1.5H11.167C11.467 1.5 11.707 1.74 11.707 2.04C11.707 2.34 11.467 2.5875 11.167 2.5875Z" fill="#9E9E9E"/>
                                </svg>
                                <span>{Math.floor(chapter.duration)} phút, {chapter.publisherDate}</span>
                            </div>
                            <button className="flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM10.7828 7.99043L16.4265 11.1258C17.1123 11.5068 17.1123 12.4932 16.4265 12.8742L10.7828 16.0096C9.98293 16.4539 9 15.8756 9 14.9606V9.03942C9 8.12444 9.98293 7.54607 10.7828 7.99043Z" fill="#06C149"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MucLuc;