import * as React from 'react'
import { Container } from 'semantic-ui-react'
import MessageBox from '../general/message/MessageBox'

export interface OwnProps {
    title: string
    description: string
    check: () => boolean
}

export type Props = OwnProps

class PrerequisiteContainer extends React.Component<Props> {

    render() {
        const { title, description, check, children } = this.props
        const ok = check()

        return (
            <Container fluid={false} >
                {!ok && <MessageBox title={title} description={description} />}
                {ok && children}
            </Container>
        )
    }
}

export default PrerequisiteContainer