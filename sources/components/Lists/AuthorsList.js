const React       = require( 'react' )
const Author      = require( '../Commons/Author' )
const LabeledList = require( '../Commons/LabeledList' )

/**
 * @class
 * @classdesc The Authors component allow to display authors as link or simple text list
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class AuthorsList extends LabeledList {

    renderLabel ( label, numberOfValues ) {
        const render = super.renderLabel( label, numberOfValues )
        if ( render ) { return render }

        return ( numberOfValues > 1 ) ? 'Authors:' : 'Author:'
    }

    renderValue ( value ) {
        return <Author { ...value }></Author>
    }

}

module.exports = AuthorsList
