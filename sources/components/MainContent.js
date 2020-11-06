const React  = require( 'react' )
const Col  = require( 'react-bootstrap/Col' )
const Row  = require( 'react-bootstrap/Row' )
const ErrorBoundary  = require( './ErrorBoundary' )

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
            <Row noGutters className="flex-fill mh-0 bg-dark" style={ { border: '4px solid #343a40' } }>
                <Col md={ 2 } className="mh-100 overflow-auto nodes-library p-1 bg-secondary">
                    <ErrorBoundary>
                        right menu side
                    </ErrorBoundary>
                </Col>
                <Col md={ 10 } className="mh-100 overflow-auto nodes-board p-1 bg-secondary">
                    <ErrorBoundary>
                        {this.props.children}
                    </ErrorBoundary>
                </Col>
            </Row>
        )
    }

}

module.exports = MainContent
