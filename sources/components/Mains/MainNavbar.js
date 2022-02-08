const { v4: uuidv4 } = require( 'uuid' )
const React          = require( 'react' )
const PropTypes      = require( 'prop-types' )
const Navbar         = require( 'react-bootstrap/Navbar' )
const Nav            = require( 'react-bootstrap/Nav' )
const NavDropdown    = require( 'react-bootstrap/NavDropdown' )

/**
 * @class
 * @classdesc The main navbar component, that will generate menus and sub menus
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class MainNavbar extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        const uuid = this.props.id || uuidv4()

        return (
            <Navbar id={ uuid } bg={ this.props.bg } variant={ this.props.variant }>
                { this._renderNavbarItems( this.props.items ) }
            </Navbar>
        )

    }

    /**
     * Render all navbar item types
     * @param {Array<Object>} [navbarItems=[]] - An array of navbar items properties
     * @returns {Array<JSX.Element>}
     * @private
     */
    _renderNavbarItems ( navbarItems = [] ) {

        return navbarItems.map( navbarItem => {

            let renderedNavbarItem

            switch ( navbarItem.type ) {

                case 'brand':
                    renderedNavbarItem = this._renderNavbarBrand( navbarItem )
                    break

                case 'nav':
                    renderedNavbarItem = this._renderNavbarNav( navbarItem )
                    break

                default:
                    throw new RangeError( `Invalid navbar item type: ${ navbarItem.type }` )

            }

            return renderedNavbarItem

        } )

    }

    /**
     * Render a navbar brand
     * @param {Object} brand - The brand properties
     * @returns {JSX.Element}
     * @private
     */
    _renderNavbarBrand ( brand ) {

        const uuid = brand.id || uuidv4()

        return <Navbar.Brand key={ uuid } id={ uuid } href={ brand.link }>{ brand.label }</Navbar.Brand>

    }

    /**
     * Render a navbar nav
     * @param {Object} nav - The nav properties
     * @returns {JSX.Element}
     * @private
     */
    _renderNavbarNav ( nav ) {

        const uuid = nav.id || uuidv4()

        return (
            <Nav key={ uuid } id={ uuid } className="mr-auto">
                { this._renderNavItems( nav.items ) }
            </Nav>
        )

    }

    /**
     * Render all nav items type
     * @param {Array<Object>} [navItems=[]] - An array of nav items properties
     * @returns {Array<JSX.Element>}
     * @private
     */
    _renderNavItems ( navItems = [] ) {

        return navItems.map( navItem => {

            let renderedNavItem

            switch ( navItem.type ) {

                case 'link':
                    renderedNavItem = this._renderNavLink( navItem )
                    break

                case 'dropdown':
                    renderedNavItem = this._renderNavDropdown( navItem )
                    break

                default:
                    throw new RangeError( `Invalid item type: ${ navItem.type }` )

            }

            return renderedNavItem

        } )

    }

    /**
     * Render a nav link
     * @param {Object} link - The link properties
     * @returns {JSX.Element}
     * @private
     */
    _renderNavLink ( link ) {

        const uuid = link.id || uuidv4()

        return (
            <Nav.Link key={ uuid } id={ uuid } href={ link.href }>{ link.label }</Nav.Link>
        )

    }

    /**
     * Render a nav dropdown
     * @param {Object} navDropdown - The nav dropdown properties
     * @returns {JSX.Element}
     * @private
     */
    _renderNavDropdown ( navDropdown ) {

        const uuid = navDropdown.id || uuidv4()

        // NavDropdown is not able to render dropdownItems as static content...
        // So defaulting to real bootstrap component
        //        return (
        //            <NavDropdown key={ uuid } title={ navDropdown.title }>
        //                { this._renderNavDropdownItems( navDropdown.items ) }
        //            </NavDropdown>
        //        )

        return (
            <li key={ uuid } className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id={ uuid } role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    { navDropdown.title }
                </a>
                <div className="dropdown-menu" aria-labelledby={ uuid }>
                    { this._renderNavDropdownItems( navDropdown.items ) }
                </div>
            </li>
        )

    }

    /**
     * Render all nav dropdown items types
     * @param {Array<Object>} [navDropdownItems=[]] - An array of nav dropdown items properties
     * @returns {Array<JSX.Element>}
     * @private
     */
    _renderNavDropdownItems ( navDropdownItems = [] ) {

        return navDropdownItems.map( ( navDropdownItem ) => {

            let renderedNavDropdownItem

            switch ( navDropdownItem.type ) {

                case 'item':
                    renderedNavDropdownItem = this._renderNavDropdownItem( navDropdownItem )
                    break

                case 'divider':
                    renderedNavDropdownItem = this._renderNavDropdownDivider( navDropdownItem )
                    break

                default:
                    throw new RangeError( `Invalid nav dropdown item type: ${ navDropdownItem.type }` )

            }

            return renderedNavDropdownItem

        } )

    }

    /**
     * Render a nav dropdown item
     * @param {Object} navDropdownItem - The nav dropdown item properties
     * @returns {JSX.Element}
     * @private
     */
    _renderNavDropdownItem ( navDropdownItem ) {

        const uuid = navDropdownItem.id || uuidv4()

        return <NavDropdown.Item key={ uuid } id={ uuid } href={ navDropdownItem.href }>{ navDropdownItem.label }</NavDropdown.Item>

    }

    /**
     * Render a nav dropdown divider
     * @param {Object} divider - The nav dropdown divider properties
     * @returns {JSX.Element}
     * @private
     */
    _renderNavDropdownDivider ( divider ) {

        const uuid = divider.id || uuidv4()

        return <div key={ uuid } id={ uuid } className="dropdown-divider"></div>

    }

}

MainNavbar.propTypes = {
    id:      PropTypes.string,
    bg:      PropTypes.string,
    variant: PropTypes.string,
    items:   PropTypes.array
}

module.exports = MainNavbar
