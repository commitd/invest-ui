import * as React from 'react'
import { Button } from 'semantic-ui-react'

export type SearchButtonProps = {
    disabled?: boolean
    onSubmit(): void
}

class SearchButton extends React.Component<SearchButtonProps> {

    render() {
        const disabled = this.props.disabled === true ? true : false

        return (
            <Button
                labelPosition="left"
                icon="search"
                content="Search"
                onClick={this.props.onSubmit}
                disabled={disabled}
                primary={true}
            />
        )
    }
}

export default SearchButton