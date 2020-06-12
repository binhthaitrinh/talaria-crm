webpackHotUpdate("static/development/pages/items.js",{

/***/ "./components/ItemRow.js":
false,

/***/ "./components/Items.js":
false,

/***/ "./components/SingleItem.js":
/*!**********************************!*\
  !*** ./components/SingleItem.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"./node_modules/@babel/runtime/regenerator/index.js\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ \"./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _styles_Loader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles/Loader */ \"./components/styles/Loader.js\");\n/* harmony import */ var _styles_MainContent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles/MainContent */ \"./components/styles/MainContent.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! axios */ \"./node_modules/axios/index.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\nvar _this = undefined,\n    _jsxFileName = \"/home/binhthaitrinh/web-dev/talaria/frontend/components/SingleItem.js\",\n    _s = $RefreshSig$();\n\nvar __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;\n\n\n\n\n\nvar SingleItem = function SingleItem(props) {\n  _s();\n\n  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__[\"useState\"])({}),\n      item = _useState[0],\n      setItem = _useState[1];\n\n  var _useState2 = Object(react__WEBPACK_IMPORTED_MODULE_2__[\"useState\"])(true),\n      loading = _useState2[0],\n      setLoading = _useState2[1];\n\n  Object(react__WEBPACK_IMPORTED_MODULE_2__[\"useEffect\"])(function () {\n    function fetchData() {\n      return _fetchData.apply(this, arguments);\n    }\n\n    function _fetchData() {\n      _fetchData = Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__[\"default\"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {\n        var res;\n        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {\n          while (1) {\n            switch (_context.prev = _context.next) {\n              case 0:\n                _context.next = 2;\n                return axios__WEBPACK_IMPORTED_MODULE_5___default.a.get(\"http://localhost:4444/api/v1/items/\".concat(props.id));\n\n              case 2:\n                res = _context.sent;\n                setItem(res.data.data);\n                setLoading(false);\n\n              case 5:\n              case \"end\":\n                return _context.stop();\n            }\n          }\n        }, _callee);\n      }));\n      return _fetchData.apply(this, arguments);\n    }\n\n    fetchData();\n  }, []);\n  return loading ? __jsx(_styles_Loader__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n    __self: _this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 23,\n      columnNumber: 5\n    }\n  }) : __jsx(_styles_MainContent__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n    __self: _this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 25,\n      columnNumber: 5\n    }\n  }, __jsx(\"h1\", {\n    __self: _this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 26,\n      columnNumber: 7\n    }\n  }, \"Hello\"));\n};\n\n_s(SingleItem, \"ryTEklHqAvM310HhVdpcTnFaNjk=\");\n\n_c = SingleItem;\n/* harmony default export */ __webpack_exports__[\"default\"] = (SingleItem);\n\nvar _c;\n\n$RefreshReg$(_c, \"SingleItem\");\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports_1 = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports_1, module.i);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports_1)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports_1;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports_1)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL1NpbmdsZUl0ZW0uanM/ZWFmNyJdLCJuYW1lcyI6WyJTaW5nbGVJdGVtIiwicHJvcHMiLCJ1c2VTdGF0ZSIsIml0ZW0iLCJzZXRJdGVtIiwibG9hZGluZyIsInNldExvYWRpbmciLCJ1c2VFZmZlY3QiLCJmZXRjaERhdGEiLCJheGlvcyIsImdldCIsImlkIiwicmVzIiwiZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBTUEsVUFBVSxHQUFHLFNBQWJBLFVBQWEsQ0FBQ0MsS0FBRCxFQUFXO0FBQUE7O0FBQUEsa0JBQ0pDLHNEQUFRLENBQUMsRUFBRCxDQURKO0FBQUEsTUFDckJDLElBRHFCO0FBQUEsTUFDZkMsT0FEZTs7QUFBQSxtQkFFRUYsc0RBQVEsQ0FBQyxJQUFELENBRlY7QUFBQSxNQUVyQkcsT0FGcUI7QUFBQSxNQUVaQyxVQUZZOztBQUk1QkMseURBQVMsQ0FBQyxZQUFNO0FBQUEsYUFDQ0MsU0FERDtBQUFBO0FBQUE7O0FBQUE7QUFBQSxvTUFDZDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQUNvQkMsNENBQUssQ0FBQ0MsR0FBTiw4Q0FDc0JULEtBQUssQ0FBQ1UsRUFENUIsRUFEcEI7O0FBQUE7QUFDUUMsbUJBRFI7QUFJRVIsdUJBQU8sQ0FBQ1EsR0FBRyxDQUFDQyxJQUFKLENBQVNBLElBQVYsQ0FBUDtBQUNBUCwwQkFBVSxDQUFDLEtBQUQsQ0FBVjs7QUFMRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQURjO0FBQUE7QUFBQTs7QUFTZEUsYUFBUztBQUNWLEdBVlEsRUFVTixFQVZNLENBQVQ7QUFZQSxTQUFPSCxPQUFPLEdBQ1osTUFBQyxzREFBRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBRFksR0FHWixNQUFDLDJEQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBREYsQ0FIRjtBQU9ELENBdkJEOztHQUFNTCxVOztLQUFBQSxVO0FBd0JTQSx5RUFBZiIsImZpbGUiOiIuL2NvbXBvbmVudHMvU2luZ2xlSXRlbS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IExvYWRlciBmcm9tICcuL3N0eWxlcy9Mb2FkZXInO1xuaW1wb3J0IE1haW5Db250ZW50IGZyb20gJy4vc3R5bGVzL01haW5Db250ZW50JztcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5cbmNvbnN0IFNpbmdsZUl0ZW0gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgW2l0ZW0sIHNldEl0ZW1dID0gdXNlU3RhdGUoe30pO1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGFzeW5jIGZ1bmN0aW9uIGZldGNoRGF0YSgpIHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGF4aW9zLmdldChcbiAgICAgICAgYGh0dHA6Ly9sb2NhbGhvc3Q6NDQ0NC9hcGkvdjEvaXRlbXMvJHtwcm9wcy5pZH1gXG4gICAgICApO1xuICAgICAgc2V0SXRlbShyZXMuZGF0YS5kYXRhKTtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgIH1cblxuICAgIGZldGNoRGF0YSgpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIGxvYWRpbmcgPyAoXG4gICAgPExvYWRlciAvPlxuICApIDogKFxuICAgIDxNYWluQ29udGVudD5cbiAgICAgIDxoMT5IZWxsbzwvaDE+XG4gICAgPC9NYWluQ29udGVudD5cbiAgKTtcbn07XG5leHBvcnQgZGVmYXVsdCBTaW5nbGVJdGVtO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./components/SingleItem.js\n");

/***/ }),

