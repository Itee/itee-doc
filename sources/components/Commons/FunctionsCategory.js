const React    = require( 'react' )
const Category = require( './Category' )
const Function = require( './Function' )


/**
 * @class
 * @classdesc The FunctionsCategory component allow to display preformated functions in Card style
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class FunctionsCategory extends Category {

    renderValue ( value ) {
        return ( <Function { ...value }></Function> )
    }

}

module.exports = FunctionsCategory
