import * as React from 'react'
import { Message } from 'semantic-ui-react'

export interface OwnProps {
    title: string
    description: string
}

export type Props = OwnProps

class MessageBox extends React.Component<Props> {

    render() {
        const { title, description } = this.props

        return (
            <div>
                <Message>
                    <Message.Header>
                        {title}
                    </Message.Header>
                    <p>
                        {description}
                    </p>
                </Message>
            </div>
        )
    }
}

export default MessageBox