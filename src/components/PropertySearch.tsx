import React, { useState } from 'react';
import { Search, MapPin, Train, Bed, Bath, Maximize2, ShieldCheck, Heart, Sparkles, Filter } from 'lucide-react';
import { CondoUnit } from '../types';

interface PropertySearchProps {
  units: CondoUnit[];
  onSelectUnit: (unit: CondoUnit) => void;
  onBookViewing: (unit: CondoUnit) => void;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({
  units,
  onSelectUnit,
  onBookViewing
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStation, setSelectedStation] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [bedroomFilter, setBedroomFilter] = useState<string>('ALL');

  const filteredUnits = units.filter((unit) => {
    const matchSearch =
      unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStation = selectedStation === 'ALL' || unit.station.includes(selectedStation);
    const matchPrice = unit.monthlyRent <= maxPrice;
    const matchBedroom =
      bedroomFilter === 'ALL' ||
      (bedroomFilter === '1' && unit.bedrooms === 1) ||
      (bedroomFilter === '2' && unit.bedrooms >= 2);

    return matchSearch && matchStation && matchPrice && matchBedroom;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Search Filters */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-8 md:p-12 shadow-xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-medium backdrop-blur-md mb-4 border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            แพลตฟอร์มเช่าคอนโด ปลอดภัย ได้ห้องตรงปก สัญญา E-Sign
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            ค้นหาคอนโดในฝัน <span className="text-blue-300">ใกล้รถไฟฟ้า</span> ทำสัญญาออนไลน์
          </h1>
          <p className="text-blue-100/90 text-sm md:text-base mb-8">
            ครบวงจรตั้งแต่จองคิวดูห้องจริง, ลงนามสัญญา E-Signature ถูกต้องตามกฎหมาย และชำระเงินผ่าน PromptPay
          </p>

          {/* Search Box Card */}
          <div className="bg-white text-slate-800 rounded-xl p-4 shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="พิมพ์ชื่อคอนโด ทำเล หรือย่าน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal"
              />
            </div>

            <div>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal cursor-pointer"
              >
                <option value="ALL">รถไฟฟ้าทั้งหมด</option>
                <option value="BTS ทองหล่อ">BTS ทองหล่อ</option>
                <option value="MRT พระราม 9">MRT พระราม 9</option>
                <option value="BTS อารีย์">BTS อารีย์</option>
              </select>
            </div>

            <div>
              <select
                value={bedroomFilter}
                onChange={(e) => setBedroomFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal cursor-pointer"
              >
                <option value="ALL">จำนวนห้องนอน</option>
                <option value="1">1 ห้องนอน / Studio</option>
                <option value="2">2+ ห้องนอน</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Stats & Results */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            รายการห้องว่างพร้อมเข้าอยู่ ({filteredUnits.length} ห้อง)
          </h2>
          <p className="text-xs text-slate-500">ข้อมูลอัปเดตล่าสุดผ่านการตรวจกรรมสิทธิ์ห้องแล้ว (KYC Verified)</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600 font-medium">งบประมาณสูงสุด:</span>
          <span className="text-xs font-bold text-blue-600">฿{maxPrice.toLocaleString()} /เดือน</span>
          <input
            type="range"
            min="10000"
            max="100000"
            step="5000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-28 sm:w-36 accent-blue-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnits.map((unit) => (
          <div
            key={unit.id}
            className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
          >
            {/* Image & Badges */}
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <img
                src={unit.images[0]}
                alt={unit.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${
                  unit.status === 'AVAILABLE'
                    ? 'bg-emerald-500/90 text-white'
                    : 'bg-slate-700/90 text-white'
                }`}>
                  {unit.status === 'AVAILABLE' ? '● ว่างพร้อมอยู่' : '● ติดสัญญาเช่า'}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white shadow-sm backdrop-blur-md flex items-center gap-1">
                  <Train className="w-3 h-3" />
                  {unit.station} ({unit.stationDistance})
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {unit.district}
                </div>
                <h3
                  onClick={() => onSelectUnit(unit)}
                  className="font-bold text-slate-800 group-hover:text-blue-600 cursor-pointer transition-colors line-clamp-1 text-base"
                >
                  {unit.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {unit.description}
                </p>
              </div>

              {/* Specs & Features */}
              <div className="grid grid-cols-3 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs text-slate-600">
                <div className="flex flex-col items-center gap-0.5">
                  <Bed className="w-3.5 h-3.5 text-slate-400" />
                  <span>{unit.bedrooms} นอน</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 border-x border-slate-200">
                  <Bath className="w-3.5 h-3.5 text-slate-400" />
                  <span>{unit.bathrooms} น้ำ</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{unit.sizeSqM} ตร.ม. (ชั้น {unit.floor})</span>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">ค่าเช่ารายเดือน</div>
                  <div className="text-lg font-bold text-blue-600">
                    ฿{unit.monthlyRent.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500"> /ด.</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectUnit(unit)}
                    className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    ดูรายละเอียด
                  </button>
                  {unit.status === 'AVAILABLE' && (
                    <button
                      onClick={() => onBookViewing(unit)}
                      className="px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      นัดดูห้อง
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
