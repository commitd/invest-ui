import * as React from 'react'
import { VictoryPie } from 'victory'

export interface Props {
    data: {
        x: string,
        y: number
    }[]
}

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
