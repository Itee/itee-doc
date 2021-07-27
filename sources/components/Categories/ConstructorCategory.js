const React    = require( 'react' )
const Category = require( '../Commons/Category' )
const Constructor = require( '../Class/Constructor' )


/**
 * @class
 * @classdesc The FunctionsCategory component allow to display preformated functions in Card style
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class ConstructorCategory extends Category {

    renderValue ( value ) {
        return ( <Constructor { ...value }></Constructor> )
    }

}

module.exports = ConstructorCategory
