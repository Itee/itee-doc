const React       = require( 'react' )
const LabeledList = require( '../Commons/LabeledList' )

/**
 * @class
 * @classdesc The LicensesList component allow to display license as link or simple text in list view
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class LicensesList extends LabeledList {

    renderLabel ( label, numberOfValues ) {
        const render = super.renderLabel( label, numberOfValues )
        if ( render ) { return render }

        return ( numberOfValues > 1 ) ? 'Licenses:' : 'License:'
    }

    renderValue ( value ) {

        const url   = value.url
        const label = value.label

        let link

        if ( !url && !label ) {

            link = null

        } else if ( !url && label ) {

            link = label

        } else if ( url && !label ) {

            link = <a href={ url } target="_blank" rel="noreferrer">{ url }</a>

        } else {

            link = <a href={ url } target="_blank" rel="noreferrer">{ label }</a>

        }

        return link

    }
}

module.exports = LicensesList
