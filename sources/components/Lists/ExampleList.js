const React       = require( 'react' )
const LabeledList = require( '../Commons/LabeledList' )
const Example     = require( '../Commons/Example' )

/**
 * @class
 * @classdesc The ExampleList component allow to display preformated code example in list style
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class ExampleList extends LabeledList {

    renderLabel ( label, numberOfValues ) {
        const render = super.renderLabel( label, numberOfValues )
        if ( render ) { return render }

        return ( numberOfValues > 1 ) ? 'Examples:' : 'Example:'
    }

    renderValue ( value ) {
        return ( <Example { ...value }></Example> )
    }

}

module.exports = ExampleList