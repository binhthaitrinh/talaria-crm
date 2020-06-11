webpackHotUpdate("static/development/pages/_app.js",{

/***/ "./components/Page.js":
/*!****************************!*\
  !*** ./components/Page.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ \"./node_modules/@babel/runtime/helpers/esm/classCallCheck.js\");\n/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ \"./node_modules/@babel/runtime/helpers/esm/createClass.js\");\n/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ \"./node_modules/@babel/runtime/helpers/esm/inherits.js\");\n/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ \"./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js\");\n/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ \"./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js\");\n/* harmony import */ var _babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/taggedTemplateLiteral */ \"./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! styled-components */ \"./node_modules/styled-components/dist/styled-components.browser.esm.js\");\n\n\n\n\n\n\nvar _jsxFileName = \"/home/binhthaitrinh/web-dev/talaria/frontend/components/Page.js\";\nvar __jsx = react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement;\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return Object(_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(this, result); }; }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _templateObject() {\n  var data = Object(_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_5__[\"default\"])([\"\\n\\n@font-face {\\n   font-family: \\\"Roboto\\\";\\n   src: url(\\\"https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap\\\");\\n}\\n\\n   *,\\n*::after,\\n*::before {\\n    margin: 0;\\n    padding: 0;\\n    box-sizing: inherit;\\n}\\n\\nhtml {\\n    font-size: 62.5%; \\n}\\n\\nbody {\\n    box-sizing: border-box;\\n    font-family: \\\"Roboto\\\", sans-serif;\\n    font-weight: 400;\\n    /*font-size: 16px;*/\\n    line-height: 1.7;\\n    color: \", \";\\n    font-size: 62.5%;\\n}\\n\\na {\\n   text-decoration: none;\\n   color: inherit;\\n}\\n\\nul {\\n  list-style: none;\\n}\\n\\n#__next {\\n  position: relative;\\n\\n  width: 100%;\\n  height: 100vh;\\n  background-image: linear-gradient(to right, \", \", \", \")\\n}\"]);\n\n  _templateObject = function _templateObject() {\n    return data;\n  };\n\n  return data;\n}\n\n\n\nvar theme = {\n  primary: '#00909e',\n  primaryDark: '#27496d',\n  primaryBlack: '#142850',\n  primaryLight: '#dae1e7',\n  black: '#393939',\n  grey: '#3A3A3A',\n  lightGrey: '#E1E1E1',\n  offWhite: '#EDEDED',\n  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)'\n};\nvar GlobalStyle = Object(styled_components__WEBPACK_IMPORTED_MODULE_7__[\"createGlobalStyle\"])(_templateObject(), function (props) {\n  return props.theme.black;\n}, function (props) {\n  return props.theme.primary;\n}, function (props) {\n  return props.theme.primaryDark;\n});\n\nvar Page = /*#__PURE__*/function (_React$Component) {\n  Object(_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(Page, _React$Component);\n\n  var _super = _createSuper(Page);\n\n  function Page() {\n    Object(_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(this, Page);\n\n    return _super.apply(this, arguments);\n  }\n\n  Object(_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(Page, [{\n    key: \"render\",\n    value: function render() {\n      return __jsx(styled_components__WEBPACK_IMPORTED_MODULE_7__[\"ThemeProvider\"], {\n        theme: theme,\n        __self: this,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 65,\n          columnNumber: 12\n        }\n      }, this.props.children);\n    }\n  }]);\n\n  return Page;\n}(react__WEBPACK_IMPORTED_MODULE_6___default.a.Component);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Page);\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports_1 = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports_1, module.i);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports_1)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports_1;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports_1)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL1BhZ2UuanM/MTc1YyJdLCJuYW1lcyI6WyJ0aGVtZSIsInByaW1hcnkiLCJwcmltYXJ5RGFyayIsInByaW1hcnlCbGFjayIsInByaW1hcnlMaWdodCIsImJsYWNrIiwiZ3JleSIsImxpZ2h0R3JleSIsIm9mZldoaXRlIiwiYnMiLCJHbG9iYWxTdHlsZSIsImNyZWF0ZUdsb2JhbFN0eWxlIiwicHJvcHMiLCJQYWdlIiwiY2hpbGRyZW4iLCJSZWFjdCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUVBLElBQU1BLEtBQUssR0FBRztBQUNaQyxTQUFPLEVBQUUsU0FERztBQUVaQyxhQUFXLEVBQUUsU0FGRDtBQUdaQyxjQUFZLEVBQUUsU0FIRjtBQUlaQyxjQUFZLEVBQUUsU0FKRjtBQUtaQyxPQUFLLEVBQUUsU0FMSztBQU1aQyxNQUFJLEVBQUUsU0FOTTtBQU9aQyxXQUFTLEVBQUUsU0FQQztBQVFaQyxVQUFRLEVBQUUsU0FSRTtBQVNaQyxJQUFFLEVBQUU7QUFUUSxDQUFkO0FBWUEsSUFBTUMsV0FBVyxHQUFHQywyRUFBSCxvQkF5QkosVUFBQ0MsS0FBRDtBQUFBLFNBQVdBLEtBQUssQ0FBQ1osS0FBTixDQUFZSyxLQUF2QjtBQUFBLENBekJJLEVBMkMrQixVQUFDTyxLQUFEO0FBQUEsU0FDNUNBLEtBQUssQ0FBQ1osS0FBTixDQUFZQyxPQURnQztBQUFBLENBM0MvQixFQTRDVyxVQUFDVyxLQUFEO0FBQUEsU0FBV0EsS0FBSyxDQUFDWixLQUFOLENBQVlFLFdBQXZCO0FBQUEsQ0E1Q1gsQ0FBakI7O0lBK0NNVyxJOzs7Ozs7Ozs7Ozs7OzZCQUNLO0FBQ1AsYUFBTyxNQUFDLCtEQUFEO0FBQWUsYUFBSyxFQUFFYixLQUF0QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBQThCLEtBQUtZLEtBQUwsQ0FBV0UsUUFBekMsQ0FBUDtBQUNEOzs7O0VBSGdCQyw0Q0FBSyxDQUFDQyxTOztBQU1WSCxtRUFBZiIsImZpbGUiOiIuL2NvbXBvbmVudHMvUGFnZS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBUaGVtZVByb3ZpZGVyLCBjcmVhdGVHbG9iYWxTdHlsZSB9IGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgdGhlbWUgPSB7XG4gIHByaW1hcnk6ICcjMDA5MDllJyxcbiAgcHJpbWFyeURhcms6ICcjMjc0OTZkJyxcbiAgcHJpbWFyeUJsYWNrOiAnIzE0Mjg1MCcsXG4gIHByaW1hcnlMaWdodDogJyNkYWUxZTcnLFxuICBibGFjazogJyMzOTM5MzknLFxuICBncmV5OiAnIzNBM0EzQScsXG4gIGxpZ2h0R3JleTogJyNFMUUxRTEnLFxuICBvZmZXaGl0ZTogJyNFREVERUQnLFxuICBiczogJzAgMTJweCAyNHB4IDAgcmdiYSgwLCAwLCAwLCAwLjA5KScsXG59O1xuXG5jb25zdCBHbG9iYWxTdHlsZSA9IGNyZWF0ZUdsb2JhbFN0eWxlYFxuXG5AZm9udC1mYWNlIHtcbiAgIGZvbnQtZmFtaWx5OiBcIlJvYm90b1wiO1xuICAgc3JjOiB1cmwoXCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PVJvYm90bzp3Z2h0QDMwMDs0MDA7NzAwJmRpc3BsYXk9c3dhcFwiKTtcbn1cblxuICAgKixcbio6OmFmdGVyLFxuKjo6YmVmb3JlIHtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgICBib3gtc2l6aW5nOiBpbmhlcml0O1xufVxuXG5odG1sIHtcbiAgICBmb250LXNpemU6IDYyLjUlOyBcbn1cblxuYm9keSB7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBmb250LWZhbWlseTogXCJSb2JvdG9cIiwgc2Fucy1zZXJpZjtcbiAgICBmb250LXdlaWdodDogNDAwO1xuICAgIC8qZm9udC1zaXplOiAxNnB4OyovXG4gICAgbGluZS1oZWlnaHQ6IDEuNztcbiAgICBjb2xvcjogJHsocHJvcHMpID0+IHByb3BzLnRoZW1lLmJsYWNrfTtcbiAgICBmb250LXNpemU6IDYyLjUlO1xufVxuXG5hIHtcbiAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgIGNvbG9yOiBpbmhlcml0O1xufVxuXG51bCB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG59XG5cbiNfX25leHQge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwdmg7XG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgJHsocHJvcHMpID0+XG4gICAgcHJvcHMudGhlbWUucHJpbWFyeX0sICR7KHByb3BzKSA9PiBwcm9wcy50aGVtZS5wcmltYXJ5RGFya30pXG59YDtcblxuY2xhc3MgUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPFRoZW1lUHJvdmlkZXIgdGhlbWU9e3RoZW1lfT57dGhpcy5wcm9wcy5jaGlsZHJlbn08L1RoZW1lUHJvdmlkZXI+O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhZ2U7XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/Page.js\n");

/***/ })

})