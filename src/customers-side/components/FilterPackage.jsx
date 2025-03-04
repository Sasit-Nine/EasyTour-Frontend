import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Dialog, DialogBackdrop, DialogPanel, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid'
import PackageList from '../subpage/PackageList'

const filters = [
  {
    id: 'category',
    name: 'หมวดหมู่',
    options: [
      { value: 'Nature And Mountain Tour', label: 'ธรรมชาติและภูเขา' },
      { value: 'Cultural And Historical Tour', label: 'วัฒนธรรมและประวัติศาสตร์' },
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
      { value: 'northwest', label: 'ภาคตะวันออกเฉียงเหนือ' },
      { value: 'central', label: 'ภาคกลาง' },
    ],
  },
]







const FilterPackage = () => {
  const location = useLocation()
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  const navigate = useNavigate()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [selectFilters, setSelectFilters] = useState({
    category: [],
    duration: [],
    sector: []
  })

  const [searchText, setSearchText] = useState('')
  useEffect(() => {
    setSearchText(location.state?.searchText)
  }, [location.state?.searchText])  

  console.log(location.state?.title, location.state?.categorie)
  useEffect(() => {
    if (location.state?.categorie) {
      setSelectFilters((prevFilter) => {
        return { ...prevFilter, category: [location.state?.categorie] }
      })
    }
  }, [location.state?.title, location.state?.categorie])



  const handleFilterChange = (filterId, value) => {
    console.log(filterId, value)
    setSelectFilters((prevFilter) => {
      const newValues = prevFilter[filterId].includes(value)
        ? prevFilter[filterId].filter((v) => v !== value)
        : [...prevFilter[filterId], value]
      return { ...prevFilter, [filterId]: newValues }
    })
    // console.log(selectFilters)
  }

  // useEffect(() => {
  //   console.log('Updated filters:', selectFilters)
  // }, [selectFilters])

  return (

    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 mb-2.5 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900 ">ตัวกรอง</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">ปิด</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4">
                {filters.map((section) => (
                  <Disclosure key={section.name} as="div" className="border-t border-gray-200 pt-4 pb-4">
                    <fieldset>
                      <legend className="w-full px-2">
                        <DisclosureButton className="group flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                          <span className="text-sm font-medium text-gray-900">{section.name}</span>
                          <span className="ml-6 flex h-7 items-center">
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="size-5 rotate-0 transform group-data-open:-rotate-180"
                            />
                          </span>
                        </DisclosureButton>
                      </legend>
                      <DisclosurePanel className="px-4 pt-4 pb-2">
                        <div className="space-y-6">
                          {section.options.map((option, optionIdx) => (
                            <div key={option.value} className="flex gap-3">
                              <div className="flex h-5 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                  <input
                                    defaultValue={option.value}
                                    id={`${section.id}-${optionIdx}-mobile`}
                                    name={`${section.id}[]`}
                                    checked={selectFilters[section.id]?.includes(option?.value)}
                                    onChange={() => handleFilterChange(section.id, option.value)}
                                    type="checkbox"
                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-[#F8644B] checked:bg-[#F8644B] indeterminate:border-[#F8644B] indeterminate:bg-[#F8644B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
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
                              <label htmlFor={`${section.id}-${optionIdx}-mobile`} className="text-sm text-gray-500">
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </DisclosurePanel>
                    </fieldset>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="border-b border-gray-200 pb-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">แพ็กเกจทัวร์</h1>
            <p className="mt-4 text-lg text-gray-500">
              สำรวจเส้นทางท่องเที่ยวใหม่สุดพิเศษ พร้อมประสบการณ์สุดประทับใจที่คุณไม่ควรพลาด!
            </p>
          </div>

          <div className="pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
            <aside className='mb-6 col-span-1'>
              <h2 className="sr-only">Filters</h2>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center lg:hidden"
              >
                <span className="text-base font-medium text-gray-700">ตัวกรอก</span>
                <PlusIcon aria-hidden="true" className="ml-1 size-5 shrink-0 text-gray-400" />
              </button>

              <div className="hidden lg:block">
                <form className="divide-y divide-gray-200">
                  {filters.map((section) => (
                    <div key={section.name} className="py-10 first:pt-0 last:pb-0">
                      <fieldset>
                        <legend className="block text-lg font-medium text-gray-900">{section.name}</legend>
                        <div className="space-y-3 pt-6">
                          {section.options.map((option, optionIdx) => (
                            <div key={option.value} className="flex gap-3">
                              <div className="flex h-5 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                  <input
                                    defaultValue={option.value}
                                    id={`${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    onChange={() => handleFilterChange(section.id, option.value)}
                                    type="checkbox"
                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-[#F8644B] checked:bg-[#F8644B] indeterminate:border-[#F8644B] indeterminate:bg-[#F8644B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8644B] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
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
                              <label htmlFor={`${section.id}-${optionIdx}`} className="text-base text-gray-600">
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  ))}
                </form>
              </div>
            </aside>
            <div className="col-span-2 xl:col-span-3">
              <PackageList filters={selectFilters} search={searchText}></PackageList>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
export default FilterPackage
