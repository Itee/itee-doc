const React = require( 'react' )

/**
 * @class
 * @classdesc The Description component allow to display a description as paragraph of simple text, and handle internal link
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Description extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        if ( !this.props.description ) {
            return null
        }

        return (
            <p className="description">{ this.props.description }</p>
        )

    }

}

module.exports = Description
