'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import useSWR from 'swr'; // Import useSWR
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

interface Category {
  id: number;
  title: string;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trendingItems, setTrendingItems] = useState<CateItem[]>([]);
  const [spiritualItems, setSpiritualItems] = useState<CateItem[]>([]);
  const [businessItems, setBusinessItems] = useState<CateItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // New state for categories
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
    const fetchData = async () => {
      const fetchTrendingItems = async () => {
        try {
          const response = await fetch('http://192.168.1.88:8386/nexia-service/v1/common/trending?type=1&page=0&size=10');
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

      // Fetch categories from the new API
      const fetchCategories = async () => {
        try {
          const response = await fetch('http://192.168.1.88:8386/nexia-service/v1/common/list-category?type=1&page=0&size=10');
          const data = await response.json();
          if (data.code === 200) {
            setCategories(data.data);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };


      // Add auto login
      try {
        const response = await fetch('http://192.168.1.88:8386/nexia-service/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "username": "TestUser2",
            "password": "123456a@A"
          }),
        });

        const data = await response.json();

        if (response.ok && data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          console.log('Auto login successful, accessToken stored:', data.accessToken);
        } else {
          console.error('Auto login failed:', data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error during auto login:', error);
      }

      // Execute all fetch functions
      await Promise.all([
        fetchTrendingItems(),
        fetchSpiritualItems(),
        fetchBusinessItems(),
        fetchCategories() // Fetch categories
      ]);
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  const handleBookClick = (book: CateItem) => {
    router.push(`/audiobook/audiobookdetail?id=${book.id}`);
  };

  // Define border colors to cycle through
  const borderColors = [
    'border-green-500',
    'border-orange-500',
    'border-purple-500',
    'border-yellow-500',
    'border-blue-500',
    'border-gray-500',
  ];


  return (
    <main className="w-screen min-h-screen bg-[#1a1a1a] md:container md:mx-auto md:px-4" >
      <div className="h-6 bg-[#1a1a1a]"></div>
      <div className="relative w-[343px] h-[140px] md:w-full md:h-[560px] object-cover rounded-xl overflow-hidden bg-black mx-auto flex justify-center">
        <Image
          src={images[currentSlide]}
          alt={`Podcast background ${currentSlide + 1}`}
          fill
          quality={100}
          priority
          className="object-cover"
          sizes="(max-width: 768px) 343px, 100vw"
        />
      </div>
      <div className="h-6 bg-[#1a1a1a]"></div>
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, index) => (
          <div
            key={index} // Thêm thuộc tính key với giá trị index
            onClick={() => handleSlideChange(index)}
            className={`h-3 rounded-full cursor-pointer transition-all duration-300 ${
              index === currentSlide ? 'bg-green-500 w-13' : 'bg-gray-700 hover:bg-gray-600 w-3'
            }`}
            aria-label={`Chuyển đến slide ${index + 1}`}
          >
          </div>
        ))}
      </div>

      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full mt-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold text-white">Thể loại</h2>
          <button
            className="text-xl text-white"
            onClick={() => router.push('/audiobook/category')}
          >
            {'>'}
          </button>
        </div>
        {/* Responsive: mobile -> wrap, desktop -> full width, chia đều */}
        <div className="md:flex md:flex-nowrap md:gap-2">
          {/* Mobile: First row */}
          <div className="flex flex-wrap gap-2 md:flex-nowrap md:flex-1">
            {categories.slice(0, 3).map((category, index) => ( // Display first 3 categories
              <button
                key={category.id}
                className={` rounded-category flex items-center bg-[#1a1a1a] text-white text-sm px-3 py-2 rounded-md border-l-4 ${borderColors[index % borderColors.length]} md:flex-1`} // Removed flex-1 here
                onClick={() => router.push(`/audiobook/category-list?name=${encodeURIComponent(category.title)}`)}
              >
                {category.title}
              </button>
            ))}
          </div>
          {/* Mobile: Second row */}
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0 md:flex-nowrap md:flex-1 rounded-category">
             {categories.slice(3, 6).map((category, index) => ( // Display next 3 categories
              <button
                key={category.id}
                className={`flex items-center bg-[#1a1a1a] text-white text-sm px-3 py-2 rounded-category border-l-4 ${borderColors[(index + 3) % borderColors.length]} md:flex-1`} // Removed flex-1 here
                onClick={() => router.push(`/audiobook/category-list?name=${encodeURIComponent(category.title)}`)}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full ">
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
      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full ">
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
      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full ">
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

      {/* Cập nhật phần categories */}
      <div className="bg-[#0f0f0f] p-4 md:p-6 rounded-lg w-full mt-4">
        <div className="flex justify-between items-center mb-3 md:mb-5">
          <h2 className="text-base font-semibold text-white md:text-xl">Thể loại</h2>
          <button
            className="text-xl text-white transition-colors hover:text-green-500"
            onClick={() => router.push('/audiobook/category')}
          >
            {'>'}
          </button>
        </div>
        <div className="md:flex md:flex-nowrap md:gap-4">
          {/* First row */}
          <div className="flex flex-wrap gap-2 md:gap-4 md:flex-nowrap md:flex-1">
            {categories.slice(0, 3).map((category, index) => (
              <button
                key={category.id}
                className={`rounded-category flex items-center bg-[#1a1a1a] text-white text-sm md:text-base px-3 py-2 md:py-3 rounded-md border-l-4 ${borderColors[index % borderColors.length]} md:flex-1 hover:bg-[#2a2a2a] transition-colors`}
                onClick={() => router.push(`/audiobook/category-list?name=${encodeURIComponent(category.title)}`)}
              >
                {category.title}
              </button>
            ))}
          </div>
          {/* Second row */}
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0 md:gap-4 md:flex-nowrap md:flex-1">
            {categories.slice(3, 6).map((category, index) => (
              <button
                key={category.id}
                className={`flex items-center bg-[#1a1a1a] text-white text-sm md:text-base px-3 py-2 md:py-3 rounded-md border-l-4 ${borderColors[(index + 3) % borderColors.length]} md:flex-1 hover:bg-[#2a2a2a] transition-colors`}
                onClick={() => router.push(`/audiobook/category-list?name=${encodeURIComponent(category.title)}`)}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cập nhật phần Trending */}
      <div className="bg-[#0f0f0f] p-4 md:p-6 rounded-lg w-full">
        <div className="flex justify-between items-center mb-3 md:mb-5">
          <h2 className="text-base font-semibold text-white md:text-xl">Trending</h2>
          <button className="text-xl text-white transition-colors hover:text-green-500">{'>'}</button>
        </div>
        <div className="overflow-x-auto md:overflow-visible">
          <div className="flex gap-4 min-w-max md:grid md:grid-cols-5 md:gap-6 md:min-w-0">
            {trendingItems.map((item) => (
              <button
                key={item.id}
                className="relative w-[160px] md:w-auto text-left focus:outline-none group"
                onClick={() => handleBookClick(item)}
              >
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden group-hover:transform group-hover:scale-105 transition-transform">
                  <Image
                    src={"/app.body/echoes.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 160px, 20vw"
                  />
                  {item.isHot === 1 && (
                    <div className="absolute top-2 right-2 px-2 py-1 text-xs text-white bg-yellow-500 rounded-full md:text-sm">
                      HOT
                    </div>
                  )}
                </div>
                <h3 className="mt-2 text-xs text-white truncate transition-colors md:text-sm line-clamp-1 group-hover:text-green-500">{item.name}</h3>
                <div className="mt-1 text-xs text-gray-400 md:text-sm">
                  {item.duration} phút • {item.totalListen} lượt nghe
                </div>
                {item.scoreContent > 0 && (
                  <div className="flex items-center mt-1 text-xs text-yellow-500 md:text-sm">
                    {'★'.repeat(Math.floor(item.scoreContent))}
                    {item.scoreContent % 1 !== 0 && '★'.slice(0, 1)}
                    {'☆'.repeat(5 - Math.ceil(item.scoreContent))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phần Tâm linh - Tinh thần */}
      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full ">
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
      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full ">
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

      {/* Nút VIP */}
      <div className="bg-[#0f0f0f] p-4 md:p-6 rounded-lg w-full">
        <button className="w-full bg-[#FFA500] text-white py-3 md:py-4 rounded-full font-medium text-center text-sm md:text-base hover:bg-[#FF8C00] transition-colors">
          Nghe VIP chỉ từ 8.999 đ
        </button>
      </div>

      {/* Banner World Book Day */}
      <div className="bg-[#0f0f0f] p-0 md:p-4 rounded-lg w-full">
        <div className="relative w-screen left-[calc(-50vw+50%)] md:left-0 md:w-[1372px] h-[180px] md:h-[400px] overflow-hidden md:mx-auto">
          <div className="absolute inset-0">
            <Image
              src="/app.body/world-book-day.png"
              alt="World Book Day"
              fill
              className="object-contain md:object-fill"
              sizes="(max-width: 768px) 100vw, 1372px"
              priority
            />
          </div>
        </div>
      </div>

      {/* Danh sách sách mới */}
      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full">
  <div className="flex flex-col gap-4">
    {businessItems.map((item, index) => (
      <React.Fragment key={item.id}>
        <button
          className="flex gap-4 items-center w-full text-left focus:outline-none"
          onClick={() => handleBookClick(item)}
        >
          <div className="relative w-[120px] h-[120px] rounded-lg overflow-hidden">
            <Image
              src={`/app.body/sach${index + 1}.png`}
              alt={item.name}
              fill
              className="object-cover"
              sizes="120px"
            />
            <div className="absolute top-0 right-0 px-2 py-1 text-xs text-white bg-[#8B5CF6] rounded-bl-lg">
              FREE
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm text-white line-clamp-1">{item.name}</h3>
            <div className="flex gap-2 items-center mt-1">
              <div className="flex items-center">
                <Image
                  src="/app.body/tacgia.png"
                  alt="Author"
                  width={30}
                  height={30}
                />
                <span className="ml-1 text-xs text-gray-400">Keith D.Harrell</span>
              </div>
            </div>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                <Image
                  src="/app.body/star.png"
                  alt="Star Rating"
                  width={20}
                  height={20}
                />
              </div>
              <span className="ml-1 text-xs text-gray-400">
                {item.scoreContent.toFixed(1)} ({item.totalListen})
              </span>
            </div>
            <div className="mt-1 text-xs text-gray-400 line-clamp-1">
              {item.description}
            </div>
          </div>
        </button>
        {index < businessItems.length - 1 && (
          <div className="w-full h-[1px] bg-gray-800"></div>
        )}
      </React.Fragment>
    ))}
  </div>
</div>


    </main>
  );
}