const React    = require( 'react' )
const Category = require( '../Commons/Category' )
const Example  = require( '../Commons/Example' )

/**
 * @class
 * @classdesc The Constants component allow to display preformated constant in Card style
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class ExampleCategory extends Category {

    renderValue ( value ) {
        return ( <Example { ...value }></Example> )
    }

}

module.exports = ExampleCategory
