import * as React from 'react'
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line, Tooltip, ReferenceArea } from 'recharts'
import debounce from 'lodash-es/debounce'
import isEqual from 'lodash-es/isEqual'

import { timeFormat } from 'd3-time-format'

export type TimeDomain = { x: [Date, Date] }

export interface OwnProps {
    data: {
        x: Date,
        y: number
    }[],
    height?: number
    onSelectionChanged?(from: Date, to: Date): void,
}

export type Props = OwnProps

export type IndexDomain = { startIndex: number, endIndex: number }

export type State = {
    start?: number
    end?: number
    selecting?: boolean
    data?: {
        x: number,
        y: number
    }[]
    onSelectionChanged?(from: Date, to: Date): void,

}

class TimelineChart extends React.Component<Props, State> {

    state: State = {
        data: [],
        selecting: false
    }

    componentWillMount() {
        const state: State = {
            data: this.convertData(this.props)
        }

        if (this.props.onSelectionChanged) {
            state.onSelectionChanged = debounce(this.props.onSelectionChanged, 250)
        }

        this.setState(state)
    }

    componentWillReceiveProps(nextProps: Props) {
        let stateChanged = false
        const state: State = {}
        if (!isEqual(nextProps.data, this.props.data)) {
            stateChanged = true
            state.start = undefined
            state.end = undefined
            state.data = this.convertData(nextProps)
        }

        if (nextProps.onSelectionChanged && nextProps.onSelectionChanged !== this.props.onSelectionChanged) {
            state.onSelectionChanged = debounce(nextProps.onSelectionChanged, 250)
        } else if (!nextProps.onSelectionChanged) {
            state.onSelectionChanged = undefined
        }

        if (stateChanged) {
            this.setState(state)
        }
    }

    render() {
        const { height, onSelectionChanged } = this.props
        const { data, start, end } = this.state

        const brushing = onSelectionChanged != null

        return (
            <ResponsiveContainer height={height ? height : 400}>
                <LineChart
                    data={data}
                    onMouseDown={brushing ? this.startSelection : undefined}
                    onMouseMove={this.updateSelection}
                    onMouseUp={this.stopSelection}
                    style={{ userSelect: 'none' }}
                >
                    <XAxis
                        dataKey="x"
                        name="Time"
                        type="number"
                        scale="time"
                        tickFormatter={timeFormat('%Y-%m-%d')}
                        domain={['auto', 'auto']}
                    />
                    <YAxis dataKey="y" name="Count" />
                    <Tooltip labelFormatter={(x: number) => new Date(x).toISOString()} />
                    <Line dataKey="y" stroke="#000" />
                    {brushing && start && end ?
                        <ReferenceArea
                            x1={start}
                            x2={end}
                            strokeOpacity={0.3}
                        />
                        : null}

                </LineChart>
            </ResponsiveContainer >
        )
    }

    private convertData = (props: Props) => {
        return [...props.data].sort((a, b) => a.x.getTime() - b.x.getTime())
            .map(d => ({ y: d.y, x: d.x.getTime() }))
    }

    private startSelection = (e: { activeLabel: number }) => {
        this.setState({ selecting: true, start: e.activeLabel })
    }

    private updateSelection = (e: { activeLabel: number }) => {
        this.setState(state => {
            if (state.selecting) {
                return { end: e.activeLabel }
            } else {
                return state
            }
        })
    }

    private stopSelection = () => {
        this.setState(state => {

            if (this.state.onSelectionChanged && state.start && state.end) {

                const from = Math.min(state.start, state.end)
                const to = Math.max(state.start, state.end)

                this.state.onSelectionChanged(new Date(from), new Date(to))
            }

            return { selecting: false }
        })

    }
}

export default TimelineChart
