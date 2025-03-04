import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/20/solid'
import PackageListManage from './PackageListManage'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const filters = [
    {
      id: 'category',
      name: 'หมวดหมู่',
      options: [
        { value: 'Nature & Mountain Tour', label: 'ธรรมชาติและภูเขา' },
        { value: 'Cultural & Historical Tour', label: 'วัฒนธรรมและประวัติศาสตร์' },
        { value: 'Adventure Tour', label: 'ผจญภัยและกิจกรรมกลางแจ้ง' },
        { value: 'Family Tour', label: 'ครอบครัว' },
        { value: 'Honeymoon & Romantic Tour', label: 'ฮันนีมูนและโรแมนติก' },
      ],
    },
    {
      id: 'duration',
      name: 'ระยะเวลา',
      options: [
        { value: false, label: 'แพ็กเกจทัวร์วันเดียว' },
        { value: true, label: 'แพ็กเกจทัวร์พร้อมที่พัก' },
      ],
    },
    {
      id: 'sector',
      name: 'ภาค',
      options: [
        { value: 'north', label: 'ภาคเหนือ' },
        { value: 'south', label: 'ภาคใต้' },
        { value: 'east', label: 'ภาคตะวันออก' },
        { value: 'west', label: 'ภาคตะวันตก' },
        { value: 'northwest', label: 'ภาคตะวันออกเฉียงเหนือ' },
        { value: 'central', label: 'ภาคกลาง' },
      ],
    },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const FilterPackageManage = () => {
    const navigate = useNavigate()

    // ตั้งค่า state สำหรับการจัดเก็บค่าที่ถูกเลือกในแต่ละหมวดของ filter
    const [filterState, setFilterState] = useState({
        category: [],
        duration: [],
        sector: []
    })

    // ฟังก์ชันสำหรับการจัดการเมื่อมีการเลือก/ยกเลิกตัวกรอง
    const handleFilterChange = (filterId, value, checked) => {
        setFilterState(prevState => {
            // ถ้า checked เป็น true ให้เพิ่มค่าเข้าไปใน array, ถ้า false ให้ลบออก
            if (checked) {
                return {
                    ...prevState,
                    [filterId]: [...prevState[filterId], value]
                }
            } else {
                return {
                    ...prevState,
                    [filterId]: prevState[filterId].filter(item => item !== value)
                }
            }
        })
    }

    // ฟังก์ชันสำหรับล้างตัวกรองทั้งหมด
    const clearAllFilters = () => {
        setFilterState({
            category: [],
            duration: [],
            sector: []
        })
        
        // รีเซ็ตการเลือกใน DOM
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false
        })
    }

    return (
        <div className="bg-white">
            <div className="px- py-5 text-left sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">จัดการแพ็กเกจ</h1>
                <p className="mx-auto mt-4 text-lg text-gray-500">
                    คุณสามารถเพิ่ม แก้ไข หรือ ลบแพ็กเกจทัวร์ตามต้องการ
                </p>
            </div>

            {/* Filters */}
            <Disclosure
                as="section"
                aria-labelledby="filter-heading"
                className="grid items-center border-t border-b border-gray-200"
            >
                <h2 id="filter-heading" className="sr-only">
                    Filters
                </h2>
                <div className="relative col-start-1 row-start-1 py-4">
                    <div className="mx-auto flex max-w-7xl divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                        <div className="pr-6">
                            <DisclosureButton className="group flex items-center font-medium text-gray-700">
                                <FunnelIcon
                                    aria-hidden="true"
                                    className="mr-2 size-5 flex-none text-gray-400 group-hover:text-gray-500"
                                />
                                Filters
                            </DisclosureButton>
                        </div>
                        <div className="pl-6">
                            <button 
                                type="button" 
                                className="text-gray-500 hover:text-gray-700"
                                onClick={clearAllFilters}
                            >
                                Clear all
                            </button>
                        </div>
                    </div>
                </div>
                <DisclosurePanel className="border-t border-gray-200 py-10">
                    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8">
                        <div className="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
                            <fieldset>
                                <legend className="block font-medium text-xl">{filters[0].name}</legend>
                                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                                    {filters[0].options.map((option, optionIdx) => (
                                        <div key={option.value} className="flex gap-3">
                                            <div className="flex h-5 shrink-0 items-center">
                                                <div className="group grid size-4 grid-cols-1">
                                                    <input
                                                        value={option.value}
                                                        id={`category-${optionIdx}`}
                                                        name="category[]"
                                                        type="checkbox"
                                                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-[#F8644B] checked:bg-[#F8644B] indeterminate:border-[#F8644B] indeterminate:bg-[#F8644B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8644B] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                        onChange={(e) => handleFilterChange('category', option.value, e.target.checked)}
                                                        checked={filterState.category.includes(option.value)}
                                                    />
                                                    <svg
                                                        fill="none"
                                                        viewBox="0 0 14 14"
                                                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                                    >
                                                        <path
                                                            d="M3 8L6 11L11 3.5"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="opacity-0 group-has-checked:opacity-100"
                                                        />
                                                        <path
                                                            d="M3 7H11"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="opacity-0 group-has-indeterminate:opacity-100"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <label htmlFor={`category-${optionIdx}`} className="text-lg text-gray-600 sm:text-lg">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                            <fieldset>
                                <legend className="block font-medium text-xl">{filters[1].name}</legend>
                                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                                    {filters[1].options.map((option, optionIdx) => (
                                        <div key={option.value} className="flex gap-3">
                                            <div className="flex h-5 shrink-0 items-center">
                                                <div className="group grid size-4 grid-cols-1">
                                                    <input
                                                        value={option.value.toString()}
                                                        id={`duration-${optionIdx}`}
                                                        name="duration[]"
                                                        type="checkbox"
                                                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-[#F8644B] checked:bg-[#F8644B] indeterminate:border-[#F8644B] indeterminate:bg-[#F8644B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8644B] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                        onChange={(e) => {
                                                            // แปลงค่า string เป็น boolean เมื่อเป็น "true" หรือ "false"
                                                            const boolValue = option.value === true || option.value === "true";
                                                            handleFilterChange('duration', boolValue, e.target.checked);
                                                        }}
                                                        checked={filterState.duration.includes(option.value)}
                                                    />
                                                    <svg
                                                        fill="none"
                                                        viewBox="0 0 14 14"
                                                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                                    >
                                                        <path
                                                            d="M3 8L6 11L11 3.5"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="opacity-0 group-has-checked:opacity-100"
                                                        />
                                                        <path
                                                            d="M3 7H11"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="opacity-0 group-has-indeterminate:opacity-100"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <label htmlFor={`duration-${optionIdx}`} className="text-lg text-gray-600 sm:text-lg">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                        </div>
                        <div className="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
                            <fieldset>
                                <legend className="block font-medium text-xl">{filters[2].name}</legend>
                                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                                    {filters[2].options.map((option, optionIdx) => (
                                        <div key={option.value} className="flex gap-3">
                                            <div className="flex h-5 shrink-0 items-center">
                                                <div className="group grid size-4 grid-cols-1">
                                                    <input
                                                        value={option.value}
                                                        id={`sector-${optionIdx}`}
                                                        name="sector[]"
                                                        type="checkbox"
                                                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-[#F8644B] checked:bg-[#F8644B] indeterminate:border-[#F8644B] indeterminate:bg-[#F8644B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8644B] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                        onChange={(e) => handleFilterChange('sector', option.value, e.target.checked)}
                                                        checked={filterState.sector.includes(option.value)}
                                                    />
                                                    <svg
                                                        fill="none"
                                                        viewBox="0 0 14 14"
                                                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                                    >
                                                        <path
                                                            d="M3 8L6 11L11 3.5"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="opacity-0 group-has-checked:opacity-100"
                                                        />
                                                        <path
                                                            d="M3 7H11"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="opacity-0 group-has-indeterminate:opacity-100"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <label htmlFor={`sector-${optionIdx}`} className="text-lg text-gray-600 sm:text-lg">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                             
                        </div>
                    </div>
                </DisclosurePanel>
                <div className="col-start-1 row-start-1 py-4">
                    <div className="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
                        <Menu as="div" className="relative inline-block">
                            <div className="flex">
                                <button onClick={()=>navigate('/add_package')} className="bg-[#F8644B] p-3 text-white rounded-xl cursor-pointer font-medium hover:scale-105 active:scale-100 transition-transform duration-100">
                                    เพิ่มแพ็กเกจทัวร์
                                </button>
                            </div>
                        </Menu>
                    </div>
                </div>
            </Disclosure>
            <div className="col-span-2 xl:col-span-4 flex mt-10 px-4 sm:px-6 lg:px-5">
                <PackageListManage filters={filterState}></PackageListManage>
            </div>
        </div>
    )
}
export default FilterPackageManage