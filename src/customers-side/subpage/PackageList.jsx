import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_PACKAGELIST } from "../../services/Graphql";
import { useNavigate } from "react-router-dom";
import {Card,Col,Row,Spin} from 'antd'
import '../../css/PackageList.scss'
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
    const transformedPackages = dataPackage?.packages?.map((pkg,index) => ({
        index: index,
        documentId: pkg.documentId,
        name: pkg.name,
        price: pkg.price,
        duration: pkg.duration,
        location: pkg.location.province,
        start: pkg.start,
        end: pkg.end,
        url: pkg.image[0].url
      })) || [];
    
    const handleToPackageDetail = (documentId) => {
        console.log(documentId)
        navigate(`${documentId}`)
    }

    console.log(transformedPackages)
    return (
        <div>
          <div className="PackageList">
            <Row gutter={16}>
                {transformedPackages.map((pkg)=>(
                    <Col key={pkg.documentId} xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Card
                            className="card"
                            hoverable
                            cover={<img src={`${strapiBaseURL}${pkg.url}`} />}
                            onClick={()=> handleToPackageDetail(pkg.documentId)}
                        >
                            <Card.Meta
                                title={pkg.name}
                                description={
                                    <div>
                                        <p>Price : ฿ {pkg.price}</p>
                                        <p>Duration : {pkg.duration}</p>
                                        <p>Location : {pkg.location}</p>
                                        <p>
                                            {pkg.start} - {pkg.end}
                                        </p>
                                    </div>
                                }
                            >

                            </Card.Meta>
                        </Card>
                    </Col>
                ))}
            </Row>
          </div>
        </div>
    )
};

export default PackageList;
