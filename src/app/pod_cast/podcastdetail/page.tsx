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



    const handleMarkBook = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('Không tìm thấy accessToken');
                return;
            }

            const id = searchParams.get('id');
            if (!id) {
                console.error('Không tìm thấy ID sách');
                return;
            }

            const action = isMarked ? 'UNMARK' : 'MARK';
            const response = await fetch(`http://192.168.1.88:8386/nexia-service/v1/secure/mark?contentId=${id}&action=${action}&type=0`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'userId': '1',
                    'contentId': '1',
                    'Client-Type': 'Web',
                    'Revision': '1',
                }
            });

            const data = await response.json();

            if (data && data.code === 200) {
                setIsMarked(!isMarked); // Đảo ngược trạng thái đánh dấu
                console.log(isMarked ? 'Hủy đánh dấu thành công' : 'Đánh dấu thành công:', data.data);
            } else {
                console.error('Lỗi khi đánh dấu:', data?.message || 'Không có phản hồi từ server');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API đánh dấu:', error instanceof Error ? error.message : 'Lỗi không xác định');
        }
    };

    const [isLiked, setIsLiked] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false); // Thêm state để quản lý dialog chia sẻ


    const handleShare = async () => {
        try {
            const id = searchParams.get('id');
            if (!id) {
                console.error('Không tìm thấy ID sách');
                return;
            }

            const response = await fetch(`http://192.168.1.88:8386/nexia-service/v1/common/share?contentId=${id}&type=0`, {
                method: 'POST',
                headers: {
                    'userId': '1',
                    'Client-Type': 'Web',
                    'Revision': '1',
                }
            });

            const data = await response.json();

            if (data && data.code === 200) {
                console.log('Chia sẻ thành công:', data.data);
                // Có thể thêm logic hiển thị thông báo thành công cho người dùng
            } else {
                console.error('Lỗi khi chia sẻ:', data?.message || 'Không có phản hồi từ server');
                // Có thể thêm logic hiển thị thông báo lỗi cho người dùng
            }
        } catch (error) {
            console.error('Lỗi khi gọi API chia sẻ:', error instanceof Error ? error.message : 'Lỗi không xác định');
        } finally {
            // Đóng dialog sau khi gọi API
            setShowShareDialog(false);
        }
    };

   


    if (loading) return <div className="flex justify-center items-center min-h-screen text-white bg-black">Đang tải...</div>;
    if (!product) return <div className="flex justify-center items-center min-h-screen text-white bg-black">Không tìm thấy sách</div>;

    return (
        <main className="min-h-screen text-white bg-black">
            {/* Header with background image */}
            <div className="relative h-[300px]">
                {/* Back and Share buttons */}
                <div className="flex absolute top-4 right-4 left-4 z-10 justify-between">
                    <button onClick={() => router.push('/')} className="p-2 text-white rounded-full bg-black/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setShowShareDialog(true)} // Thêm sự kiện click để mở dialog
                        className="p-2 text-white rounded-full bg-black/30"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                            <path d="M17.7086 3.33328C17.7086 4.8291 16.4961 6.04172 15.0003 6.04172C13.5045 6.04172 12.292 4.8291 12.292 3.33328C12.292 1.83762 13.5045 0.625 15.0003 0.625C16.4961 0.625 17.7086 1.83762 17.7086 3.33328Z" fill="white" />
                            <path d="M15.0003 6.66672C13.1619 6.66672 11.667 5.17168 11.667 3.33328C11.667 1.49504 13.1619 0 15.0003 0C16.8386 0 18.3336 1.49504 18.3336 3.33328C18.3336 5.17168 16.8386 6.66672 15.0003 6.66672ZM15.0003 1.25C13.8511 1.25 12.917 2.18508 12.917 3.33328C12.917 4.48164 13.8511 5.41672 15.0003 5.41672C16.1494 5.41672 17.0836 4.48164 17.0836 3.33328C17.0836 2.18508 16.1494 1.25 15.0003 1.25ZM17.7086 16.6667C17.7086 18.1624 16.4961 19.375 15.0003 19.375C13.5045 19.375 12.292 18.1624 12.292 16.6667C12.292 15.1709 13.5045 13.9583 15.0003 13.9583C16.4961 13.9583 17.7086 15.1709 17.7086 16.6667Z" fill="white" />
                            <path d="M15 19.9998C13.1616 19.9998 11.6667 18.5047 11.6667 16.6665C11.6667 14.8281 13.1616 13.3331 15 13.3331C16.8384 13.3331 18.3333 14.8281 18.3333 16.6665C18.3333 18.5047 16.8384 19.9998 15 19.9998ZM15 14.5831C13.8509 14.5831 12.9167 15.5181 12.9167 16.6665C12.9167 17.8147 13.8509 18.7498 15 18.7498C16.1491 18.7498 17.0833 17.8147 17.0833 16.6665C17.0833 15.5181 16.1491 14.5831 15 14.5831ZM6.04172 9.99978C6.04172 11.4956 4.8291 12.7081 3.33328 12.7081C1.83762 12.7081 0.625 11.4956 0.625 9.99978C0.625 8.50396 1.83762 7.2915 3.33328 7.2915C4.8291 7.2915 6.04172 8.50396 6.04172 9.99978Z" fill="white" />
                            <path d="M3.33328 13.3331C1.49504 13.3331 0 11.8381 0 9.99979C0 8.16143 1.49504 6.6665 3.33328 6.6665C5.17168 6.6665 6.66672 8.16143 6.66672 9.99979C6.66672 11.8381 5.17168 13.3331 3.33328 13.3331ZM3.33328 7.9165C2.18414 7.9165 1.25 8.85143 1.25 9.99979C1.25 11.1481 2.18414 12.0831 3.33328 12.0831C4.48258 12.0831 5.41672 11.1481 5.41672 9.99979C5.41672 8.85143 4.48258 7.9165 3.33328 7.9165Z" fill="white" />
                            <path d="M5.30096 9.6C5.01088 9.6 4.7292 9.44906 4.57588 9.17914C4.34834 8.78 4.48842 8.27078 4.8876 8.04238L12.62 3.6341C13.0192 3.40492 13.5283 3.545 13.7567 3.9457C13.9843 4.34484 13.8442 4.85406 13.445 5.08246L5.71249 9.49074C5.58718 9.56241 5.44532 9.60007 5.30096 9.6ZM13.0326 16.475C12.8925 16.475 12.7509 16.4399 12.6209 16.3657L4.88842 11.9575C4.4892 11.73 4.34932 11.2207 4.57682 10.8207C4.80338 10.4207 5.31338 10.2799 5.71346 10.5091L13.446 14.9174C13.8452 15.1449 13.9851 15.6541 13.7576 16.0541C13.6035 16.3241 13.3218 16.475 13.0326 16.475H13.0326Z" fill="white" />
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
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm ${isMarked ? 'bg-green-500' : 'bg-white'}`}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src="/app.body/danhdau.png"
                                        alt="Đánh dấu"
                                        width={16}
                                        height={16}
                                        className={isMarked ? 'brightness-0 invert' : ''} // Thêm filter để chuyển icon thành màu trắng khi đánh dấu
                                    />
                                    <span className={isMarked ? 'ml-1 text-white' : 'ml-1 text-green-500'}>Đánh dấu</span>
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
                                <span className="ml-1">{product.totalListen}</span>
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
                        className={`flex-1 px-2 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap ${activeTab === 'mucluc'
                                ? 'font-medium text-green-500 border-b-2 border-green-500'
                                : 'text-gray-400'
                            }`}
                    >
                        Danh sách tập
                    </button>
                    <button
                        onClick={() => handleTabChange('tuongtu')}
                        className={`flex-1 px-2 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap ${activeTab === 'tuongtu'
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
             {/* Share Dialog */}
      {showShareDialog && (
  <div className="fixed inset-0 z-50"> {/* Đảm bảo bao phủ toàn màn hình */}
    <div
      className="fixed inset-0 bg-black/50"
      onClick={() => setShowShareDialog(false)} // Click nền tối để đóng dialog
    />
    <div className="fixed bottom-0 left-0 right-0 flex flex-col p-4 gap-4 bg-[#35383F] rounded-t-2xl">
      {/* Thay đổi: Dòng chứa icon sẽ được căn giữa và cách đều */}
      <div className="flex justify-around items-center w-full">

        {/* Facebook Button */}
        <button className="flex flex-col gap-2 items-center" onClick={handleShare}>
          {/* Thay đổi: Kích thước icon chuẩn hóa và căn giữa SVG */}
          <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 33 32" fill="none">
              <path d="M16.6259 0C-3.21146 0.581054 -5.23454 28.4171 14.113 32.0001H19.1387C38.4907 28.4137 36.4588 0.579033 16.6259 0Z" fill="#1877F2" />
              <path d="M19.1385 20.7507H22.8859L23.599 16.0976H19.1385V13.0778C19.1385 11.8048 19.7617 10.5639 21.7595 10.5639H23.7876V6.60229C19.4444 5.8198 14.2264 6.05795 14.1128 12.5509V16.0976H10.0293V20.7507H14.1128V31.9999H19.1385V20.7507Z" fill="#F1F1F1" />
            </svg>
          </div>
          <span className="text-sm text-white">Facebook</span>
        </button>

        {/* Messenger Button */}
        <button className="flex flex-col gap-2 items-center"  onClick={handleShare}>
          <div className="w-10 h-10 rounded-full bg-[#2196F3] flex items-center justify-center"> {/* Thay đổi màu nền cho Messenger nếu cần, ở đây dùng màu từ SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 33 32" fill="none">
              <path d="M16.875 0.00164694C8.22781 -0.168853 1.07244 6.6884 0.875 15.335C0.886134 17.5098 1.3687 19.6564 2.28943 21.6268C3.21016 23.5971 4.54717 25.3444 6.20831 26.7483V31.335C6.20831 31.7031 6.50681 32.0016 6.875 32.0016C6.99994 32.0016 7.12236 31.9665 7.22831 31.9003L10.9443 29.579C12.8376 30.3031 14.848 30.6724 16.875 30.6683C25.5222 30.8388 32.6776 23.9816 32.875 15.335C32.6776 6.6884 25.5222 -0.168853 16.875 0.00164694Z" fill="#2196F3" />
              <path d="M27.4091 10.935C27.3131 10.8064 27.174 10.7167 27.0172 10.6824C26.8605 10.6481 26.6966 10.6715 26.5557 10.7483L19.6224 14.5283L15.3091 10.8296C15.1816 10.7203 15.0175 10.6631 14.8497 10.6695C14.6818 10.6759 14.5226 10.7455 14.4038 10.8643L6.40381 18.8643C6.14425 19.1254 6.1455 19.5475 6.40668 19.8071C6.50837 19.9082 6.63993 19.9738 6.78184 19.9942C6.92376 20.0146 7.06847 19.9886 7.1945 19.9203L14.1278 16.1403L18.4451 19.8403C18.5726 19.9496 18.7367 20.0068 18.9046 20.0004C19.0724 19.9939 19.2317 19.9244 19.3504 19.8056L27.3504 11.8056C27.4632 11.6918 27.5312 11.5411 27.542 11.3812C27.5528 11.2213 27.5056 11.0629 27.4091 10.935Z" fill="#FAFAFA" />
            </svg>
          </div>
          <span className="text-sm text-white">Messenger</span>
        </button>

        {/* QR Code Button */}
        <button className="flex flex-col gap-2 items-center"   onClick={handleShare}>
          {/* Thay đổi: Nền trắng, kích thước chuẩn hóa */}
          <div className="flex justify-center items-center w-10 h-10 bg-white rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 21 20" fill="none"> {/* Điều chỉnh kích thước SVG */}
              <path d="M0.839286 6.42857C1.02873 6.42857 1.21041 6.35332 1.34436 6.21936C1.47832 6.08541 1.55357 5.90373 1.55357 5.71429V2.14286C1.55357 1.95342 1.62883 1.77174 1.76278 1.63778C1.89674 1.50383 2.07842 1.42857 2.26786 1.42857H6.19643C6.38587 1.42857 6.56755 1.35332 6.7015 1.21936C6.83546 1.08541 6.91071 0.903726 6.91071 0.714286C6.91071 0.524845 6.83546 0.343164 6.7015 0.209209C6.56755 0.0752549 6.38587 0 6.19643 0H2.26786C1.69954 0 1.15449 0.225765 0.752628 0.627628C0.350765 1.02949 0.125 1.57454 0.125 2.14286V5.71429C0.125 5.90373 0.200255 6.08541 0.334209 6.21936C0.468164 6.35332 0.649845 6.42857 0.839286 6.42857ZM17.9821 0H14.0536C13.8641 0 13.6824 0.0752549 13.5485 0.209209C13.4145 0.343164 13.3393 0.524845 13.3393 0.714286C13.3393 0.903726 13.4145 1.08541 13.5485 1.21936C13.6824 1.35332 13.8641 1.42857 14.0536 1.42857H17.9821C18.1716 1.42857 18.3533 1.50383 18.4872 1.63778C18.6212 1.77174 18.6964 1.95342 18.6964 2.14286V5.71429C18.6964 5.90373 18.7717 6.08541 18.9056 6.21936C19.0396 6.35332 19.2213 6.42857 19.4107 6.42857C19.6002 6.42857 19.7818 6.35332 19.9158 6.21936C20.0497 6.08541 20.125 5.90373 20.125 5.71429V2.14286C20.125 1.57454 19.8992 1.02949 19.4974 0.627628C19.0955 0.225765 18.5505 0 17.9821 0ZM19.4107 13.5714C19.2213 13.5714 19.0396 13.6467 18.9056 13.7806C18.7717 13.9146 18.6964 14.0963 18.6964 14.2857V17.8571C18.6964 18.0466 18.6212 18.2283 18.4872 18.3622C18.3533 18.4962 18.1716 18.5714 17.9821 18.5714H14.0536C13.8641 18.5714 13.6824 18.6467 13.5485 18.7806C13.4145 18.9146 13.3393 19.0963 13.3393 19.2857C13.3393 19.4752 13.4145 19.6568 13.5485 19.7908C13.6824 19.9247 13.8641 20 14.0536 20H17.9821C18.5505 20 19.0955 19.7742 19.4974 19.3724C19.8992 18.9705 20.125 18.4255 20.125 17.8571V14.2857C20.125 14.0963 20.0497 13.9146 19.9158 13.7806C19.7818 13.6467 19.6002 13.5714 19.4107 13.5714ZM6.19643 18.5714H2.26786C2.07842 18.5714 1.89674 18.4962 1.76278 18.3622C1.62883 18.2283 1.55357 18.0466 1.55357 17.8571V14.2857C1.55357 14.0963 1.47832 13.9146 1.34436 13.7806C1.21041 13.6467 1.02873 13.5714 0.839286 13.5714C0.649845 13.5714 0.468164 13.6467 0.334209 13.7806C0.200255 13.9146 0.125 14.0963 0.125 14.2857V17.8571C0.125 18.4255 0.350765 18.9705 0.752628 19.3724C1.15449 19.7742 1.69954 20 2.26786 20H6.19643C6.38587 20 6.56755 19.9247 6.7015 19.7908C6.83546 19.6568 6.91071 19.4752 6.91071 19.2857C6.91071 19.0963 6.83546 18.9146 6.7015 18.7806C6.56755 18.6467 6.38587 18.5714 6.19643 18.5714ZM19.4107 9.28571H0.839286C0.649845 9.28571 0.468164 9.36097 0.334209 9.49492C0.200255 9.62888 0.125 9.81056 0.125 10C0.125 10.1894 0.200255 10.3711 0.334209 10.5051C0.468164 10.639 0.649845 10.7143 0.839286 10.7143H19.4107C19.6002 10.7143 19.7818 10.639 19.9158 10.5051C20.0497 10.3711 20.125 10.1894 20.125 10C20.125 9.81056 20.0497 9.62888 19.9158 9.49492C19.7818 9.36097 19.6002 9.28571 19.4107 9.28571Z" fill="#212121" />
              <path d="M2.98242 4.2855V7.85693H17.2681V4.2855C17.267 3.90697 17.1161 3.54427 16.8485 3.2766C16.5808 3.00894 16.2181 2.85806 15.8396 2.85693H4.41099C4.03246 2.85806 3.66975 3.00894 3.40209 3.2766C3.13443 3.54427 2.98355 3.90697 2.98242 4.2855ZM15.8396 17.1426C16.2181 17.1415 16.5808 16.9906 16.8485 16.723C17.1161 16.4553 17.267 16.0926 17.2681 15.7141V12.1426H2.98242V15.7141C2.98355 16.0926 3.13443 16.4553 3.40209 16.723C3.66975 16.9906 4.03246 17.1415 4.41099 17.1426H15.8396Z" fill="#212121" />
            </svg>
          </div>
          <span className="text-sm text-white">QR Code</span>
        </button>

        {/* Link Button */}
        <button className="flex flex-col gap-2 items-center"  onClick={handleShare}>
          {/* Thay đổi: Nền trắng, kích thước chuẩn hóa */}
          <div className="flex justify-center items-center w-10 h-10 bg-white rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 21 20" fill="none"> {/* Điều chỉnh kích thước SVG */}
              <path d="M8.66713 15.2443L6.31045 17.601C5.33342 18.578 3.75119 18.578 2.77498 17.6012C1.79857 16.6247 1.79857 15.0424 2.77479 14.0662L7.48897 9.35197C8.46518 8.37572 10.0476 8.37572 11.0238 9.35197C11.3492 9.6774 11.8769 9.6774 12.2023 9.35197C12.5277 9.02654 12.5277 8.49889 12.2023 8.17346C10.5752 6.54635 7.93756 6.54635 6.31045 8.17346L1.59631 12.8876C-0.0308008 14.5147 -0.0308008 17.1524 1.59631 18.7795C3.22322 20.4074 5.86103 20.4074 7.489 18.7795L9.84568 16.4228C10.1711 16.0974 10.1711 15.5697 9.84568 15.2443C9.52025 14.9188 8.99256 14.9188 8.66713 15.2443Z" fill="#212121" />
              <path d="M19.1544 7.1125C20.7815 5.48539 20.7815 2.84777 19.1544 1.22066C17.5273 -0.406406 14.8898 -0.406406 13.2619 1.22047L10.4342 4.04816C10.1088 4.37359 10.1088 4.90125 10.4342 5.22668C10.7596 5.55211 11.2873 5.55211 11.6127 5.22668L14.4402 2.39918C15.4171 1.42293 16.9996 1.42293 17.9759 2.39918C18.9521 3.37539 18.9521 4.95777 17.9759 5.93398L12.7909 11.119C11.8146 12.0952 10.2323 12.0952 9.25609 11.119C8.93066 10.7936 8.40301 10.7936 8.07758 11.119C7.75215 11.4444 7.75215 11.9721 8.07758 12.2975C9.70469 13.9246 12.3423 13.9246 13.9694 12.2975L19.1544 7.1125ZM15.9647 14.4112C15.6393 14.0857 15.1116 14.0857 14.7862 14.4112C14.4607 14.7366 14.4607 15.2643 14.7862 15.5897L17.2854 18.0889C17.6108 18.4143 18.1384 18.4143 18.4639 18.0889C18.7893 17.7634 18.7893 17.2358 18.4639 16.9104L15.9647 14.4112ZM4.78684 5.59035C5.11227 5.91578 5.63992 5.91578 5.96535 5.59035C6.29078 5.26492 6.29078 4.73727 5.96535 4.41184L3.46367 1.91016C3.13824 1.58473 2.61059 1.58473 2.28516 1.91016C1.95973 2.23559 1.95973 2.76324 2.28516 3.08867L4.78684 5.59035ZM19.5417 12.5H17.0417C16.5814 12.5 16.2084 12.8731 16.2084 13.3333C16.2084 13.7936 16.5814 14.1666 17.0417 14.1666H19.5417C20.0019 14.1666 20.375 13.7936 20.375 13.3333C20.375 12.8731 20.0019 12.5 19.5417 12.5ZM7.04168 4.16668C7.50191 4.16668 7.875 3.79359 7.875 3.33336V0.833359C7.875 0.373086 7.50191 0 7.04168 0C6.58145 0 6.20836 0.373086 6.20836 0.83332V3.33332C6.20832 3.79355 6.58145 4.16668 7.04168 4.16668ZM1.20832 7.5H3.70832C4.16855 7.5 4.54164 7.12691 4.54164 6.66668C4.54164 6.20645 4.16855 5.83336 3.70832 5.83336H1.20832C0.748086 5.83336 0.375 6.20645 0.375 6.66668C0.375 7.12691 0.748086 7.5 1.20832 7.5ZM13.7083 15.8333C13.2481 15.8333 12.875 16.2064 12.875 16.6666V19.1666C12.875 19.6269 13.2481 20 13.7083 20C14.1686 20 14.5416 19.6269 14.5416 19.1666V16.6666C14.5417 16.2064 14.1686 15.8333 13.7083 15.8333Z" fill="#212121" />
            </svg>
          </div>
          <span className="text-sm text-white">Link</span>
        </button>

      </div>
    </div>
  </div>
)}
        </main>
    );
}