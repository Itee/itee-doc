const React       = require( 'react' )
const Card        = require( 'react-bootstrap/Card' )
const Description = require( '../Commons/Description' )
const LabeledList = require( '../Commons/LabeledList' )

/**
 * @class
 * @classdesc The root component for documenting package
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Package extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return (
            <Card id={ this.props.uuid } className="class m-3">

                <Card.Header as="h2" className="class-header">
                    <span className="class-title">Package:</span> <span className="class-name">{ this.props.name }</span>
                </Card.Header>

                <Card.Body className="class-body">
                    <Description className="class-description" description={ this.props.description }></Description>
                    <LabeledList label="Files:" values={ this.props.files }></LabeledList>
                </Card.Body>

                <Card.Footer className="class-footer">
                </Card.Footer>

            </Card>
        )

    }

}

module.exports = Package

