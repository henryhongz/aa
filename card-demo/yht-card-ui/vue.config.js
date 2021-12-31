const path = require('path')
const resolve = dir => path.join(__dirname, dir)

const vueConfig = {
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
    },
    devServer: {
        port: 9999,
        proxy: {
            '/api': {
                target: 'http://121.43.40.223:8182',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/remote-api': {
                target: 'http://121.43.40.223:9292',
                changeOrigin: true,
                pathRewrite: {
                    '^/remote-api': ''
                }
            },
            '/tdt-api': {
                target: 'http://mock.xtspace.cn/mock/607e32a7044fe12694c833cc/ninghai',
                changeOrigin: true
            },
            '/formal': {
                target: 'http://47.118.53.118:9998',
                changeOrigin: true,
                pathRewrite: {
                    '^/formal': '/'
                }
            },
            '/geo-api': {
                target: 'https://geo.datav.aliyun.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/geo-api': '/'
                }
            },
        }
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [path.resolve(__dirname, 'src/styles/index.less')] // 引入全局样式变量
        },
        electronBuilder: {
            builderOptions: {
                'productName': 'yht-card',
                'appId': '**',
                // 'directories': {
                //   'output': 'build'
                // },
                // 'icon': './public/logo.ico',
                'publish': [
                    {
                        'provider': 'generic',
                        'url': 'http://121.43.40.223/yht-card/'
                    }
                ],
                // 'files': [
                //   'dist/electron/**/*'
                // ],
                'nsis': {
                    'oneClick': false,
                    'perMachine': true,
                    'allowElevation': true,
                    'allowToChangeInstallationDirectory': true,
                    'createDesktopShortcut': true,
                    'runAfterFinish': true,
                    // 'installerIcon': './public/logo.ico',
                    // 'uninstallerIcon': './public/logo.ico'
                },
                'dmg': {
                    'contents': [
                        {
                            'x': 410,
                            'y': 150,
                            'type': 'link',
                            'path': '/Applications'
                        },
                        {
                            'x': 130,
                            'y': 150,
                            'type': 'file'
                        }
                    ]
                },
                'win': {
                    'icon': './public/logo.ico',
                    // eslint-disable-next-line no-template-curly-in-string
                    'artifactName': '${productName}_setup_${version}.${ext}'
                },
                // 'mac': {
                //   'icon': 'build/icons/icon.icns',
                //   // eslint-disable-next-line no-template-curly-in-string
                //   'artifactName': '${productName}_setup_${version}.${ext}'
                // },
                // 'linux': {
                //   'icon': 'build/icons',
                //   // eslint-disable-next-line no-template-curly-in-string
                //   'artifactName': '${productName}_setup_${version}.${ext}'
                // },
                extends: null
            }
        }
    }
}

module.exports = vueConfig