/***/ "./components/styles/ActionBtn.js":
false,

/***/ "./components/styles/ActionDetails.js":
false,

/***/ "./components/styles/Btn.js":
false,

/***/ "./components/styles/Table.js":
false,

/***/ "./node_modules/@babel/runtime/helpers/arrayWithHoles.js":
false,

/***/ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js":
false,

/***/ "./node_modules/@babel/runtime/helpers/construct.js":
false,

/***/ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js":
false,

/***/ "./node_modules/@babel/runtime/helpers/interopRequireWildcard.js":
false,

/***/ "./node_modules/@babel/runtime/helpers/isNativeReflectConstruct.js":
false,

/***/ "./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":
false,

/***/ "./node_modules/@babel/runtime/helpers/nonIterableRest.js":
false,

/***/ "./node_modules/@babel/runtime/helpers/slicedToArray.js":
false,

/***/ "./node_modules/function-bind/implementation.js":
false,

/***/ "./node_modules/function-bind/index.js":
false,

/***/ "./node_modules/has/src/index.js":
false,

/***/ "./node_modules/native-url/dist/index.js":
false,

/***/ "./node_modules/next/dist/build/polyfills/object-assign.js":
false,

/***/ "./node_modules/next/dist/build/polyfills/object.assign/index.js":
false,

/***/ "./node_modules/next/dist/client/link.js":
false,

/***/ "./node_modules/next/dist/client/router.js":
false,

/***/ "./node_modules/next/dist/client/with-router.js":
false,

/***/ "./node_modules/next/dist/next-server/lib/mitt.js":
false,

/***/ "./node_modules/next/dist/next-server/lib/router-context.js":
false,

