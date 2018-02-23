import * as React from 'react'
import { VictoryChart, VictoryLine } from 'victory'

export interface OwnProps {
    data: {
        x: Date | number,
        y: number
    }[]
}

export type Props = OwnProps

class TimelineChart extends React.Component<Props> {
    render() {
        const { data } = this.props
        return (
            <VictoryChart
                width={1500}
                height={500}
                domainPadding={100}
                scale={{ x: 'time' }}
            >
                <VictoryLine data={data} />
            </VictoryChart>
        )
    }
}

export default TimelineChart
