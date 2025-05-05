'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CateItem {
  id: number;
  name: string;
  image: string;
  description: string;
  publisher: number;
  publisherDate: string;
  reader: number;
  typeEarn: number;
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
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trendingItems, setTrendingItems] = useState<CateItem[]>([]);
  const [spiritualItems, setSpiritualItems] = useState<CateItem[]>([]);
  const [businessItems, setBusinessItems] = useState<CateItem[]>([]);
  const router = useRouter();
  const totalSlides = 5;
  const images = [
    "/app.body/podcast-bg.png",
    "/app.body/podcast-bg1.png",
    "/app.body/podcast-bg2.png",
    "/app.body/podcast-bg3.png",
    "/app.body/podcast-bg.png"
  ];

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const fetchTrendingItems = async () => {
      try {
        const response = await fetch('http://192.168.1.88:8386/nexia-service/v1/common/trending?type=0&page=0&size=10');
        const data = await response.json();
        if (data.code === 200) {
          setTrendingItems(data.data);
        }
      } catch (error) {
        console.error('Error fetching trending items:', error);
      }
    };

    const fetchSpiritualItems = async () => {
      try {
        const response = await fetch('http://192.168.1.88:8386/nexia-service/v1/common/category?sort=id:asc&page=0&size=10&type=1');
        const data = await response.json();
        if (data.code === 200) {
          setSpiritualItems(data.data.cateItem);
        }
      } catch (error) {
        console.error('Error fetching spiritual items:', error);
      }
    };

    const fetchBusinessItems = async () => {
      try {
        const response = await fetch('http://192.168.1.88:8386/nexia-service/v1/common/category?sort=id:asc&page=0&size=10&type=1');
        const data = await response.json();
        if (data.code === 200) {
          setBusinessItems(data.data.cateItem);
        }
      } catch (error) {
        console.error('Error fetching business items:', error);
      }
    };

    fetchTrendingItems();
    fetchSpiritualItems();
    fetchBusinessItems();
  }, []);

  const handleBookClick = (book: CateItem) => {
    router.push(`audiobookdetail?product=${JSON.stringify(book)}`);
  };

  return (
    <main className="w-screen min-h-screen bg-[#1a1a1a]" >
      <div className="h-6 bg-[#1a1a1a]"></div>
      <div className="relative w-[343px] h-[140px] md:w-[1372px] md:h-[560px] object-cover rounded-xl overflow-hidden bg-black mx-auto flex justify-center">
        <Image
          src={images[currentSlide]}
          alt={`Podcast background ${currentSlide + 1}`}
          fill
          quality={100}
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="h-6 bg-[#1a1a1a]"></div> 
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-3 rounded-full cursor-pointer transition-all duration-300 ${
              index === currentSlide ? 'bg-green-500 w-13' : 'bg-gray-700 hover:bg-gray-600 w-3'
            }`}
            aria-label={`Chuyển đến slide ${index + 1}`}
          >
          </div>
        ))}
      </div>

      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold text-white">Thể loại</h2>
          <button 
            className="text-xl text-white"
            onClick={() => router.push('/category')}
          >
            {'>'}
          </button>
        </div>
        {/* Responsive: mobile -> wrap, desktop -> full width, chia đều */}
        <div className="md:flex md:flex-nowrap md:gap-2">
          {/* Mobile: First row */}
          <div className="flex flex-wrap gap-2 md:flex-nowrap md:flex-1">
            <button 
              className="flex-1 flex items-center bg-[#1a1a1a] text-white text-sm px-3 py-2 rounded-md border-l-4 border-green-500 md:flex-1"
              onClick={() => router.push('/category-list?name=Tâm linh')}
            >
              Tâm linh
            </button>
            <button 
              className="flex-1 flex items-center bg-[#1a1a1a] text-white text-sm px-3 py-2 rounded-md border-l-4 border-orange-500 md:flex-1"
              onClick={() => router.push('/category-list?name=Hồi ký và tiểu sử')}
            >
              Hồi ký và tiểu sử
            </button>
            <button 
              className="flex-1 flex items-center bg-[#1a1a1a] text-white text-sm px-3 py-2 rounded-md border-l-4 border-purple-500 md:flex-1"
              onClick={() => router.push('/category-list?name=Lịch sử, Văn hoá')}
            >
              Lịch sử, Văn hoá
            </button>
          </div>
          {/* Mobile: Second row */}
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0 md:flex-nowrap md:flex-1">
            <button 
              className="flex-1 flex items-center bg-[#1a1a1a] text-white text-sm px-3 py-2 rounded-md border-l-4 border-yellow-500 md:flex-1"
              onClick={() => router.push('/category-list?name=Kinh tế')}
            >
              Kinh tế
            </button>
            <button 
              className="flex-1 flex items-center bg-[#1a1a1a] text-white text-sm px-3 py-2 rounded-md border-l-4 border-blue-500 md:flex-1"
              onClick={() => router.push('/category-list?name=Tài chính, đầu tư')}
            >
              Tài chính, đầu tư
            </button>
            <button 
              className="flex-1 flex items-center bg-[#1a1a1a] text-white text-sm px-3 py-2 rounded-md border-l-4 border-gray-500 md:flex-1"
              onClick={() => router.push('/category-list?name=Quản lý công ty')}
            >
              Quản lý công ty
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold text-white">Trending</h2>
          <button className="text-xl text-white">{'>'}</button>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max md:grid md:grid-cols-5 md:min-w-0">
            {trendingItems.map((item) => (
              <button
                key={item.id}
                className="relative w-[160px] md:w-auto text-left focus:outline-none"
                onClick={() => handleBookClick(item)}
              >
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
                  <Image
                    src={"/app.body/echoes.png"}               
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 160px, 20vw"
                  />
                  {item.isHot === 1 && (
                    <div className="absolute top-2 right-2 px-2 py-1 text-xs text-white bg-yellow-500 rounded-full">
                      HOT
                    </div>
                  )}
                </div>
                <h3 className="mt-2 text-xs text-white truncate line-clamp-1">{item.name}</h3>
                <div className="mt-1 text-xs text-gray-400">
                  {item.duration} phút • {item.totalListen} lượt nghe
                </div>
                {item.scoreContent > 0 && (
                  <div className="flex items-center mt-1 text-xs text-yellow-500">
                    {'★'.repeat(Math.floor(item.scoreContent))}
                    {item.scoreContent % 1 !== 0 && '★'.slice(0, 1)}
                    { '☆'.repeat(5 - Math.ceil(item.scoreContent))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phần Tâm linh - Tinh thần */}
      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold text-white">Tâm linh - Tinh thần</h2>
          <button className="text-xl text-white">{'>'}</button>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max md:grid md:grid-cols-5 md:min-w-0">
            {spiritualItems.map((item) => (
              <button
                key={item.id}
                className="relative w-[160px] md:w-auto text-left focus:outline-none"
                onClick={() => handleBookClick(item)}
              >
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
                  <Image
                    src={"/app.body/tamlinh-tinhthan.png"}               
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 160px, 20vw"
                  />
                  {item.isHot === 1 && (
                    <div className="absolute top-2 right-2 px-2 py-1 text-xs text-white bg-yellow-500 rounded-full">
                      VIP
                    </div>
                  )}
                </div>
                <h3 className="mt-2 text-xs text-white truncate line-clamp-1">{item.name}</h3>
                <div className="mt-1 text-xs text-gray-400">
                  {item.duration} phút • {item.totalListen} lượt nghe
                </div>
                {item.scoreContent > 0 && (
                  <div className="flex items-center mt-1 text-xs text-yellow-500">
                    {'★'.repeat(Math.floor(item.scoreContent))}
                    {item.scoreContent % 1 !== 0 && '★'.slice(0, 1)}
                    { '☆'.repeat(5 - Math.ceil(item.scoreContent))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phần Kinh doanh - Khởi nghiệp */}
      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold text-white">Kinh doanh - Khởi nghiệp</h2>
          <button className="text-xl text-white">{'>'}</button>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max md:grid md:grid-cols-5 md:min-w-0">
            {businessItems.map((item) => (
              <button
                key={item.id}
                className="relative w-[160px] md:w-auto text-left focus:outline-none"
                onClick={() => handleBookClick(item)}
              >
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
                  <Image
                    src={"/app.body/kinhdoanh-khoinghiep.png"}               
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 160px, 20vw"
                  />
                  {item.isHot === 1 && (
                    <div className="absolute top-2 right-2 px-2 py-1 text-xs text-white bg-orange-500 rounded-full">
                      COIN
                    </div>
                  )}
                </div>
                <h3 className="mt-2 text-xs text-white truncate line-clamp-1">{item.name}</h3>
                <div className="mt-1 text-xs text-gray-400">
                  {item.duration} phút • {item.totalListen} lượt nghe
                </div>
                {item.scoreContent > 0 && (
                  <div className="flex items-center mt-1 text-xs text-yellow-500">
                    {'★'.repeat(Math.floor(item.scoreContent))}
                    {item.scoreContent % 1 !== 0 && '★'.slice(0, 1)}
                    { '☆'.repeat(5 - Math.ceil(item.scoreContent))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

    </main>
  );
}