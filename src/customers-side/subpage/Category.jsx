import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { MapPin } from "lucide-react";
import { QUERY_PACKAGELIST } from "../../services/Graphql";
import { motion } from "framer-motion";
const Category = () => {
    const location = useLocation()
    const [SearchText, setSearchText] = useState('')
    const handleClear = () => {
        setSearchText('')
    }
    const category = location.state?.category
    const sector = location.state?.sector
    console.log(sector)
    const { pathname } = useLocation()
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [pathname])
    const navigate = useNavigate()
    const strapiBaseURL = import.meta.env.VITE_STRAPI_URL
    const { data: packageList, loading: loadingPackage, error: errorPackage } = useQuery(QUERY_PACKAGELIST, {
        variables: {
            filters: {
                status_package: {
                    eq: "PUBLISH"
                },
                location: sector ? {
                    sector: {
                        eq: sector
                    }
                } : undefined,
                type: category ? {
                    eq: category
                } : undefined,

            }
        }
    })
    console.log(packageList)
    if (loadingPackage) {
        return (
            <div className="flex justify-center items-center space-x-2">
                <div className="w-4 h-4 bg-[#F8644B] rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-[#F8644B] rounded-full animate-bounce200"></div>
                <div className="w-4 h-4 bg-[#F8644B] rounded-full animate-bounce400"></div>
            </div>
        );
    }
    if (errorPackage) {
        console.log(errorPackage)
    }
    const transformedPackages = packageList?.packages?.map((pkg, index) => ({
        index: index,
        documentId: pkg.documentId,
        name: pkg.name,
        price: pkg.price,
        duration: pkg.duration,
        location: pkg.location.province,
        sector: pkg.location.sector,
        start: pkg.start,
        end: pkg.end,
        url: pkg.thumbnail.url,
        package_id: pkg.package_id
    })) || [];
    const filterData = transformedPackages.filter((item) => {
        return item.name.toLowerCase().includes(SearchText.toLowerCase())
    })

    const handleToPackageDetail = (documentId, package_id) => {
        console.log(documentId)
        console.log(package_id)

        navigate(`/packages/${documentId}`, {
            state: {
                pkgID: package_id
            }
        })
    }
    return (
        <div className="bg-white">
            <section
                aria-labelledby="social-impact-heading"
                className="mx-auto max-w[80%] sm:max-w-[80%] px-4 pt-10 sm:px-6 sm:pt-10 lg:px-8 mt-10 lg:pt-10"
            >
                <div className="relative overflow-hidden rounded-lg">
                    <div className="absolute inset-0">
                        <img
                            alt=""
                            src={category === 'Nature And Mountain Tour' ? 'https://images.unsplash.com/photo-1511162384289-94da0b4013d8?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                : category === 'Cultural And Historical Tour' ? 'https://images.unsplash.com/photo-1595131153384-21ced4991b07?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                    : category === 'Adventure Tour' ? 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                        : category === 'Family Tour' ? 'https://plus.unsplash.com/premium_photo-1664367173144-7e854e199524?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                            : category === 'Honeymoon & Romantic Tour' ? 'https://images.unsplash.com/photo-1513279922550-250c2129b13a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                                : sector === 'north' ? 'https://images.unsplash.com/photo-1723460626293-3c52ef6fca15?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                                    : sector === 'central' ? 'https://images.unsplash.com/photo-1568656038091-661f9d284b72?q=80&w=2751&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                                        : sector === 'south' ? 'https://images.unsplash.com/photo-1586302836983-d1efb5eee221?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                                            : sector === 'northeast' ? 'https://s.isanook.com/tr/0/ud/282/1412875/171694_1.jpg'
                                                                : 'https://s359.kapook.com/pagebuilder/037951b6-33c7-4130-a250-44ee7ee41a5e.jpg'}
                            className="size-full object-cover"
                        />
                    </div>
                    <div className="relative bg-gray-900/40 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
                        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                            <h2 id="social-impact-heading" className="text-2xl font-bold tracking-tight text-white sm:text-5xl">
                                <span className="block sm:inline">
                                    {category === 'Nature And Mountain Tour' ? 'ทัวร์ธรรมชาติและภูเขา'
                                        : category === 'Cultural And Historical Tour' ? 'ทัวร์วัฒนธรรมและประวัติศาสตร์'
                                            : category === 'Adventure Tour' ? 'ทัวร์ผจญภัย'
                                                : category === 'Family Tour' ? 'ทัวร์ครอบครัว'
                                                    : category === 'Honeymoon & Romantic Tour' ? 'ทัวร์ฮันนีมูนและโรแมนติก'
                                                        : sector === 'north' ? 'ทัวร์ภาคเหนือ'
                                                            : sector === 'central' ? 'ทัวร์ภาคกลาง'
                                                                : sector === 'south' ? 'ทัวร์ภาคใต้'
                                                                    : sector === 'northeast' ? 'ทัวร์ภาคอีสาน'
                                                                        : 'ทัวร์ภาคตะวันออกเฉียงเหนือ'}
                                </span>
                            </h2>
                            <p className="mt-3 text-xl text-white">
                                {category === 'Nature And Mountain Tour' ? 'สัมผัสเสน่ห์ธรรมชาติ ไปกับทัวร์ธรรมชาติและภูเขา ดื่มด่ำกับวิวทิวทัศน์สุดอลังการ สูดอากาศบริสุทธิ์ เดินป่าชมหมอก และสัมผัสความงามของธรรมชาติอย่างใกล้ชิด เหมาะสำหรับคนรักความสงบและต้องการรีเฟรชร่างกายและจิตใจ'
                                    : category === 'Cultural And Historical Tour' ? 'เปิดโลกแห่งวัฒนธรรม เรียนรู้เรื่องราวทางประวัติศาสตร์และวัฒนธรรมที่มีเสน่ห์ เดินชมโบราณสถาน วัดวาอาราม และพิพิธภัณฑ์ พร้อมดื่มด่ำกับวิถีชีวิตท้องถิ่นที่จะทำให้คุณเข้าใจอดีตและปัจจุบันได้อย่างลึกซึ้ง'
                                        : category === 'Adventure Tour' ? 'ท้าทายขีดจำกัดของคุณ! ไม่ว่าจะเป็นปีนเขา ดำน้ำ ซิปไลน์ หรือกิจกรรมสุดมันส์อื่น ๆ ทัวร์ผจญภัยจะพาคุณไปสัมผัสประสบการณ์ตื่นเต้นที่ไม่มีวันลืม เหมาะสำหรับสายลุยที่ชอบความท้าทายและแอดเรนาลีนที่พุ่งพล่าน'
                                            : category === 'Family Tour' ? 'ความสุขสำหรับทุกวัย เดินทางพร้อมกันทั้งครอบครัว สนุกสนานกับกิจกรรมที่ออกแบบมาให้เหมาะกับทุกคน ไม่ว่าจะเป็นเด็กหรือผู้ใหญ่ พักผ่อนสบาย ๆ กับที่พักแสนอบอุ่น และสร้างความทรงจำดี ๆ ไปด้วยกัน'
                                                : category === 'Honeymoon & Romantic Tour' ? 'เติมเต็มความหวานให้คู่รัก กับบรรยากาศสุดโรแมนติก ดื่มด่ำพระอาทิตย์ตกดินริมทะเล ดินเนอร์ใต้แสงเทียน และพักผ่อนในรีสอร์ตสุดหรู ที่จะทำให้ทุกช่วงเวลาของคุณและคนพิเศษเต็มไปด้วยความทรงจำที่สวยงาม'
                                                    : 'ทัวร์อื่นๆ'}
                            </p>
                            <a
                                href="#"
                                className="mt-8 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
                            >
                                เลือกดูแพ็คเกจ
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <div>

                <div className="bg-white">
                    <div className="mx-auto max-w[80%] sm:max-w-[80%] px-4 pt-10 py-24  sm:px-6 sm:pt-10 sm:py-32 lg:px-8 lg:pt-10">
                        <div>
                            <div className="flex flex-wrap gap-4 justify-center items-end sm:flex-nowrap mb-8">
                                <button className="w-full sm:w-50 size-11 px-6 rounded-xl bg-[#F8644B] py-2 text-white cursor-pointer hover:scale-105 active:scale-100 transition-transform duration-100"
                                    onClick={() => handleClear()}
                                >
                                    ล้างคำค้นหา
                                </button>
                                <div className="w-full sm:w-[2/4]">
                                    <input
                                        placeholder="ค้นหาแพ็กเกจ"
                                        onChange={(e) => setSearchText(e.target.value)}
                                        value={SearchText}
                                        className="w-full sm:w-full rounded-xl size-11 bg-white px-3 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-[#F8644B]"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-10">
                            <motion.div
                                key={SearchText}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                {filterData.map((product) => (
                                    <div
                                        key={product.documentId}
                                        className="group relative cursor-pointer hover:scale-105 active:scale-100 transition-transform duration-200 lg:w-2xs mb-8"
                                        onClick={() => handleToPackageDetail(product.documentId, product.package_id)}
                                    >
                                        <img
                                            src={`${strapiBaseURL}${product.url}`}
                                            className="aspect-square rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-80"
                                        />
                                        <div className="mt-4 flex justify-between">
                                            <div>
                                                <h3 className="text-lg text-gray-700">
                                                    <a href={product.href}>
                                                        <span aria-hidden="true" className="absolute inset-0" />
                                                        {product.name}
                                                    </a>
                                                </h3>
                                                <div className="flex items-center space-x-1.5">
                                                    <MapPin className="text-[#F8644B]"></MapPin>
                                                    <p className="mt-1 text-sm text-gray-500">{product.location}</p>
                                                </div>
                                            </div>
                                            <p className="text-3xl font-bold text-[#F8644B]">{product.price} ฿</p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Category;
