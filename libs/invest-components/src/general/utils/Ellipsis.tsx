import * as React from 'react'
import { Popup } from 'semantic-ui-react'

export type Props = {
    text: string
    size?: number
    ellipsis?: string
}

class Ellipsis extends React.Component<Props> {

    render() {
        const { text, size, ellipsis } = this.props

        const maxSize = size == null ? 32 : size
        const postfix = ellipsis == null ? '...' : ellipsis

        if (text.length > maxSize) {
            const content = text.substring(0, maxSize - postfix.length) + postfix

            return (
                <Popup
                    hoverable={true}
                    trigger={<span>{content}</span>}
                    content={text}
                />
            )
        } else {
            return <span>{text}</span>
        }
    }
}

export default Ellipsis