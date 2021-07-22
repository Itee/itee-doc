const React     = require( 'react' )
const PropTypes = require( 'prop-types' )
const Card      = require( 'react-bootstrap/Card' )
const ListGroup = require( 'react-bootstrap/ListGroup' )
const Property  = require( './Property' )

/**
 * @class
 * @classdesc The Constants component allow to display preformated constant in Card style
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class PropertiesCategory extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element|null}
     */
    render () {

        const properties = this.props.values
        if ( properties.length === 0 ) {
            return null
        }

        const renderedProperties = properties.map( property => {

            return (
                <ListGroup.Item key={ property.uuid } href={ `#${ property.longName }` }>
                    <Property { ...property }></Property>
                </ListGroup.Item>
            )

        } )

        return (
            <Card className="mb-3">
                <Card.Header as="h3">
                    { this.props.name }
                </Card.Header>
                <ListGroup variant="flush">
                    { renderedProperties }
                </ListGroup>
            </Card>
        )

    }

}

PropertiesCategory.propTypes = {
    name:   PropTypes.string,
    values: PropTypes.array
}

PropertiesCategory.defaultProps = {
    name:   'PropertiesCategory',
    values: []
}

module.exports = PropertiesCategory
