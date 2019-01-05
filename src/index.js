import { declare } from '@babel/helper-plugin-utils';
import jsx from '@babel/plugin-syntax-jsx';
import { types as t } from '@babel/core';

export default declare((api, options) => {
  api.assertVersion(7);

  let {
    elementName = 'Svg',
    elementProp = 'name',
    propertyName = 'icon',
    componentPrefix = 'Svg',
  } = options;

  let components = new Set();

  let visitor = {
    Program: {
      enter(path, state) {
        if (!state.opts.packageName) {
          throw path.buildCodeFrameError(
            'babel-plugin-jsx-svg - missing required option `packageName`'
          );
        }

        state.components = components;
      },
      exit(path, state) {
        if (!state.hasSvgProp && !state.hasSvgElement) {
          return;
        }

        state.specifiers.forEach(name => {
          state.components.has(name) && state.components.delete(name);
        });

        if (!state.components.size) {
          return;
        }

        const lastImport = path
          .get('body')
          .filter(path => path.isImportDeclaration())
          .pop();

        if (lastImport) {
          lastImport.insertAfter(createImportDeclaration(path, state));
        } else {
          path.unshiftContainer('body', createImportDeclaration(path, state));
        }
      },
    },

    ImportDeclaration(path, state) {
      if (path.node.source.value !== state.opts.packageName) {
        return;
      }

      state.specifiers = path
        .get('specifiers')
        .filter(specifier => specifier.isImportSpecifier())
        .map(specifier => specifier.get('imported').node.name);
    },

    JSXAttribute(path, state) {
      if (path.node.name.name !== propertyName) {
        return;
      }

      let value = path.get('value');
      if (!value.isStringLiteral()) {
        return;
      }

      let name = componentPrefix + capitalize(value.node.value);

      value.replaceWith(t.JSXExpressionContainer(createSvgElement(name)));

      state.components.add(name);
      state.hasSvgProp = true;
      path.skip();
    },

    JSXOpeningElement(path, state) {
      if (path.node.name.name !== elementName) {
        return;
      }

      let [prop, attributes] = extract(
        path.node.attributes,
        isJSXAttributeOfName,
        elementProp
      );

      if (!prop || !t.isStringLiteral(prop.value)) {
        return;
      }

      let name = componentPrefix + capitalize(prop.value.value);

      path.node.name.name = name;
      path.node.attributes = attributes;

      state.components.add(name);
      state.hasSvgElement = true;
      path.skip();
    },
  };

  return {
    name: 'jsx-svg',
    inherits: jsx,
    visitor,
  };
});

function isJSXAttributeOfName(attr, name) {
  return t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name, { name });
}

function createImportDeclaration(path, state) {
  return t.importDeclaration(
    [...state.components].map(name =>
      t.importSpecifier(
        // path.scope.generateUidIdentifier(name),
        t.identifier(name),
        t.identifier(name)
      )
    ),
    t.stringLiteral(state.opts.packageName)
  );
}

function createSvgElement(name) {
  let children = [];
  let attributes = [];
  let selfClosing = true;
  let closingElement = null;

  return t.JSXElement(
    t.JSXOpeningElement(t.JSXIdentifier(name), attributes, selfClosing),
    closingElement,
    children,
    selfClosing
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function unique(arr) {
  return arr.filter(function(el) {
    return !this.has(el) && this.add(el);
  }, new Set());
}

function extract(arr, predicate, ...args) {
  let found;
  let filtered = arr.filter((el, idx) => {
    if (predicate(el, ...args)) {
      found = el;
      return false;
    }

    return true;
  });

  return [found, filtered];
}
