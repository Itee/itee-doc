const { v4: uuidv4 }      = require( 'uuid' )
const React               = require( 'react' )
const PropTypes           = require( 'prop-types' )
const Card                = require( 'react-bootstrap/Card' )
const Description         = require( '../Commons/Description' )
const SourceFile          = require( '../Commons/SourceFile' )
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

        if ( this.props.source.file ) {
            return (
                <div className="m-3">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="definition-tab" data-bs-toggle="tab" data-bs-target="#definition" type="button" role="tab" aria-controls="home" aria-selected="true">Definition</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="source-tab" data-bs-toggle="tab" data-bs-target="#source" type="button" role="tab" aria-controls="profile" aria-selected="false">Source</button>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="definition" role="tabpanel" aria-labelledby="home-tab">
                            <Card id={ this.props.uuid } className="class" style={ {
                                borderTop:            'none',
                                borderTopRightRadius: 0,
                                borderTopLeftRadius:  0
                            } }>

                                {/*<Card.Header as="h2">*/ }
                                {/*    <span className="class-title">Class:</span>*/ }
                                {/*    <span className="class-name">{ this.props.name }</span>*/ }
                                {/*</Card.Header>*/ }

                                <Card.Body>
                                    <Description id="description" className="class-description" description={ this.props.classDescription }></Description>
                                    <ExampleCategory id="examples" className="class-examples" name="Examples" values={ this.props.examples }></ExampleCategory>
                                    <ConstructorCategory id="constructor" className="class-constructor" name="Constructor" values={ [ this.props ] }></ConstructorCategory>
                                    <PropertiesCategory id="constants" className="class-constants" name="Constants" values={ this.props.constants }></PropertiesCategory>
                                    <PropertiesCategory id="members" className="class-members" name="Members" values={ this.props.members }></PropertiesCategory>
                                    <FunctionsCategory id="methods" className="class-methods" name="Methods" values={ this.props.methods }></FunctionsCategory>
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
                        </div>
                        <div className="tab-pane fade" id="source" role="tabpanel" aria-labelledby="profile-tab">
                            <SourceFile content={ this.props.source.file } language={ this.props.source.language }></SourceFile>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <Card id={ this.props.uuid } className="class m-3">

                    <Card.Header as="h2">
                        <span className="class-title">Class:</span>
                        <span className="class-name">{ this.props.name }</span>
                    </Card.Header>

                    <Card.Body>
                        <Description id="description" className="class-description" description={ this.props.classDescription }></Description>
                        <ExampleCategory id="examples" className="class-examples" name="Examples" values={ this.props.examples }></ExampleCategory>
                        <ConstructorCategory id="constructor" className="class-constructor" name="Constructor" values={ [ this.props ] }></ConstructorCategory>
                        <PropertiesCategory id="constants" className="class-constants" name="Constants" values={ this.props.constants }></PropertiesCategory>
                        <PropertiesCategory id="members" className="class-members" name="Members" values={ this.props.members }></PropertiesCategory>
                        <FunctionsCategory id="methods" className="class-methods" name="Methods" values={ this.props.methods }></FunctionsCategory>
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

}

Class.propTypes = {
    authors:          PropTypes.array,
    classDescription: PropTypes.string,
    constants:        PropTypes.array,
    description:      PropTypes.string,
    examples:         PropTypes.array,
    exceptions:       PropTypes.array,
    inherits:         PropTypes.array,
    licenses:         PropTypes.array,
    members:          PropTypes.array,
    methods:          PropTypes.array,
    name:             PropTypes.string,
    requires:         PropTypes.array,
    returns:          PropTypes.array,
    sees:             PropTypes.array,
    source:           PropTypes.object,
    uuid:             PropTypes.string
}

Class.defaultProps = {
    authors:          [],
    classDescription: '',
    constants:        [],
    description:      '',
    examples:         [],
    exceptions:       [],
    inherits:         [],
    licenses:         [],
    members:          [],
    methods:          [],
    name:             '',
    requires:         [],
    returns:          [],
    sees:             [],
    source:           {},
    uuid:             uuidv4()
}

module.exports = Class

