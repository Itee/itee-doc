const React       = require( 'react' )
const LabeledList = require( '../Commons/LabeledList' )

/**
 * @class
 * @classdesc The Source component allow to display sources as link or simple text
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class SourcesList extends React.Component {

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return <LabeledList className="sources-list" label={ this._computeLabel() } values={ this._computeValues() }></LabeledList>

    }

    _computeLabel () {

        return ( this.props.sources.length > 1 ) ? 'Sources:' : 'Source:'

    }

    _computeValues () {

        return this.props.sources.map( source => {

            const sourcePath               = `${ source.path }\\${ source.filename }`
            const sourcePathWithLineNumber = `${ sourcePath }#line_${ source.lineNumber }`
            const sourceLineNumberLabel    = `line n°${ source.lineNumber }`

            return (
                <span key={ sourcePath }>
                    <a href={ sourcePath }>{ sourcePath }</a>&#44;&nbsp;<a href={ sourcePathWithLineNumber }>{ sourceLineNumberLabel }</a>
                </span>
            )

        } )

    }

}

SourcesList.defaultProps = {
    sources: []
}

module.exports = SourcesList
