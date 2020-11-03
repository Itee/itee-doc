/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @see [IFC Standard]{@link http://standards.buildingsmart.org/IFC/RELEASE/IFC4_1/FINAL/HTML/}
 *
 */

const React  = require( 'react' )
const Navbar = require( 'react-bootstrap/Navbar' )

class MainFooter extends React.Component {

    // Renderers
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
