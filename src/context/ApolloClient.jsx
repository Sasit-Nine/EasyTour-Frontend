import { ApolloClient,InMemoryCache,ApolloProvider } from "@apollo/client";
const strapiBaseURL = import.meta.env.VITE_STRAPI_URL

const client = new ApolloClient({
    
    uri:`${strapiBaseURL}/graphql`,
    cache: new InMemoryCache()
})
export default client