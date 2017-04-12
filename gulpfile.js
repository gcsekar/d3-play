var _	  = require("lodash");
var chalk = require("chalk");
var gulp = require("gulp");
var color = require("gulp-color");
var connect = require("gulp-connect");
var run = require('gulp-run');
var logger = console.log;
var errored = chalk.bgRed;
var warned = chalk.bgYellow;
var succeeded = chalk.bgGreen;
var head = chalk.inverse;
var normal = chalk.bgBlue;
/* 
 * Gulp Declarations
 */
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var environments = require("gulp-environments");
var rename = require("gulp-rename");	
var cssmin = require("gulp-cssmin");

var development = environments.development;
var production = environments.production;

var environment = production() ? "public/production" : "public/staging";
var _port = production() ? 80 : 8080;
/*
 * Vendor Compoenents & Styles
 */
var js = [
    './node_modules/bootstrap/dist/js/bootstrap.js',
    './node_modules/jquery/dist/jquery.js',
    './node_modules/jquery/dist/jquery.js'
];
var css = [
    './node_modules/bootstrap/dist/css/bootstrap.css',
    './node_modules/font-awesome/css/font-awesome.css'
];
var fonts = [
    './node_modules/bootstrap/dist/fonts/*.*',
    './node_modules/font-awesome/fonts/*.*',    
];

/***************************
 * Gulp Tasks
 **************************/

gulp.task("default",['environment','scripts','css','html','watch','server'],function(){
//	run('watch');
	console.log(environment);
});

gulp.task('html', function(){
	return gulp.src("*.html")
		.pipe(gulp.dest(environment))
		.pipe(connect.reload());
});

gulp.task('scripts',['vendor-scripts'], function(){
	
		return gulp.src("resources/js/**/*.js")
				.pipe(concat("app.js"))
				.pipe(production(rename({suffix:".min"})))
				.pipe(production(uglify()))
				.pipe(gulp.dest(environment + '/resources/js'))
				.pipe(connect.reload());
		
});

gulp.task('vendor-scripts', function(){
	
    _.forEach(js, function (file, _) {
        gulp.src(file)
			.pipe(production(rename({suffix:".min"})))
			.pipe(production(uglify()))
			.pipe(gulp.dest(environment + '/resources/vendor/js'))
    });
 
});

gulp.task('vendor-styles',['vendor-fonts'], function(){
    _.forEach(css, function (file, _) {
        gulp.src(file)
			.pipe(production(cssmin()))
			.pipe(production(rename({suffix : ".min"})))
			.pipe(gulp.dest(environment + '/resources/vendor/css'))
    });
});

gulp.task('vendor-fonts', function(){
    _.forEach(fonts, function (file, _) {
        gulp.src(file)
			.pipe(gulp.dest(environment + '/resources/vendor/fonts'))
    });
});


gulp.task('css', ['vendor-styles'],function(){
	return gulp.src("resources/css/*.css")
			.pipe(production(cssmin()))
			.pipe(production(rename({suffix : ".min"})))
			.pipe(gulp.dest(environment+'/resources/css'))
});

gulp.task('data', function(){
	return gulp.src("resources/data/*.*")
			.pipe(gulp.dest(environment+'/resources/data'));
});

gulp.task('images', function(){
	return gulp.src("resources/images/*.*")
			.pipe(gulp.dest(environment+'/resources/images'));
});

gulp.task('vendor', function(){
	return gulp.src("vendor/**/*.*")
			.pipe(gulp.dest(environment+'/vendor'));
});

gulp.task('environment', function(){
	header("This is a " + environment + " build ... ");
})

gulp.task('server', function(){
	connect.server({
		root:environment,
		livereload: development() ? true : false,
		port: _port
		
	});
});

gulp.task('reload', function(){
	connect.reload();
});
gulp.task('watch', function(){
	gulp.watch(['./resources/js/**/*.js'], ['scripts']);
	gulp.watch(['**/*.html'], ['html']);	
});
/***************************
 * Custom Functions
 **************************/


function header(message){
	logger(chalk.inverse(message));
}

function success(message){
	logger(succeeded(message));
}

function warn(message){
	logger(warned(message));
}

function fail(message){
	logger(errored(message));
}

function header(message){
	logger(head(message));
}

function log(message){
	logger(normal(message));
}


