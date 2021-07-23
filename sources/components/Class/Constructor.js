const React       = require( 'react' )
const PropTypes   = require( 'prop-types' )
const Description = require( '../Commons/Description' )
const Parameters  = require( '../Commons/Parameters' )

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
    uuid:        PropTypes.string,
    parameters:  PropTypes.array,
    sources:     PropTypes.array,
    inherit:     PropTypes.array,
    name:        PropTypes.string,
    authors:     PropTypes.array,
    description: PropTypes.string,
    exceptions:  PropTypes.array,
    generator:   PropTypes.bool,
    inner:       PropTypes.bool,
    kind:        PropTypes.string,
    licenses:    PropTypes.array,
    readOnly:    PropTypes.bool,
    requires:    PropTypes.array,
    returns:     PropTypes.array,
    sees:        PropTypes.array
}

module.exports = Constructor
