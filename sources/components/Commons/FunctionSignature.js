const React     = require( 'react' )
const PropTypes = require( 'prop-types' )

/**
 * @class
 * @classdesc The FunctionSignature component allow to display preformated function datas
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class FunctionSignature extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return (
            <h5 className="function-signature">{ this._renderFlags() } { this.props.name }{ this._renderParameters( this.props.parameters ) } { this._renderReturns( this.props.returns ) }</h5>
        )

    }

    _renderFlags () {

        const flags = []
        if ( this.props.access ) { flags.push( this.props.access ) } else { flags.push( 'public' ) }
        if ( this.props.readOnly ) { flags.push( 'readonly' ) }
        if ( this.props.virtual ) { flags.push( 'abstract' ) }
        if ( this.props.kind === 'constant' ) { flags.push( 'constant' ) }
        if ( this.props.inner ) { flags.push( 'inner' ) }
        if ( this.props.generator ) { flags.push( 'generator' ) }
        if ( this.props.async ) { flags.push( 'async' ) }

        return ( flags.length ) ? `<${ flags.toString() }>` : ''

    }

    _renderParameters ( parameters = [] ) {

        if ( parameters.length === 0 ) { return '()' }

        let result = '( '

        for ( let index = 0, numberOfValues = parameters.length ; index < numberOfValues ; index++ ) {

            const parameter  = parameters[ index ]
            const name       = parameter.name
            const isOptional = parameter.optional

            if ( index < numberOfValues - 1 ) {
                result += ( isOptional ) ? `[${ name }], ` : `${ name }, `
            } else {
                result += ( isOptional ) ? `[${ name }] )` : `${ name } )`
            }


            //            if ( index < numberOfValues - 1 ) {
            //                result += ( isOptional ) ? `[${ name }], ` : `${ name }, `
            //            } else {
            //                result += ( isOptional ) ? `[${ name }] )` : `${ name } )`
            //            }

        }

        return result

    }

    _renderReturns ( returns = [] ) {

        if ( returns.length === 0 ) { return null }

        let result = '-> { '

        for ( let index = 0, numberOfValues = returns.length ; index < numberOfValues ; index++ ) {

            const ret = returns[ index ]

            if ( index < numberOfValues - 1 ) {
                result += `${ ret } | `
            } else {
                result += `${ ret } }`
            }

        }

        return result


    }

}

FunctionSignature.propTypes = {
    access:     PropTypes.string,
    async:      PropTypes.bool,
    generator:  PropTypes.bool,
    inner:      PropTypes.bool,
    kind:       PropTypes.string,
    name:       PropTypes.string,
    parameters: PropTypes.array,
    readOnly:   PropTypes.bool,
    returns:    PropTypes.array,
    virtual:    PropTypes.bool,
}

module.exports = FunctionSignature
