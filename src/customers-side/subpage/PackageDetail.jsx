import { useParams } from "react-router-dom";
import React from "react";
const PackageDetail = () => {
    const {documentId} = useParams()
    console.log(documentId)
    return(
        <div>
            <p>{documentId}</p>
        </div>
    )
};
export default PackageDetail;

