const React       = require( 'react' )
const PropTypes   = require( 'prop-types' )
const MainNavbar  = require( './Mains/MainNavbar' )
const MainContent = require( './Mains/MainContent' )
const MainFooter  = require( './Mains/MainFooter' )

/**
 * @class
 * @classdesc The root component for HTML page generation, it allow to add your own static styles and scritps
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Page extends React.Component {

    /**
     * This methods will map this.props.stylesheets to html link elements
     *
     * @returns {JSX.Element}
     * @private
     */
    _renderStylesheets () {

        const stylesheets = this.props.stylesheets || []
        return stylesheets.map( stylesheet => <link key={ stylesheet } rel="stylesheet" href={ stylesheet } /> )

    }

    /**
     * This methods will map this.props.scripts to html script elements
     *
     * @returns {JSX.Element}
     * @private
     */
    _renderScripts () {

        const scripts = this.props.scripts || []
        return scripts.map( script => <script key={ script } type="text/javascript" src={ script }></script> )

    }

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return (
            <html lang="en">
                <head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>{ this.props.title }</title>
                    <link rel="stylesheet" type="text/css" href="styles/style.css" />
                    { this._renderStylesheets() }
                </head>
                <body className="h-100 overflow-hidden">
                    <div className="d-flex flex-column h-100 overflow-hidden">
                        <MainNavbar { ...this.props.navbar }></MainNavbar>
                        <MainContent { ...this.props.content }>
                            { this.props.children }
                        </MainContent>
                        <MainFooter { ...this.props.footer }>
                            <span className="copyright">{ this.props.copyright }</span>
                        </MainFooter>
                    </div>
                    <script type="text/javascript" src="scripts/itee-doc.js" />
                    { this._renderScripts() }
                </body>
            </html>
        )

    }

}

Page.propTypes = {
    stylesheets: PropTypes.array,
    scripts:     PropTypes.array,
    title:       PropTypes.string,
    navbar:      PropTypes.object,
    content:     PropTypes.object,
    footer:      PropTypes.object,
    copyright:   PropTypes.string
}

Page.defaultProps = {
    stylesheets: [],
    scripts:     []
}

module.exports = Page
