/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */

require( '@babel/register' )( {
    presets: [ '@babel/preset-react' ]
} )

const Parser   = require( './scripts/parser' )
const Renderer = require( './scripts/renderer' )
const env      = require( '../node_modules/jsdoc/lib/jsdoc/env.js' )
const helper   = require( '../node_modules/jsdoc/lib/jsdoc/util/templateHelper.js' )


exports.publish = function ( taffyData, jsdocOpts ) {

    const safeTaffyData = helper.prune( taffyData )
    const options       = {
        ...env.conf.templates,
        ...jsdocOpts
    }
    const parser        = new Parser( options )
    const datas         = parser.parse( safeTaffyData )

    const renderer = new Renderer( options )
    renderer.render( datas, options )

}
