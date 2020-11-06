const React = require( 'react' )
const Card  = require( 'react-bootstrap/Card' )

/**
 * @class
 * @classdesc An special component to wrap template error and display them to end user
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class ErrorBoundary extends React.Component {

    /**
     * @constructor
     * @param {Object} props - The component properties
     */
    constructor ( props ) {
        super( props )

        /**
         * The local component state
         * @type {Object}
         */
        this.state = {
            /**
             * The current catched error
             * @type {Object}
             */
            error: null
        }
    }

    /**
     *
     * @static
     * @param error
     * @returns {Object}
     */
    static getDerivedStateFromError ( error ) {
        return {
            error
        }
    }

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        if ( this.state.error ) {
            return (
                <div className="error-boundary">
                    <Card className="error-boundary-body" bg="danger" text="white">
                        <Card.Header>
                            <strong>Component Error</strong>
                        </Card.Header>
                        <Card.Body>
                            { this.state.error.stack }
                        </Card.Body>
                    </Card>
                </div>
            )
        }

        return this.props.children
    }
}

module.exports = ErrorBoundary
