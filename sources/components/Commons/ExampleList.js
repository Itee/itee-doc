const React     = require( 'react' )
const PropTypes = require( 'prop-types' )
const Card      = require( 'react-bootstrap/Card' )
const ListGroup = require( 'react-bootstrap/ListGroup' )
const Example  = require( './Example' )

/**
 * @class
 * @classdesc The Constants component allow to display preformated constant in Card style
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class ExampleList extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element|null}
     */
    render () {

        const examples = this.props.examples
        if ( examples.length === 0 ) {
            return null
        }

        const renderedExamples = examples.map( example => {

            return (
                <ListGroup.Item key={ example.uuid }>
                    <Example { ...example }></Example>
                </ListGroup.Item>
            )

        } )

        return (
            <Card className="mb-3">
                <Card.Header as="h3">
                    Examples
                </Card.Header>
                <ListGroup variant="flush">
                    { renderedExamples }
                </ListGroup>
            </Card>
        )

    }

}

ExampleList.propTypes = {
    examples: PropTypes.array
}

module.exports = ExampleList
