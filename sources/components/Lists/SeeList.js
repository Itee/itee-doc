const React       = require( 'react' )
const LabeledList = require( '../Commons/LabeledList' )

/**
 * @class
 * @classdesc The Authors component allow to display authors as link or simple text list
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class SeeList extends LabeledList {

    // eslint-disable-next-line
    renderLabel ( label, numberOfValues ) {
        return 'See:'
    }

    renderValue ( value ) {
        return <a key={ value.link } href={ value.link } target="_blank" rel="noreferrer">{ value.description }</a>
    }

}

module.exports = SeeList
