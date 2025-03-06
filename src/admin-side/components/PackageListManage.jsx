import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_PACKAGELIST } from "../../services/Graphql";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { useSearch } from "../components/AdminLayout";

const PackageListManage = ({ filters }) => {
  const navigate = useNavigate()
  const strapiBaseURL = import.meta.env.VITE_STRAPI_URL
  const {searchQuery} = useSearch()
  const [debounceFilters, setDebounceFilters] = useState(filters || { category: [], duration: [], sector: [] })
  
  useEffect(() => {
    const handler = debounce(() => {
      setDebounceFilters(filters)
    }, 500)
    
    if (filters) {
      handler()
    }
    
    return () => handler.cancel()
  }, [filters])

  const { data: dataPackage, loading: loadingPackage, error: errorPackage, refetch } = useQuery(QUERY_PACKAGELIST, {
    variables: {
      filters: {
        ...(debounceFilters?.category?.length > 0 && { type: { in: debounceFilters.category } }),
        ...(debounceFilters?.duration?.length > 0 && { with_accommodation: { in: debounceFilters.duration } }),
        ...(debounceFilters?.sector?.length > 0 && { location: { sector: { in: debounceFilters.sector } } }),
      }
    }
  })

  useEffect(() => {
    if (debounceFilters) {
      refetch({
        filters: {
          ...(debounceFilters.category?.length > 0 && { type: { in: debounceFilters.category } }),
          ...(debounceFilters.duration?.length > 0 && { with_accommodation: { in: debounceFilters.duration } }),
          ...(debounceFilters.sector?.length > 0 && { location: { sector: { in: debounceFilters.sector } } }),
        }
      })
    }
  }, [debounceFilters, refetch])

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
    return <p>Error loading packages: {errorPackage.message}</p>;
  }
  
  const transformedPackages = dataPackage?.packages?.map((pkg, index) => ({
    index: index,
    documentId: pkg.documentId,
    name: pkg.name,
    price: pkg.price,
    duration: pkg.duration,
    location: pkg.location.province,
    start: pkg.start,
    end: pkg.end,
    url: pkg.thumbnail.url,
    package_id: pkg.package_id,
    status: pkg.status_package,
    type: pkg.type,
    sector: pkg.sector,
  })) || [];

  const handleToPackageDetail = (documentId, package_id) => {
    navigate(`${documentId}`, {
      state: {
        pkgID: package_id
      }
    })
  }

  const filterPackage = transformedPackages.filter((product) => {
    return product.name.toLowerCase().includes(searchQuery?.toLowerCase())
  })

  return (
    <motion.div
      key={`${debounceFilters?.category?.join(",")}-${debounceFilters?.duration?.join(",")}-${debounceFilters?.sector?.join(",")}-${filterPackage}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="bg-white w-full">
        {transformedPackages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">ไม่พบแพ็กเกจทัวร์ที่ตรงกับเงื่อนไขการค้นหา</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {filterPackage.map((product) => (
              <div
                key={product.documentId}
                className="group relative cursor-pointer hover:scale-105 active:scale-100 transition-transform duration-200 lg:w-2xs"
                onClick={() => handleToPackageDetail(product.documentId, product.package_id)} >
                <img
                  src={`${strapiBaseURL}${product.url}`}
                  alt={product.name}
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
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="text-[#F8644B]"></MapPin>
                        <p className="mt-1 text-sm text-gray-500">{product.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {product.status === "Publish" ?
                        <div className="bg-green-100 p-0.5 pr-3 pl-3 rounded-md border-green-400 border-1 text-center mt-2">
                          <p className="text-sm text-green-800">เผยแพร่</p>
                        </div> :
                        <div className="bg-red-200 p-0.5 w-20 rounded-md border-red-500 border-1 text-center mt-2">
                          <p className="text-sm text-red-800">ฉบับร่าง</p>
                        </div>
                      }
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#F8644B]">{product.price} ฿</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
};

PackageListManage.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.array,
    duration: PropTypes.array,
    sector: PropTypes.array
  })
};

PackageListManage.defaultProps = {
  filters: {
    category: [],
    duration: [],
    sector: []
  }
};

export default PackageListManage;