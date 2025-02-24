import { useQuery } from "@apollo/client"
import { QUERY_PACKAGELIST } from "../../services/Graphql"
const ProductInHome = () => {
    const {data:packageList , loading:loadingPackage , error:errorPackage} = useQuery(QUERY_PACKAGELIST,{
        variables:{
            filters:{
                status_package: {
                    eq: "PUBLISH"
                }
            }
        }
    })
    if(loadingPackage){
        return (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-4 h-4 bg-[#F8644B] rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-[#F8644B] rounded-full animate-bounce200"></div>
              <div className="w-4 h-4 bg-[#F8644B] rounded-full animate-bounce400"></div>
            </div>
        );
    }
}
export default ProductInHome