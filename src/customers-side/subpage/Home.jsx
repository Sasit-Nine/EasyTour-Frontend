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


const categories = [
  {
    name: 'ทัวร์ธรรมชาติและภูเขา',
    href: '#',
    imageSrc: 'https://images.unsplash.com/photo-1511162384289-94da0b4013d8?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'ทัวร์วัฒนธรรมและประวัติศาสตร์',
    href: '#',
    imageSrc: 'https://images.unsplash.com/photo-1595131153384-21ced4991b07?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'ทัวร์ผจญภัยและกิจกรรมกลางแจ้ง',
    href: '#',
    imageSrc: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'ทัวร์ครอบครัว',
    href: '#',
    imageSrc: 'https://plus.unsplash.com/premium_photo-1664367173144-7e854e199524?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'ทัวร์ฮันนีมูนและโรแมนติก',
    href: '#',
    imageSrc: 'https://images.unsplash.com/photo-1513279922550-250c2129b13a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
]

const types = [
  { id: 1, name: 'ทั้งหมด', value: 'all' },
  { id: 2, name: 'แพ็กเกจพร้อมที่พัก', value: 'Package with accommodation' },
  { id: 3, name: 'แพ็กเกจวันเดียว', value: 'One day trip' },
]

const category = [
  { id: 1, name: 'ทั้งหมด' , value: 'all'},
  { id: 2, name: 'ธรรมชาติและภูเขา' , value: 'Nature & Mountain Tour' },
  { id: 3, name: 'วัฒนธรรมและประวัติศาสตร์' , value: 'Cultural & Historical Tour' },
  { id: 4, name: 'ผจญภัยและกิจกรรมกลางแจ้ง' , value: 'Adventure Tour' },
  { id: 5, name: 'ครอบครัว' , value: 'Family Tour' },
  { id: 6, name: 'ฮันนีมูนและโรแมนติก' , value: 'Honeymoon & Romantic Tour' },
]


const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [selectedTypes, setSelectedTypes] = useState(types[0])
  const [selectedCategory, setSelectedCategory] = useState(category[0])

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

        {/* Centered Text */}
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y:0}}
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
          <div className="absolute top-[88%] mx-24 max-sm:w-[95%] max-md:w-[92%] max-lg:w-[95%] max-xl:w-[95%] xl:w-[85%] rounded-2xl bg-white p-6 shadow-lg z-50">
            <div className='w-full flex justify-start'>
              <h3 className="text-2xl font-semibold text-gray-900 text-center">ค้นหาแพ็กเกจทัวร์</h3>
            </div>
            {/* ✅ ปรับ flex ให้ responsive */}
            <div className="mt-4 flex flex-wrap gap-4 justify-center items-end sm:flex-nowrap">
              <div className="w-full sm:w-[2/4]">
                <label className="block text-base font-medium text-gray-900 mb-1.5">
                  ค้นหาแพ็กเกจ
                </label>
                <input
                  placeholder="ค้นหาแพ็กเกจ"
                  className="w-full sm:w-full rounded-xl bg-white px-3 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-[#F8644B]"
                />
              </div>
              

              {/* 🔹 Dropdown ประเภทแพ็คเกจ */}
              <div className="w-full sm:w-[1/2]">
                <label className="block text-base font-medium text-gray-900 mb-1.5">
                  ประเภทแพ็คเกจ
                </label>
                <Listbox value={selectedTypes} onChange={setSelectedTypes}>
                  <div className="relative z-50">
                    <ListboxButton className="w-full sm:w-[1/2] rounded-xl bg-white py-2 pr-2 pl-3 text-left text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-[#F8644B]">
                      <span className="truncate">{selectedTypes.name}</span>
                      <ChevronUpDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </ListboxButton>
                    <ListboxOptions className="absolute mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-none">
                      {types.map((type) => (
                        <ListboxOption key={type.id} value={type} className={({ active, selectedTypes }) =>
                          `relative cursor-pointer select-none py-2 pr-9 pl-3 ${active ? "bg-[#F8644B] text-white" : "text-gray-900"}`
                        }>
                          {({ selectedTypes }) => (
                            <>
                              <span className={`block truncate ${selectedTypes ? "font-semibold" : "font-normal"}`}>
                                {type.name}
                              </span>
                              {selectedTypes && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                  <CheckIcon className="w-5 h-5 text-[#F8644B]" aria-hidden="true" />
                                </span>
                              )}
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>

              <div className="w-full sm:w-[1/2]">
                <label className="block text-base font-medium text-gray-900 mb-1.5">
                  หมวดหมู่
                </label>
                <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                  <div className="relative">
                    <ListboxButton className="w-full sm:w-[1/2] rounded-xl bg-white py-2 pr-2 pl-3 text-left text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-[#F8644B]">
                      <span className="truncate">{selectedCategory.name}</span>
                      <ChevronUpDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </ListboxButton>
                    <ListboxOptions className="absolute mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-none">
                      {category.map((category) => (
                        <ListboxOption key={category.id} value={category} className={({ active, selectedCategory }) =>
                          `relative cursor-pointer select-none py-2 pr-9 pl-3 ${active ? "bg-[#F8644B] text-white" : "text-gray-900"}`
                        }>
                          {({ selectedCategory }) => (
                            <>
                              <span className={`block truncate ${selectedCategory ? "font-semibold" : "font-normal"}`}>
                                {category.name}
                              </span>
                              {selectedCategory && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                  <CheckIcon className="w-5 h-5 text-[#F8644B]" aria-hidden="true" />
                                </span>
                              )}
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>

              {/* 🔹 ปุ่มค้นหา */}
              <button className="w-full sm:w-auto px-6 rounded-xl bg-[#F8644B] py-2 text-white cursor-pointer hover:scale-105 active:scale-100 transition-transform duration-100">
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
                      href={category.href}
                      className="relative flex h-80 w-56 flex-col overflow-hidden rounded-lg p-6 xl:w-auto hover:scale-105 active:scale-100 transition-transform duration-100"
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

        <section aria-labelledby="comfort-heading" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0">
              <img
                alt=""
                src="https://tailwindui.com/plus-assets/img/ecommerce-images/home-page-01-feature-section-02.jpg"
                className="size-full object-cover"
              />
            </div>
            <div className="relative bg-gray-900/75 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
              <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                <h2 id="comfort-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Simple productivity
                </h2>
                <p className="mt-3 text-xl text-white">
                  Endless tasks, limited hours, a single piece of paper. Not really a haiku, but we're doing our best
                  here. No kanban boards, burndown charts, or tangled flowcharts with our Focus system. Just the
                  undeniable urge to fill empty circles.
                </p>
                <a
                  href="#"
                  className="mt-8 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
                >
                  Shop Focus
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
export default Home
