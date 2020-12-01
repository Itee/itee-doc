const React              = require( 'react' )
const Card               = require( 'react-bootstrap/Card' )
const Constructor        = require( './Constructor' )
const Description        = require( '../Commons/Description' )
const FunctionsCategory  = require( '../Commons/FunctionsCategory' )
const PropertiesCategory = require( '../Commons/PropertiesCategory' )
const AuthorsList        = require( '../Metas/AuthorsList' )
const ExceptionsList     = require( '../Metas/ExceptionsList' )
const InheritList        = require( '../Metas/InheritList' )
const LicensesList       = require( '../Metas/LicensesList' )
const RequiresList       = require( '../Metas/RequiresList' )
const ReturnsList        = require( '../Metas/ReturnsList' )
const SeeList            = require( '../Metas/SeeList' )
const SourcesList        = require( '../Metas/SourcesList' )

/**
 * @class
 * @classdesc The root component for documenting class
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Class extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return (
            <Card id={ this.props.uuid } className="class m-3">

                <Card.Header as="h2">
                    <span className="class-title">Class:</span> <span className="class-name">{ this.props.name }</span>
                </Card.Header>

                <Card.Body>
                    <Description className="class-description" description={ this.props.description }></Description>
                    <Constructor className="class-constructor" { ...this.props }></Constructor>
                    <PropertiesCategory className="class-constants" name="Constants" values={ this.props.constants }></PropertiesCategory>
                    <PropertiesCategory className="class-members" name="Members" values={ this.props.members }></PropertiesCategory>
                    <FunctionsCategory className="class-methods" name="Methods" values={ this.props.methods }></FunctionsCategory>
                </Card.Body>

                <Card.Footer>
                    <AuthorsList authors={ this.props.authors }></AuthorsList>
                    <ExceptionsList exceptions={ this.props.exceptions }></ExceptionsList>
                    <InheritList inherits={ this.props.inherits }></InheritList>
                    <LicensesList licenses={ this.props.licenses }></LicensesList>
                    <RequiresList requires={ this.props.requires }></RequiresList>
                    <ReturnsList returns={ this.props.returns }></ReturnsList>
                    <SeeList sees={ this.props.see }></SeeList>
                    <SourcesList sources={ this.props.sources }></SourcesList>
                </Card.Footer>

            </Card>
        )

    }

}

module.exports = Class

