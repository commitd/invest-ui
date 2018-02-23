import * as React from 'react'
import { VictoryChart, VictoryBar } from 'victory'

export interface OwnProps {
    data: {
        x: string | number,
        y: number
    }[]
}

export type Props = OwnProps

class BarChart extends React.Component<Props> {
    render() {
        const { data } = this.props
        return (
            <VictoryChart
                width={1500}
                height={500}
                domainPadding={100}
            >
                <VictoryBar data={data} />
            </VictoryChart>
        )
    }
}

export default BarChart
