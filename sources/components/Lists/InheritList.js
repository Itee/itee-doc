const React        = require( 'react' )
const LabeledList  = require( '../Commons/LabeledList' )
const { isString } = require( '../../scripts/utils' )

/**
 * @class
 * @classdesc The InheritsList component allow to display authors as link or simple text in list view
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class InheritList extends LabeledList {

    renderLabel ( label, numberOfValues ) {
        const render = super.renderLabel( label, numberOfValues )
        if ( render ) { return render }

        return ( numberOfValues > 1 ) ? 'Inherits:' : 'Inherit:'
    }

    renderValue ( value ) {

        let renderedValue

        if ( isString( value ) ) {

            renderedValue = value

        } else if ( value.link ) {

            renderedValue = <a href={ value.link } target="_blank" rel="noreferrer">{ value.description }</a>

        } else {

            renderedValue = `Unmanaged Inherit value: ${ value }`

        }

        return renderedValue
    }
    
}

module.exports = InheritList
