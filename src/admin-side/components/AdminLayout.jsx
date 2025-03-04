'use client'
import { useState, createContext, useContext } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  ArchiveBoxIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import ContentLayout from './ContentLayout'
import LogoPicture from '../../assets/plane_orange.png'
import { useAuth } from '../../context/AuthContext'
import { QEURY_PROFILE } from '../../services/Graphql'
import { useQuery } from '@apollo/client'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

// Create a context for the search functionality
export const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

const navigation = [
  { name: 'จัดการแพ็กเกจ', href: '/', icon: FolderIcon, current: false },
  { name: 'จัดการการจอง', href: '/customer_manage', icon: UsersIcon, current: false },
  { name: 'ประวัติการจอง', href: '/history', icon: ArchiveBoxIcon, current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const AdminLayout = () => {
  

  const strapiBaseURL = import.meta.env.VITE_STRAPI_URL
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: urlProfile } = useQuery(QEURY_PROFILE, {
    skip: (!user),
    variables: {
      "documentId": user?.documentId
    },
    context: {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
      },
    }
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

    const handleLogout = () => {
        logout()
        window.location.href = "/login"
    }

    const handleSetting = () => {
      window.location.href = "/admin/setting"
  }

  return (
    <>
      <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
        <div>
          <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
            />

            <div className="fixed inset-0 flex">
              <DialogPanel
                transition
                className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
              >
                <TransitionChild>
                  <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                    <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                    </button>
                  </div>
                </TransitionChild>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <img
                      alt="Your Company"
                      src={LogoPicture}
                      className="h-8 w-auto"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <a
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? 'bg-gray-50 text-[#F8644B]'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#F8644B]',
                                  'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                )}
                              >
                                <item.icon
                                  aria-hidden="true"
                                  className={classNames(
                                    item.current ? 'text-[#F8644B]' : 'text-gray-400 group-hover:text-[#F8644B]',
                                    'size-6 shrink-0',
                                  )}
                                />
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </DialogPanel>
            </div>
          </Dialog>

          {/* Static sidebar for desktop */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center mt-3">
                <img
                  src={LogoPicture}
                  className="size-12"
                />
                <div>
                  <p className='text-3xl font-bold ml-2 text-[#F8644B]'>EazyTour</p>
                  <p className='text-lg font-bold ml-2 text-[#F8644B]'>Admin</p>
                </div>
                
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-gray-50 text-[#F8644B]'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-[#F8644B]',
                              'group flex gap-x-3 rounded-md p-2 text-lg font-normal',
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className={classNames(
                                item.current ? 'text-[#F8644B]' : 'text-gray-400 group-hover:text-[#F8644B]',
                                'size-6 shrink-0',
                              )}
                            />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>

                </ul>
              </nav>
            </div>
          </div>

          <div className="lg:pl-72">
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
              <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Separator */}
              <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form action="#" method="GET" className="grid flex-1 grid-cols-1" onSubmit={(e) => e.preventDefault()}>
                  <input
                    name="search"
                    type="search"
                    placeholder="ค้นหาตามชื่อลูกค้า หรือ ชื่อแพ็กเกจ"
                    aria-label="Search"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="col-start-1 row-start-1 block size-full bg-white pl-8 text-lg text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
                  />
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
                  />
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6">

                  {/* Separator */}
                  <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex rounded-full bg-white text-sm focus:ring-offset-2 focus:outline-none border-3 border-white hover:scale-110 active:scale-100 transition-transform duration-200 cursor-pointer">
                        <img alt="User" src={`${strapiBaseURL}${urlProfile?.usersPermissionsUser?.profile_picture?.url}`} className="size-10 rounded-full" />
                      </MenuButton>
                    </div>

                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5">
                    <MenuItem>
                        <button className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100" onClick={()=>{handleSetting()}}>จัดการบัญชี</button>
                      </MenuItem>
                      <MenuItem>
                        <button className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-orange-700" onClick={()=>{handleLogout()}}>ออกจากระบบ</button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            </div>

            <main className="py-10">
              <div className="px-4 sm:px-6 lg:px-8">
                <ContentLayout></ContentLayout>
              </div>
            </main>
          </div>
        </div>
      </SearchContext.Provider>
    </>
  )
}
export default AdminLayout