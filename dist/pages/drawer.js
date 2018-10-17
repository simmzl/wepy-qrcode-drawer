"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _qrcode = require('./../components/qrcode/qrcode.js');

var _qrcode2 = _interopRequireDefault(_qrcode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Drawer = function (_wepy$page) {
    _inherits(Drawer, _wepy$page);

    function Drawer() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Drawer);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Drawer.__proto__ || Object.getPrototypeOf(Drawer)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
            navigationBarTitleText: "二维码绘制",
            navigationBarBackgroundColor: "#fff",
            navigationBarTextStyle: "black"
        }, _this.$repeat = {}, _this.$props = { "qrcode": {} }, _this.$events = {}, _this.components = {
            qrcode: _qrcode2.default
        }, _this.data = {
            url: ""
        }, _this.methods = {
            handleInput: function handleInput(e) {
                this.url = e.detail.value;
            },
            inputDefault: function inputDefault() {
                this.url = "https://simmzl.cn";
                this.toDraw();
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Drawer, [{
        key: "toDraw",
        value: function toDraw() {
            this.$invoke("qrcode", "createQrcode", this.url);
        }
    }, {
        key: "download",
        value: function download() {}
    }]);

    return Drawer;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Drawer , 'pages/drawer'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyYXdlci5qcyJdLCJuYW1lcyI6WyJEcmF3ZXIiLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsIm5hdmlnYXRpb25CYXJUZXh0U3R5bGUiLCIkcmVwZWF0IiwiJHByb3BzIiwiJGV2ZW50cyIsImNvbXBvbmVudHMiLCJxcmNvZGUiLCJkYXRhIiwidXJsIiwibWV0aG9kcyIsImhhbmRsZUlucHV0IiwiZSIsImRldGFpbCIsInZhbHVlIiwiaW5wdXREZWZhdWx0IiwidG9EcmF3IiwiJGludm9rZSIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFcUJBLE07Ozs7Ozs7Ozs7Ozs7OzBMQUNqQkMsTSxHQUFTO0FBQ0xDLG9DQUF3QixPQURuQjtBQUVMQywwQ0FBOEIsTUFGekI7QUFHTEMsb0NBQXdCO0FBSG5CLFMsUUFNVkMsTyxHQUFVLEUsUUFDYkMsTSxHQUFTLEVBQUMsVUFBUyxFQUFWLEUsUUFDVEMsTyxHQUFVLEUsUUFDVEMsVSxHQUFhO0FBQ05DO0FBRE0sUyxRQUlWQyxJLEdBQU87QUFDSEMsaUJBQUs7QUFERixTLFFBSVBDLE8sR0FBVTtBQUNOQyx1QkFETSx1QkFDTUMsQ0FETixFQUNTO0FBQ1gscUJBQUtILEdBQUwsR0FBV0csRUFBRUMsTUFBRixDQUFTQyxLQUFwQjtBQUNILGFBSEs7QUFJTkMsd0JBSk0sMEJBSVM7QUFDWCxxQkFBS04sR0FBTCxHQUFXLG1CQUFYO0FBQ0EscUJBQUtPLE1BQUw7QUFDSDtBQVBLLFM7Ozs7O2lDQVVEO0FBQ0wsaUJBQUtDLE9BQUwsQ0FBYSxRQUFiLEVBQXVCLGNBQXZCLEVBQXVDLEtBQUtSLEdBQTVDO0FBQ0g7OzttQ0FDVSxDQUNWOzs7O0VBaEMrQlMsZUFBS0MsSTs7a0JBQXBCckIsTSIsImZpbGUiOiJkcmF3ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcclxuaW1wb3J0IHFyY29kZSBmcm9tIFwiQC9jb21wb25lbnRzL3FyY29kZS9xcmNvZGVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyYXdlciBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgICBjb25maWcgPSB7XHJcbiAgICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogXCLkuoznu7TnoIHnu5jliLZcIixcclxuICAgICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIixcclxuICAgICAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiBcImJsYWNrXCJcclxuICAgIH07XHJcblxyXG4gICAkcmVwZWF0ID0ge307XHJcbiRwcm9wcyA9IHtcInFyY29kZVwiOnt9fTtcclxuJGV2ZW50cyA9IHt9O1xyXG4gY29tcG9uZW50cyA9IHtcclxuICAgICAgICBxcmNvZGVcclxuICAgIH07XHJcblxyXG4gICAgZGF0YSA9IHtcclxuICAgICAgICB1cmw6IFwiXCJcclxuICAgIH07XHJcblxyXG4gICAgbWV0aG9kcyA9IHtcclxuICAgICAgICBoYW5kbGVJbnB1dChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXJsID0gZS5kZXRhaWwudmFsdWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbnB1dERlZmF1bHQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXJsID0gXCJodHRwczovL3NpbW16bC5jblwiO1xyXG4gICAgICAgICAgICB0aGlzLnRvRHJhdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0b0RyYXcoKSB7XHJcbiAgICAgICAgdGhpcy4kaW52b2tlKFwicXJjb2RlXCIsIFwiY3JlYXRlUXJjb2RlXCIsIHRoaXMudXJsKTtcclxuICAgIH1cclxuICAgIGRvd25sb2FkKCkge1xyXG4gICAgfVxyXG59XHJcbiJdfQ==