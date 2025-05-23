'use client'
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface CateItem {
  id: number;
  name: string;
  image: string;
  description: string;
  publisher: number;
  publisherDate: string;
  reader: number;
  typeEarn: number;
  numberFreeChap: number; // Thêm trường này để hiển thị số chương
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

interface Category { // Define interface for Category from API
  id: number;
  title: string;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trendingItems, setTrendingItems] = useState<CateItem[]>([]);
  const [spiritualItems, setSpiritualItems] = useState<CateItem[]>([]);
  const [businessItems, setBusinessItems] = useState<CateItem[]>([]);
  const [newBooks, setNewBooks] = useState<CateItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // New state for categories
  const router = useRouter();
  const totalSlides = 5;

  // Refs và states mới cho phần 'Sách mới'
  const outerContainerRef = useRef<HTMLDivElement>(null); // Ref cho div overflow-hidden
  const flexContentRef = useRef<HTMLDivElement>(null); // Ref cho div flex chứa các sách
  const [selectedBookIndex, setSelectedBookIndex] = useState(0); // Index của sách đang chọn (mặc định là 0 hoặc sách đầu tiên)

  // Kích thước cố định cho sách và khoảng cách
  const BOOK_WIDTH_SELECTED = 200;
  const BOOK_HEIGHT_SELECTED = 270;
  const BOOK_WIDTH_UNSELECTED = 145;
  const BOOK_HEIGHT_UNSELECTED = 215;
  const GAP = 10; // Khoảng cách giữa các sách (giảm xuống)

  // Define border colors to cycle through
  const borderColors = [
    'border-green-500',
    'border-orange-500',
    'border-purple-500',
    'border-yellow-500',
    'border-blue-500',
    'border-gray-500',
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
        const response = await fetch('http://192.168.1.88:8386/nexia-service/v1/common/category?sort=date:desc&page=0&size=10&type=0');
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
        const response = await fetch('http://192.168.1.88:8386/nexia-service/v1/common/category?sort=date:desc&page=0&size=10&type=0');
        const data = await response.json();
        if (data.code === 200) {
          setBusinessItems(data.data.cateItem);
        }
      } catch (error) {
        console.error('Error fetching business items:', error);
      }
    };

    const fetchNewBooks = async () => {
      try {
        const response = await fetch('http://192.168.1.88:8386/nexia-service/v1/common/category?sort=date:desc&page=0&size=10&type=0');
        const data = await response.json();
        if (data.code === 200) {
          setNewBooks(data.data.cateItem);
          // Khi dữ liệu sách mới được tải, đặt sách thứ hai (index 1) làm mặc định
          if (data.data.cateItem.length > 1) {
            setSelectedBookIndex(1);
          } else if (data.data.cateItem.length === 1) {
            setSelectedBookIndex(0); // Nếu chỉ có 1 sách, chọn sách đó
          }
        }
      } catch (error) {
        console.error('Error fetching new books:', error);
      }
    };

    // Fetch categories from the new API
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://192.168.1.88:8386/nexia-service/v1/common/list-category?type=0&page=0&size=10');
        const data = await response.json();
        if (data.code === 200) {
          setCategories(data.data); // Set categories state with fetched data
        } else {
          console.error('Error fetching categories:', data.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };


    fetchTrendingItems();
    fetchSpiritualItems();
    fetchBusinessItems();
    fetchNewBooks();
    fetchCategories(); // Fetch categories
  }, []);

  // useEffect để xử lý việc căn giữa sách mới
  useEffect(() => {
    if (outerContainerRef.current && flexContentRef.current && newBooks.length > 0) {
      const containerWidth = outerContainerRef.current.offsetWidth;

      let widthBeforeSelected = 0;
      // Tính toán tổng chiều rộng của các sách trước sách được chọn
      for (let i = 0; i < selectedBookIndex; i++) {
        // Tất cả sách trước sách được chọn được coi là có kích thước 'unselected'
        widthBeforeSelected += BOOK_WIDTH_UNSELECTED + GAP;
      }

      // Vị trí trung tâm của sách được chọn so với điểm bắt đầu của container flex
      const centerOfSelectedBookInFlex = widthBeforeSelected + (BOOK_WIDTH_SELECTED / 2);

      // Vị trí trung tâm mong muốn trong vùng hiển thị
      const desiredCenterInContainer = containerWidth / 2;

      // Giá trị translateX cần thiết để dịch chuyển toàn bộ container flex
      const translateXValue = desiredCenterInContainer - centerOfSelectedBookInFlex;

      flexContentRef.current.style.transform = `translateX(${translateXValue}px)`;
    }
  }, [selectedBookIndex, newBooks.length]); // Dependencies: selectedBookIndex và số lượng sách

  const handleBookClick = (book: CateItem) => {
    router.push(`podcastdetail?id=${book.id}`);
  };

  const handleBookSelect = (book: CateItem, index: number) => {
    // Cho phép chọn sách nếu nó là sách được chọn hiện tại
    // Hoặc nếu nó là sách liền kề (trước hoặc sau) sách được chọn hiện tại
    if (index === selectedBookIndex || Math.abs(index - selectedBookIndex) === 1) {
      setSelectedBookIndex(index);
    }
  };

  const handlePlayClick = (e: React.MouseEvent, book: CateItem) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra button cha (handleBookSelect)
    router.push(`podcastdetail?id=${book.id}`);
  };

  // Tính toán khoảng cách margin top để căn chỉnh dọc các sách nhỏ
  const verticalOffset = (BOOK_HEIGHT_SELECTED - BOOK_HEIGHT_UNSELECTED) / 2;


  return (
    <main className="w-screen min-h-screen bg-[#1a1a1a]" >
      <div className="h-6 bg-[#1a1a1a]"></div>

      {/* Phần Sách mới */}
      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full mt-4">
        <div className="flex justify-between items-center mb-3">
        </div>
        {/* Container cha có overflow-hidden để cắt các sách bị dịch chuyển ra ngoài */}
        <div className="overflow-hidden" ref={outerContainerRef}>
          {/* Container flex chứa tất cả các sách, sẽ được áp dụng transform */}
          <div
            className="flex items-center transition-transform duration-300"
            style={{ gap: `${GAP}px` }} // Áp dụng khoảng cách
            ref={flexContentRef}
          >
            {newBooks.map((item, index) => {
              const isSelected = index === selectedBookIndex;
              const isBeforeSelected = index === selectedBookIndex - 1;
              const isAfterSelected = index === selectedBookIndex + 1;

              // Quyết định liệu sách có nên hiển thị rõ ràng hay không
              const shouldBeVisible = isSelected || isBeforeSelected || isAfterSelected;

              return (
                <button
                  key={item.id}
                  className={`relative text-left transition-all duration-300 focus:outline-none`}
                  style={{
                    width: isSelected ? `${BOOK_WIDTH_SELECTED}px` : `${BOOK_WIDTH_UNSELECTED}px`,
                    height: isSelected ? `${BOOK_HEIGHT_SELECTED}px` : `${BOOK_HEIGHT_UNSELECTED}px`,
                    flexShrink: 0, // Ngăn sách bị co lại
                    // Áp dụng opacity và pointerEvents để ẩn/hiện và điều khiển tương tác
                    opacity: shouldBeVisible ? '1' : '0',
                    pointerEvents: shouldBeVisible ? 'auto' : 'none',
                    // Căn chỉnh dọc các sách nhỏ để nằm giữa sách lớn
                    marginTop: isSelected ? '0' : `${verticalOffset}px`,
                  }}
                  onClick={() => handleBookSelect(item, index)}
                >
                  <div className="overflow-hidden relative w-full h-full rounded-lg">
                    <Image
                      src={`/app.body/sach${(index % 5) + 1}.png`} // Đường dẫn ảnh giả định
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes={isSelected ? '227px' : '160px'}
                    />
                    <div
                      className="absolute right-2 bottom-2 flex-shrink-0 w-10 h-10 cursor-pointer"
                      onClick={(e) => handlePlayClick(e, item)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="#212121" fillOpacity="0.7"/>
                        <path d="M14.1406 29.375V10.625C14.1406 9.68907 15.1838 9.13079 15.9625 9.64993L30.025 19.0249C30.7208 19.4888 30.7208 20.5112 30.025 20.9751L15.9625 30.3501C15.1838 30.8692 14.1406 30.311 14.1406 29.375Z" fill="#E6F9ED"/>
                      </svg>
                    </div>
                  </div>


                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Các phần khác của trang (giữ nguyên) */}
      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full mt-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold text-white">Thể loại</h2>
          <button
            className="text-xl text-white"
            onClick={() => router.push('/audiobook/category')} // Link to the category list page
          >
            {'>'}
          </button>
        </div>
        {/* Responsive: mobile -> wrap, desktop -> full width, chia đều */}
        <div className="md:flex md:flex-nowrap md:gap-2">
          {/* Mobile: First row */}
          <div className="flex flex-wrap gap-2 md:flex-nowrap md:flex-1">
            {categories.slice(0, 4).map((category, index) => ( // Display first 3 categories
              <button
                key={category.id}
                className={`flex items-center bg-[#1a1a1a] text-white text-sm px-3 py-2 rounded-category border-l-4 ${borderColors[index % borderColors.length]} md:flex-1`}
                onClick={() => router.push(`/audiobook/category-list?categoryId=${category.id}&name=${encodeURIComponent(category.title)}`)} // Pass category id and name
              >
                {category.title} {/* Use category.title */}
              </button>
            ))}
          </div>
          {/* Mobile: Second row */}
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0 md:flex-nowrap md:flex-1">
             {categories.slice(5, 6).map((category, index) => ( // Display next 3 categories
              <button
                key={category.id}
                className={`flex items-center bg-[#1a1a1a] text-white text-sm px-3 py-2 rounded-category border-l-4 ${borderColors[(index + 3) % borderColors.length]} md:flex-1`} // Offset index for color cycling
                onClick={() => router.push(`/audiobook/category-list?categoryId=${category.id}&name=${encodeURIComponent(category.title)}`)} // Pass category id and name
              >
                {category.title} {/* Use category.title */}
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

      {/* Danh sách sách mới */}
      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold text-white">Tập mới ra mắt</h2>
            <button className="text-xl text-white">{'>'}</button>
          </div>
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
                  {/* NEW VIP Icon */}
                  <div className="absolute top-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="14" viewBox="0 0 36 14" fill="none">
                      <path d="M36 4C36 1.79086 34.2091 0 32 0H0L2.65574 7L0 14H36V4Z" fill="url(#paint0_linear_4130_526)"/>
                      <defs>
                        <linearGradient id="paint0_linear_4130_526" x1="-1.07288e-06" y1="14" x2="29.847" y2="-8.25281" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FB9400"/>
                          <stop offset="1" stopColor="#FFAB38"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm text-white line-clamp-1">{item.name}</h3>
                  <div className="flex gap-2 items-center mt-1">
                  </div>
                  {/* New content: Duration and Chapters */}
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    {/* Clock Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                      <path d="M8.99957 3.4873C5.41457 3.4873 2.49707 6.4048 2.49707 9.9898C2.49707 13.5748 5.41457 16.4998 8.99957 16.4998C12.5846 16.4998 15.5021 13.5823 15.5021 9.9973C15.5021 6.4123 12.5846 3.4873 8.99957 3.4873ZM9.56207 9.7498C9.56207 10.0573 9.30707 10.3123 8.99957 10.3123C8.69207 10.3123 8.43707 10.0573 8.43707 9.7498V5.9998C8.43707 5.6923 8.69207 5.4373 8.99957 5.4373C9.30707 5.4373 9.56207 5.6923 9.56207 5.9998V9.7498Z" fill="#9E9E9E"/>
                      <path d="M11.167 2.5875H6.83199C6.53199 2.5875 6.29199 2.3475 6.29199 2.0475C6.29199 1.7475 6.53199 1.5 6.83199 1.5H11.167C11.467 1.5 11.707 1.74 11.707 2.04C11.707 2.34 11.467 2.5875 11.167 2.5875Z" fill="#9E9E9E"/>
                    </svg>
                    <span className="ml-1">{item.duration} phút</span>
                    <span className="mx-2">•</span>

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

      {/* Nút VIP */}
      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full ">
        <button
          className="w-full bg-[#FFA500] text-white py-3  font-medium text-center rounded-full"
        >
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
      {/*Văn hóa*/}
      <div className="bg-[#0f0f0f] p-4 rounded-lg w-full ">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold text-white">Văn hóa</h2>
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


    </main>
  );
}