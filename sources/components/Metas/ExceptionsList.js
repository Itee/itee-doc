const React       = require( 'react' )
const PropTypes   = require( 'prop-types' )
const LabeledList = require( '../Commons/LabeledList' )

/**
 * @class
 * @classdesc The LicensesList component allow to display license as link or simple text in list view
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class ExceptionsList extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return <LabeledList className="exceptions-list" label={ this._computeLabel() } values={ this._computeValues() }></LabeledList>

    }

    _computeLabel () {

        return ( this.props.values.length > 1 ) ? 'Exceptions:' : 'Exception:'

    }

    _computeValues () {

        return this.props.values.map( exception => {

            const url   = exception.url
            const label = exception.label

            let licenseLink

            if ( !url && !label ) {

                licenseLink = null

            } else if ( !url && label ) {

                licenseLink = label

            } else if ( url && !label ) {

                licenseLink = <a href={ url } target="_blank" rel="noreferrer">{ url }</a>

            } else {

                licenseLink = <a href={ url } target="_blank" rel="noreferrer">{ label }</a>

            }

            return licenseLink

        } )

    }

}

ExceptionsList.propTypes = {
    values: PropTypes.array
}

ExceptionsList.defaultProps = {
    values: []
}

module.exports = ExceptionsList
