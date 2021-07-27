const React       = require( 'react' )
const LabeledList = require( '../Commons/LabeledList' )

/**
 * @class
 * @classdesc The Source component allow to display sources as link or simple text
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class SourcesList extends LabeledList {

    renderLabel ( label, numberOfValues ) {
        const render = super.renderLabel( label, numberOfValues )
        if ( render ) { return render }

        return ( numberOfValues > 1 ) ? 'Sources:' : 'Source:'
    }

    renderValue ( value ) {

        const sourcePath               = `${ value.path }\\${ value.filename }`
        const sourcePathWithLineNumber = `${ sourcePath }#line_${ value.lineNumber }`
        const sourceLineNumberLabel    = `line n°${ value.lineNumber }`

        return (
            <span key={ sourcePath }>
                <a href={ sourcePath }>{ sourcePath }</a>&#44;&nbsp;<a href={ sourcePathWithLineNumber }>{ sourceLineNumberLabel }</a>
            </span>
        )

    }

}

module.exports = SourcesList
