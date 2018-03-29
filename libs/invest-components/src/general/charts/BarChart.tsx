import * as React from 'react'
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Tooltip } from 'recharts'

export interface Props {
    data: {
        x: string,
        y: number
    }[],
    height?: number
}

class SimpleBarChart extends React.Component<Props> {
    render() {
        const { data, height } = this.props
        return (
            <ResponsiveContainer height={height ? height : 400}>
                <BarChart data={data}>
                    <XAxis dataKey="x" />
                    <YAxis dataKey="y" />
                    <Tooltip />
                    <Bar dataKey="y" name="Value" fill="#000" />
                </BarChart>
            </ResponsiveContainer>

        )
    }
}

export default SimpleBarChart
