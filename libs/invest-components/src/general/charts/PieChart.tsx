import * as React from 'react'
import { VictoryPie } from 'victory'

export interface Props {
    data: {
        x: string,
        y: number
    }[]
}

// TODO: The padding here is a hack for the label being outside the area (ie chart is too big...)

class SimplePieChart extends React.Component<Props> {
    render() {
        const { data } = this.props
        return (
            <VictoryPie
                data={data}
            />
        )
    }
}

export default SimplePieChart
