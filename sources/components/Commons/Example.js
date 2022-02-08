const { v4: uuidv4 } = require( 'uuid' )
const React          = require( 'react' )
const PropTypes      = require( 'prop-types' )

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
            <div id={ this.props.uuid } className="example">
                <div className="example-content">
                    <pre>
                        <code className={ this.props.lang }>
                            { content }
                        </code>
                    </pre>
                    <button className="btn btn-outline-secondary btn-copy" data-code={ content }>Copy</button>
                </div>
            </div>
        )

    }

}

Example.propTypes = {
    content: PropTypes.string,
    lang:    PropTypes.string,
    uuid:    PropTypes.string
}

Example.defaultProps = {
    content: '',
    lang:    '',
    uuid:    uuidv4()
}

module.exports = Example