/***/ "./node_modules/next/dist/next-server/lib/router/router.js":
false,

/***/ "./node_modules/next/dist/next-server/lib/router/utils/is-dynamic.js":
false,

/***/ "./node_modules/next/dist/next-server/lib/router/utils/route-matcher.js":
false,

/***/ "./node_modules/next/dist/next-server/lib/router/utils/route-regex.js":
false,

/***/ "./node_modules/next/dist/next-server/lib/utils.js":
false,

/***/ "./node_modules/next/link.js":
false,

/***/ "./node_modules/prop-types-exact/build/helpers/isPlainObject.js":
false,

/***/ "./node_modules/prop-types-exact/build/index.js":
false,

/***/ "./node_modules/prop-types/checkPropTypes.js":
false,

/***/ "./node_modules/prop-types/factoryWithTypeCheckers.js":
false,

/***/ "./node_modules/prop-types/index.js":
false,

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
false,

/***/ "./node_modules/querystring-es3/decode.js":
false,

/***/ "./node_modules/querystring-es3/encode.js":
false,

/***/ "./node_modules/querystring-es3/index.js":
false,

/***/ "./pages/items/index.js":
/*!******************************!*\
  !*** ./pages/items/index.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Items; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _components_Meta__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/Meta */ \"./components/Meta.js\");\n/* harmony import */ var _components_styles_Title__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/styles/Title */ \"./components/styles/Title.js\");\n/* harmony import */ var _components_styles_MainCntHeader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/styles/MainCntHeader */ \"./components/styles/MainCntHeader.js\");\n/* harmony import */ var _components_SingleItem__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/SingleItem */ \"./components/SingleItem.js\");\nvar _jsxFileName = \"/home/binhthaitrinh/web-dev/talaria/frontend/pages/items/index.js\";\n\nvar __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;\n\n\n\n\nfunction Items() {\n  return __jsx(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, __jsx(_components_Meta__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n    title: \"Dashboard\",\n    __self: this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 9,\n      columnNumber: 7\n    }\n  }), __jsx(_components_styles_MainCntHeader__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n    __self: this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 10,\n      columnNumber: 7\n    }\n  }, __jsx(_components_styles_Title__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n    __self: this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 11,\n      columnNumber: 9\n    }\n  }, \"Items\")), __jsx(_components_SingleItem__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n    __self: this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 13,\n      columnNumber: 7\n    }\n  }));\n}\n_c = Items;\n\nvar _c;\n\n$RefreshReg$(_c, \"Items\");\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports_1 = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports_1, module.i);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports_1)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports_1;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports_1)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9pdGVtcy9pbmRleC5qcz84MWFjIl0sIm5hbWVzIjpbIkl0ZW1zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRWUsU0FBU0EsS0FBVCxHQUFpQjtBQUM5QixTQUNFLG1FQUNFLE1BQUMsd0RBQUQ7QUFBTSxTQUFLLEVBQUMsV0FBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBREYsRUFFRSxNQUFDLHdFQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FDRSxNQUFDLGdFQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFERixDQUZGLEVBS0UsTUFBQyw4REFBRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTEYsQ0FERjtBQVNEO0tBVnVCQSxLIiwiZmlsZSI6Ii4vcGFnZXMvaXRlbXMvaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWV0YSBmcm9tICcuLi8uLi9jb21wb25lbnRzL01ldGEnO1xuaW1wb3J0IFRpdGxlIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvc3R5bGVzL1RpdGxlJztcbmltcG9ydCBNYWluQ250SGVhZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvc3R5bGVzL01haW5DbnRIZWFkZXInO1xuaW1wb3J0IFNpbmdsZUl0ZW0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9TaW5nbGVJdGVtJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSXRlbXMoKSB7XG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxNZXRhIHRpdGxlPVwiRGFzaGJvYXJkXCIgLz5cbiAgICAgIDxNYWluQ250SGVhZGVyPlxuICAgICAgICA8VGl0bGU+SXRlbXM8L1RpdGxlPlxuICAgICAgPC9NYWluQ250SGVhZGVyPlxuICAgICAgPFNpbmdsZUl0ZW0gLz5cbiAgICA8Lz5cbiAgKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/items/index.js\n");

/***/ })

})