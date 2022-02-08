const { v4: uuidv4 } = require( 'uuid' )
const React          = require( 'react' )
const PropTypes      = require( 'prop-types' )
const Description    = require( './Description' )
const AuthorsList    = require( '../Lists/AuthorsList' )
const ExceptionsList = require( '../Lists/ExceptionsList' )
const InheritList    = require( '../Lists/InheritList' )
const LicensesList   = require( '../Lists/LicensesList' )
const RequiresList   = require( '../Lists/RequiresList' )
const ReturnsList    = require( '../Lists/ReturnsList' )
const SeeList        = require( '../Lists/SeeList' )
const SourcesList    = require( '../Lists/SourcesList' )

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
                <h5>{ this._renderFlags() } { this.props.name } { `{ ${ this.props.type } }` }</h5>
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

Property.propTypes = {
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
    readOnly:    PropTypes.bool,
    requires:    PropTypes.array,
    returns:     PropTypes.array,
    sees:        PropTypes.array,
    sources:     PropTypes.array,
    type:        PropTypes.array,
    uuid:        PropTypes.string,
    virtual:     PropTypes.bool
}

Property.defaultProps = {
    access:      '',
    async:       false,
    authors:     [],
    description: '',
    exceptions:  [],
    generator:   false,
    inherits:    [],
    inner:       false,
    kind:        '',
    licenses:    [],
    name:        '',
    readOnly:    false,
    requires:    [],
    returns:     [],
    sees:        [],
    sources:     [],
    type:        [],
    uuid:        uuidv4(),
    virtual:     false
}

module.exports = Property
