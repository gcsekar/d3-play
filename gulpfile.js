var _	  = require("lodash");
var chalk = require("chalk");
var gulp = require("gulp");
var color = require("gulp-color");
var connect = require("gulp-connect");
var htmlbuild = require("gulp-htmlbuild");
var run = require("gulp-run");
var logger = console.log;
var errored = chalk.red;
var warned = chalk.yellow;
var succeeded = chalk.green;
var head = chalk.inverse;
var normal = chalk.blue;
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

var environment = production() ? "production" : "staging";
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
	success("Build succeeded !!");
});

gulp.task('html', function(){
	warn("Staring Index.html files !!");	
	return gulp.src("index.html")
		.pipe(development(htmlbuild({
			js:htmlbuild.preprocess.js(function(block){
				warn("Starting " + environment + " index.html files !!");
				block.write('/resources/js/app.js')
				success("Completed " + environment + " index.html files !!");
				block.end()
			}),
			css:htmlbuild.preprocess.css(function(block){
				warn("Staring " + environment + " style.css files !!");
				block.write('/resources/css/styles.css')
				success("Completed " + environment + " style.css files !!");
				block.end()
			})			
		})))
		.pipe(production(htmlbuild({
			js:htmlbuild.preprocess.js(function(block){
				warn("Staring " + environment + " index.html files !!");
				block.write('/resources/js/app.min.js')
				success("Completed " + environment + " index.html files !!");
				block.end()
			}),
			css:htmlbuild.preprocess.css(function(block){
				warn("Staring " + environment + " style.min.css files !!");
				block.write('/resources/css/styles.min.css')
				success("Completed " + environment + " style.min.css files !!");
				block.end()
			})			
		})))
		.pipe(gulp.dest('public/' + environment))
		.pipe(connect.reload());
});

gulp.task('scripts',['vendor-scripts'], function(){
		warn("Processing Application Scripts !!")
		return gulp.src(["resources/js/**/*.js","resources/vendor/js/**/*.js"])
				.pipe(concat("app.js"))
				.pipe(production(rename({suffix:".min"})))
				.pipe(production(uglify()))
				.pipe(gulp.dest('public/' + environment + '/resources/js'))
				.pipe(connect.reload())		
});

gulp.task('vendor-scripts', function(){
	warn("Starting vendor scripts ...")
    _.forEach(js, function (file, _) {
        gulp.src(file)
			.pipe(production(rename({suffix:".min"})))
			.pipe(production(uglify()))
			.pipe(gulp.dest('/resources/vendor/js'))
    });
	success("Completed Vendor Scripts !!") 
});

gulp.task('vendor-styles',['vendor-fonts'], function(){
	warn("Starting vendor scripts ...")	
    _.forEach(css, function (file, _) {
        var a = gulp.src(file)
			.pipe(production(cssmin()))
			.pipe(production(rename({suffix : ".min"})))
			.pipe(gulp.dest('./resources/vendor/css'));

        a.on('data', function(chunk){
//	            var contents = chunk.contents.toString().trim(); 
//	            var bufLength = process.stdout.columns;
//	            var hr = '\n\n' + Array(bufLength).join("_") + '\n\n'
//	            if (contents.length > 1) {
//	                process.stdout.write(chunk.path + '\n' + contents + '\n');
//	                process.stdout.write(chunk.path + hr);
//	            }        	
	        });
    });
	success("Completed Vendor Styles !!")
});

gulp.task('vendor-fonts', function(){
	warn("Processing Vendor fonts ...");
    _.forEach(fonts, function (file, _) {
        gulp.src(file)
			.pipe(gulp.dest('public/'+environment + '/resources/fonts'))
    });
    success("Completed processing Vendor Fonts !!")
});


gulp.task('css', ['vendor-styles'],function(){
	warn("Processing App Styles !!");
	return gulp.src(['resources/vendor/css/**/*.css','resources/css/**/*.css'])
			.pipe(concat("styles.css"))
			.pipe(production(cssmin()))
			.pipe(production(rename({suffix : ".min"})))
			.pipe(gulp.dest('public/'+environment+'/resources/css/'))
});

gulp.task('data', function(){
	warn("Processing data !!");
	return gulp.src("resources/data/*.*")
			.pipe(gulp.dest('public/'+environment+'/resources/data'))
});

gulp.task('images', function(){
	warn("Processing images !!");
	return gulp.src("resources/images/*.*")
			.pipe(gulp.dest('public/'+environment+'/resources/images'))
});

gulp.task('vendor', function(){
	warn("Processing Vendor Assets !!");
	return gulp.src("vendor/**/*.*")
			.pipe(gulp.dest('public/'+environment+'/vendor'))
});

gulp.task('environment', function(){
	header("This is a build for " + environment + "... ");
})

gulp.task('server', function(){
	connect.server({
		root: 'public/' + environment,
		livereload: development() ? true : false,
		port: _port
	});
});

gulp.task('reload', function(){
	connect.reload();
});
gulp.task('watch', function(){
	warn("Starting watch processes ...")
	gulp.watch(['./resources/js/**/*.js'], ['scripts']);
	gulp.watch(['./resources/css/**/*.css'], ['css']);
	gulp.watch(['**/*.html'], ['html']);	
	success("Started watch processes ...")
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


