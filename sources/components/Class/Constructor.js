const { v4: uuidv4 }    = require( 'uuid' )
const React             = require( 'react' )
const PropTypes         = require( 'prop-types' )
const Description       = require( '../Commons/Description' )
const FunctionSignature = require( '../Commons/FunctionSignature' )
const Parameters        = require( '../Commons/Parameters' )

/**
 * @class
 * @classdesc The Constructor component allow to display all information related to create the given class
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Constructor extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return (
            <div id={ `${ this.props.uuid }-ctor` } className="constructor">
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
            </div>
        )

    }

    _renderSignature () {

        const inherit = this.props.inherit
        if ( inherit && inherit.length > 0 ) {
            return `${ this.props.name }${ this._renderParameters( this.props.parameters ) } extends ${ inherit[ 0 ] }`
        } else {
            return `${ this.props.name }${ this._renderParameters( this.props.parameters ) }`
        }

    }

    _renderParameters ( parameters = [] ) {

        if ( parameters.length === 0 ) {
            return '()'
        } else {
            return `( ${ parameters.map( ( parameter, index ) => {

                if ( index === 0 ) {
                    return parameter.name
                } else {
                    return ` ${ parameter.name }`
                }

            } ) } )`
        }

    }

}

Constructor.propTypes = {
    access:      PropTypes.string,
    async:       PropTypes.bool,
    authors:     PropTypes.array,
    description: PropTypes.string,
    exceptions:  PropTypes.array,
    generator:   PropTypes.bool,
    inherit:     PropTypes.array,
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

Constructor.defaultProps = {
    access:      '',
    async:       false,
    authors:     [],
    description: '',
    exceptions:  [],
    generator:   false,
    inherit:     [],
    inner:       false,
    kind:        '',
    licenses:    [],
    name:        '',
    parameters:  [],
    readOnly:    false,
    requires:    [],
    returns:     [],
    sees:        [],
    sources:     [],
    uuid:        uuidv4(),
    virtual:     false
}

module.exports = Constructor
