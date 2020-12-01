const React          = require( 'react' )
const PropTypes      = require( 'prop-types' )
const Description    = require( './Description' )
const Parameters     = require( './Parameters' )
const AuthorsList    = require( '../Metas/AuthorsList' )
const ExceptionsList = require( '../Metas/ExceptionsList' )
const InheritList    = require( '../Metas/InheritList' )
const LicensesList   = require( '../Metas/LicensesList' )
const RequiresList   = require( '../Metas/RequiresList' )
const ReturnsList    = require( '../Metas/ReturnsList' )
const SeeList        = require( '../Metas/SeeList' )
const SourcesList    = require( '../Metas/SourcesList' )

/**
 * @class
 * @classdesc The Function component allow to display preformated function datas
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Function extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return (
            <div id={ this.props.uuid } className="function">
                <h5 className="function-signature">{ this._renderFlags() } { this.props.name }{ this._renderParameters( this.props.parameters ) } { this._renderReturns( this.props.returns ) }</h5>
                <Description description={ this.props.description }></Description>
                <Parameters values={ this.props.parameters }></Parameters>

                <AuthorsList authors={ this.props.authors }></AuthorsList>
                <ExceptionsList exceptions={ this.props.exceptions }></ExceptionsList>
                <InheritList inherits={ this.props.inherits }></InheritList>
                <LicensesList licenses={ this.props.licenses }></LicensesList>
                <RequiresList requires={ this.props.requires }></RequiresList>
                <ReturnsList returns={ this.props.returns }></ReturnsList>
                <SeeList sees={ this.props.sees }></SeeList>
                <SourcesList sources={ this.props.sources }></SourcesList>
            </div>
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

Function.propTypes = {
    access:      PropTypes.string,
    async:       PropTypes.bool,
    authors:     PropTypes.array,
    description: PropTypes.string,
    exceptions:  PropTypes.array,
    generator:   PropTypes.bool,
    inherits:    PropTypes.array,
    inner:       PropTypes.bool,
    kind:        PropTypes.string,
    licenses:    PropTypes.array,
    name:        PropTypes.string,
    parameters:  PropTypes.array,
    readOnly:    PropTypes.bool,
    requires:    PropTypes.array,
    returns:     PropTypes.array,
    sees:        PropTypes.array,
    sources:     PropTypes.array,
    uuid:        PropTypes.string,
    virtual:     PropTypes.bool
}

module.exports = Function
