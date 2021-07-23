const React     = require( 'react' )
const PropTypes = require( 'prop-types' )

/**
 * @class
 * @classdesc The Constants component allow to display preformated constant in Card style
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Example extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element|null}
     */
    render () {

        const content = this.props.content
        if ( !content ) {
            return null
        }

        return (
            <pre>
                <code>
                    { this.props.content }
                </code>
            </pre>
        )

    }

}

Example.propTypes = {
    lang:    PropTypes.string,
    content: PropTypes.string
}

module.exports = Example
