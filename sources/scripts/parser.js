const logger = require( '../../node_modules/jsdoc/lib/jsdoc/util/logger.js' )

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

    /**
     *
     * @param options
     */
    constructor ( options = {} ) {

        /**
         * The options to use
         * @type {Object}
         */
        this.options = options

        // todo: Who is the faster between { a: true, b: true... }[key] and [a,b,...].includes(key)

        this._currentDocletPath = null

        /**
         * The internal map of parsed data
         * @type {Object}
         * @private
         */
        this._datas = {
            indexes:        new Map(),
            longNameToUuid: new Map()
        }

        this._globalUuid = uuidv4()

    }

    // Utils

    _isInvalidDoclet ( doclet ) {

        let isInvalid = false

        if ( isNotDefined( doclet ) ) {
            logger.warn( `Get null or undefined doclet in ${ this._currentDocletPath }. Ignoring doclet !` )
            isInvalid = true
        } else {

            if ( this._datas.indexes.has( doclet.___id ) ) {
                logger.warn( `Id collision on "${ doclet.longname }" in ${ this._currentDocletPath }. Ignoring doclet !` )
                isInvalid = true
            }

            if ( this._datas.longNameToUuid.has( doclet.longname ) ) {
                logger.warn( `Long name collision on "${ doclet.longname }" in ${ this._currentDocletPath }. Ignoring doclet !` )
                isInvalid = true
            }

        }

        return isInvalid

    }

    // Parsers

    /**
     * @param taffyData
     * @returns {Object}
     */
    parse ( taffyData ) {

        taffyData().each( this.parseDoclet.bind( this ) )

        this.assignConstants()
        this.assignMembers()
        this.assignFunctions()

        return this._datas

    }

    parseDoclet ( doclet ) {
        if ( this._isInvalidDoclet( doclet ) ) { return }
        if ( isNotDefined( doclet.meta ) ) { return }

        this._currentDocletPath = `${ doclet.meta.path }\\${ doclet.meta.filename } at line ${ doclet.meta.lineno }`

        const docletDatas = {
            abstract:     this.parseAbstract( doclet ),
            access:       this.parseAccess( doclet ),
            alias:        this.parseAlias( doclet ),
            async:        this.parseAsync( doclet ),
            augments:     this.parseExtends( doclet ),
            authors:      this.parseAuthors( doclet ),
            constant:     this.parseConstant( doclet ),
            defaultValue: this.parseDefaultValue( doclet ),
            description:  this.parseDescription( doclet ),
            examples:     this.parseExamples( doclet ),
            exceptions:   this.parseExceptions( doclet ),
            files:        this.parseFiles( doclet ),
            generator:    this.parseGenerator( doclet ),
            inherited:    this.parseInherited( doclet ),
            inherits:     this.parseInherits( doclet ),
            kind:         this.parseKind( doclet ),
            licenses:     this.parseLicense( doclet ),
            longName:     this.parseLongName( doclet ),
            memberOf:     this.parseMemberOf( doclet ),
            name:         this.parseName( doclet ),
            overrides:    this.parseOverrides( doclet ),
            parameters:   this.parseParameters( doclet ),
            preserveName: this.parsePreserveName( doclet ),
            properties:   this.parseProperties( doclet ),
            readOnly:     this.parseReadOnly( doclet ),
            requires:     this.parseRequires( doclet ),
            returns:      this.parseReturns( doclet ),
            scope:        this.parseScope( doclet ),
            sees:         this.parseSee( doclet ),
            source:       this.parseSource( doclet ),
            type:         this.parseType( doclet ),
            uuid:         this.parseId( doclet ),
            yields:       this.parseYields( doclet )
        }

        // Clean up
        Object.keys( docletDatas ).forEach( key => {
            const value = docletDatas[ key ]
            if ( ( value === undefined ) || ( Array.isArray( value ) && value.length === 0 ) ) {
                delete docletDatas[ key ]
            }
        } )

        // Debug unprocessed doclet properties
        delete doclet.___s
        delete doclet.comment
        for ( let property in doclet ) {
            logger.warn( `Unprocessed doclet property [${ property } => ${ JSON.stringify( doclet[ property ] ) }] from ${ this._currentDocletPath }` )
        }

        // Keep reference of doclet
        // Create entry in data if not already exist
        if ( !this._datas[ docletDatas.kind ] ) {
            this._datas[ docletDatas.kind ] = new Map()
        }
        this._datas[ docletDatas.kind ].set( docletDatas.longName, docletDatas )
        this._datas.indexes.set( docletDatas.uuid, docletDatas )
        this._datas.longNameToUuid.set( docletDatas.longName, docletDatas.uuid )

    }

    parseId ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const uuid = doclet.___id
        delete doclet.___id

        return uuid

    }

    parseLongName ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const longName = doclet.longname
        delete doclet.longname

        return longName
    }

    /**
     *
     * @param {String} link
     * @returns {null}
     */
    parseLink ( link = '' ) {

        let linkMatchs
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

    parseLicense ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const license = doclet.license
        let result
        if ( isLink( license ) ) {
            result = this.parseLink( license )
        } else {
            result = license
        }

        delete doclet.license

        return result
    }

    /**
     * Parse a doclet type and return an array of type as string
     * @param {Object} doclet - The doclet to parse
     * @returns {Array<String>}
     */
    parseType ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const type = doclet.type || {}
        let result = []

        if ( isDefined( type.names ) ) {
            result = type.names
        } else if ( isDefined( type.parsedType ) && type.parsedType.name ) {
            result = [ type.parsedType.name ]
        } else if ( isDefined( type.parsedType ) && type.parsedType.elements ) {
            result = type.parsedType.elements.map( element => element.name )
        }

        delete doclet.type

        return result
    }

    parseSee ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const sees      = doclet.see || []
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

        delete doclet.see

        return results
    }

    parseExamples ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const examples = doclet.examples || []
        const results  = []
        let lang       = null
        let content    = null

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

        delete doclet.examples

        return results
    }

    parseParameters ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const parameters = doclet.params || []
        const results     = []
        let target

        for ( let parameter of parameters ) {

            const parameterName = parameter.name
            target              = null

            if ( parameterName && parameterName.includes( '.' ) ) {

                const parameterKeyPath  = parameterName.split( '.' )
                let currentPropertyName = null

                while ( parameterKeyPath.length > 0 ) {

                    currentPropertyName = parameterKeyPath.shift()

                    let propertyElement = null
                    if ( target === null ) {
                        propertyElement = results.filter( ( prop ) => {
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
                            name:        propertyName,
                            optional:    parameter.optional,
                            default:     parameter.defaultvalue,
                            description: parameter.description,
                            type:        this.parseType( parameter.type ),
                            properties:  []
                        } )

                        break

                    }

                }

            } else {

                results.push( {
                    name:         parameter.name,
                    optional:     parameter.optional,
                    defaultValue: parameter.defaultvalue,
                    description:  parameter.description,
                    type:         this.parseType( parameter.type ),
                    properties:   []
                } )

            }

        }

        delete doclet.params

        return results

    }

    parseRequires ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const requires = doclet.requires || []
        const results  = requires.map( require => {
            return isLink( require ) ? this.parseLink( require ) : require
        } )

        delete doclet.requires

        return results
    }

    parseAuthors ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const authors = doclet.author || []
        const results = authors.map( author => {
            return isLink( author ) ? this.parseLink( author ) : author
        } )

        delete doclet.author

        return results

    }

    parseReturns ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const returns = doclet.returns || []
        const results = returns.map( ret => this.parseType( ret.type ) ).flat()

        delete doclet.returns

        return results

    }

    parseExceptions ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const exceptions = doclet.exceptions || []
        const results    = []

        for ( let exception of exceptions ) {
            results.push( {
                type:        this.parseType( exception.type ),
                description: exception.description
            } )
        }

        delete doclet.exceptions

        return results

    }

    parseSource ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const meta   = doclet.meta || {}
        const source = {
            path:         meta.path || '',
            filename:     meta.filename || '',
            lineNumber:   meta.lineno || 0,
            columnNumber: meta.columnno || 0
        }

        delete doclet.meta

        return source

    }

    parseKind ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.kind
        delete doclet.kind

        return result

    }

    parseScope ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.scope
        delete doclet.scope

        return result

    }

    parseYields ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.yields
        delete doclet.yields

        return result

    }

    parseAlias ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.alias
        delete doclet.alias

        return result

    }

    parseExtends ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        let result

        if ( doclet.augments ) {
            result = doclet.augments
            delete doclet.augments
        }

        if ( doclet.extends ) {
            if ( result ) {
                logger.warn( `Duplicate extends in ${ this._currentDocletPath }` )
            }
            result = doclet.extends
            delete doclet.extends
        }

        return result

    }

    parseDescription ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        let result

        if ( doclet.description ) {
            result = doclet.description
            delete doclet.description
        }

        if ( doclet.classdesc ) {
            if ( result ) {
                logger.warn( `Duplicate description in ${ this._currentDocletPath }` )
            }
            result = doclet.classdesc
            delete doclet.classdesc
        }

        return result

    }

    parseFiles ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.files
        delete doclet.files

        return result

    }

    parseMemberOf ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.memberof
        delete doclet.memberof

        return result

    }

    parseName ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.name
        delete doclet.name

        return result

    }

    parseOverrides ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.overrides
        delete doclet.overrides

        return result

    }

    parsePreserveName ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.preserveName
        delete doclet.preserveName

        return result

    }

    parseProperties ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.properties
        delete doclet.properties

        return result

    }

    // Flags
    parseAbstract ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        let result

        if ( doclet.abstract ) {
            result = doclet.abstract
            delete doclet.abstract
        }

        if ( doclet.virtual ) {
            if ( result ) {
                logger.warn( `Duplicate abstraction in ${ this._currentDocletPath }` )
            }
            result = doclet.virtual
            delete doclet.virtual
        }

        return result

    }

    parseAsync ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.async
        delete doclet.async

        return result

    }

    parseAccess ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.access
        delete doclet.access

        return result

    }

    parseConstant ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.constant
        delete doclet.constant

        return result

    }

    parseReadOnly ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.readonly
        delete doclet.readonly

        return result

    }

    parseDefaultValue ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.defaultvalue
        delete doclet.defaultvalue

        return result

    }

    parseGenerator ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.generator
        delete doclet.generator

        return result

    }

    parseInherited ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = doclet.inherited
        delete doclet.inherited

        return result

    }

    parseInherits ( doclet ) {
        if ( isNotDefined( doclet ) ) { return null }

        const result = ( doclet.inherits ) ? [ doclet.inherits ] : undefined
        delete doclet.inherits

        return result

    }

    /////

    assignConstants () {

        const constants = this._datas[ 'constant' ]
        if ( !constants ) { return }

        for ( const constant of constants.values() ) {

            const parentName = constant.memberOf
            if ( isDefined( parentName ) ) {

                this._assignToParent( parentName, 'constants', constant )

            } else if ( constant.scope === 'global' ) {

                this._assignToGlobal( 'constants', constant )

            } else {

                logger.warn( `Unable to bind constant [${ constant.name }] from ${ this._currentDocletPath } to ${ parentName }. ${ parentName } is not defined !` )

            }

        }

    }

    assignMembers () {

        const members = this._datas[ 'member' ]
        if ( !members ) { return }

        for ( const member of members.values() ) {

            const parentName = member.memberOf
            if ( isDefined( parentName ) ) {

                this._assignToParent( parentName, 'members', member )

            } else if ( member.scope === 'global' ) {

                this._assignToGlobal( 'members', member )

            } else {

                logger.warn( `Unable to bind member [${ member.name }] to ${ parentName }. ${ parentName } is not defined !` )

            }

        }

    }

    assignFunctions () {

        const functions = this._datas[ 'function' ]
        if ( !functions ) { return }

        for ( const method of functions.values() ) {

            const parentName = method.memberOf
            if ( isDefined( parentName ) ) {

                this._assignToParent( parentName, 'methods', method )

            } else if ( method.scope === 'global' ) {

                this._assignToGlobal( 'methods', method )

            } else {

                logger.warn( `Unable to bind method [${ method.name }] to ${ parentName }. ${ parentName } is not defined !` )

            }

        }

    }

    _assignToParent ( parentName, propertyListName, data ) {

        const parentUuid = this._datas.longNameToUuid.get( parentName )
        if ( isNotDefined( parentUuid ) ) {
            logger.warn( `Unable to bind [${ data.name }] from ${ this._currentDocletPath } to ${ parentName }. Parent uuid is not defined !` )
            return
        }

        const parent = this._datas.indexes.get( parentUuid )
        if ( isNotDefined( parent ) ) {
            logger.warn( `Unable to bind [${ data.name }] from ${ this._currentDocletPath } to ${ parentName }. Parent with uuid ${ parentUuid } is not defined !` )
            return
        }

        if ( isNotDefined( parent[ propertyListName ] ) ) {
            parent[ propertyListName ] = []
        }

        parent[ propertyListName ].push( data )

    }

    _assignToGlobal ( propertyListName, data ) {

        this._createGlobalMapIfNotExist()

        const parent = this._datas[ 'global' ].get( this._globalUuid )
        if ( isNotDefined( parent[ propertyListName ] ) ) {
            parent[ propertyListName ] = []
        }

        parent[ propertyListName ].push( data )

    }

    _createGlobalMapIfNotExist () {

        if ( isDefined( this._datas[ 'global' ] ) ) { return }

        this._datas[ 'global' ] = new Map()
        this._datas[ 'global' ].set( this._globalUuid, {
            uuid:     this._globalUuid,
            fileName: 'globals.html'
        } )

    }

}

module.exports = Parser
