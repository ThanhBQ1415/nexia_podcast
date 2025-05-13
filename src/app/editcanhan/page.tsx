'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function EditProfile() {
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[#212121] text-white mx-auto md:max-w-2xl lg:max-w-4xl overflow-x-hidden">
      {/* Header */}
      <div 
        className="p-4 rounded-b-[32px] relative w-[375px] h-[181px] bg-no-repeat"
        style={{ 
          backgroundImage: 'url("app.body/canhanbackground.png")',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center'
        }}
      >
        <div className="flex items-center h-[64px]">
          <button className="text-white" onClick={() => router.push('/canhan')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19.5L7.5 12L15 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="ml-4 text-lg font-medium text-white">Chỉnh sửa thông tin cá nhân</h1>
        </div>
        <div className="flex items-center px-4 pb-4">
          {/* Avatar */}
          <div className="relative mr-3">
            <div 
              className="flex overflow-hidden justify-center items-center w-10 h-10 bg-gray-700 rounded-full cursor-pointer md:w-12 md:h-12"
              onClick={() => setShowDialog(true)}
            >
              <img src="/api/placeholder/40/40" alt="User avatar" className="object-cover w-full h-full" />
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full border-2 border-[#212121]"></div>
          </div>

          {/* Avatar options dialog */}
          {showDialog && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-black bg-opacity-50"
                onClick={() => setShowDialog(false)}
              ></div>
              <div className="fixed z-50 w-[272px] h-[272px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#35383F] rounded-[12px] p-6 shadow-lg flex flex-col gap-4">
                <h3 className="text-lg font-medium text-white">Đổi ảnh đại diện</h3>
                <button className="flex gap-2 items-center text-white hover:opacity-80">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 9C3 7.9 3.9 7 5 7H7.54C8.64 7 9.02 6.65 9.55 6.11L10.45 5.21C11.01 4.65 11.99 4 13.1 4H15.9C17.01 4 17.99 4.65 18.55 5.21L19.45 6.11C19.98 6.65 20.36 7 21.46 7H22C23.1 7 24 7.9 24 9V17C24 18.1 23.1 19 22 19H5C3.9 19 3 18.1 3 17V9Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Chụp ảnh
                </button>
                <button className="flex gap-2 items-center text-white hover:opacity-80">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16V4C22 2.9 21.1 2 20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H20C21.1 18 22 17.1 22 16Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 13H16L14 16H10L8 13H2" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Thư viện
                </button>
                <button className="flex gap-2 items-center text-white hover:opacity-80">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.85 9.14L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Xoá ảnh hiện tại
                </button>
              </div>
            </>
          )}
          {/* User info */}
          <div className="flex-1">
            <div className="flex items-center space-x-1">
              <h2 className="font-medium text-sm md:text-base lg:text-lg text-[#FAFAFA]">Chanon2k</h2>
              <img 
                src="app.body/edituser.png" 
                alt="Edit" 
                className="w-5 h-5 cursor-pointer md:w-6 md:h-6" 
     
              />
            </div>
            <p className="text-xs md:text-sm text-[#FAFAFA] opacity-80">ID: 1908BHT</p>
          </div>

      
        </div>

        
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-white">Tên</label>
          <div className="relative flex items-center bg-[#1F222A] rounded-lg">
            <div className="pr-3 pl-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="text"
              className="w-full bg-transparent text-white p-4 focus:outline-none focus:ring-2 focus:ring-[#06C149] rounded-lg"
              placeholder="Nhập tên của bạn"
              defaultValue="Chanon2k"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white">Ngày sinh</label>
          <div className="relative flex items-center bg-[#1F222A] rounded-lg">
            <div className="pr-3 pl-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#71717A" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="date"
              className="w-full bg-transparent text-white p-4 focus:outline-none focus:ring-2 focus:ring-[#06C149] rounded-lg"
              defaultValue="1980-08-19"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white">Số điện thoại</label>
          <div className="flex">
            <select className="bg-[#1F222A] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06C149] mr-2 w-[130px] h-[48px] gap-[4px] border-radius-[8px] text-sm">
              <option value="+84">VN +84</option>
            </select>
            <input
              type="tel"
              className="flex-1 bg-[#1F222A] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06C149] w-[229px] h-[48px] gap-[10px] border-radius-[8px]"
              placeholder="Nhập số điện thoại"
              defaultValue="299273789"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button className="w-[343px] h-[48px] bg-[#06C149] text-white py-3 rounded-[8px] mt-6 font-medium hover:opacity-90 transition-opacity rounded-full ">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}