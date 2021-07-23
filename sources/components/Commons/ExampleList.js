const React     = require( 'react' )
const PropTypes = require( 'prop-types' )
const Card      = require( 'react-bootstrap/Card' )
const ListGroup = require( 'react-bootstrap/ListGroup' )
const Example   = require( './Example' )

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
        if ( this.props.values.length === 0 ) {
            return null
        }

        return (
            <Card className="mb-3">
                <Card.Header as="h3" className="examples-header">
                    { this.props.name }
                </Card.Header>
                <ListGroup variant="flush" className="examples-list">
                    { this._renderValues() }
                </ListGroup>
            </Card>
        )

    }

    /**
     *
     * @param values
     * @returns {*}
     * @private
     */
    _renderValues () {

        return this.props.values.map( ( value, index ) => {
            if ( !value ) { return null }

            return (
                <ListGroup.Item key={ value.uuid || index } href={ `#${ value.longName }` }>
                    <Example { ...value }></Example>
                </ListGroup.Item>
            )
        } )

    }

}

ExampleList.propTypes = {
    name:   PropTypes.string,
    values: PropTypes.array
}

ExampleList.defaultProps = {
    name:   'Examples',
    values: []
}

module.exports = ExampleList
