const loaderUtils = require('loader-utils');
const glob = require('glob');

module.exports = function importGlob(source) {
  const options = loaderUtils.getOptions(this) || {};
  const files = [];

  const regex = /import\s+[^'"]*['"]([^'"]+\*[^'"]*)['"];?/g;
  let match;

  while ((match = regex.exec(source))) {
    const globPath = match[1];
    const cwd = options.cwd || this.context;
    const resolvedFiles = glob.sync(globPath, { cwd });

    resolvedFiles.forEach((file) => {
      const importPath = `${globPath.startsWith('.') ? '' : './'}${file}`;
      files.push(`import '${importPath}';`);
    });

    source = source.replace(match[0], '');
  }

  return files.join('\n') + '\n' + source;
};
