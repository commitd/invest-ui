
import { HandlerFunction, JsonRpcParameter } from 'vessel-rpc' 
import { NetworkInterface, ApolloClient } from 'react-apollo' 
import { ExecutionResult } from 'graphql' 

// We are intercepting at the network interface level... not at the client level. This is repeating the work..
// TODO: but perhaps we shoud be doing it this way? Then we only have a redux store in the parent.
// However 
// We'd need to proxy the apologclient... (or just provide a mutrate / query api )?
// export const createGraphQLHandlerForClient  = (client: ApolloClient) => {
//     return (...params: JsonRpcParameter[]) =>  {
//         if (params.length !== 1) {
//             return Promise.reject('Invalid number of arguments')
//         }
//         return client.query(params[0])
//     }
// }

export type NetworkInferfaceHandlerFunctionCreator = (networkInterface: NetworkInterface) 
                => HandlerFunction<ExecutionResult>

export type ClientHandlerFunctionCreator = (client: ApolloClient) 
    => HandlerFunction<ExecutionResult>

export const createGraphQLHandlerForNetworkInterface: NetworkInferfaceHandlerFunctionCreator = 
    (networkInterface: NetworkInterface) => {
    return (...params: JsonRpcParameter[]) =>  {
        if (params.length !== 1) {
            return Promise.reject('Invalid number of arguments')
        }
        return networkInterface.query(params[0])
    }
}

export const createGraphQLHandlerForClient: ClientHandlerFunctionCreator 
    = (client: ApolloClient) => createGraphQLHandlerForNetworkInterface(client.networkInterface)