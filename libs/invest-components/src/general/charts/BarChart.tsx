import * as React from 'react'
import { VictoryChart, VictoryBar } from 'victory'

export interface OwnProps {
    data: {
        x: string | number,
        y: number
    }[]
}

export type Props = OwnProps

// TODO: Max height... ? the component keeps growing!! by +4 pixels each time

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

// TODO: Could add brushing here. See the Victory example.

export default BarChart
