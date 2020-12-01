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

        /**
         * An array containing used file names to check collision and allow to generate some alternatives
         * @type {Array<String>}
         * @private
         */
        this._usedFileNames = []

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

    /**
     *
     * @param longName
     * @returns {String}
     */
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

    /**
     * @param taffyData
     * @returns {Object}
     */
    parse ( taffyData ) {

        taffyData().each( ( doclet ) => {

            this.parseDoclet( doclet )

        } )

        this.assignConstants()
        this.assignMembers()
        this.assignFunctions()

        return this._datas

    }

    parseDoclet ( doclet ) {

        delete doclet.___s
        delete doclet.comment

        const uuid = doclet.___id
        delete doclet.___id
        if ( this._datas.indexes.has( uuid ) ) {
            logger.warn( `Id collision on "${ doclet.longname }" in ${ doclet.meta.path }\\${ doclet.meta.filename }. Ignoring doclet !` )
            return
        }

        const longName = doclet.longname
        delete doclet.longname
        if ( this._datas.longNameToUuid.has( longName ) ) {
            logger.warn( `Long name collision on "${ longName }" in ${ doclet.meta.path }\\${ doclet.meta.filename }. Ignoring doclet !` )
            return
        }

        const sources = this.parseMeta( doclet.meta )
        delete doclet.meta

        const destination = {
            fileName: this.getUniqueFilename( longName )
        }
        const docletKind  = doclet.kind
        delete doclet.kind
        const commonDocletProperties = {
            uuid:        uuid,
            longName:    longName,
            sources:     sources,
            destination: destination,
            kind:        docletKind
        }

        let parsedDoclet = {
            abstract:     doclet.abstract,
            access:       doclet.access,
            alias:        doclet.alias,
            async:        doclet.async,
            augments:     doclet.augments,
            authors:      this.parseAuthors( doclet.author ),
            contant:      doclet.contant,
            defaultValue: doclet.defaultvalue,
            description:  doclet.description || doclet.classdesc,
            examples:     this.parseExamples( doclet.examples ),
            exceptions:   this.parseExceptions( doclet.exceptions ),
            files:        doclet.files,
            generator:    doclet.generator,
            inherited:    doclet.inherited,
            inherits:     ( doclet.inherits ) ? [ doclet.inherits ] : undefined,
            licenses:     this.parseLicense( doclet.license ),
            memberOf:     doclet.memberof,
            name:         doclet.name,
            overrides:    doclet.overrides,
            parameters:   this.parseParameters( doclet.params ),
            preserveName: doclet.preserveName,
            properties:   doclet.properties,
            readOnly:     doclet.readonly,
            requires:     this.parseRequires( doclet.requires ),
            returns:      this.parseReturns( doclet.returns ),
            scope:        doclet.scope,
            sees:         this.parseSee( doclet.see ),
            type:         this.parseType( doclet.type ),
            virtual:      doclet.virtual,
            yields:       doclet.yields
        }

        delete doclet.abstract
        delete doclet.access
        delete doclet.alias
        delete doclet.async
        delete doclet.augments
        delete doclet.author
        delete doclet.contant
        delete doclet.defaultvalue
        delete doclet.classdesc
        delete doclet.description
        delete doclet.examples
        delete doclet.exceptions
        delete doclet.files
        delete doclet.generator
        delete doclet.inherited
        delete doclet.inherits
        delete doclet.license
        delete doclet.memberof
        delete doclet.name
        delete doclet.overrides
        delete doclet.params
        delete doclet.preserveName
        delete doclet.properties
        delete doclet.readonly
        delete doclet.requires
        delete doclet.returns
        delete doclet.scope
        delete doclet.see
        delete doclet.type
        delete doclet.virtual
        delete doclet.yields

        /*
                // @formatter:off
                switch ( docletKind ) {
                    case 'class':     parsedDoclet = this.parseClass( doclet );     break
                    case 'constant':  parsedDoclet = this.parseConstant( doclet );  break
                    case 'external':  parsedDoclet = this.parseExternal( doclet );  break
                    case 'file':      parsedDoclet = this.parseFile( doclet );      break
                    case 'function':  parsedDoclet = this.parseFunction( doclet );  break
                    case 'global':    parsedDoclet = this.parseGlobal( doclet );    break
                    case 'interface': parsedDoclet = this.parseInterface( doclet ); break
                    case 'member':    parsedDoclet = this.parseMember( doclet );    break
                    case 'mixin':     parsedDoclet = this.parseMixin( doclet );     break
                    case 'module':    parsedDoclet = this.parseModule( doclet );    break
                    case 'namespace': parsedDoclet = this.parseNamespace( doclet ); break
                    case 'package':   parsedDoclet = this.parsePackage( doclet );   break
                    case 'typedef':   parsedDoclet = this.parseTypeDef( doclet );   break
                    default: throw new RangeError( `Invalid doclet kind: ${ docletKind }` )
                }
        */
        // @formatter:on

        // Debug unprocessed doclet properties
        for ( let property in doclet ) {
            logger.warn( `Unprocessed doclet property ${ property }` )
        }

        // Merge common and specific
        const docletDatas = {
            ...commonDocletProperties,
            ...parsedDoclet
        }

        // Keep reference of doclet
        // Create entry in data if not already exist
        if ( !this._datas[ docletKind ] ) {
            this._datas[ docletKind ] = new Map()
        }
        this._datas[ docletKind ].set( longName, docletDatas )
        this._datas.indexes.set( uuid, docletDatas )
        this._datas.longNameToUuid.set( longName, uuid )

    }

    parseModule ( doclet ) {

        const result = {
            name:         doclet.name,
            description:  doclet.description,
            preserveName: doclet.preserveName,
            authors:      this.parseAuthors( doclet.author ),
            requires:     this.parseRequires( doclet.requires ),
            licenses:     this.parseLicense( doclet.license )
        }

        delete doclet.name
        delete doclet.description
        delete doclet.preserveName
        delete doclet.author
        delete doclet.requires
        delete doclet.license

        return result
    }

    parseClass ( doclet ) {

        //                type:        this.parseType( doclet.type ),
        //                name:        doclet.name,
        //                description: doclet.description || doclet.classdesc,
        //                scope:       doclet.scope,
        //                readOnly:    doclet.readonly,
        //                access:      doclet.access,
        //                virtual:     doclet.virtual,
        //                contant:     doclet.contant,
        //                abstract:    doclet.abstract,
        //                inner:       doclet.inner,
        //                private:     doclet.private,
        //                generator:   doclet.generator,
        //                async:       doclet.async,
        //                        augments:    doclet.augments,
        //                memberOf:    doclet.memberof,
        //                inherited:   doclet.inherited,
        //                inherits:    doclet.inherits,
        //                members:     doclet.members || [],
        //                sees:        this.parseSee( doclet.see ),
        //                examples:    this.parseExamples( doclet.example ),
        //                licenses:    this.parseLicense( doclet.license ),
        //                requires:    this.parseRequires( doclet.requires ),
        //                parameters:  this.parseParameters( doclet.params ),
        //                exceptions:  this.parseExceptions( doclet.exceptions ),
        //                authors:     this.parseAuthors( doclet.author ),
        //                returns:     this.parseReturns( doclet.returns )

        const result = {
            alias:       doclet.alias,
            augments:    doclet.augments,
            description: doclet.description || doclet.classdesc,
            name:        doclet.name,
            memberOf:    doclet.memberof,
            parameters:  this.parseParameters( doclet.params ),
            scope:       doclet.scope
        }

        delete doclet.alias
        delete doclet.augments
        delete doclet.classdesc
        delete doclet.description
        delete doclet.name
        delete doclet.memberof
        delete doclet.params
        delete doclet.scope

        return result

    }

    parseMember ( doclet ) {

        const result = {
            defaultValue: doclet.defaultvalue,
            description:  doclet.description,
            examples:     this.parseExamples( doclet.examples ),
            memberOf:     doclet.memberof,
            name:         doclet.name,
            parameters:   this.parseParameters( doclet.params ),
            returns:      this.parseReturns( doclet.returns ),
            scope:        doclet.scope,
            see:          this.parseSee( doclet.see ),
            type:         this.parseType( doclet.type )
        }

        delete doclet.defaultvalue
        delete doclet.description
        delete doclet.examples
        delete doclet.memberof
        delete doclet.name
        delete doclet.params
        delete doclet.returns
        delete doclet.scope
        delete doclet.see
        delete doclet.type

        return result

    }

    parseTypeDef ( /*doclet*/ ) {

        return {}

    }

    parseFile ( /*doclet*/ ) {

        return {}

    }

    parseNamespace ( /*doclet*/ ) {

        return {}

    }

    parseMixin ( /*doclet*/ ) {

        return {}

    }

    parseInterface ( /*doclet*/ ) {

        return {}

    }

    parseGlobal ( /*doclet*/ ) {

        return {}

    }

    parsePackage ( doclet ) {

        return {
            files: doclet.files
        }

    }

    parseExternal ( /*doclet*/ ) {

        return {}

    }

    parseConstant ( doclet ) {

        const result = {
            description: doclet.description,
            name:        doclet.name,
            scope:       doclet.scope,
            parameters:  this.parseParameters( doclet.params ),
            type:        this.parseType( doclet.type )
        }

        delete doclet.description
        delete doclet.name
        delete doclet.scope
        delete doclet.params
        delete doclet.type

        return result
    }

    parseFunction ( doclet ) {

        const result = {
            name:        doclet.name,
            description: doclet.description,
            parameters:  this.parseParameters( doclet.params ),
            see:         this.parseSee( doclet.see ),
            returns:     this.parseReturns( doclet.returns ),
            memberOf:    doclet.memberof,
            scope:       doclet.scope,
            overrides:   doclet.overrides
        }

        delete doclet.name
        delete doclet.description
        delete doclet.params
        delete doclet.see
        delete doclet.memberof
        delete doclet.returns
        delete doclet.scope
        delete doclet.overrides

        return result

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

    parseLicense ( license ) {

        if ( isNotDefined( license ) ) { return }

        let result
        if ( isLink( license ) ) {
            result = this.parseLink( license )
        } else {
            result = license
        }

        return [ result ]
    }

    /**
     * Parse a doclet type and return an array of type as string
     * @param {Object} [type={}] The type to parse
     * @returns {Array<String>}
     */
    parseType ( type = {} ) {
        let result = []

        if ( isDefined( type.names ) ) {
            result = type.names
        } else if ( isDefined( type.parsedType ) && type.parsedType.name ) {
            result = [ type.parsedType.name ]
        } else if ( isDefined( type.parsedType ) && type.parsedType.elements ) {
            result = type.parsedType.elements.map( element => element.name )
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

            if ( parameterName && parameterName.includes( '.' ) ) {

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

    parseReturns ( returns = [] ) {

        return returns.map( ret => this.parseType( ret.type ) ).flat()

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

        const source = [ {
            path:         meta.path || '',
            filename:     meta.filename || '',
            lineNumber:   meta.lineno || 0,
            columnNumber: meta.columnno || 0
        } ]

        return source
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

                logger.warn( `Unable to bind constant [${ constant.name }] to ${ parentName }. ${ parentName } is not defined !` )

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
            logger.warn( `Unable to bind [${ data.name }] to ${ parentName }. Parent uuid is not defined !` )
            return
        }

        const parent = this._datas.indexes.get( parentUuid )
        if ( isNotDefined( parent ) ) {
            logger.warn( `Unable to bind [${ data.name }] to ${ parentName }. Parent with uuid ${ parentUuid } is not defined !` )
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
            uuid:        this._globalUuid,
            destination: {
                fileName: 'globals.html'
            }
        } )

    }

}

module.exports = Parser
