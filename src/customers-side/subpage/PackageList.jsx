import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_PACKAGELIST } from "../../services/Graphql";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
const PackageList = () => {
  const navigate = useNavigate()
  const strapiBaseURL = import.meta.env.VITE_STRAPI_URL
  const { data: dataPackage, loading: loadingPackage, error: errorPackage } = useQuery(QUERY_PACKAGELIST, {
    variables: {
      filters: {
        status_package: {
          eq: "PUBLISH"
        }
      }
    }
  })
  if (loadingPackage) {
    return <p>Loading packages...</p>;
  }

  if (errorPackage) {
    console.log()
    return <p>Error loading packages: {errorPackage.message}</p>;
  }
  console.log(dataPackage)
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

  console.log(transformedPackages.package_id)
  const handleToPackageDetail = (documentId,package_id) => {
    console.log(documentId)
    console.log(package_id)
    
    navigate(`${documentId}`,{
      state:{
        pkgID: package_id
      }
    })
  }

  return (
    <div className="bg-white">
        <div className="drop-shadow-xl grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-1">
          {transformedPackages.map((product) => (
            <div key={product.documentId} className=" group relative cursor-pointer hover:scale-105 active:scale-100 transition-transform duration-200" onClick={() => handleToPackageDetail(product.documentId,product.package_id)} >
              <img
                src={`${strapiBaseURL}${product.url}`}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-80"
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
};

export default PackageList;