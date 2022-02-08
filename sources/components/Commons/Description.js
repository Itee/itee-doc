const { v4: uuidv4 } = require( 'uuid' )
const React          = require( 'react' )
const PropTypes      = require( 'prop-types' )

/**
 * @class
 * @classdesc The Description component allow to display a description as paragraph of simple text, and handle internal link
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Description extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        const description = this.props.description
        if ( !description ) {
            return null
        }

        return (
            <p id={ this.props.uuid } className={ `description ${ this.props.className }` }>{ description }</p>
        )

    }

}

Description.propTypes = {
    className:   PropTypes.string,
    description: PropTypes.string,
    uuid:        PropTypes.string
}

Description.defaultProps = {
    className:   '',
    description: '',
    uuid:        uuidv4()
}


module.exports = Description
