import { useQuery } from "@apollo/client"
import { QUERY_PACKAGELIST } from "../../services/Graphql"
import { MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"
const ProductInHome = () => {
    const navigate = useNavigate()
    const strapiBaseURL = import.meta.env.VITE_STRAPI_URL
    const { data: packageList, loading: loadingPackage, error: errorPackage } = useQuery(QUERY_PACKAGELIST, {
        variables: {
            filters: {
                status_package: {
                    eq: "PUBLISH"
                }
            }
        }
    })
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
        return (
            <p>Error {errorPackage}</p>
        )
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
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">แพ็กเกจทัวร์ภาคเหนือ</h2>
                    <p className="text-lg text-[#F8644B]">ดูเพิ่มเติม</p>
                </div>
                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-10">
                    {transformedPackages.filter(product => product.sector === "north").map((product) => (
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
                </div>
        </div>
    )
}
export default ProductInHome