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

export default function CategoryListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryName = searchParams.get('name') || 'Sách nói chất lượng';
  const [categoryItems, setCategoryItems] = useState<CateItem[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showSortDialog, setShowSortDialog] = useState(false);
  const [sortBy, setSortBy] = useState('all'); // Thêm state để theo dõi tiêu chí sắp xếp

  // Danh sách các thể loại
  const categories = [
    { id: 'all', name: 'Tất cả', icon: '/iconcategory-list/all-icon.png' },
    { id: 'tamlinh', name: 'Tâm linh', icon: '/iconcategory-list/tamlinh-icon.png' },
    { id: 'hoiky', name: 'Hồi ký và tiểu sử', icon: '/iconcategory-list/hoiky-icon.png' },
    { id: 'kinhte', name: 'Kinh tế', icon: '/iconcategory-list/kinhte-icon.png' },
    { id: 'taichinh', name: 'Tài chính, đầu tư', icon: '/iconcategory-list/taichinh-icon.png' },
    { id: 'lichsu', name: 'Lịch sử, Văn hoá', icon: '/iconcategory-list/lichsu-icon.png' },
    { id: 'quanly', name: 'Quản lý công ty', icon: '/iconcategory-list/quanly-icon.png' },
  ];

  // Danh sách các tùy chọn sắp xếp
  const sortOptions = [
    { id: 'all', name: 'Tất cả' },
    { id: 'newest', name: 'Mới nhất' },
    { id: 'oldest', name: 'Cũ nhất' },
    { id: 'free', name: 'Miễn phí' },
  ];

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        let url = 'http://192.168.1.88:8386/nexia-service/v1/common/category?page=0&size=10&type=1';
        if (sortBy === 'newest') {
          url += '&sort=publisherDate:desc';
        } else if (sortBy === 'oldest') {
          url += '&sort=publisherDate:asc';
        } else {
          url += '&sort=id:asc';
        }
        const response = await fetch(url);
        const data = await response.json();
        if (data.code === 200) {
          let items = data.data.cateItem;
          if (sortBy === 'newest') {
            // Sắp xếp tăng dần theo publisherDate (ngày cũ lên trước)
            items = [...items].sort((a, b) => {
              const [da, ma, ya] = a.publisherDate.split('/').map(Number);
              const [db, mb, yb] = b.publisherDate.split('/').map(Number);
              const dateA = new Date(ya, ma - 1, da);
              const dateB = new Date(yb, mb - 1, db);
              return dateA.getTime() - dateB.getTime();
            });
          } else if (sortBy === 'oldest') {
            // Sắp xếp giảm dần theo publisherDate (ngày mới lên trước)
            items = [...items].sort((a, b) => {
              const [da, ma, ya] = a.publisherDate.split('/').map(Number);
              const [db, mb, yb] = b.publisherDate.split('/').map(Number);
              const dateA = new Date(ya, ma - 1, da);
              const dateB = new Date(yb, mb - 1, db);
              return dateB.getTime() - dateA.getTime();
            });
          }
          setCategoryItems(items);
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
    router.back();
  };

  const handleBookClick = (book: CateItem) => {
    router.push(`/audiobookdetail?product=${JSON.stringify(book)}`);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const toggleSortDialog = () => {
    setShowSortDialog(!showSortDialog);
  };

  const handleSortOptionClick = (option: string) => {
    // Xử lý khi người dùng chọn tùy chọn sắp xếp
    console.log(`Sắp xếp theo: ${option}`);
    setShowSortDialog(false);
  };

  return (
    <main className="w-screen min-h-screen bg-[#1a1a1a] text-white">
      <div className="flex items-center justify-between p-4 bg-[#0f0f0f]">
        <button onClick={handleBack} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="hidden md:block">
          <h1 className="text-base font-medium">Sách nói chất lượng</h1>
        </div>
        <div className="block md:hidden">
          <span className="text-base font-medium">Sách nói chất lượng</span>
        </div>
        <button className="ml-auto text-white rounded-md" onClick={toggleSortDialog}>
          <Image 
            src="/app.body/iconcategory-list.png"
            alt="Category list icon"
            width={32}
            height={32}
          />
        </button>
      </div>

      {/* Sort Dialog */}
      {showSortDialog && (
        <div className="absolute right-4 top-16 z-10 bg-[#333333] rounded-lg shadow-lg w-48">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              className="block w-full text-left px-4 py-3 text-sm hover:bg-[#444444]"
              onClick={() => handleSortOptionClick(option.id)}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex overflow-x-auto p-2 space-x-2 bg-[#1a1a1a]">
        {categories.map((category) => (
          <button 
            key={category.id}
            className={`px-6 py-2 text-sm rounded-full whitespace-nowrap transition-all duration-150
              ${activeTab === category.id 
                ? 'bg-white text-black font-semibold shadow-md' 
                : 'bg-[#222] text-white'
              }`}
            onClick={() => handleTabChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>



      {/* Book Grid */}
      <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
        {categoryItems.map((item) => (
          <div 
            key={item.id} 
            className="relative cursor-pointer"
            onClick={() => handleBookClick(item)}
          >
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
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
              {item.typeEarn === 1 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 text-xs text-white bg-green-500 rounded-full">
                  VIP
                </div>
              )}
            </div>
            <h3 className="mt-2 text-sm text-white truncate line-clamp-1">{item.name}</h3>
            <div className="mt-1 text-xs text-gray-400">
              {item.duration} phút • {item.totalListen} lượt nghe
            </div>
            {item.scoreContent > 0 && (
              <div className="flex items-center mt-1 text-xs text-yellow-500">
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