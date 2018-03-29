import * as React from 'react'
import Pagination from './Pagination'

export type Props<T> = {
    items: T[]
    itemsKey?: string,
    emptyMessage?: string,
    children: React.ReactElement<{}>
    size?: number
}

export type State = {
    offset: number
}

export default class Paginated<T> extends React.Component<Props<T>, State> {

    state: State = {
        offset: 0
    }

    componentWillReceiveProps(nextProps: Props<T>) {
        if (this.props.items !== nextProps.items) {
            this.setState({
                offset: 0
            })
        }
    }

    render() {
        const { items, itemsKey, emptyMessage, children, size } = this.props

        if (items == null || items.length === 0) {
            return <p>{emptyMessage ? emptyMessage : 'Nothing to display'}</p>
        }

        const child = React.Children.only(children)
        const key = itemsKey ? itemsKey : 'items'

        const { offset } = this.state

        let pageSize = size && size > 0 ? size : 25
        const subItems = items.slice(offset, offset + pageSize)

        return (
            <React.Fragment>
                {React.cloneElement(child, { [key]: subItems })}
                <Pagination
                    total={items.length}
                    resultsOnPage={subItems.length}
                    offset={offset}
                    size={pageSize}
                    onOffsetChange={this.handleOffsetChanged}
                />
            </React.Fragment>
        )
    }

    private handleOffsetChanged = (offset: number) => {
        this.setState({
            offset
        })
    }
}
