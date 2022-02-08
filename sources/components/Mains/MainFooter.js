const { v4: uuidv4 } = require( 'uuid' )
const React          = require( 'react' )
const PropTypes      = require( 'prop-types' )
const Navbar         = require( 'react-bootstrap/Navbar' )

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
                id={ this.props.uuid }
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
    bg:      PropTypes.string,
    fixed:   PropTypes.bool,
    sticky:  PropTypes.bool,
    uuid:    PropTypes.string,
    variant: PropTypes.string
}

MainFooter.defaultProps = {
    bg:      '',
    fixed:   false,
    sticky:  false,
    uuid:    uuidv4(),
    variant: ''
}

module.exports = MainFooter
