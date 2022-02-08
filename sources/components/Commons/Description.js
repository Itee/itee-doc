const React     = require( 'react' )
const PropTypes = require( 'prop-types' )

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

        if ( !this.props.description ) {
            return null
        }

        return (
            <p id={ this.props.id } className={ `description ${ this.props.className }` }>{ this.props.description }</p>
        )

    }

}

Description.propTypes = {
    id:          PropTypes.string,
    className:   PropTypes.string,
    description: PropTypes.string
}


module.exports = Description
