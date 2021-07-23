const React    = require( 'react' )
const Category = require( './Category' )
const Property = require( './Property' )

/**
 * @class
 * @classdesc The Constants component allow to display preformated constant in Card style
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class PropertiesCategory extends Category {

    renderValue ( value ) {
        return ( <Property { ...value }></Property> )
    }

}

module.exports = PropertiesCategory
