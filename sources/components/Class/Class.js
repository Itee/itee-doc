const React               = require( 'react' )
const PropTypes           = require( 'prop-types' )
const Card                = require( 'react-bootstrap/Card' )
const Description         = require( '../Commons/Description' )
const ExampleCategory     = require( '../Categories/ExampleCategory' )
const ConstructorCategory = require( '../Categories/ConstructorCategory' )
const FunctionsCategory   = require( '../Categories/FunctionsCategory' )
const PropertiesCategory  = require( '../Categories/PropertiesCategory' )
const AuthorsList         = require( '../Lists/AuthorsList' )
const ExceptionsList      = require( '../Lists/ExceptionsList' )
const InheritList         = require( '../Lists/InheritList' )
const LicensesList        = require( '../Lists/LicensesList' )
const RequiresList        = require( '../Lists/RequiresList' )
const ReturnsList         = require( '../Lists/ReturnsList' )
const SeeList             = require( '../Lists/SeeList' )
const SourcesList         = require( '../Lists/SourcesList' )

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
                    <Description className="class-description" description={ this.props.classDescription }></Description>
                    <ExampleCategory className="class-examples" name="Examples" values={ this.props.examples }></ExampleCategory>
                    <ConstructorCategory className="class-constructor" name="Constructor" values={ [ this.props ] }></ConstructorCategory>
                    <PropertiesCategory className="class-constants" name="Constants" values={ this.props.constants }></PropertiesCategory>
                    <PropertiesCategory className="class-members" name="Members" values={ this.props.members }></PropertiesCategory>
                    <FunctionsCategory className="class-methods" name="Methods" values={ this.props.methods }></FunctionsCategory>
                </Card.Body>

                <Card.Footer>
                    <AuthorsList values={ this.props.authors }></AuthorsList>
                    <ExceptionsList values={ this.props.exceptions }></ExceptionsList>
                    <InheritList values={ this.props.inherits }></InheritList>
                    <LicensesList values={ this.props.licenses }></LicensesList>
                    <RequiresList values={ this.props.requires }></RequiresList>
                    <ReturnsList values={ this.props.returns }></ReturnsList>
                    <SeeList values={ this.props.sees }></SeeList>
                    <SourcesList values={ ( this.props.source ) ? [ this.props.source ] : [] }></SourcesList>
                </Card.Footer>

            </Card>
        )

    }

}

Class.propTypes = {
    uuid:             PropTypes.string,
    name:             PropTypes.string,
    classDescription: PropTypes.string,
    description:      PropTypes.string,
    constants:        PropTypes.array,
    members:          PropTypes.array,
    methods:          PropTypes.array,
    authors:          PropTypes.array,
    examples:         PropTypes.array,
    exceptions:       PropTypes.array,
    inherits:         PropTypes.array,
    licenses:         PropTypes.array,
    requires:         PropTypes.array,
    returns:          PropTypes.array,
    sees:             PropTypes.array,
    source:           PropTypes.object
}

module.exports = Class

