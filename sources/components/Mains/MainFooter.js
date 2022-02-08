const React     = require( 'react' )
const PropTypes = require( 'prop-types' )
const Navbar    = require( 'react-bootstrap/Navbar' )

/**
 * @class
 * @classdesc The main footer of html page, that allow to display copyright and others stuffs
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class MainFooter extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {
        return (
            <Navbar
                className="footer justify-content-center"
                bg={ this.props.bg }
                variant={ this.props.variant }
                sticky={ this.props.sticky }
                fixed={ this.props.fixed }
            >
                { this.props.children }
            </Navbar>
        )
    }

}

MainFooter.propTypes = {
    variant: PropTypes.string,
    bg:      PropTypes.string,
    sticky:  PropTypes.bool,
    fixed:   PropTypes.bool
}

module.exports = MainFooter
