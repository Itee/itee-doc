const React     = require( 'react' )
const PropTypes = require( 'prop-types' )
const Card      = require( 'react-bootstrap/Card' )
const ListGroup = require( 'react-bootstrap/ListGroup' )

/**
 * @class
 * @classdesc The Category component allow to display preformated data in Card style
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Category extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element|null}
     */
    render () {
        if ( this.props.values.length === 0 ) { return null }

        return (
            <Card id={ this.props.id } className="mb-3">
                <Card.Header as="h3" className="category-header">
                    { this.props.name }
                </Card.Header>
                <ListGroup variant="flush" className="category-list">
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

        return this.props.values.map( ( value, index ) => {
            if ( !value ) { return null }

            const haveUuid     = value.uuid != null
            const haveLongName = value.longName != null

            if ( haveUuid && haveLongName ) {
                return (
                    <ListGroup.Item key={ value.uuid } href={ `#${ value.longName }` }>
                        { this.renderValue( value ) }
                    </ListGroup.Item>
                )
            } else if ( haveUuid && !haveLongName ) {
                return (
                    <ListGroup.Item key={ value.uuid } href={ `#${ value.uuid }` }>
                        { this.renderValue( value ) }
                    </ListGroup.Item>
                )
            } else if ( !haveUuid && haveLongName ) {
                return (
                    <ListGroup.Item key={ index } href={ `#${ value.longName }` }>
                        { this.renderValue( value ) }
                    </ListGroup.Item>
                )
            } else {
                return (
                    <ListGroup.Item key={ index }>
                        { this.renderValue( value ) }
                    </ListGroup.Item>
                )
            }

        } )

    }

    renderValue ( value ) {
        return value
    }

}

Category.propTypes = {
    id:     PropTypes.string,
    name:   PropTypes.string,
    values: PropTypes.array
}

Category.defaultProps = {
    name:   '',
    values: []
}

module.exports = Category
