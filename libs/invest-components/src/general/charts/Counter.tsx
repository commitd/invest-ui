import * as React from 'react'

import { Statistic } from 'semantic-ui-react'

import * as numeral from 'numeral'

export type Props = {
    value: number,
    singular: string,
    plural: string
}

class Counter extends React.Component<Props> {

    render() {
        const { value, singular, plural } = this.props

        const title = value === 1 ? singular : plural
        return (
            <Statistic>
                <Statistic.Value>{numeral(value).format('0,0')}</Statistic.Value>
                <Statistic.Label>{title}</Statistic.Label>
            </Statistic>
        )
    }
}

export default Counter