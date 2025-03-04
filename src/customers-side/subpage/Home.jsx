import { Fragment, useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import pichome from '../../assets/mg-cthu--1h_NN3nqzI-unsplash.jpg'
import { useNavigate } from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { motion } from 'framer-motion'
import ProductInHome from '../components/ProductInHome'
import { XCircleIcon } from '@heroicons/react/20/solid'


const categories = [
  {
    name: 'ทัวร์ธรรมชาติและภูเขา',
    value: 'Nature And Mountain Tour',
    imageSrc: 'https://images.unsplash.com/photo-1511162384289-94da0b4013d8?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'ทัวร์วัฒนธรรมและประวัติศาสตร์',
    value: 'Cultural And Historical Tour',
    imageSrc: 'https://images.unsplash.com/photo-1595131153384-21ced4991b07?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'ทัวร์ผจญภัยและกิจกรรมกลางแจ้ง',
    value: 'Adventure Tour',
    imageSrc: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'ทัวร์ครอบครัว',
    value: 'Family Tour',
    imageSrc: 'https://plus.unsplash.com/premium_photo-1664367173144-7e854e199524?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'ทัวร์ฮันนีมูนและโรแมนติก',
    value: 'Honeymoon & Romantic Tour',
    imageSrc: 'https://images.unsplash.com/photo-1513279922550-250c2129b13a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
]

const types = [
  { id: 1, name: 'ทั้งหมด', value: 'all' },
  { id: 2, name: 'แพ็กเกจพร้อมที่พัก', value: 'Package with accommodation' },
  { id: 3, name: 'แพ็กเกจวันเดียว', value: 'One day trip' },
]

const category = [
  { id: 1, name: 'ทั้งหมด', value: 'all' },
  { id: 2, name: 'ธรรมชาติและภูเขา', value: 'Nature And Mountain Tour' },
  { id: 3, name: 'วัฒนธรรมและประวัติศาสตร์', value: 'Cultural And Historical Tour' },
  { id: 4, name: 'ผจญภัยและกิจกรรมกลางแจ้ง', value: 'Adventure Tour' },
  { id: 5, name: 'ครอบครัว', value: 'Family Tour' },
  { id: 6, name: 'ฮันนีมูนและโรแมนติก', value: 'Honeymoon & Romantic Tour' },
]

const Home = () => {
  const [searchError, setSearchError] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [selectedTypes, setSelectedTypes] = useState(types[0])
  const [selectedCategory, setSelectedCategory] = useState(category[0])
  const [searchText, setSearchText] = useState('')

  const handleNavigate = (categoryValue) => {
    navigate("/category",
      {
        state:
          { category: categoryValue }
      });
  };
  const handleSearch = () => {
    navigate('/packages', {
      state: {
        searchText: searchText
      }
    })
  }

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      {/* Hero section */}
      <div className="relative bg-g ray-900">
        {/* Background Image & Overlay */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <img alt="" src={pichome} className="size-full object-cover" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gray-900 opacity-50" />

        /* Centered Text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:py-64 lg:px-0">
            <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
              WELCOME TO TRAVEL
            </h1>
            <p className="mt-3 text-3xl text-white">
              EXPLORE THE WHOLE WORLD AND ENJOY ITS BEAUTY
            </p>
            <button
              onClick={() => navigate('/packages')}
              className="mt-8 inline-block rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-[#f84b4b] cursor-pointer hover:scale-105 active:scale-100 transition-transform duration-100"
            >
              เลือกดูแพ็คเกจ
            </button>
          </div>
        </motion.div>

        <div className="flex justify-center px-16">
          <div className="absolute top-[88%] mx-24 max-sm:w-[95%] max-md:w-[92%] max-lg:w-[95%] max-xl:w-[95%] xl:w-[75%] rounded-2xl bg-white p-6 shadow-lg z-50">
            <div className='w-full flex justify-start'>
              <h3 className="text-2xl font-semibold text-gray-900 text-center">ค้นหาแพ็กเกจทัวร์</h3>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 justify-center items-end sm:flex-nowrap">
              <div className="w-full sm:w-[2/4]">
                <label className="block text-base font-medium text-gray-900 mb-1.5">
                  ค้นหาแพ็กเกจ
                </label>
                {(searchError)&&<div className="absolute top-[88%] rounded-xl bg-red-50 p-4 mt-3">
                  <div className="flex">
                    <div className="shrink-0">
                      <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base text-red-700">
                          <p>กรุณาป้อนข้อมูลก่อนค้นหา</p>
                      </div>
                    </div>
                  </div>
                </div>}
                <input
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setSearchError(false);
                  }}
                  value={searchText}
                  placeholder="ค้นหาแพ็กเกจ"
                  className="w-full sm:w-full size-11 rounded-xl bg-white px-3 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-[#F8644B]"
                />
                
              </div>

              <button className="w-full sm:w-auto size-11 px-6 rounded-xl bg-[#F8644B] py-2 text-white cursor-pointer hover:scale-105 active:scale-100 transition-transform duration-100"
                onClick={() => {
                  if (searchText.trim() !== '') {
                    handleSearch();
                  } else {
                    setSearchError(true);
                  }
                }}
              >
                ค้นหา
              </button>
            </div>
          </div>
        </div>

      </div>
      
      <main className='max-sm:mt-72 md:mt-6 lg:mt-6 xl:mt-6'>
        {/* Category section */}
        <section aria-labelledby="category-heading" className="pt-24 sm:pt-32 xl:mx-auto xl:max-w-7xl xl:px-8">
          <div className="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0">
            <h2 id="category-heading" className="text-2xl font-bold tracking-tight text-gray-900">
              หมวดหมู่
            </h2>
          </div>

          <div className="mt-4 flow-root">
            <div className="-my-2">
              <div className="relative box-content h-80 overflow-x-auto py-2 xl:overflow-visible">
                <div className="absolute flex space-x-8 px-4 sm:px-6 lg:px-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0 xl:px-0 ">
                  {categories.map((category) => (
                    <a
                      key={category.name}
                      onClick={() => handleNavigate(category.value)}
                      className="relative flex h-80 w-56 flex-col overflow-hidden rounded-lg p-6 xl:w-auto hover:scale-105 active:scale-100 transition-transform duration-100 cursor-pointer"
                    >
                      <span aria-hidden="true" className="absolute inset-0">
                        <img alt="" src={category.imageSrc} className="size-full object-cover" />
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-gray-800 opacity-50"
                      />
                      <span className="relative mt-auto text-center text-xl font-bold text-white">{category.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section aria-labelledby="comfort-heading" className="mx-auto max-w-7xl px-4 pt-10 py-24  sm:px-6 sm:pt-10 sm:py-32 lg:px-8 lg:pt-10">
          <ProductInHome></ProductInHome>
        </section>
      </main>
    </div>
  )
}
export default Home
