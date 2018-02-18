const gulp = require("gulp");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const cssnext = require("postcss-cssnext");
const normalize = require("postcss-normalize");
const postcssScss = require("postcss-scss");
const cssnano = require("cssnano");
const notify = require("gulp-notify");
const stripInlineComments = require("postcss-strip-inline-comments");
const postcssImport = require("postcss-import");
const browserSync = require("browser-sync").create();

function error(...args) {
  notify
    .onError({
      message: "<%= error.message %>"
    })
    .apply(this, args);
  this.emit("end");
}

// Static server
gulp.task("serve", ["css"], function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch("./src/styles/*.css", ["css"]);
  gulp.watch("./*.html").on("change", browserSync.reload);
});

gulp.task("css", () => {
  const plugins = [
    postcssImport,
    stripInlineComments,
    normalize({
      forceImport: true
    }),
    cssnext({
      features: {
        customProperties: {
          preserve: true,
          warnings: false
        },
        autoprefixer: {
          grid: true
        }
      }
    }),
    cssnano({
      normalizeWhitespace: true,
      autoprefixer: false
    })
  ];
  return gulp
    .src("./src/styles/app.css")
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins, { syntax: postcssScss }))
    .on("error", error)
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./assets/styles"))
    .pipe(browserSync.stream());
});

gulp.task("default", ["serve"]);
