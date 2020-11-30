const React     = require( 'react' )
const Card      = require( 'react-bootstrap/Card' )
const ListGroup = require( 'react-bootstrap/ListGroup' )
const Function  = require( './Function' )

/**
 * @class
 * @classdesc The FunctionsCategory component allow to display preformated functions in Card style
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class FunctionsCategory extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element|null}
     */
    render () {

        const values = this.props.values
        if ( values.length === 0 ) {
            return null
        }

        const renderedValues = values.map( value => {

            return (
                <ListGroup.Item key={ value.uuid } href={ `#${ value.longName }` }>
                    <Function { ...value }></Function>
                </ListGroup.Item>
            )

        } )

        return (
            <Card className="functions-category mb-3">
                <Card.Header as="h3" className="functions-header">
                    { this.props.name }
                </Card.Header>
                <ListGroup variant="flush" className="functions-list">
                    { renderedValues }
                </ListGroup>
            </Card>
        )

    }

}

FunctionsCategory.defaultProps = {
    name:   'FunctionsCategory',
    values: []
}

module.exports = FunctionsCategory
