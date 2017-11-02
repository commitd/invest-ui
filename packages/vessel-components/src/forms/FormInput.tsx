import * as React from 'react'
import TextField from 'material-ui/TextField'
import * as validate from 'validate.js'

export interface Props {
    id: string,
    value: string,
    type: string,
    placeholder: string,
    disabled?: boolean,
    errorConstraints?: Object,
    warnConstraints?: Object,
    validationState?: boolean,
    validationMessage?: string,
    error?: Array<string>,
    warn?: Array<string>,
    className?: string,
    multiline?: boolean,
    label?: string,
    onChange(value: string): void,
    inputRef?(arg: {}): void,
    onFocus?(e: Event): void,
    onBlur?(e: Event): void,
    onValidationChange?(valid: boolean): void
}

interface State {
    dirty: boolean
}

class FormInput extends React.PureComponent<Props, State> {

    static defaultProps = {
        type: 'text',
        disabled: false,
        placeholder: '',
        errorConstrains: {},
        warnConstraints: {},
        multiline: false
    }

    state = {
        dirty: false
    }

    getValidation = (
        value: string,
        result?: Array<string>,
        constraints?: Object
    ) => {
        if (result) {
            return result
        }
        if (constraints) {
            return validate.single(value, constraints) || []
        }
        return []
    }

    getError = () => {
        const { value, error, errorConstraints } = this.props
        return this.getValidation(value, error, errorConstraints)
    }

    getWarn = () => {
        const { value, warn, warnConstraints } = this.props
        return this.getValidation(value, warn, warnConstraints)
    }

    getValidationState(
        value: string,
        error: Array<string>,
        warn: Array<string>
    ): boolean {
        if (!this.state.dirty) {
            return false
        }
        if (this.props.validationState != null) {
            return !this.props.validationState
        }
        if (error.length > 0) {
            return true
        }
        if (warn.length > 0) {
            return true
        }
        return false
    }

    getValidationMessage(error: Array<string>, warn: Array<string>) {
        if (this.state.dirty) {
            if (this.props.validationMessage) {
                return this.props.validationMessage
            }
            if (error.length > 0) {
                return error[0]
            }
            if (warn.length > 0) {
                return warn[0]
            }
        }
        return ''
    }

    onChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ dirty: true })
        this.props.onChange(e.currentTarget.value)
    }

    render() {
        const {
      id,
            label,
            value,
            type,
            placeholder,
            disabled,
            className,
            multiline,
            inputRef,
            onFocus,
            onBlur
    } = this.props
        const hasError = this.getError()
        const warn = this.getWarn()
        return (
            <TextField
                id={id}
                label={label}
                value={value}
                type={type}
                disabled={disabled}
                error={this.getValidationState(value, hasError, warn)}
                placeholder={placeholder}
                className={className}
                helperText={this.getValidationMessage(hasError, warn)}
                margin="normal"
                onChange={this.onChange}
                fullWidth={true}
                multiline={multiline}
                inputRef={inputRef}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        )
    }
}

export default FormInput as React.ComponentType<Props>