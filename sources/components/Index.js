const React              = require( 'react' )

/**
 * @class
 * @classdesc The Index component allow to display a markdown file like a Readme or license as first documentation page
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Index extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return (
            <div id={ this.props.uuid } dangerouslySetInnerHTML={{__html: this.props.children }}>
            </div>
        )

    }

}

module.exports = Index

