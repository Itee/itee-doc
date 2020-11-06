const React = require( 'react' )

/**
 * @class
 * @classdesc The root component for documenting class
 * @augments React.Component
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Class extends React.Component {

//{
//    uuid:        uuidv4(),
//    type:        docletKind,
//    name:        doclet.name,
//    longName:    doclet.longname,
//    description: doclet.description || doclet.classdesc,
//    scope:       doclet.scope,
//    readOnly:    doclet.readonly,
//    virtual:     doclet.virtual,
//    contant:     doclet.contant,
//    abstract:    doclet.abstract,
//    augments:    doclet.augments,
//    memberOf:    doclet.memberof,
//    inherited:   doclet.inherited,
//    inherits:    doclet.inherits,
//    members:     doclet.members || [],
//    see:         parseSee( doclet.see ),
//    examples:    parseExamples( doclet.example ),
//    license:     parseLicense( doclet.license ),
//    requires:    parseRequires( doclet.requires ),
//    parameters:  parseParameters( doclet.params ),
//    exceptions:  parseExceptions( doclet.exceptions ),
//    author:      parseAuthors( doclet.author ),
//    source:      parseMeta( doclet.meta ),
//    destination: {
//        fileName: getUniqueFilename( longName )
//    }
//}

    /**
     * The main component render method
     *
     * @returns {JSX.Element}
     */
    render () {

        return (
            <section id={this.props.uuid} class="class">
                <div>{this.props.name}</div>
                <div>{this.props.description}</div>
                <div></div>
            </section>
        )

    }

}

module.exports = Class

