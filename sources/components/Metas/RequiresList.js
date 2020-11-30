const React       = require( 'react' )
const LabeledList = require( '../Commons/LabeledList' )

/**
 * @class
 * @classdesc The LicensesList component allow to display license as link or simple text in list view
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class RequiresList extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return <LabeledList className="requires-list" label={ this._computeLabel() } values={ this._computeValues() }></LabeledList>

    }

    _computeLabel () {

        return ( this.props.requires.length > 1 ) ? 'Requires:' : 'Require:'

    }

    _computeValues () {

        return this.props.requires.map( require => {

            const url   = require.url
            const label = require.label

            let licenseLink

            if ( !url && !label ) {

                licenseLink = null

            } else if ( !url && label ) {

                licenseLink = label

            } else if ( url && !label ) {

                licenseLink = <a href={ url } target="_blank">{ url }</a>

            } else {

                licenseLink = <a href={ url } target="_blank">{ label }</a>

            }

            return licenseLink

        } )

    }

}

RequiresList.defaultProps = {
    requires: []
}

module.exports = RequiresList
