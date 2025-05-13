"use client"
import { useState } from 'react';
import { BellRing, Info, FileText, MessageSquare, Share2, Star, LogOut, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const router = useRouter();
  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    // Implement logout logic here
    setShowLogoutDialog(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#212121] text-white mx-auto md:max-w-2xl lg:max-w-4xl overflow-x-hidden">
      {/* Header with gradient - custom dimensions and border radius */}
      <div 
        className="w-full max-w-full h-44 md:h-52 lg:h-60 mx-auto rounded-b-2xl relative text-[#FAFAFA] bg-no-repeat"
        style={{ 
          backgroundImage: 'url("app.body/canhanbackground.png")',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h1 className="text-lg font-medium md:text-xl lg:text-2xl">Trang cá nhân</h1>
          <BellRing className="w-6 h-6 md:w-8 md:h-8" />
        </div>

        {/* User profile section */}
        <div className="flex items-center px-4 pb-4">
          {/* Avatar */}
          <div className="relative mr-3">
            <div className="flex overflow-hidden justify-center items-center w-10 h-10 bg-gray-700 rounded-full md:w-12 md:h-12">
              <img src="/api/placeholder/40/40" alt="User avatar" className="object-cover w-full h-full" />
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full border-2 border-[#212121]"></div>
          </div>

          {/* User info */}
          <div className="flex-1">
            <div className="flex items-center space-x-1">
              <h2 className="font-medium text-sm md:text-base lg:text-lg text-[#FAFAFA]">Chanon2k</h2>
              <img 
                src="app.body/edituser.png" 
                alt="Edit" 
                className="w-5 h-5 cursor-pointer md:w-6 md:h-6" 
                onClick={() => router.push('/editcanhan')}
              />
            </div>
            <p className="text-xs md:text-sm text-[#FAFAFA] opacity-80">ID: 1908BHT</p>
          </div>

          {/* Nạp xu button */}
          <button
            className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-black rounded-full shadow md:text-sm"
            style={{
              background: 'linear-gradient(180deg, #FACC15 0%, #FFE580 100%)',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
            }}
          >
            <img src="app.body/xu.png" alt="Xu" className="w-4 h-4 md:w-5 md:h-5" />
            Nạp xu
          </button>
        </div>
      </div>

      {/* VIP account and balance section */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-[#181A20]">
        {/* VIP account section */}
        <div className="flex items-center p-3 bg-[#1F222A] rounded-lg w-full h-[67px]">
          <div className="flex items-center w-full">
            <img src="app.body/mienphi.png" alt="VIP" className="mr-2 w-8 h-8" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Tài khoản vip</span>
              <span className="text-xs text-gray-400">Gói miễn phí</span>
            </div>
          </div>    
        </div>

        {/* Current balance */}
        <div className="flex items-center p-3 bg-[#1F222A] rounded-lg w-full h-[67px]">
          <div className="flex items-center w-full">
            <img src="app.body/xu.png" alt="Xu" className="mr-2 w-8 h-8" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Bạn đang có</span>
              <span className="text-xs text-gray-400">0 xu</span>
            </div>
          </div>    
        </div>
      </div>

      {/* Subscription plans */}
      <div className="p-4 bg-[#212121]">
        {/* 3 months plan */}
        
        <div className="flex items-center justify-between p-3 bg-[#1F222A] rounded-lg mb-3 ${selectedPlan === 1 ? 'border-2 border-[#F59E0B]' : ''}" onClick={() => setSelectedPlan(1)}>
          <div className="flex gap-2 items-center">
            <span className="text-base font-medium">159.000 đ</span>
            <span className="text-xs text-gray-400">/1 tháng Vip</span>
          </div>
        </div>

        {/* Monthly plan */}
        <div 
          className={`flex items-center justify-between p-3 bg-[#1F222A] rounded-lg mb-3 ${selectedPlan === 2 ? 'border-2 border-[#F59E0B]' : ''}`}
          onClick={() => setSelectedPlan(2)}
        >
          <div className="flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 line-through">279.000 đ</span>
              <div className="flex items-center">
                <span className="text-base font-medium">159.000 đ</span>
                <span className="ml-1 text-xs text-gray-400">/3 tháng</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex justify-end items-center">
              <span className="text-xs text-white bg-[#F59E0B] px-2 py-0.5 rounded-full">Tiết kiệm 46%</span>
            </div>
            <div className="mt-1 text-xs text-gray-400">53.000đ/tháng</div>
          </div>
        </div>

        {/* Annual plan */}
        <div 
          className={`flex items-center justify-between p-3 bg-[#1F222A] rounded-lg mb-3 ${selectedPlan === 3 ? 'border-2 border-[#F59E0B]' : ''}`}
          onClick={() => setSelectedPlan(3)}
        >
          <div className="flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 line-through">1.100.000 đ</span>
              <div className="flex items-center">
                <span className="text-base font-medium">559.000 đ</span>
                <span className="ml-1 text-xs text-gray-400">/1 năm</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex justify-end items-center">
              <span className="text-xs text-white bg-[#F59E0B] px-2 py-0.5 rounded-full">Tiết kiệm 50%</span>
            </div>
            <div className="mt-1 text-xs text-gray-400">53.000đ/tháng</div>
          </div>
        </div>

        <div className="mt-2 mb-4 text-xs text-gray-400">
          Tự động gia hạn, có thể hủy trong 24h trước ngày hết hạn
        </div>

        <button className="px-4 py-3 w-full text-base font-medium text-black bg-yellow-500 rounded-full">
          Đăng ký ngay
        </button>
      </div>

      {/* Menu items */}
      <div className="flex-1 overflow-y-auto bg-[#212121] pb-4">
        <div className="border-t border-[#2A2A2A]">
          <div className="flex items-center p-4 border-b border-[#2A2A2A]">
            <Info className="mr-3 w-5 h-5 text-green-500" />
            <span className="flex-1">Thông tin ứng dụng</span>
            <span className="text-gray-400">{'>'}</span>
          </div>

          <div className="flex items-center p-4 border-b border-[#2A2A2A]">
            <FileText className="mr-3 w-5 h-5 text-green-500" />
            <span className="flex-1">Điều khoản ứng dụng</span>
            <span className="text-gray-400">{'>'}</span>
          </div>

          <div className="flex items-center p-4 border-b border-[#2A2A2A]">
            <MessageSquare className="mr-3 w-5 h-5 text-green-500" />
            <span className="flex-1">Liên hệ hợp tác hoặc góp ý</span>
            <span className="text-gray-400">{'>'}</span>
          </div>

          <div className="flex items-center p-4 border-b border-[#2A2A2A]">
            <Share2 className="mr-3 w-5 h-5 text-green-500" />
            <span className="flex-1">Chia sẻ Nexla cho bạn bè</span>
            <span className="text-gray-400">{'>'}</span>
          </div>

          <div className="flex items-center p-4 border-b border-[#2A2A2A]">
            <Star className="mr-3 w-5 h-5 text-green-500" />
            <span className="flex-1">Đánh giá Nexla tại Store</span>
            <span className="text-gray-400">{'>'}</span>
          </div>

          <div className="flex items-center p-4">
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-2 bg-[#1F222A] rounded-lg text-green-500 hover:bg-[#2A2A2A] transition-colors"
            >

              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Logout Dialog */}
      {showLogoutDialog && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="bg-[#35383F] rounded-[12px] p-6 w-[321px]">
            <h3 className="mb-4 text-lg font-medium text-center">Đăng xuất tài khoản</h3>
            <p className="mb-6 text-sm text-center text-gray-400">
              Sau khi đăng xuất tài khoản, lịch sử đọc và nghe sách sẽ không được đồng bộ.
              Bạn chắc chắn muốn đăng xuất?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleCancelLogout}
                className="flex-1 px-4 py-2.5 bg-[#2A2A2A] rounded-lg text-white hover:bg-[#3A3A3A] transition-colors rounded-full"
              >
                Huỷ bỏ
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-2.5 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors rounded-full"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}