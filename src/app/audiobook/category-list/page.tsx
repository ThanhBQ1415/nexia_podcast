'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

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

interface Category { // Updated interface to match API response
  id: number;
  title: string;
}

export default function CategoryListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId') || 'all'; // Lấy categoryId từ URL
  const categoryName = searchParams.get('name') || 'Sách nói chất lượng';
  const [categoryItems, setCategoryItems] = useState<CateItem[]>([]);
  const [activeTab, setActiveTab] = useState(categoryId); // Khởi tạo activeTab bằng categoryId từ URL
  const [showSortDialog, setShowSortDialog] = useState(false);
  const [sortBy, setSortBy] = useState('all'); // Thêm state để theo dõi tiêu chí sắp xếp
  const [originalItems, setOriginalItems] = useState<CateItem[]>([]); // Thêm state để lưu danh sách gốc
  const [categories, setCategories] = useState<Category[]>([]); // State để lưu danh sách thể loại từ API

  // Danh sách các tùy chọn sắp xếp
  const sortOptions = [
    { id: 'all', name: 'Tất cả' },
    { id: 'newest', name: 'Mới nhất' },
    { id: 'oldest', name: 'Cũ nhất' },
    { id: 'free', name: 'Miễn phí' },
  ];

  // Fetch category list from API
  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        // Kiểm tra cache trước
        const cachedData = localStorage.getItem('audiobook_category_list');
        if (cachedData) {
          setCategories([{ id: 0, title: 'Tất cả' }, ...JSON.parse(cachedData)]);
          return;
        }

        const response = await fetch('http://192.168.1.88:8386/nexia-service/v1/common/list-category?type=1&page=0&size=10');
        const data = await response.json();
        if (data.code === 200) {
          // Add 'Tất cả' option at the beginning
          setCategories([{ id: 0, title: 'Tất cả' }, ...data.data]);
          // Lưu vào cache
          localStorage.setItem('audiobook_category_list', JSON.stringify(data.data));
        } else {
          console.error('Error fetching category list:', data.message);
        }
      } catch (error) {
        console.error('Error fetching category list:', error);
      }
    };

    fetchCategoryList();
  }, []);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        // Xây dựng URL với tham số thể loại nếu không phải 'all'
        let url = 'http://192.168.1.88:8386/nexia-service/v1/common/category?page=0&size=10&type=1';

        // Thêm tham số categoryId nếu activeTab không phải 'all' (hoặc id 0)
        if (activeTab !== 'all' && activeTab !== '0') {
          url += `&categoryId=${activeTab}`;
        }

        // Luôn lấy dữ liệu theo id:asc để đảm bảo thứ tự nhất quán
        url += '&sort=id:asc';

        // Tạo cache key dựa trên URL để lưu trữ riêng cho mỗi category
        const cacheKey = `audiobook_category_items_${activeTab}`;

        // Kiểm tra cache trước
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const items = JSON.parse(cachedData);
          setOriginalItems(items);
          let sortedItems = [...items];

      
          if (sortBy === 'newest') {
            sortedItems = sortedItems.sort((a, b) => {
              const [da, ma, ya] = a.publisherDate.split('/').map(Number);
              const [db, mb, yb] = b.publisherDate.split('/').map(Number);
              const dateA = new Date(ya, ma - 1, da);
              const dateB = new Date(yb, mb - 1, db);
              return dateB.getTime() - dateA.getTime();
            });
          } else if (sortBy === 'oldest') {
            sortedItems = sortedItems.sort((a, b) => {
              const [da, ma, ya] = a.publisherDate.split('/').map(Number);
              const [db, mb, yb] = b.publisherDate.split('/').map(Number);
              const dateA = new Date(ya, ma - 1, da);
              const dateB = new Date(yb, mb - 1, db);
              return dateA.getTime() - dateB.getTime();
            });
          }

          setCategoryItems(sortedItems);
          return;
        }

        const response = await fetch(url);
        const data = await response.json();
        if (data.code === 200) {
          const items = data.data.cateItem;
          setOriginalItems(items);

          // Lưu vào cache
          localStorage.setItem(cacheKey, JSON.stringify(items));

          let sortedItems = [...items];


          if (sortBy === 'newest') {
            sortedItems = sortedItems.sort((a, b) => {
              const [da, ma, ya] = a.publisherDate.split('/').map(Number);
              const [db, mb, yb] = b.publisherDate.split('/').map(Number);
              const dateA = new Date(ya, ma - 1, da);
              const dateB = new Date(yb, mb - 1, db);
              return dateB.getTime() - dateA.getTime();
            });
          } else if (sortBy === 'oldest') {
            sortedItems = sortedItems.sort((a, b) => {
              const [da, ma, ya] = a.publisherDate.split('/').map(Number);
              const [db, mb, yb] = b.publisherDate.split('/').map(Number);
              const dateA = new Date(ya, ma - 1, da);
              const dateB = new Date(yb, mb - 1, db);
              return dateA.getTime() - dateB.getTime();
            });
          }

          setCategoryItems(sortedItems);
        }
      } catch (error) {
        console.error('Error fetching category items:', error);
      }
    };
    fetchCategoryItems();
  }, [activeTab, sortBy]);

  // Hàm xử lý khi chọn tùy chọn sắp xếp
  const handleSortOptionSelect = (sortId: string) => {
    setSortBy(sortId);
    setShowSortDialog(false);
  };

  const handleBack = () => {
    router.push('/')
  };

  const handleBookClick = (book: CateItem) => {
    router.push(`/audiobook/audiobookdetail?id=${book.id}`);
  };

  const handleTabChange = (tabId: number | string) => { // Accept number or string for 'all'
    setActiveTab(String(tabId)); // Ensure activeTab is always a string
  };

  const toggleSortDialog = () => {
    setShowSortDialog(!showSortDialog);
  };

  const handleSortOptionClick = (option: string) => {
    console.log(`Sắp xếp theo: ${option}`);
    setSortBy(option);
    setShowSortDialog(false);
  };

  return (
    <main className="w-full min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden">
      <div className="flex items-center justify-between p-4 bg-[#0f0f0f] sticky top-0 z-20">
        <button onClick={handleBack} className="text-white transition-opacity hover:opacity-80">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="hidden md:block">
          <h1 className="text-lg font-medium md:text-xl">{categoryName}</h1>
        </div>
        <div className="block md:hidden">
          <span className="text-base font-medium">{categoryName}</span>
        </div>
        <button className="ml-auto text-white rounded-md transition-opacity hover:opacity-80" onClick={toggleSortDialog}>
          <Image 
            src="/app.body/iconcategory-list.png"
            alt="Category list icon"
            width={32}
            height={32}
            className="w-6 h-6 md:w-8 md:h-8"
          />
        </button>
      </div>

      {/* Sort Dialog */}
      {showSortDialog && (
        <div className="fixed right-4 top-16 z-30 bg-[#333333] rounded-lg shadow-lg w-48 md:w-56">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              className="block w-full text-left px-4 py-3 text-sm md:text-base hover:bg-[#444444] transition-colors"
              onClick={() => handleSortOptionClick(option.id)}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex overflow-x-auto p-2 space-x-2 bg-[#1a1a1a] scrollbar-hide sticky top-16 z-10">
        {categories.map((category) => ( // Map over fetched categories
          <button
            key={category.id}
            className={`px-4 md:px-6 py-2 text-sm md:text-base rounded-full whitespace-nowrap transition-all duration-150
              ${activeTab === String(category.id) // Compare with string version of id
                ? 'bg-white text-black font-semibold shadow-md'
                : 'bg-[#222] text-white hover:bg-[#333]'
              }`}
            onClick={() => handleTabChange(category.id)} // Pass category.id
          >
            {category.title} {/* Use category.title */}
          </button>
        ))}
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 md:p-6">
        {categoryItems.map((item) => (
          <div 
            key={item.id} 
            className="relative transition-transform duration-200 transform cursor-pointer hover:scale-105"
            onClick={() => handleBookClick(item)}
          >
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
              <Image
                src={"/app.body/echoes.png"}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
              />
              {item.isHot === 1 && (
                <div className="absolute top-2 right-2 px-2 py-1 text-xs text-white bg-yellow-500 rounded-full md:text-sm">
                  HOT
                </div>
              )}
              {item.typeEarn === 1 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 text-xs text-white bg-green-500 rounded-full md:text-sm">
                  VIP
                </div>
              )}
            </div>
            <h3 className="mt-2 text-sm font-medium text-white truncate md:text-base line-clamp-1">{item.name}</h3>
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
          </div>
        ))}
      </div>
    </main>
  );
}