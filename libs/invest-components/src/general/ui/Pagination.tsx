import * as React from 'react'
import { Segment, Button } from 'semantic-ui-react'

export type Props = {
    total: number
    offset: number
    size: number
    onOffsetChange(offset: number): void
}

class Pagination extends React.Component<Props> {

    handlePrevious = () => {
        const offset = Math.max(this.props.offset - this.props.size, 0)
        this.props.onOffsetChange(offset)
    }

    handleNext = () => {
        const offset = Math.min(this.props.offset + this.props.size, this.props.total - this.props.size)
        this.props.onOffsetChange(offset)
    }

    render() {
        const { total, offset, size } = this.props

        const hasPrevious = offset > 0
        const hasNext = offset + size < total

        return (
            <div>
                {(hasNext || hasPrevious) &&
                    <div>
                        <Segment basic={true}>
                            {hasPrevious &&
                                <Button
                                    floated="left"
                                    labelPosition="left"
                                    icon="left chevron"
                                    content="Previous"
                                    onClick={this.handlePrevious}
                                />}
                            {hasNext &&
                                <Button
                                    floated="right"
                                    labelPosition="right"
                                    icon="right chevron"
                                    content="Next"
                                    onClick={this.handleNext}
                                />}
                        </Segment>
                    </div>

                }
            </div>
        )
    }
}

export default Pagination