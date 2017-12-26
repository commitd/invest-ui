
export * from './RpcNetworkInterface'
export * from './GraphQlRpcHander'
export * from './SpiltNetworkInterface'
export * from './LocalNetworkInterface'

// TODO: This has not been tested and documented as it is subject to change
// See Issue #3
// Seems like apollo schema stitching could be used in order to more cleanly
// manage this. 
// This would likely remove the need for SpiltNetworkInterface. 
// Perhaps that would move the spiltting from the application the plugin? 
// (perhaps - if it where moved it would allow the plugin to be smarter about what it did if not outer app
// was available, but it also complicates the plugin). 
// http://dev.apollodata.com/tools/graphql-tools/schema-stitching.html#remote-schemas