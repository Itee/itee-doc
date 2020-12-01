const React          = require( 'react' )
const Description    = require( './Description' )
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
 * @classdesc The Property component allow to display preformated property data
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Property extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return (
            <div id={ this.props.uuid } className="property">
                <h5>{ this._renderFlags() } { this.props.name } { `{${ this.props.type }}` }</h5>
                <Description description={ this.props.description }></Description>

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

}

module.exports = Property
