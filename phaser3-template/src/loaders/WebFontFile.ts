// import WebFont = require("webfontloader")

// export default class WebFontFile extends Phaser.Loader.File {
    
//     /**
//      * @param {Phaser.Loader.LoaderPlugin} loader
//      * @param {string | string[]} fontNames
//      * @param {string} [service]
//      */
//     constructor(loader, fontNames, service = 'google') {
//         super(loader, {
//             type: 'webfont',
//             key: fontNames.toString()
//         })

//         this.config.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames]
//         this.config.service = service
//     }

//     load() {
//         const config = {
//             active: () => {
//                 this.loader.nextFile(this, true)
//             }
//         }

//         switch (this.config.service) {
//             case 'google':
//                 config['google'] = {
//                     families: this.config.fontNames
//                 }
//                 break

//             default:
//                 throw new Error('Unsupported font service')
//         }
        
//         WebFont.load(config)
//     }

// }

/*
using example

preloader() {
    ...
    // Load the Google WebFont Loader script
    this.load.addFile(new WebFontFile(this.load, [
        'Press Start 2P',
        'DynaPuff'
    ]));
}

*/