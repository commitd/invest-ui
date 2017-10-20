import { visit, FieldNode, DocumentNode, GraphQLError, BREAK, ExecutionResult, OperationDefinitionNode } from 'graphql'
import { NetworkInterface, Request } from 'react-apollo'

export interface SpiltNetworkInterfaceOptions {
    interfaces: { [key: string]: NetworkInterface },
    defaultInterface: NetworkInterface
}

export class SpiltNetworkInterface implements NetworkInterface {
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
            const compiledErrors = p.reduce(
                (a, i) => i.errors !== undefined ? a.concat(i.errors) : a,
                [] as GraphQLError[])
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