import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
} from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import App from './App'

import { newStore } from 'vessel-redux'
import { rootReducer, RootState } from './redux/RootReducer'
import { rootSaga } from './redux/RootSaga'
const store = newStore<RootState>(rootReducer, rootSaga)

// TODO; These sshould be in vessel-ui-componnts MaterialUi but 
import './icons/index'

import { MaterialUi } from 'vessel-components'
import { ApolloProvider, ApolloClient, NetworkInterface, createNetworkInterface, Request } from 'react-apollo'

import { ExecutionResult, graphql, print, GraphQLResolveInfo, OperationDefinitionNode } from 'graphql'
import { schema } from 'vessel-framework'

type GraphResolverCallback<Result, Source, Context>
  = (source: Source, context: Context, info: GraphQLResolveInfo) => Result | Promise<Result>
type GraphResolver<Result, Source = {}, Context = {}> = Result
  | Promise<Result>
  | GraphResolverCallback<Result, Source, Context>

interface VesselUiGraphQlRoot {
  vesselUi: {
    status: GraphResolver<string>
  }
}

const simpleRoot: VesselUiGraphQlRoot = {
  vesselUi: {
    status: () => 'ok'
  }
}

class VesselUiNetworkInterface implements NetworkInterface {
  root: VesselUiGraphQlRoot

  constructor(root: VesselUiGraphQlRoot) {
    this.root = root
  }

  query(request: Request): Promise<ExecutionResult> {
    return this._handle(
      print(request.query),
      request.operationName === null ? undefined : request.operationName,
      request.variables)
  }

  private _handle(query: string, operationName?: string, variables?: {}) {
    return graphql(schema, query, this.root, undefined, variables, operationName)
  }

}

import { visit, FieldNode, DocumentNode, GraphQLError, BREAK } from 'graphql'

interface SpiltNetworkInterfaceOptions {
  interfaces: { [key: string]: NetworkInterface },
  defaultInterface: NetworkInterface
}

class SpiltNetworkInterface implements NetworkInterface {
  options: SpiltNetworkInterfaceOptions

  constructor(options: SpiltNetworkInterfaceOptions) {
    this.options = options
  }

  query(request: Request): Promise<ExecutionResult> {
    // If its empty, just pass off to the default interface
    if (!request.query) {
      return this.options.defaultInterface.query(request)
    }

    // For the default query strip off which we have another top level query for
    const defaultQuery = visit(request.query, {
      'Field': (node: FieldNode) => {
        const name = node.name.value
        if (this.options.interfaces.hasOwnProperty(name)) {
          return null
        } else {
          // As its top level, if we don't find it here, we can just stop processing the subtree
          return false
        }
      }
    })

    const allPromises: Promise<ExecutionResult>[] = []

    if (!this._isEmpty(defaultQuery)) {
      const defaultPromise = this._callNetworkInterface(this.options.defaultInterface, request, defaultQuery)
      allPromises.push(defaultPromise)
    }

    for (let key of Object.keys(this.options.interfaces)) {
      const keyOnlyQuery: DocumentNode = visit(request.query, {
        'Field': (node: FieldNode) => {
          const name = node.name.value
          if (name === key) {
            return false
          } else {
            // As its top level, if we don't find it here, we can just stop processing the subtree
            return null
          }
        }
      })

      if (!this._isEmpty(keyOnlyQuery)) {
        const i = this.options.interfaces[key]
        const p = this._callNetworkInterface(i, request, keyOnlyQuery)
        allPromises.push(p)
      }

    }

    // Want to write;  return Promise.all(...allPromises)
    // but I get a 'mimume args 0 when needs at least 1' from typescript so rolling my own all()

    return new Promise<ExecutionResult[]>((resolve, reject) => {
      if (allPromises.length === 0) {
        return resolve([])
      }

      const results: ExecutionResult[] = []
      let resolved = 0
      allPromises.forEach((p, i) => {
        p.then(v => {
          results[i] = v
          resolved++
          if (resolved === allPromises.length) {
            resolve(results)
          }
        }).catch(reject)
      })
    }).then(p => {
      const compiledErrors = p.reduce((a, i) => i.errors !== undefined ? a.concat(i.errors) : a, [] as GraphQLError[])
      const error = compiledErrors.length === 0 ? undefined : compiledErrors
      const combined = {
        data: p.reduce((a, i) => { Object.assign(a, i.data); return a }, {}),
        error
      }
      return combined
    })
  }

  private _isEmpty(query: DocumentNode): boolean {
    // Look if we have an operational definitions and is 
    let hasOperations = false
    visit(query, {
      OperationDefinition(node: OperationDefinitionNode) {
        if (node.selectionSet.selections.length > 0) {
          hasOperations = true
          return BREAK
        }
        return undefined
      }
    })

    return !hasOperations
  }

  private _callNetworkInterface(networkInterface: NetworkInterface, request: Request, query?: DocumentNode)
    : Promise<ExecutionResult> {
    return networkInterface.query({
      ...request,
      query
    })
  }

}

const client = new ApolloClient({
  networkInterface: new SpiltNetworkInterface({
    interfaces: {
      'vesselUi': new VesselUiNetworkInterface(simpleRoot)
      // TODO: Likely have something like this
      // 'vesselServer': createNetworkInterface({
      //   uri: '/vessel/graphql'
      // }),
    },
    defaultInterface: createNetworkInterface({
      uri: '/graphql'
    })
  })
})

ReactDOM.render(
  <ApolloProvider client={client} >
    <MaterialUi>
      <Provider store={store}>
        <Router>
          <App client={client} />
        </Router>
      </Provider>
    </MaterialUi>
  </ApolloProvider>
  ,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
