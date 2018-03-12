import * as React from 'react'
import { ResponsiveContainer, PieChart, Pie, Tooltip } from 'recharts'
// Label list is not yet in @types/recharts so we can't import it without an error...
const { LabelList } = require('recharts')

export interface Props {
    data: {
        x: string,
        y: number
    }[]
    height?: number

}

class SimplePieChart extends React.Component<Props> {
    render() {
        const { data, height } = this.props
        return (
            <ResponsiveContainer height={height ? height : 400}>
                <PieChart>
                    <Tooltip />
                    <Pie data={data} dataKey="y" nameKey="x" label={true} fill="#000" >
                        <LabelList dataKey="x" />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

        )
    }
}

export default SimplePieChart
