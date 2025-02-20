import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_PACKAGELIST } from "../../services/Graphql";
import { useNavigate } from "react-router-dom";
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
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">แพ็คเกจท่องเที่ยว</h2>

        <div className="drop-shadow-xl mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {transformedPackages.map((product) => (
            <div key={product.documentId} className=" group relative cursor-pointer hover:scale-105 active:scale-100 transition-transform duration-200" onClick={() => handleToPackageDetail(product.documentId,product.package_id)} >
              <img
                src={`${strapiBaseURL}${product.url}`}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-80"
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.location}</p>
                </div>
                <p className="text-2xl font-bold text-[#F8644B]">{product.price} ฿</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};

export default PackageList;