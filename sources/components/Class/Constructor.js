const React       = require( 'react' )
const Card        = require( 'react-bootstrap/Card' )
const Parameters  = require( '../Commons/Parameters' )
const Description = require( '../Commons/Description' )
const SourcesList = require( '../Metas/SourcesList' )
const Authors     = require( '../Metas/AuthorsList' )
const License     = require( '../Metas/LicensesList' )

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

        let body = null
        if ( this.props.parameters && this.props.parameters.length > 0 ) {
            body = (
                <Card.Body className="constructor-body">
                    {/*<Description description={ this.props.description }></Description>*/ }
                    <Parameters values={ this.props.parameters }></Parameters>
                </Card.Body>
            )
        }

        let footer = null
        if ( this.props.source && this.props.source.length > 0 ) {
            footer = (
                <Card.Footer className="constructor-footer">
                    <SourcesList sources={ this.props.sources }></SourcesList>
                    {/*    <Authors authors={ this.props.authors }></Authors>*/ }
                    {/*    <License { ...this.props.license }></License>*/ }
                </Card.Footer>
            )
        }


        return (
            <Card className="constructor mb-3">
                <Card.Header as="h3" className="constructor-header">
                    { this._renderSignature() }
                </Card.Header>
                { body }
                { footer }
            </Card>
        )

    }

    _renderSignature () {

        const inherit = this.props.inherit
        if ( inherit && inherit.length > 0 ) {
            return `new ${ this.props.name }${ this._renderParameters( this.props.parameters ) } extends ${ inherit[ 0 ] }`
        } else {
            return `new ${ this.props.name }${ this._renderParameters( this.props.parameters ) }`
        }

    }

    _renderParameters ( parameters = [] ) {

        if ( parameters.length === 0 ) {
            return '()'
        } else {
            return `( ${ parameters.map( ( parameter, index, array ) => {

                if ( index === 0 ) {
                    return parameter.name
                } else {
                    return ` ${ parameter.name }`
                }

            } ) } )`
        }

    }

}

module.exports = Constructor
