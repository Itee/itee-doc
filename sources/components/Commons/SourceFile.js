const { v4: uuidv4 } = require( 'uuid' )
const React          = require( 'react' )
const PropTypes      = require( 'prop-types' )

/**
 * @class
 * @classdesc The Authors component allow to display authors as link or simple text list
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class SourceFile extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        const content = this.props.content
        if ( !content ) {
            return null
        }

        return (
            <div id={ this.props.uuid } className="source-file">
                <div className="source-file-content">
                    <pre>
                        <code className={ this.props.language }>
                            { content }
                        </code>
                    </pre>
                </div>
            </div>
        )

    }

}

SourceFile.propTypes = {
    content: PropTypes.string,
    language:    PropTypes.string,
    uuid:    PropTypes.string
}

SourceFile.defaultProps = {
    content: '',
    language:    '',
    uuid:    uuidv4()
}

module.exports = SourceFile
