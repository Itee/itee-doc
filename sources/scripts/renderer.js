const path                                  = require( 'path' )
const fs                                    = require( 'fs' )
const { getFilesInDirectory, isNotDefined } = require( './utils' )
const logger                                = require( '../../node_modules/jsdoc/lib/jsdoc/util/logger.js' )

const React          = require( 'react' )
const ReactDOMServer = require( 'react-dom/server' )
const Page           = require( '../components/Page' )
const Index          = require( '../components/Index' )
const Class          = require( '../components/Class/Class' )
const Package        = require( '../components/Packages/Package' )
const LoremIpsum     = require( '../components/Others/LoremIpsum' )

/**
 * @class
 * @classdesc This renderer allow to to render React POJO descriptor into static html files
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 */
class Renderer {

    constructor ( options = {} ) {

        this.options = options

        this.availableCategories = [
            {
                key:       'class',
                label:     'Classes',
                component: Class
            },
            {
                key:       'external',
                label:     'Externals',
                component: Class
            },
            {
                key:       'file',
                label:     'Files',
                component: Class
            },
            {
                key:       'global',
                label:     'Globals',
                component: Class
            },
            {
                key:       'interface',
                label:     'Interfaces',
                component: Class
            },
            {
                key:       'mixin',
                label:     'Mixins',
                component: Class
            },
            {
                key:       'module',
                label:     'Modules',
                component: Class
            },
            {
                key:       'namespace',
                label:     'Namespaces',
                component: Class
            },
            {
                key:       'package',
                label:     'Packages',
                component: Package
            }
        ]


    }

    computeTemplateDatas ( datas ) {


        ////////////////////////////////////////

        const navbar = {
            bg:      'dark',
            variant: 'dark',
            items:   []
        }

        const navbarBrand = {
            type:  'brand',
            link:  'index.html',
            label: 'Itee-Doc'
        }
        navbar.items.push( navbarBrand )

        const nav = {
            type:  'nav',
            align: 'left',
            items: []
        }
        navbar.items.push( nav )

        // Compute main categories list
        for ( let availableCategory of this.availableCategories ) {

            const categoryDropdown = this.computeCategoryList( availableCategory.label, datas[ availableCategory.key ] )
            if ( categoryDropdown ) { nav.items.push( categoryDropdown ) }

        }

        // Compute Tutorials list
        // Compute Graphics list

        return {
            navbar:  navbar,
            content: {},
            footer:  {
                bg:      'dark',
                variant: 'dark',
                sticky:  true
            }
        }

    }

    computeCategoryList ( label, datas ) {
        if ( !datas ) { return }

        const categoryDropdown = {
            type:  'dropdown',
            title: label,
            items: []
        }

        datas.forEach( ( value, key ) => {

            categoryDropdown.items.push( {
                type:  'item',
                href:  value.destination.fileName,
                label: key
            } )

        } )

        return categoryDropdown

    }

    outputStaticFiles ( outputPath ) {

        try {

            // Todo: finaly will be only __dirname/statics after bundling !
            const inputDirectory  = path.join( __dirname, '../..', 'builds', 'statics' )
            const outputDirectory = path.resolve( outputPath )
            const files           = getFilesInDirectory( inputDirectory )
            for ( let inputFilePath of files ) {

                const relativeOutputFilePath  = inputFilePath.replace( inputDirectory, '' )
                const relativeOutputDirectory = path.dirname( relativeOutputFilePath )
                const finalOutputDirectory    = path.join( outputDirectory, relativeOutputDirectory )

                const directoryExist = fs.existsSync( finalOutputDirectory )
                if ( !directoryExist ) {

                    const success = fs.mkdirSync( finalOutputDirectory, { recursive: true } )
                    if ( isNotDefined( success ) ) {
                        logger.error( `Unable to create directory structure: ${ finalOutputDirectory }` )
                        continue
                    }

                }

                const fileName       = path.basename( inputFilePath )
                const outputFilePath = path.join( finalOutputDirectory, fileName )
                fs.copyFileSync( inputFilePath, outputFilePath )
                logger.info( `Copying static file ${ inputFilePath } to ${ outputFilePath }` )

            }

            // Todo: user specified files

        } catch ( error ) {
            logger.error( error )
        }

    }

    render ( datas, options ) {

        const outputPath    = options.destination
        const templateDatas = this.computeTemplateDatas( datas )

        this.outputStaticFiles( outputPath )
        this.renderIndex( templateDatas, {
            indexOpt: 'This is the index'
        }, outputPath )

        for ( let availableCategory of this.availableCategories ) {

            const dataMap = datas[ availableCategory.key ]
            if ( dataMap ) {
                this.renderCategory( templateDatas, availableCategory.component, dataMap.values(), outputPath )
            }

        }

    }

    renderIndex ( pageProps, indexData, outputPath ) {

        const pageHtml = this.renderPage( pageProps, [
            React.createElement( Index, indexData )
        ] )

        const filePath = path.join( outputPath, 'index.html' )
        fs.writeFileSync( filePath, pageHtml )

    }

    renderCategory ( pageProps, Component, datas, outputPath ) {

        for ( const data of datas ) {

            // Avoid jsdoc warning on render even if there is only one rendered class per file
            data.key = data.uuid

            const fileName = data.destination.fileName
            const filePath = path.join( outputPath, fileName )
            const pageHtml = this.renderPage( pageProps, [
                React.createElement( Component, data )
            ] )

            fs.writeFileSync( filePath, pageHtml )

        }

    }

    renderPage ( props, children = [] ) {

        // Throws : FATAL: Unable to load template: Unexpected token '<'
        //    const html = ReactDOMServer.renderToStaticMarkup(<LoremIpsum name="Yougourt" />)
        const html = ReactDOMServer.renderToStaticMarkup(
            React.createElement( Page, props, children )
        )
        return `<!DOCTYPE html>${ html }`

    }

}

module.exports = Renderer
