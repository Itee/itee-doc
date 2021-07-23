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
        if ( this.props.values.length === 0 ) {
            return null
        }

        return (
            <Card className="mb-3">
                <Card.Header as="h3" className="properties-header">
                    { this.props.name }
                </Card.Header>
                <ListGroup variant="flush" className="properties-list">
                    { this._renderValues() }
                </ListGroup>
            </Card>
        )

    }

    /**
     *
     * @returns {*}
     * @private
     */
    _renderValues () {

        return this.props.values.map( ( value ) => {
            if ( !value ) { return null }

            return (
                <ListGroup.Item key={ value.uuid } href={ `#${ value.longName }` }>
                    <Property { ...value }></Property>
                </ListGroup.Item>
            )
        } )

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
