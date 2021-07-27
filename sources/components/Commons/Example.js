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
            <div className="example">
                <div className="example-content">
                    <pre>
                        <code className={ this.props.lang }>
                            { this.props.content }
                        </code>
                    </pre>
                    <button className="btn btn-outline-secondary btn-copy" data-code={ this.props.content }>Copy</button>
                </div>
            </div>
        )

    }

}

Example.propTypes = {
    lang:    PropTypes.string,
    content: PropTypes.string
}

Example.defaultProps = {
    lang:    '',
    content: ''
}

module.exports = Example
