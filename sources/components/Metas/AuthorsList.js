const React       = require( 'react' )
const PropTypes   = require( 'prop-types' )
const LabeledList = require( '../Commons/LabeledList' )

/**
 * @class
 * @classdesc The Authors component allow to display authors as link or simple text list
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class AuthorsList extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return <LabeledList className="authors-list" label={ this._computeLabel() } values={ this._computeValues() }></LabeledList>

    }

    _computeLabel () {

        return ( this.props.authors.length > 1 ) ? 'Authors:' : 'Author:'

    }

    _computeValues () {

        return this.props.authors.map( author => {

            const url          = author.url
            const label        = author.label
            const labelWithUrl = `${ label } <${ url }>`

            let licenseLink

            if ( !url && !label ) {

                licenseLink = null

            } else {

                licenseLink = <a className="author-link" href={ url } target="_blank" rel="noreferrer">{ labelWithUrl }</a>

            }

            return licenseLink

        } )

    }

}

AuthorsList.propTypes = {
    authors: PropTypes.array
}

AuthorsList.defaultProps = {
    authors: []
}

module.exports = AuthorsList
