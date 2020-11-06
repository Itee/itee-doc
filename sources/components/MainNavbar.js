const { v4: uuidv4 } = require( 'uuid' )
const React          = require( 'react' )
const Navbar         = require( 'react-bootstrap/Navbar' )
const Nav            = require( 'react-bootstrap/Nav' )
const isString       = require( '../scripts/utils' )

/**
 * @class
 * @classdesc The main navbar component, that will generate menus and sub menus
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class MainNavbar extends React.Component {

    renderMenuItems ( items = [] ) {

        return items.map( item => {

            let menuItem

            if ( isString( item ) ) {
                menuItem = <Nav.Link key={ uuidv4() } href={ `#${ item }` }>{ item }</Nav.Link>
            } else {
                // todo: dropdown
            }

            return menuItem

        } )

    }

    renderMenus ( menus = [] ) {

        return menus.map( menu => {

            return (
                <Nav key={ uuidv4() } className="mr-auto">
                    { this.renderMenuItems( menu.items ) }
                </Nav>
            )


        } )

    }

    renderScripts () {

        const scripts = this.props.scripts || []
        return scripts.map( script => <script type="text/javascript" src={ script }></script> )

    }

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="index.html">{ this.props.brand }</Navbar.Brand>
                { this.renderMenus( this.props.menus ) }
                {/*<Nav className="mr-auto">*/ }
                {/*    <Nav.Link href="#home">Home</Nav.Link>*/ }
                {/*    <Nav.Link href="#features">Features</Nav.Link>*/ }
                {/*    <Nav.Link href="#pricing">Pricing</Nav.Link>*/ }
                {/*</Nav>*/ }
                {/*<Form inline>*/ }
                {/*    <FormControl type="text" placeholder="Search" className="mr-sm-2" />*/ }
                {/*    <Button variant="outline-info">Search</Button>*/ }
                {/*</Form>*/ }
            </Navbar>
        )

    }

}

MainNavbar.defaultProps = {
    brand: 'MyBrand',
    menus: [ {
        align: 'left',
        items: [ 'foo', 'bar', 'baz' ]
    } ]
}

module.exports = MainNavbar
