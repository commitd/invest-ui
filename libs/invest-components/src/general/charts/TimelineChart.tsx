import * as React from 'react'
import { VictoryChart, VictoryLine, VictoryBrushContainer } from 'victory'
import debounce from 'lodash-es/debounce'

export type TimeDomain = { x: [Date, Date] }

export interface OwnProps {
    data: {
        x: Date,
        y: number
    }[],
    onSelectionChanged?(from: Date, to: Date): void
}

export type Props = OwnProps

export type State = {
    selectedDomain?: TimeDomain
    onSelectionChanged?(from: Date, to: Date): void
}

class TimelineChart extends React.Component<Props, State> {

    state: State = {}

    componentWillMount() {
        if (this.props.onSelectionChanged) {
            this.setState({
                onSelectionChanged: debounce(this.props.onSelectionChanged, 250)
            })
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        let stateChanged = false
        const state: State = {}
        if (nextProps.data !== this.props.data) {
            stateChanged = true
            state.selectedDomain = undefined
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
        const { data, onSelectionChanged } = this.props

        let outerChartContainer = undefined
        if (onSelectionChanged) {
            outerChartContainer = (
                <VictoryBrushContainer
                    brushDimension="x"
                    brushDomain={this.state.selectedDomain}
                    onBrushDomainChange={this.handleBrush}
                    responsive={true}
                />
            )
        }

        return (
            <VictoryChart
                width={1500}
                height={500}
                domainPadding={100}
                scale={{ x: 'time' }}
                containerComponent={outerChartContainer}
            >
                <VictoryLine data={data} />

            </VictoryChart>
        )
    }

    private handleBrush = (domain: TimeDomain) => {
        this.setState({
            selectedDomain: domain
        })

        if (this.state.onSelectionChanged) {
            console.log(domain)
            this.state.onSelectionChanged(domain.x[0], domain.x[1])
        }
    }
}

export default TimelineChart
