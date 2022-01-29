const autoPrefixer = require("gulp-autoprefixer");
let { src, dest } = require("gulp"),
gulp = require("gulp"),
browsersync = require("browser-sync").create(),
fileinclude = require("gulp-file-include"),
scss = require("gulp-sass")(require("sass")),
// scss = require('gulp-sass'),
gcmq = require("gulp-group-css-media-queries"),
svgSprite = require("gulp-svg-sprite"),
autoprefixer = require("gulp-autoprefixer");
// const Fiber = require('fibers');


// scss.compiler = require('sass')

let dist = "dist",
  app = "app";

let path = {
  build: {
    html: dist + "/",
    css: dist + "/css/",
    js: dist + "/js/",
    images: dist + "/images/",
    popups: dist + "/popups/",
    // fonts: dist + "/fonts/"
  },
  src: {
    html: app + "/*.html",
    css: app + "/css/*.scss",
    js: app + "/js/*.js",
    images: app + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
    popups: app + "/popups/*.html",
    // fonts: app + "/fonts/*.ttf"
  },
  watch: {
    html: app + "/**/*.html",
    css: app + "/css/**/*.scss",
    js: app + "/js/**/*.js",
    images: app + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
    popups: app + "/popups/*.html",
  },
  clean: "./" + dist + "/",
};



function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + dist + "/",
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded",
      })
    )
    .pipe(
      autoprefixer({
        cascade: true,
        overrideBrowserslist: ["last 5 version"],
      })
    )
    .pipe(gcmq())
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function images() {
  return src(path.src.images)
    .pipe(dest(path.build.images))
    .pipe(browsersync.stream());
}
function popups() {
  return src(path.src.popups)
    .pipe(fileinclude())
    .pipe(dest(path.build.popups))
    .pipe(browsersync.stream());
}

gulp.task("svgSprite", function () {
  return gulp
    .src([dist + "/iconsprite/*.svg"])
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../icons/icons.svg",
            example: true,
          },
        },
      })
    )
    .pipe(dest(path.build.images));
});

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.popups], popups);
}

let build = gulp.series(gulp.parallel(js, css, html, images, popups));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
exports.popups = popups;
