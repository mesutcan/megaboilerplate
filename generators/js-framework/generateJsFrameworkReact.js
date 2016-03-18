import { join } from 'path';
import { copy, cpy, mkdirs, addNpmPackage, replaceCode } from '../utils';

async function generateJsFrameworkReact(params) {
  const build = join(__base, 'build', params.uuid);
  const app = join(build, 'app.js');
  const es6Transpiler = join(__dirname, 'modules', 'react', 'es6-transpiler.js');
  const mainJs = join(__dirname, 'modules', 'react', 'main.js');
  const reactRequire = join(__dirname, 'modules', 'react', 'react-require.js');
  const reactRoutesRequire = join(__dirname, 'modules', 'react', 'react-routes-require.js');
  const reactRoutes = join(__dirname, 'modules', 'react', 'routes.js');
  const serverRenderingWithRouting = join(__dirname, 'modules', 'react', 'server-rendering-with-routing.js');

  switch (params.framework) {
    case 'express':

      await addRedux(params);

      // Require react, react-router, react-dom packages
      await replaceCode(app, 'REACT_REQUIRE', reactRequire);
      await replaceCode(app, 'REACT_ROUTES_REQUIRE', reactRoutesRequire);

      // Add ES6 transpiler
      await replaceCode(app, 'ES6_TRANSPILER', es6Transpiler);

      // Add server-rendering  middleware
      await replaceCode(join(build, 'app.js'), 'REACT_SERVER_RENDERING', serverRenderingWithRouting);

      // Copy React components
      await mkdirs(join(build, 'app', 'components'));
      await cpy([
        join(__dirname, 'modules', 'react', 'components', 'App.js'),
        join(__dirname, 'modules', 'react', 'components', 'Home.js'),
        join(__dirname, 'modules', 'react', 'components', 'Contant.js'),
        join(__dirname, 'modules', 'react', 'components', 'Header.js'),
        join(__dirname, 'modules', 'react', 'components', 'Footer.js')
      ], join(build, 'app', 'components'));
      await cpy([
        join(__dirname, 'modules', 'react', 'components', 'Account', 'Login.js'),
        join(__dirname, 'modules', 'react', 'components', 'Account', 'Signup.js'),
        join(__dirname, 'modules', 'react', 'components', 'Account', 'Profile.js'),
        join(__dirname, 'modules', 'react', 'components', 'Account', 'Forgot.js'),
        join(__dirname, 'modules', 'react', 'components', 'Account', 'Reset.js')
      ], join(build, 'app', 'components', 'Account'));

      await copy(mainJs, join(build, 'app', 'main.js'));
      await copy(reactRoutes, join(build, 'app', 'routes.js'));

      switch (params.templateEngine) {
        case 'jade':
          const layoutJade = join(build, 'views', 'layout.jade');
          const bundleJsJadeImport = join(__dirname, 'modules', 'react', 'react-jade-import.jade');
          const renderFileJade = join(__dirname, 'modules', 'react', 'render-template-jade.js');
          await replaceCode(app, 'RENDER_TEMPLATE', renderFileJade, { indentLevel: 3 });

          await replaceCode(layoutJade, 'JS_FRAMEWORK_MAIN_IMPORT', bundleJsJadeImport, { indentLevel: 2 });
          break;

        case 'handlebars':
          break;

        case 'nunjucks':
          const layoutNunjucks = join(build, 'views', 'layout.html');
          const bundleNunjucksImport = join(__dirname, 'modules', 'react', 'react-html-import.html');
          const renderFileNunjucks = join(__dirname, 'modules', 'react', 'render-template-nunjucks.js');

          await replaceCode(layoutNunjucks, 'JS_FRAMEWORK_MAIN_IMPORT', bundleNunjucksImport, { indentLevel: 1 });
          await replaceCode(app, 'RENDER_TEMPLATE', renderFileNunjucks);
          break;

        default:
          break;
      }
      break;

    case 'hapi':
      break;

    case 'meteor':
      break;

    default:
  }

  await addNpmPackage('react', params);
  await addNpmPackage('react-dom', params);
}

async function addRedux(params) {
  const build = join(__base, 'build', params.uuid);
  const app = join(__base, 'build', params.uuid, 'app.js');

  if (params.reactOptions.redux) {
    await mkdirs(join(build, 'actions'));
    await mkdirs(join(build, 'containers'));
    await mkdirs(join(build, 'reducers'));

    // const serverRenderingWithRouting = join(__dirname, 'modules', 'react', 'react-router', 'server-rendering-with-routing.js');
    // await replaceCode(join(build, 'app.js'), 'REACT_SERVER_RENDERING', serverRenderingWithRouting);
  } else {
    // const serverRendering = join(__dirname, 'modules', 'react', 'server-rendering.js');
    // await replaceCode(join(build, 'app.js'), 'REACT_SERVER_RENDERING', serverRendering);
  }
}

export default generateJsFrameworkReact;
