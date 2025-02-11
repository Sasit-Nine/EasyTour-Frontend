import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_PACKAGELIST } from "../../services/Graphql";
import { useNavigate } from "react-router-dom";
const PackageList = () => {
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
        return <p>Error loading packages: {errorPackage.message}</p>;
    }
    // console.log(dataPackage.packages)
    const transformedPackages = dataPackage?.packages?.map((pkg,index) => ({
        index: index,
        documentId: pkg.documentId,
        name: pkg.name,
        price: pkg.price,
        duration: pkg.duration,
        location: pkg.location,
        start: pkg.start,
        end: pkg.end
      })) || [];
    
    const navigate = useNavigate()
    const handleToPackageDetail = () => {
        navigate(`package/${documentId}`)
    }

    console.log(transformedPackages)
    return (
        <div>
            <button onClick={handleToPackageDetail()}>Booking</button>
        </div>
    )
};

export default PackageList;
