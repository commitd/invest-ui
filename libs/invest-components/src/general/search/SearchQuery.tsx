import * as React from 'react'
import { Input } from 'semantic-ui-react'

export type Props = {
    query: string
    onSearch?(): void
    onQueryChange(query: String): void
}

class SearchQuery extends React.Component<Props> {

    handleChange = (e: React.SyntheticEvent<{}>, data: { value: string }) => {
        this.props.onQueryChange(data.value)
    }

    handleSubmit = () => {
        if (this.props.onSearch) {
            this.props.onSearch()
        }
    }

    handleKeyPress = (e: React.KeyboardEvent<{}>) => {
        if (e.key === 'Enter') {
            this.handleSubmit()
        }
    }

    render() {
        const { query } = this.props
        return (
            <Input
                fluid={true}
                action={{ labelPosition: 'left', icon: 'search', content: 'Search', onClick: this.handleSubmit }}
                placeholder="Query..."
                value={query}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}

            />
        )
    }
}

export default SearchQuery