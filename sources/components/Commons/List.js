const React     = require( 'react' )
const PropTypes = require( 'prop-types' )

/**
 * @class
 * @classdesc The List component allow to display preformated data in <ul><li> style with an optional label on top
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class List extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element|null}
     */
    render () {
        if ( this.props.values.length === 0 ) { return null }

        return (
            <div className="example-list">
                <h6 className="label">{ this.props.label }</h6>
                <ul className="list" style={ { listStyleType: 'none' } }>
                    { this._renderValues() }
                </ul>
            </div>
        )

    }

    /**
     *
     * @returns {*}
     * @private
     */
    _renderValues () {

        return this.props.values.map( ( value, index ) => {
            if ( !value ) { return null }

            const uuid = value.uuid || index
            return (
                <li className="mb-2" key={ uuid }>
                    { this.renderValue( value ) }
                </li>
            )

        } )

    }

    renderValue ( value ) {
        return value
    }

}

List.propTypes = {
    label:  PropTypes.string,
    values: PropTypes.array
}

List.defaultProps = {
    label:  '',
    values: []
}

module.exports = List
