const React = require( 'react' )
const Col   = require( 'react-bootstrap/Col' )
const Row   = require( 'react-bootstrap/Row' )

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

        return (
            <Row noGutters className="flex-fill mh-0">
                <Col md={ 2 } className="mh-100 overflow-auto">
                    right menu side
                </Col>
                <Col md={ 10 } className="mh-100 overflow-auto">
                    { this.props.children }
                </Col>
            </Row>
        )
    }

}

module.exports = MainContent
