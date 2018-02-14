import * as React from 'react'
import { Card } from 'semantic-ui-react'

export type Props = {
    title?: string
    subTitle?: string
}

class SimpleCard extends React.Component<Props> {
    render() {
        const { title, subTitle, children } = this.props
        return (
            <Card fluid={true}>
                <Card.Content>
                    {title && <Card.Header>{title}</Card.Header>}
                    {subTitle && <Card.Meta>{subTitle}</Card.Meta>}
                    {children}
                </Card.Content>
            </Card>
        )
    }
}

export default SimpleCard