const React     = require( 'react' )
const PropTypes = require( 'prop-types' )
const Table     = require( 'react-bootstrap/Table' )

/**
 * @class
 * @classdesc The FunctionsCategory component allow to display preformated functions in Card style
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Parameters extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element|null}
     */
    render () {

        const values = this.props.values
        if ( values.length === 0 ) {
            return null
        }

        const haveNames         = this._haveNames()
        const haveTypes         = this._haveTypes()
        const haveOptionals     = this._haveOptionals()
        const haveDefaultValues = this._haveDefaultValues()
        const haveDescriptions  = this._haveDescriptions()

        const nameColumn         = ( haveNames ) ? <th>Name</th> : null
        const typeColumn         = ( haveTypes ) ? <th>Type</th> : null
        const optionalColumn     = ( haveOptionals ) ? <th>Optional</th> : null
        const defaultValueColumn = ( haveDefaultValues ) ? <th>Default</th> : null
        const descriptionColumn  = ( haveDescriptions ) ? <th>Description</th> : null

        const tableHeader = (
            <tr>
                { nameColumn }
                { typeColumn }
                { optionalColumn }
                { defaultValueColumn }
                { descriptionColumn }
            </tr>
        )

        const tableBody = values.map( ( value, index ) => {

            const nameValue        = ( haveNames ) ? <td>{ value.name }</td> : null
            const typeValue        = ( haveTypes ) ? <td>{ value.type }</td> : null
            const optionalValue    = ( haveOptionals ) ? <td>{ ( value.optional === true ) ? 'true' : 'false' }</td> : null
            const defaultValue     = ( haveDefaultValues ) ? <td>{ value.defaultValue }</td> : null
            const descriptionValue = ( haveDescriptions ) ? <td>{ value.description }</td> : null

            return (
                <tr key={ index }>
                    { nameValue }
                    { typeValue }
                    { optionalValue }
                    { defaultValue }
                    { descriptionValue }
                </tr>
            )

        } )

        return (
            <div className="parameters">
                <h6 className="label">Parameters:</h6>
                <ul className="list" style={ { listStyleType: 'none' } }>
                    <li>
                        <Table striped bordered>
                            <thead>
                                { tableHeader }
                            </thead>
                            <tbody>
                                { tableBody }
                            </tbody>
                        </Table>
                    </li>
                </ul>
            </div>
        )

    }

    _haveNames () {

        let haveNames = false

        for ( let value of this.props.values ) {
            if ( value.name ) {
                haveNames = true
                break
            }
        }

        return haveNames

    }

    _haveTypes () {

        let haveTypes = false

        for ( let value of this.props.values ) {
            if ( value.type ) {
                haveTypes = true
                break
            }
        }

        return haveTypes

    }

    _haveOptionals () {

        let haveOptionals = false

        for ( let value of this.props.values ) {
            if ( value.optional ) {
                haveOptionals = true
                break
            }
        }

        return haveOptionals

    }

    _haveDefaultValues () {

        let haveDefaultValues = false

        for ( let value of this.props.values ) {
            if ( value.defaultValue ) {
                haveDefaultValues = true
                break
            }
        }

        return haveDefaultValues

    }

    _haveDescriptions () {

        let haveDescriptions = false

        for ( let value of this.props.values ) {
            if ( value.description ) {
                haveDescriptions = true
                break
            }
        }

        return haveDescriptions

    }

}

Parameters.propTypes = {
    values: PropTypes.array
}

Parameters.defaultProps = {
    values: []
}

module.exports = Parameters
