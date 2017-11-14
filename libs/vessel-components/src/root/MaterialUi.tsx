import * as React from 'react'
import { MuiThemeProvider, createMuiTheme, Theme  } from 'material-ui/styles'

export interface Props {
    theme?: object
}

class MaterialUi extends React.Component<Props, {}> {
    static defaultProps = {
        theme: {}
    }

    private theme: Theme

    constructor(props: Props) {
        super(props)
        this.theme = createMuiTheme(this.props.theme)
    }

    render() {
        return (
            <MuiThemeProvider theme={this.theme}>
                {this.props.children}
            </MuiThemeProvider>
        )
    }

}

export default MaterialUi