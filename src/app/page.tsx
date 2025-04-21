import Image from 'next/image';

export default function Home() {
  return (
    <main className="container p-4 mx-auto" style={{ backgroundColor: '#000000' }}>
      {/* Podcast banner */}
      <div className="relative w-[343px] h-[140px] rounded-xl overflow-hidden mb-6">
        <Image
          src="/app.body/podcast-bg.png"
          alt="Podcast background"
          fill
          quality={100}
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Categories section */}
      <div className="w-[343px]">
        <h2 className="mb-4 text-xl text-white">Thể loại</h2>
        <div className="grid grid-cols-2 gap-3">
          <button className="px-4 py-2 text-left text-white rounded-lg" style={{ backgroundColor: '#1F222A', borderLeft: '4px solid #00B44C' }}>
            Tâm linh
          </button>
          <button className="px-4 py-2 text-left text-white rounded-lg" style={{ backgroundColor: '#1F222A', borderLeft: '4px solid #FFA726' }}>
            Hồi ký và tiểu sử
          </button>
          <button className="px-4 py-2 text-left text-white rounded-lg" style={{ backgroundColor: '#1F222A', borderLeft: '4px solid #E040FB' }}>
            Lịch sử, Văn hoá
          </button>
          <button className="px-4 py-2 text-left text-white rounded-lg" style={{ backgroundColor: '#1F222A', borderLeft: '4px solid #FFD600' }}>
            Kinh tế
          </button>
          <button className="px-4 py-2 text-left text-white rounded-lg" style={{ backgroundColor: '#1F222A', borderLeft: '4px solid #2196F3' }}>
            Tài chính, đầu tư
          </button>
          <button className="px-4 py-2 text-left text-white rounded-lg" style={{ backgroundColor: '#1F222A', borderLeft: '4px solid #E0E0E0' }}>
            Quản lý công ty
          </button>
        </div>
      </div>
    </main>
  );
}