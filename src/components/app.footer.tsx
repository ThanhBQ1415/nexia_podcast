'use client'
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function Appfooter() {
    const [activeButton, setActiveButton] = useState<string | null>('Audiobook');
    const router = useRouter();

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
        if (buttonName === 'Audiobook') {
            router.push('/'); // Điều hướng đến trang chủ
        } else if (buttonName === 'Podcast') {
            router.push('/pod_cast/podcast'); // Điều hướng đến trang podcast
        }else if (buttonName === 'Cá nhân') {
            router.push('/ca_nhan/canhan'); // Điều hướng đến trang podcast
        }
    };

    return (
        <>
            <div className="pb-12"></div> {/* Thêm padding-bottom để tạo khoảng trống cho footer */}
            <footer className="bg-[#1F222A] bg-opacity-80 backdrop-blur-md p-2 rounded-t-2xl fixed bottom-0 w-full flex justify-around items-center">
                <div className={`flex flex-col items-center ${activeButton === 'Audiobook' ? 'text-green-500' : 'text-gray-400'}`} onClick={() => handleButtonClick('Audiobook')}>
                    <Image src="/app.footer/audiobook.png" alt="Audiobook" width={24} height={24} className={`${activeButton === 'Audiobook' ? 'filter-green-500' : ''}`} />
                    <span className="text-xs">Audiobook</span>
                </div>
                <div className={`flex flex-col items-center ${activeButton === 'Podcast' ? 'text-green-500' : 'text-gray-400'}`} onClick={() => handleButtonClick('Podcast')}>
                    <Image src="/app.footer/podcast.png" alt="Podcast" width={24} height={24} className={`${activeButton === 'Podcast' ? 'filter-green-500' : ''}`} />
                    <span className="text-xs">Podcast</span>
                </div>
                <div className={`flex flex-col items-center ${activeButton === 'New Icon' ? 'text-green-500' : 'text-gray-400'}`} onClick={() => handleButtonClick('New Icon')}>
                    <Image src="/app.footer/phat.png" alt="" width={48} height={48} className={`${activeButton === 'New Icon' ? 'filter-green-500' : ''}`} />
                </div>
                <div className={`flex flex-col items-center ${activeButton === 'Thư viện' ? 'text-green-500' : 'text-gray-400'}`} onClick={() => handleButtonClick('Thư viện')}>
                    <Image src="/app.footer/thuvien.png" alt="Thư viện" width={24} height={24} className={`${activeButton === 'Thư viện' ? 'filter-green-500' : ''}`} />
                    <span className="text-xs">Thư viện</span>
                </div>
                <div className={`flex flex-col items-center ${activeButton === 'Cá nhân' ? 'text-green-500' : 'text-gray-400'}`} onClick={() => handleButtonClick('Cá nhân')}>
                    <Image src="/app.footer/canhan.png" alt="Cá nhân" width={24} height={24} className={`${activeButton === 'Cá nhân' ? 'filter-green-500' : ''}`} />
                    <span className="text-xs">Cá nhân</span>
                </div>
            </footer>
        </>
    )
}

export default Appfooter;
