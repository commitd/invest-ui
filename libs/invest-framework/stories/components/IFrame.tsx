import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import IFrame from '../../src/components/IFrame'

const stories = storiesOf('IFrame', module)
stories.addDecorator(withKnobs)

stories
    .add('index', () => (
        <IFrame src="http://localhost:6006" hide={boolean('Hidden', false)} onLoad={action('onLoad')} />
    ))
