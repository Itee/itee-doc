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

        // Compute Modules list


        // Compute Classes list
        const classDropdown = {
            type:  'dropdown',
            title: 'Classes',
            items: []
        }
        nav.items.push( classDropdown )

        datas.classes.forEach( ( classValue, classKey ) => {

            classDropdown.items.push( {
                type:  'item',
                href:  classValue.destination.fileName,
                label: classKey
            } )

        } )


        // Compute Externals list
        // Compute Globals list
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

    renderPage ( props, children = [] ) {

        // Throws : FATAL: Unable to load template: Unexpected token '<'
        //    const html = ReactDOMServer.renderToStaticMarkup(<LoremIpsum name="Yougourt" />)
        const html = ReactDOMServer.renderToStaticMarkup(
            React.createElement( Page, props, children )
        )
        return `<!DOCTYPE html>${ html }`

    }

    renderClasses ( pageProps, classes, outputPath ) {

        for ( const classData of classes ) {

            // Avoid jsdoc warning on render even if there is only one rendered class per file
            classData.key = classData.uuid

            const fileName = classData.destination.fileName
            const filePath = path.join( outputPath, fileName )
            const pageHtml = this.renderPage( pageProps, [
                React.createElement( Class, classData )
            ] )

            fs.writeFileSync( filePath, pageHtml )

        }

    }

    render ( datas, options ) {

        const outputPath    = options.destination
        const templateDatas = this.computeTemplateDatas( datas )

        this.outputStaticFiles( outputPath )
        this.renderClasses( templateDatas, datas.classes.values(), outputPath )

    }

}

module.exports = Renderer
