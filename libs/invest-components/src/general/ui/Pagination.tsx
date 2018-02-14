import * as React from 'react'
import { Segment, Button } from 'semantic-ui-react'

export type Props = {
    // Either provide the total number of hits
    total?: number,
    // Or the number o results on teh current page
    resultsOnPage?: number
    offset: number
    size: number,
    onOffsetChange(offset: number): void
}

class Pagination extends React.Component<Props> {

    handlePrevious = () => {
        const offset = Math.max(this.props.offset - this.props.size, 0)
        this.props.onOffsetChange(offset)
    }

    handleNext = () => {
        let offset = this.props.offset + this.props.size
        const total = this.props.total
        if (total != null) {
            offset = Math.min(offset, total)
        }
        this.props.onOffsetChange(offset)
    }

    render() {
        const { total, offset, size, resultsOnPage } = this.props

        const hasPrevious = offset > 0
        let hasNext: boolean

        if (total != null) {
            hasNext = offset + size < total
        } else if (resultsOnPage != null) {
            // If we have a full page guess there'ss another page...
            hasNext = resultsOnPage >= size
        } else {
            // If we have nothing to go on, assume another page
            hasNext = true
        }

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