const React        = require( 'react' )
const LabeledList  = require( '../Commons/LabeledList' )
const { isString } = require( '../../scripts/utils' )

/**
 * @class
 * @classdesc The LicensesList component allow to display license as link or simple text in list view
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class ReturnsList extends LabeledList {

    renderLabel ( label, numberOfValues ) {
        const render = super.renderLabel( label, numberOfValues )
        if ( render ) { return render }

        return ( numberOfValues > 1 ) ? 'Returns:' : 'Return:'
    }

    renderValue ( value ) {

        let renderedValue

        if ( isString( value ) ) {

            renderedValue = value

        } else if ( value.link ) {

            renderedValue = <a href={ value.link } target="_blank" rel="noreferrer">{ value.label }</a>

        } else {

            renderedValue = `Unmanaged return value: ${ value }`

        }

        return renderedValue

    }

}

module.exports = ReturnsList
