const React        = require( 'react' )
const PropTypes    = require( 'prop-types' )
const LabeledList  = require( '../Commons/LabeledList' )
const { isString } = require( '../../scripts/utils' )

/**
 * @class
 * @classdesc The LicensesList component allow to display license as link or simple text in list view
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class ReturnsList extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return <LabeledList className="returns-list" label={ this._computeLabel() } values={ this._computeValues() }></LabeledList>

    }

    _computeLabel () {

        return ( this.props.values.length > 1 ) ? 'Returns:' : 'Return:'

    }

    _computeValues () {

        return this.props.values.map( return_ => {

            let renderedValue

            if ( isString( return_ ) ) {

                renderedValue = return_

            } else if ( return_.link ) {

                renderedValue = <a href={ return_.link } target="_blank" rel="noreferrer">{ return_.label }</a>

            } else {

                renderedValue = `Unmanaged return value: ${ return_ }`

            }

            return renderedValue

        } )

    }

}

ReturnsList.propTypes = {
    values: PropTypes.array
}

ReturnsList.defaultProps = {
    values: []
}

module.exports = ReturnsList
