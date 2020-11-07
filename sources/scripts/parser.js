const logger                      = require( '../../node_modules/jsdoc/lib/jsdoc/util/logger.js' )

const { v4: uuidv4 }              = require( 'uuid' )
const { isNotDefined, isDefined } = require( './utils' )

const linkRegex                = RegExp( '@link' )
const squaredLinkRegex         = RegExp( '\\[(.*)\\]{@link (.*)}' )
const pipedLinkRegex           = RegExp( '{@link (.*)\\|(.*)}' )
const spacedLinkRegex          = RegExp( '{@link ([^ ]*) (.*)}' )
const simpleLinkRegex          = RegExp( '{@link ([^ ]*)}' )
const linkWithDescriptionRegex = RegExp( '{@link .*}(.*)' )
const langRegex                = RegExp( '{@lang (.*)}' )

/**
 * Allow to validate if the given string is a JsDoc link tag or not
 * @param string
 * @returns {boolean}
 */
function isLink ( string ) {
    return linkRegex.test( string )
}

/**
 * @class
 * @classdesc The Parser class allow to parse taffyDatas doclets into POJO tree structure
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Parser {

    constructor ( options = {} ) {

        this.options = options

        // todo: Who is the faster between { a: true, b: true... }[key] and [a,b,...].includes(key)
        this._usedFileNames = []
        this._datas         = {
            indexes:        new Map(),
            longNameToUuid: new Map(),

            classes:    new Map(),
            constants:  new Map(),
            externals:  new Map(),
            files:      new Map(),
            functions:  new Map(),
            globals:    new Map(),
            graphs:     new Map(),
            interfaces: new Map(),
            members:    new Map(),
            mixins:     new Map(),
            modules:    new Map(),
            namespaces: new Map(),
            packages:   new Map(),
            statics:    new Map(),
            tutorials:  new Map(),
            typedefs:   new Map()
        }

    }

    // Utils

    getUniqueFilename ( longName ) {

        let basename = longName.replace( /[\\/?*:|'"<>]/g, '_' )// replace characters that can cause problems on some filesystems
                               .replace( /~/g, '-' )// use - instead of ~ to denote 'inner'
                               .replace( /#/g, '_' )// use _ instead of # to denote 'instance'
                               .replace( /\//g, '_' )// use _ instead of / (for example, in module names)
                               .replace( /\([\s\S]*\)$/, '' )// remove the variation, if any
                               .replace( /^[.-]/, '' ) // make sure we don't create hidden files, or files whose names start with a dash

        // in case we've now stripped the entire basename (uncommon, but possible):
        basename = ( basename.length ) ? basename : uuidv4()

        // Be sure it is unique
        let fileName = `${ basename }.html`
        let counter  = 0
        while ( this._usedFileNames.includes( fileName ) ) {
            fileName = `${ basename }_${ counter }.html`
            counter++
        }

        // Keep reference on it
        this._usedFileNames.push( fileName )

        return fileName

    }

    // Parsers

    parse ( taffyData ) {

        taffyData().each( doclet => {

            let uuid = uuidv4()
            while ( this._datas.indexes.has( uuid ) ) {
                uuid = uuidv4()
            }

            // Parse doclet data
            const docletKind = doclet.kind
            const longName   = doclet.longname
            let docletData   = {
                uuid:        uuid,
                type:        docletKind,
                name:        doclet.name,
                longName:    doclet.longname,
                description: doclet.description || doclet.classdesc,
                scope:       doclet.scope,
                readOnly:    doclet.readonly,
                virtual:     doclet.virtual,
                contant:     doclet.contant,
                abstract:    doclet.abstract,
                augments:    doclet.augments,
                memberOf:    doclet.memberof,
                inherited:   doclet.inherited,
                inherits:    doclet.inherits,
                members:     doclet.members || [],
                see:         this.parseSee( doclet.see ),
                examples:    this.parseExamples( doclet.example ),
                license:     this.parseLicense( doclet.license ),
                requires:    this.parseRequires( doclet.requires ),
                parameters:  this.parseParameters( doclet.params ),
                exceptions:  this.parseExceptions( doclet.exceptions ),
                author:      this.parseAuthors( doclet.author ),
                source:      this.parseMeta( doclet.meta ),
                destination: {
                    fileName: this.getUniqueFilename( longName )
                }
            }

            switch ( docletKind ) {

                case 'module':
                    this._datas.modules.set( longName, docletData )
                    break

                case 'class':
                    this._datas.classes.set( longName, docletData )
                    break

                case 'member':
                    this._datas.members.set( longName, docletData )
                    break

                case 'typedef':
                    this._datas.typedefs.set( longName, docletData )
                    break

                case 'file':
                    this._datas.files.set( longName, docletData )
                    break

                case 'namespace':
                    this._datas.namespaces.set( longName, docletData )
                    break

                case 'mixin':
                    this._datas.mixins.set( longName, docletData )
                    break

                case 'interface':
                    this._datas.interfaces.set( longName, docletData )
                    break

                case 'global':
                    this._datas.globals.set( longName, docletData )
                    break

                case 'package':
                    this._datas.packages.set( longName, docletData )
                    break

                case 'external':
                    this._datas.externals.set( longName, docletData )
                    break

                case 'constant':
                    this._datas.constants.set( longName, docletData )
                    break

                case 'function':
                    this._datas.functions.set( longName, docletData )
                    break

                default: //todo allow invalid tag ?
                    throw new RangeError( `Invalid switch parameter: ${ docletKind }` )

            }

            // Keep reference of doclet
            this._datas.indexes.set( uuid, docletData )

            if ( this._datas.longNameToUuid.has( longName ) ) {
                logger.warn( '%s', `Long name collision on "${ longName }".` )
            }
            this._datas.longNameToUuid.set( longName, uuid )

        } )

        // Assign members to parent
        for ( const member of this._datas.members.values() ) {

            const memberOf   = member.memberOf
            const parentUuid = this._datas.longNameToUuid.get( memberOf )
            const parent     = this._datas.indexes.get( parentUuid )
            if ( isNotDefined( parent ) ) {
                logger.warn( `Unable to bind member [${ member.name }] to ${ memberOf }. ${ memberOf } is not defined !` )
                continue
            }

            if ( isNotDefined( parent.members ) ) {
                parent.members = []
            }

            parent.members.push( member )

        }

        return this._datas

    }

    /**
     *
     * @param {String} link
     * @returns {null}
     */
    parseLink ( link = '' ) {

        let linkMatchs    = null
        const squaredLink = link.match( squaredLinkRegex, 's' )
        if ( isNotDefined( squaredLink ) || squaredLink.length < 3 ) {

            const pipedLink = link.match( pipedLinkRegex, 's' )
            if ( isNotDefined( pipedLink ) || pipedLink.length < 3 ) {

                const spacedLink = link.match( spacedLinkRegex, 's' )
                if ( isNotDefined( spacedLink ) || spacedLink.length < 3 ) {

                    const simpleLink = link.match( simpleLinkRegex, 's' )
                    if ( isNotDefined( simpleLink ) || simpleLink.length < 2 ) {

                        logger.error( `Invalide link matching: ${ link }` )

                    } else {
                        linkMatchs = {
                            type:  'link',
                            label: null,
                            url:   simpleLink[ 1 ]
                        }
                    }
                } else {
                    linkMatchs = {
                        type:  'link',
                        label: spacedLink[ 2 ],
                        url:   spacedLink[ 1 ]
                    }
                }

            } else {
                linkMatchs = {
                    type:  'link',
                    label: pipedLink[ 2 ],
                    url:   pipedLink[ 1 ]
                }
            }

        } else {
            linkMatchs = {
                type:  'link',
                label: squaredLink[ 1 ],
                url:   squaredLink[ 2 ]
            }
        }

        return linkMatchs

    }

    parseLicense ( license = '' ) {
        let result = ''

        if ( isDefined( license ) ) {

            if ( isLink( license ) ) {
                result = this.parseLink( license )
            } else {
                result = license
            }

        }

        return result
    }

    parseType ( type = {} ) {
        let result = []

        if ( isDefined( type.names ) ) {
            result = type.names
        } else if ( isDefined( type.parsedType ) ) {
            result = type.parsedType.name
        }

        return result
    }

    parseSee ( sees = [] ) {
        const results   = []
        let link        = null
        let description = null

        for ( let see of sees ) {

            if ( isLink( see ) ) {
                link                    = this.parseLink( see )
                const descriptionMatchs = see.match( linkWithDescriptionRegex )
                if ( descriptionMatchs ) {
                    description = descriptionMatchs[ 1 ].trim()
                }
            } else {
                description = see
            }

            results.push( {
                link:        link,
                description: description
            } )

        }

        return results
    }

    parseExamples ( examples = [] ) {
        const results = []
        let lang      = null
        let content   = null

        for ( let example of examples ) {

            const langMatchs = example.match( langRegex )
            if ( langMatchs ) {
                lang = langMatchs[ 1 ]

                const langTagLength = langMatchs[ 0 ].length
                content             = example.slice( langTagLength )
            } else {
                lang    = 'javascript'
                content = example
            }

            results.push( {
                lang:    lang,
                content: content
            } )

        }

        return results
    }

    parseParameters ( parameters = [] ) {

        const result = []
        let target

        for ( let parameter of parameters ) {

            const parameterName = parameter.name
            target              = null

            if ( parameterName.includes( '.' ) ) {

                const parameterKeyPath  = parameterName.split( '.' )
                let currentPropertyName = null

                while ( parameterKeyPath.length > 0 ) {

                    currentPropertyName = parameterKeyPath.shift()

                    let propertyElement = null
                    if ( target === null ) {
                        propertyElement = result.filter( ( prop ) => {
                            return ( prop.name === currentPropertyName )
                        } )
                    } else {
                        propertyElement = target.properties.filter( ( prop ) => {
                            return ( prop.name === currentPropertyName )
                        } )
                    }

                    if ( propertyElement && propertyElement.length > 0 ) {
                        target = propertyElement[ 0 ]
                    } else {
                        logger.error( `Intermediate property ${ currentPropertyName } does not exist in path: ${ parameterName }` )
                        break
                    }

                    if ( parameterKeyPath.length === 1 ) {

                        if ( !target.properties ) {
                            target.properties = []
                        }

                        const propertyName = parameterKeyPath[ 0 ]

                        target.properties.push( {
                            name:         propertyName,
                            optional:     parameter.optional,
                            defaultValue: parameter.defaultvalue,
                            description:  parameter.description,
                            type:         this.parseType( parameter.type ),
                            properties:   []
                        } )

                        break

                    }

                }

            } else {

                result.push( {
                    name:         parameter.name,
                    optional:     parameter.optional,
                    defaultValue: parameter.defaultvalue,
                    description:  parameter.description,
                    type:         this.parseType( parameter.type ),
                    properties:   []
                } )

            }

        }

        return result

    }

    parseRequires ( requires = [] ) {
        return requires.map( require => {
            return isLink( require ) ? this.parseLink( require ) : require
        } )
    }

    parseAuthors ( authors = [] ) {
        return authors.map( author => {
            return isLink( author ) ? this.parseLink( author ) : author
        } )
    }

    parseExceptions ( exceptions = [] ) {
        const results = []

        for ( let exception of exceptions ) {
            results.push( {
                type:        this.parseType( exception.type ),
                description: exception.description
            } )
        }

        return results
    }

    parseMeta ( meta = {} ) {
        return {
            path:         meta.path || '',
            filename:     meta.filename || '',
            lineNumber:   meta.lineno || 0,
            columnNumber: meta.columnno || 0
        }
    }

}

module.exports = Parser
