import { data, useParams } from "react-router-dom";
import React from "react";
import { useQuery } from "@apollo/client";
import { QUERY_PACKAGE } from "../../services/Graphql";
import { Card, Typography, Button, InputNumber, Row, Col, Image } from "antd";
import '../../css/PackageDetail.scss'
import dayjs from "dayjs";
import { MapPin } from 'lucide-react';


const PackageDetail = () => {
    const { Title } = Typography;
    const strapiBaseURL = import.meta.env.VITE_STRAPI_URL
    const { documentId } = useParams()
    console.log(documentId)
    const { data: dataPackage, loading: loadingPackage, error: errorPackage } = useQuery(QUERY_PACKAGE, {
        variables: {
            documentId: documentId
        }
    })
    if (loadingPackage) {
        return <p>Loading</p>
    }
    if (errorPackage) {
        return <p>{errorPackage}</p>
    }
    console.log(dataPackage.package)
    const includesList = dataPackage.package.price_includes.split('\n');
    const time = dataPackage.package.time; // "09:00:00.000"
    const formattedTime = dayjs(time, 'HH:mm:ss.SSS').format('HH:mm');
    return (
        <div className="box">
            <Row gutter={[16, 16]}>
                <Col span={14} style={{ background: '#bae7ff', padding: '20px' }}>

                </Col>
                <Col span={10} style={{ background: 'white', padding: '20px' }}>
                    <Title>{dataPackage.package.name}</Title>
                    <p className="titleDetail">รายละเอียด</p>
                    <div>
                        <p className="subDetail">ราคานี้รวม</p>
                        <div className="listBox">
                            <ul>
                                {includesList.map((item, index) => (
                                    <li key={index}>{item.replace('- ', '')}</li>
                                ))}
                            </ul>
                        </div>
                        <p className="subDetail">จุดนัดพบ</p>
                        <div className="textBox">
                            <p>{dataPackage.package.meeting_point}</p>
                        </div>
                        <p className="subDetail">เวลานัดพบ</p>
                        <div className="textBox">
                            <p>{formattedTime} น.</p>
                        </div>
                        <p className="subDetail">หมายเหตุ</p>
                        <div className="textBox">
                            <p>{dataPackage.package.note}</p>
                        </div>
                    </div>
                    <Row align="middle" gutter={8} style={{ marginTop: 20 }}>
                        <Col>
                            <MapPin size={20} color="#F8644B" />
                        </Col>
                        <Col>
                            <p>{dataPackage.package.location.province} อำเภอ {dataPackage.package.location.district} ตำบล {dataPackage.package.location.subdistrict}</p>
                        </Col>
                    </Row>
                    <Row align="middle" gutter={8} style={{ marginTop: 20 }}>
                        <Col>
                            <p className="price">{dataPackage.package.price}</p>
                        </Col>
                        <Col>
                            <p className="perPerson" >per Person</p>
                        </Col>
                    </Row>


                    <Button style={{ backgroundColor: '#F8644B', borderColor: '#F8644B', color: '#fff' ,padding: 30, marginTop: 10, width:'30%'}}>
                        Booking
                    </Button>
                </Col>
            </Row>
        </div>
    )
};
export default PackageDetail;

