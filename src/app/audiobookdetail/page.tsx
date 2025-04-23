'use client'
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

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

export default function AudiobookDetail() {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<CateItem | null>(null);

  useEffect(() => {
    const productParam = searchParams.get('product');
    if (productParam) {
      setProduct(JSON.parse(productParam));
    }
  }, [searchParams]);

  if (!product) return <div>Loading...</div>;

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="relative h-[400px] sm:h-[300px] md:h-[400px]">
        <Image
          src="/app.body/podcast-bg.png"
          alt={product.name}
          fill
          sizes="100vw"
          priority
          className="object-cover w-full h-full brightness-50"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1a1a1a] to-transparent">
          <div className="flex gap-4">
            <div className="relative w-[120px] h-[160px] rounded-lg overflow-hidden">
              <Image
                src="/app.body/echoes.png"
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-end">
              <h1 className="mb-2 text-2xl font-bold">{product.name}</h1>
              <div className="flex gap-2 items-center mb-2">
                <div className="flex text-yellow-500">
                  {'★'.repeat(Math.floor(product.scoreContent))}
                  {product.scoreContent % 1 !== 0 && '½'}
                  {'☆'.repeat(5 - Math.ceil(product.scoreContent))}
                </div>
                <span className="text-sm">{product.scoreContent}/5</span>
              </div>
              <div className="flex gap-4 items-center text-sm text-gray-300">
                <span>{product.duration} phút</span>
                <span>{product.totalListen} lượt nghe</span>
                <span>{product.priceOrCoin} xu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-4 mb-6">
          <button className="flex-1 py-3 font-medium text-white bg-green-500 rounded-full">
            Phát tất cả
          </button>
          <button className="flex-1 py-3 font-medium text-black bg-white rounded-full">
            Nghe thử
          </button>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">Giới thiệu</h2>
          <p className="text-gray-300">{product.description}</p>
          <button className="mt-2 text-sm text-green-500">Xem thêm</button>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold">Đánh giá</h2>
          <div className="flex gap-2 items-center mb-4">
            <span className="text-2xl font-bold">{product.scoreContent}/5</span>
            <div className="flex text-yellow-500">
              {'★'.repeat(Math.floor(product.scoreContent))}
              {product.scoreContent % 1 !== 0 && '½'}
              {'☆'.repeat(5 - Math.ceil(product.scoreContent))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#282828] flex gap-4">
        <button className="flex-1 bg-[#1a1a1a] text-white py-3 rounded-full font-medium">
          Mua lẻ gói
        </button>
        <button className="flex-1 py-3 font-medium text-white bg-green-500 rounded-full">
          Mua gói VIP
        </button>
      </div>
    </main>
  );
}