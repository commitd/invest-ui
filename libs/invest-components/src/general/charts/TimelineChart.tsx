import * as React from 'react'
import { VictoryChart, VictoryLine } from 'victory'

export interface OwnProps {
    data: {
        x: Date | number,
        y: number
    }[]
}

export type Props = OwnProps

// TODO: Max height... ? the component keeps growing!! by +4 pixels each time

class TimelineChart extends React.Component<Props> {
    render() {
        const { data } = this.props
        return (
            <VictoryChart
                scale={{ x: 'time' }}
            >
                <VictoryLine data={data} />
            </VictoryChart>
        )
    }
}

// TODO: Could add brushing here. See the Victory example.

export default TimelineChart
