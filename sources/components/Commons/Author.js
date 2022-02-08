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
class Author extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        const name = this.props.name
        const url  = this.props.url
        let result

        if ( !name && !url ) {
            result = null
        } else if ( !url ) {
            result = name
        } else if ( !name ) {
            result = <a id={ this.props.uuid } className="author-link" href={ url } target="_blank" rel="noreferrer">{ `Anonymous <${ url }>` }</a>
        } else {
            result = <a className="author-link" href={ url } target="_blank" rel="noreferrer">{ `${ name } <${ url }>` }</a>
        }

        return result

    }
}

Author.propTypes = {
    name: PropTypes.string,
    url:  PropTypes.string,
    uuid: PropTypes.string
}

Author.defaultProps = {
    name: '',
    url:  '',
    uuid: uuidv4()
}

module.exports = Author
