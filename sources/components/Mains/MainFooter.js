const React  = require( 'react' )
const Navbar = require( 'react-bootstrap/Navbar' )

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
                className="footer"
                bg={ this.props.bg }
                variant={ this.props.variant }
                sticky={ this.props.sticky }
                fixed={ this.props.fixed }
            ></Navbar>
        )
    }

}

module.exports = MainFooter
