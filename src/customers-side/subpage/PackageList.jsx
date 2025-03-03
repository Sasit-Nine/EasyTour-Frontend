import React, { useEffect, useState, createContext, useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_PACKAGELIST } from "../../services/Graphql";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { debounce } from "lodash";

// เพิ่ม context สำหรับแชร์ข้อมูลกับ FilterPackage
export const FilterContext = createContext();

// ฟังก์ชันสำหรับแปลงเป็นเงื่อนไขของระยะเวลา
const convertDurationToCondition = (durationFilters) => {
  if (!durationFilters || durationFilters.length === 0) return null;
  
  const conditions = [];
  
  durationFilters.forEach(filter => {
    switch (filter) {
      case '1-day':
        conditions.push({ duration: { lte: 1 } });
        break;
      case '2-3-days':
        conditions.push({ 
          and: [
            { duration: { gte: 2 } },
            { duration: { lte: 3 } }
          ]
        });
        break;
      case '4-7-days':
        conditions.push({ 
          and: [
            { duration: { gte: 4 } },
            { duration: { lte: 7 } }
          ]
        });
        break;
      case 'more-than-7-days':
        conditions.push({ duration: { gt: 7 } });
        break;
    }
  });
  
  return conditions.length > 0 ? { or: conditions } : null;
};

const PackageList = ({filters, onFilterInitialized}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const strapiBaseURL = import.meta.env.VITE_STRAPI_URL;
  
  // Check if search filters are passed from Home component
  const searchFilters = location.state?.searchFilters || null;
  
  // Merge search filters from Home with existing filters if available
  const initialFilters = {
    category: searchFilters?.category || filters?.category || [],
    packageType: searchFilters?.type && searchFilters?.type !== 'all' ? [searchFilters.type] : filters?.packageType || [],
    duration: filters?.duration || [],
    sector: filters?.sector || [],
    searchQuery: searchFilters?.query || ""
  };
  
  const [debounceFilters, setDebounceFilters] = useState(initialFilters);
  
  // Update filters when searchFilters change
  useEffect(() => {
    if (onFilterInitialized && searchFilters) {
      onFilterInitialized(initialFilters);
    }
  }, [searchFilters]);

  // Update filters when component filters change
  useEffect(() => {
    const handler = debounce(() => {
      if (filters) {
        setDebounceFilters(prevFilters => ({
          ...prevFilters,
          category: filters.category || prevFilters.category,
          packageType: filters.packageType || prevFilters.packageType,
          duration: filters.duration || prevFilters.duration,
          sector: filters.sector || prevFilters.sector
        }));
      }
    }, 500);
    
    handler();
    return () => handler.cancel();
  }, [filters]);

  // สร้างเงื่อนไขสำหรับ GraphQL query
  const buildQueryFilters = () => {
    const queryFilters = {
      status_package: {
        eq: "PUBLISH"
      }
    };

    // เพิ่มเงื่อนไขหมวดหมู่
    if (debounceFilters.category.length > 0) {
      queryFilters.type = { in: debounceFilters.category };
    }

    // เพิ่มเงื่อนไขภาค
    if (debounceFilters.sector.length > 0) {
      queryFilters.location = { sector: { in: debounceFilters.sector } };
    }

    // เพิ่มเงื่อนไขการค้นหา
    if (debounceFilters.searchQuery) {
      queryFilters.name = { containsi: debounceFilters.searchQuery };
    }

    // เพิ่มเงื่อนไขประเภทแพ็คเกจ
    if (debounceFilters.packageType?.length > 0) {
      queryFilters.package_type = { in: debounceFilters.packageType };
    }

    // สร้างเงื่อนไขสำหรับระยะเวลา
    const durationCondition = convertDurationToCondition(debounceFilters.duration);
    if (durationCondition) {
      // รวมเงื่อนไขระยะเวลากับเงื่อนไขอื่นๆ
      return {
        and: [
          queryFilters,
          durationCondition
        ]
      };
    }

    return queryFilters;
  };

  const { data: dataPackage, loading: loadingPackage, error: errorPackage, refetch } = useQuery(QUERY_PACKAGELIST, {
    variables: {
      filters: buildQueryFilters()
    }
  });

  useEffect(() => {
    refetch();
  }, [debounceFilters, refetch]);
  
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
    url: pkg.image[0].url,
    package_id: pkg.package_id
  })) || [];

  const handleToPackageDetail = (documentId, package_id) => {
    navigate(`${documentId}`, {
      state: {
        pkgID: package_id
      }
    });
  };

  return (
    <motion.div
      key={`${debounceFilters.category.join(",")}-${debounceFilters.duration.join(",")}-${debounceFilters.packageType.join(",")}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Show search query if provided */}
      {debounceFilters.searchQuery && (
        <div className="mb-6">
          <h2 className="text-xl font-medium">ผลการค้นหา: "{debounceFilters.searchQuery}"</h2>
        </div>
      )}
      
      {/* Show applied filters summary */}
      {(debounceFilters.category.length > 0 || 
        debounceFilters.duration.length > 0 || 
        debounceFilters.packageType.length > 0 || 
        debounceFilters.sector.length > 0) && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">กำลังกรอง:</h3>
          <div className="flex flex-wrap gap-2">
            {debounceFilters.category.length > 0 && (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                หมวดหมู่: {debounceFilters.category.length} รายการ
              </span>
            )}
            {debounceFilters.packageType.length > 0 && (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                ประเภทแพ็กเกจ: {debounceFilters.packageType.length} รายการ
              </span>
            )}
            {debounceFilters.duration.length > 0 && (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                ระยะเวลา: {debounceFilters.duration.length} รายการ
              </span>
            )}
            {debounceFilters.sector.length > 0 && (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                ภาค: {debounceFilters.sector.length} รายการ
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className="bg-white w-full">
        {transformedPackages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {transformedPackages.map((product) => (
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
                    <div className="mt-1">
                      <p className="text-sm text-gray-500">ระยะเวลา: {product.duration} วัน</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#F8644B]">{product.price} ฿</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">ไม่พบแพ็กเกจที่ตรงกับการค้นหาของคุณ</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

PackageList.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.array,
    packageType: PropTypes.array,
    duration: PropTypes.array,
    sector: PropTypes.array
  }),
  onFilterInitialized: PropTypes.func
};

PackageList.defaultProps = {
  filters: {
    category: [],
    packageType: [],
    duration: [],
    sector: []
  },
  onFilterInitialized: () => {}
};

export default PackageList;