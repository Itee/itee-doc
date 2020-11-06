/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */

const React       = require( 'react' )
const MainNavbar  = require( './MainNavbar' )
const MainContent = require( './MainContent' )
const MainFooter  = require( './MainFooter' )

/**
 * @class
 * @classdesc The root component for page generation
 */
class Page extends React.Component {

    _renderStylesheets () {

        const stylesheets = this.props.stylesheets || []
        return stylesheets.map( stylesheet => <link rel="stylesheet" href={ stylesheet } /> )

    }

    _renderScripts () {

        const scripts = this.props.scripts || []
        return scripts.map( script => <script type="text/javascript" src={ script }></script> )

    }

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
                    {/*<script type="text/javascript" src="scripts/app.js" />*/ }
                    { this._renderScripts() }
                </body>
            </html>
        )

    }

}

module.exports = Page
