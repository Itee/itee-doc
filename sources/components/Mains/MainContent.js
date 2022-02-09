const { v4: uuidv4 } = require( 'uuid' )
const React          = require( 'react' )
const PropTypes      = require( 'prop-types' )
const Col            = require( 'react-bootstrap/Col' )
const Row            = require( 'react-bootstrap/Row' )
const Nav            = require( 'react-bootstrap/Nav' )
const Navbar         = require( 'react-bootstrap/Navbar' )
const NavDropdown    = require( 'react-bootstrap/NavDropdown' )
const MoveToAnchor   = require( '../Others/MoveToAnchor' )

function Menu () {
    return null
}

function Content () {
    return null
}

/**
 * @class
 * @classdesc The page main content that allow to specify a template type
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class MainContent extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {
        //        const { children } = this.props
        //        const menu         = children.find( child => child.type === Menu )
        //        const content      = children.find( child => child.type === Content )

        const anchorId   = 'anchor-top'
        const anchorLink = `${ this.props.path }#${ anchorId }`

        return (
            <Row id={ this.props.uuid } className="flex-fill m-0 mh-0">
                <Col md={ 2 } className="mh-100 overflow-auto p-0">
                    {/*{ menu ? menu.props.items : null }*/ }
                    { this._renderSideMenu() }
                </Col>
                <Col md={ 10 } className="mh-100 overflow-auto p-0">
                    <div id={ anchorId }></div>
                    {/*{ content ? content.props.children : null }*/ }
                    { this.props.children }
                </Col>

                <MoveToAnchor anchor={ anchorLink }>🚀</MoveToAnchor>
            </Row>
        )

    }

    _renderSideMenu () {

        // Keep this until index have its own component
        const child = ( this.props.children && this.props.children.length > 0 ) ? this.props.children[ 0 ] : null
        if ( !child ) { return null }

        const navs = []

        if ( child.props.readMe ) {
            //navs.push(...this._parseMarkDownTemplate(child.props.readMe))
        }
        if ( child.props.kind === 'class' || child.props.kind === 'module' || child.props.kind === 'mixin' ) {
            navs.push(
                <Nav.Item>
                    <Nav.Link href={ `${ this.props.path }#${ child.props.uuid }-ctor` }>Constructor</Nav.Link>
                    {/*<Nav.Link href={ `${ this.props.path }#constructor` }>Constructor</Nav.Link>*/}
                </Nav.Item>
            )
        }
        if ( child.props.constants && child.props.constants.length > 0 ) {
            navs.push( this._renderNavItems( 'Constants', child.props.constants ) )
            //            navs.push( ...this._renderNavItems( child.props.constants ) )
        }
        if ( child.props.members && child.props.members.length > 0 ) {
            navs.push( this._renderNavItems( 'Members', child.props.members ) )
            //            navs.push( ...this._renderNavItems( child.props.members ) )
        }
        if ( child.props.methods && child.props.methods.length > 0 ) {
            navs.push( this._renderNavItems( 'Methods', child.props.methods ) )
            //            navs.push( ...this._renderNavItems( child.props.methods ) )
        }
        if ( child.props.examples && child.props.examples.length > 0 ) {
            navs.push(
                <Nav.Item>
                    <Nav.Link href={ `${ this.props.path }#examples` }>Examples</Nav.Link>
                </Nav.Item>
            )
        }

        return (
            <Navbar bg="light" variant="light" expand={ false } className="h-100 p-3" style={ {
                alignItems:     'flex-start',
                flexWrap:       'wrap',
                justifyContent: 'flex-start',
                flexDirection:  'column',
                alignContent:   'flex-start'
            } }>
                <Navbar.Brand href={ `${ this.props.path }#${ child.props.uuid }` }>{ child.props.name }</Navbar.Brand>
                <Nav>
                    { navs }
                </Nav>
            </Navbar>
        )

    }

    _renderNavItems ( title, items ) {

        const navItems = []
        for ( const item of items ) {
            navItems.push(
                <NavDropdown.Item key={ item.uuid } href={ `${ this.props.path }#${ item.uuid }` }>{ item.name }</NavDropdown.Item>
            )
        }

        const uuid = uuidv4()

        return (
            <div key={ uuid } className="dropdown nav-item">
                <a id={ uuid } className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    { title }
                </a>
                <div className="dropdown-menu" aria-labelledby={ uuid }>
                    { navItems }
                </div>
            </div>
        )
    }
}

MainContent.propTypes = {
    path: PropTypes.string,
    uuid: PropTypes.string
}

MainContent.defaultProps = {
    path: '',
    uuid: uuidv4()
}

MainContent.Menu    = Menu
MainContent.Content = Content

module.exports = MainContent
