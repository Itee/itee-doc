/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */

const React     = require( 'react' )
const PropTypes = require( 'prop-types' )

class MoveToAnchor extends React.Component {
    render () {

        const anchor = this.props.anchor
        if ( anchor.length === 0 ) {
            return null
        }

        return (
            <a href={ anchor } className="move-to-anchor bg-dark text-light">{ this.props.children }</a>
        )
    }
}

MoveToAnchor.propTypes = {
    anchor: PropTypes.string
}

MoveToAnchor.defaultProps = {
    anchor: ''
}

module.exports = MoveToAnchor
