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

        const value = this.props.value
        if ( value.length === 0 ) {
            return null
        }

        return (
            <pre>
                <code>
                    { this.props.value }
                </code>
            </pre>
        )

    }

}

Example.propTypes = {
    value: PropTypes.string
}

module.exports = Example
