const React             = require( 'react' )
const PropTypes         = require( 'prop-types' )
const Description       = require( './Description' )
const Parameters        = require( './Parameters' )
const Example           = require( './Example' )
const FunctionSignature = require( './FunctionSignature' )
const AuthorsList       = require( '../Metas/AuthorsList' )
const ExceptionsList    = require( '../Metas/ExceptionsList' )
const InheritList       = require( '../Metas/InheritList' )
const LicensesList      = require( '../Metas/LicensesList' )
const RequiresList      = require( '../Metas/RequiresList' )
const ReturnsList       = require( '../Metas/ReturnsList' )
const SeeList           = require( '../Metas/SeeList' )
const SourcesList       = require( '../Metas/SourcesList' )

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

        const _example = ( this.props.examples.length > 0 ) ? this.props.examples[ 0 ] : {}

        return (
            <div id={ this.props.uuid } className="function">
                <FunctionSignature
                    name={ this.props.name }
                    access={ this.props.access }
                    kind={ this.props.kind }
                    readOnly={ this.props.readOnly }
                    async={ this.props.async }
                    generator={ this.props.generator }
                    inner={ this.props.inner }
                    virtual={ this.props.virtual }
                    parameters={ this.props.parameters }
                    returns={ this.props.returns }
                ></FunctionSignature>
                <Description description={ this.props.description }></Description>
                <Parameters values={ this.props.parameters }></Parameters>
                <Example { ..._example }></Example>

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
}

Function.propTypes = {
    access:      PropTypes.string,
    async:       PropTypes.bool,
    authors:     PropTypes.array,
    description: PropTypes.string,
    examples:    PropTypes.array,
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

Function.defaultProps = {
    examples: []
}

module.exports = Function
