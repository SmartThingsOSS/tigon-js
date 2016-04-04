import webpackConfig from './webpack.config';

const KARMA_ENTRY_FILE = './webpack/tests.webpack.js';

function makeDefaultConfig(config) {
	return {
		// web server port
		port: 9876,
		// enable / disable colors in the output (reporters and logs)
		colors: true,
		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,
		// report which specs are slower than 500ms
		reportSlowerThan: 500,
		files: [KARMA_ENTRY_FILE],
		singleRun: true,
		frameworks: ['mocha', 'sinon-chai', 'chai'],
		preprocessors: {
			[KARMA_ENTRY_FILE]: ['webpack', 'sourcemap']
		},
		reporters: ['junit', 'progress', 'coverage'],
		browsers: ['Chrome'],
		webpack: {
			devtool: 'inline-source-map',
			resolve: webpackConfig.resolve,
			plugins: webpackConfig.plugins.filter(plugin => !plugin.__KARMA_IGNORE__),
			module: {
				loaders: webpackConfig.module.loaders
			}
		},
		webpackMiddleware: {
			noInfo: true
		},
		junitReporter: {
			outputDir: 'build/test/junit',
			suite: '',
			useBrowserName: true
		},
		coverageReporter: {
			type : 'cobertura',
			dir : 'build/coverage/',
			subdir: '.',
			file: 'cobertura.xml'
		},
		plugins: [
			'karma-webpack',
			'karma-mocha',
			'karma-chai',
			'karma-sinon-chai',
			'karma-coverage',
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-junit-reporter',
			'karma-sourcemap-loader'
		]
	};
}

export default (karmaConfig) => {
	karmaConfig.set(makeDefaultConfig(karmaConfig));
}
