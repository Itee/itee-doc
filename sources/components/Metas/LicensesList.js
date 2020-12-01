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
class LicensesList extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return <LabeledList className="licenses-list" label={ this._computeLabel() } values={ this._computeValues() }></LabeledList>

    }

    _computeLabel () {

        return ( this.props.licenses.length > 1 ) ? 'Licenses:' : 'License:'

    }

    _computeValues () {

        return this.props.licenses.map( license => {

            const url   = license.url
            const label = license.label

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

LicensesList.propTypes = {
    licenses: PropTypes.array
}

LicensesList.defaultProps = {
    licenses: []
}

module.exports = LicensesList
