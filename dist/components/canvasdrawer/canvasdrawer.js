"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Drawer = function (_wepy$component) {
    _inherits(Drawer, _wepy$component);

    function Drawer() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Drawer);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Drawer.__proto__ || Object.getPrototypeOf(Drawer)).call.apply(_ref, [this].concat(args))), _this), _this.props = {
            painting: {
                type: Object,
                default: {}
            }
        }, _this.data = {
            showCanvas: false,

            width: 100,
            height: 100,

            index: 0,
            imageList: [],
            tempFileList: [],

            isPainting: false,
            ctx: null,
            cache: {}
        }, _this.watch = {
            painting: function painting(newVal, oldVal) {
                if (!this.isPainting) {
                    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                        if (newVal && newVal.width && newVal.height) {
                            this.showCanvas = true;
                            this.isPainting = true;
                            this.$apply();
                            this.readyPigment();
                        }
                    } else {
                        if (newVal && newVal.mode !== "same") {
                            this.$emit("getImage", {
                                errMsg: "canvasdrawer:samme params"
                            });
                        }
                    }
                }
            }
        }, _this.methods = {}, _temp), _possibleConstructorReturn(_this, _ret);
    }
    /**
    * @argument
    * painting -- json数据
    * @event
    * getImage 渲染图片完成后的回调
    **/


    _createClass(Drawer, [{
        key: "readyPigment",
        value: function readyPigment() {
            var _this2 = this;

            var _painting = this.painting,
                width = _painting.width,
                height = _painting.height,
                views = _painting.views;

            this.width = width;
            this.height = height;

            var inter = setInterval(function () {
                if (_this2.ctx) {
                    clearInterval(inter);
                    _this2.ctx.clearActions();
                    _this2.ctx.save();
                    _this2.getImageList(views);
                    _this2.downLoadImages(0);
                }
            }, 100);
        }
    }, {
        key: "getImageList",
        value: function getImageList(views) {
            var imageList = [];
            for (var i = 0; i < views.length; i++) {
                if (views[i].type === "image") {
                    imageList.push(views[i].url);
                }
            }
            this.imageList = imageList;
        }
    }, {
        key: "downLoadImages",
        value: function downLoadImages(index) {
            var _this3 = this;

            var imageList = this.imageList,
                tempFileList = this.tempFileList;

            if (index < imageList.length) {
                this.getImageInfo(imageList[index]).then(function (file) {
                    tempFileList.push(file);
                    _this3.tempFileList = tempFileList;
                    _this3.downLoadImages(index + 1);
                });
            } else {
                this.startPainting();
            }
        }
    }, {
        key: "startPainting",
        value: function startPainting() {
            var _this4 = this;

            var tempFileList = this.tempFileList,
                views = this.painting.views;

            for (var i = 0, imageIndex = 0; i < views.length; i++) {
                if (views[i].type === "image") {
                    this.drawImage(_extends({}, views[i], {
                        url: tempFileList[imageIndex]
                    }));
                    imageIndex++;
                } else if (views[i].type === "text") {
                    if (!this.ctx.measureText) {
                        _wepy2.default.showModal({
                            title: "提示",
                            content: "当前微信版本过低，无法使用 measureText 功能，请升级到最新微信版本后重试。"
                        });
                        this.$emit("getImage", {
                            errMsg: "canvasdrawer:version too low"
                        });
                        return;
                    } else {
                        this.drawText(views[i]);
                    }
                } else if (views[i].type === "rect") {
                    this.drawRect(views[i]);
                }
            }
            this.ctx.draw(false, function () {
                _wepy2.default.setStorageSync("canvasdrawer_pic_cache", _this4.cache);
                _this4.saveImageToLocal();
            });
        }
    }, {
        key: "drawImage",
        value: function drawImage(params) {
            this.ctx.save();
            var url = params.url,
                _params$top = params.top,
                top = _params$top === undefined ? 0 : _params$top,
                _params$left = params.left,
                left = _params$left === undefined ? 0 : _params$left,
                _params$width = params.width,
                width = _params$width === undefined ? 0 : _params$width,
                _params$height = params.height,
                height = _params$height === undefined ? 0 : _params$height,
                _params$borderRadius = params.borderRadius,
                borderRadius = _params$borderRadius === undefined ? 0 : _params$borderRadius;

            this.ctx.drawImage(url, left, top, width, height);
            this.ctx.restore();
        }
    }, {
        key: "drawText",
        value: function drawText(params) {
            this.ctx.save();
            var _params$MaxLineNumber = params.MaxLineNumber,
                MaxLineNumber = _params$MaxLineNumber === undefined ? 2 : _params$MaxLineNumber,
                _params$breakWord = params.breakWord,
                breakWord = _params$breakWord === undefined ? false : _params$breakWord,
                _params$color = params.color,
                color = _params$color === undefined ? "black" : _params$color,
                _params$content = params.content,
                content = _params$content === undefined ? "" : _params$content,
                _params$fontSize = params.fontSize,
                fontSize = _params$fontSize === undefined ? 16 : _params$fontSize,
                _params$top2 = params.top,
                top = _params$top2 === undefined ? 0 : _params$top2,
                _params$left2 = params.left,
                left = _params$left2 === undefined ? 0 : _params$left2,
                _params$lineHeight = params.lineHeight,
                lineHeight = _params$lineHeight === undefined ? 20 : _params$lineHeight,
                _params$textAlign = params.textAlign,
                textAlign = _params$textAlign === undefined ? "left" : _params$textAlign,
                width = params.width,
                _params$bolder = params.bolder,
                bolder = _params$bolder === undefined ? false : _params$bolder,
                _params$textDecoratio = params.textDecoration,
                textDecoration = _params$textDecoratio === undefined ? "none" : _params$textDecoratio;


            this.ctx.beginPath();
            this.ctx.setTextBaseline("top");
            this.ctx.setTextAlign(textAlign);
            this.ctx.setFillStyle(color);
            this.ctx.setFontSize(fontSize);

            if (!breakWord) {
                this.ctx.fillText(content, left, top);
                this.drawTextLine(left, top, textDecoration, color, fontSize, content);
            } else {
                var fillText = "";
                var fillTop = top;
                var lineNum = 1;
                for (var i = 0; i < content.length; i++) {
                    fillText += [content[i]];
                    if (this.ctx.measureText(fillText).width > width) {
                        if (lineNum === MaxLineNumber) {
                            if (i !== content.length) {
                                fillText = fillText.substring(0, fillText.length - 1) + "...";
                                this.ctx.fillText(fillText, left, fillTop);
                                this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText);
                                fillText = "";
                                break;
                            }
                        }
                        this.ctx.fillText(fillText, left, fillTop);
                        this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText);
                        fillText = "";
                        fillTop += lineHeight;
                        lineNum++;
                    }
                }
                this.ctx.fillText(fillText, left, fillTop);
                this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText);
            }

            this.ctx.restore();

            if (bolder) {
                this.drawText(_extends({}, params, {
                    left: left + 0.3,
                    top: top + 0.3,
                    bolder: false,
                    textDecoration: "none"
                }));
            }
        }
    }, {
        key: "drawTextLine",
        value: function drawTextLine(left, top, textDecoration, color, fontSize, content) {
            if (textDecoration === "underline") {
                this.drawRect({
                    background: color,
                    top: top + fontSize * 1.2,
                    left: left - 1,
                    width: this.ctx.measureText(content).width + 3,
                    height: 1
                });
            } else if (textDecoration === "line-through") {
                this.drawRect({
                    background: color,
                    top: top + fontSize * 0.6,
                    left: left - 1,
                    width: this.ctx.measureText(content).width + 3,
                    height: 1
                });
            }
        }
    }, {
        key: "drawRect",
        value: function drawRect(params) {
            this.ctx.save();
            var background = params.background,
                _params$top3 = params.top,
                top = _params$top3 === undefined ? 0 : _params$top3,
                _params$left3 = params.left,
                left = _params$left3 === undefined ? 0 : _params$left3,
                _params$width2 = params.width,
                width = _params$width2 === undefined ? 0 : _params$width2,
                _params$height2 = params.height,
                height = _params$height2 === undefined ? 0 : _params$height2;

            this.ctx.setFillStyle(background);
            this.ctx.fillRect(left, top, width, height);
            this.ctx.restore();
        }
    }, {
        key: "getImageInfo",
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
                var objExp, res;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!this.cache[url]) {
                                    _context.next = 6;
                                    break;
                                }

                                console.log("url", url);
                                console.log("this.cache", this.cache);
                                // return url;
                                return _context.abrupt("return", this.cache[url]);

                            case 6:
                                objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);

                                if (!objExp.test(url)) {
                                    _context.next = 20;
                                    break;
                                }

                                _context.next = 10;
                                return _wepy2.default.getImageInfo({
                                    src: url
                                });

                            case 10:
                                res = _context.sent;

                                if (!(res.errMsg === "getImageInfo:ok")) {
                                    _context.next = 16;
                                    break;
                                }

                                this.cache[url] = res.path;
                                return _context.abrupt("return", res.path);

                            case 16:
                                this.$emit("getImage", {
                                    errMsg: "canvasdrawer:download fail"
                                });
                                return _context.abrupt("return", new Error("getImageInfo fail"));

                            case 18:
                                _context.next = 22;
                                break;

                            case 20:
                                this.cache[url] = url;
                                return _context.abrupt("return", url);

                            case 22:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getImageInfo(_x) {
                return _ref2.apply(this, arguments);
            }

            return getImageInfo;
        }()
    }, {
        key: "saveImageToLocal",
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var width, height, res;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                width = this.width, height = this.height;
                                _context2.next = 3;
                                return _wepy2.default.canvasToTempFilePath({
                                    x: 0,
                                    y: 0,
                                    width: width,
                                    height: height,
                                    canvasId: "canvasdrawer"
                                }, this);

                            case 3:
                                res = _context2.sent;

                                if (res.errMsg === "canvasToTempFilePath:ok") {
                                    this.showCanvas = false;
                                    this.isPainting = false;
                                    this.imageList = [];
                                    this.tempFileList = [];
                                    this.$apply();
                                    this.$emit("getImage", {
                                        tempFilePath: res.tempFilePath,
                                        errMsg: "canvasdrawer:ok"
                                    });
                                } else {
                                    this.$emit("getImage", {
                                        errMsg: "canvasdrawer:fail"
                                    });
                                }

                            case 5:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function saveImageToLocal() {
                return _ref3.apply(this, arguments);
            }

            return saveImageToLocal;
        }()
    }, {
        key: "onLoad",
        value: function onLoad() {
            _wepy2.default.removeStorageSync("canvasdrawer_pic_cache");
            this.cache = _wepy2.default.getStorageSync("canvasdrawer_pic_cache") || {};
            this.ctx = _wepy2.default.createCanvasContext("canvasdrawer", this);
        }
    }]);

    return Drawer;
}(_wepy2.default.component);

exports.default = Drawer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbnZhc2RyYXdlci5qcyJdLCJuYW1lcyI6WyJEcmF3ZXIiLCJwcm9wcyIsInBhaW50aW5nIiwidHlwZSIsIk9iamVjdCIsImRlZmF1bHQiLCJkYXRhIiwic2hvd0NhbnZhcyIsIndpZHRoIiwiaGVpZ2h0IiwiaW5kZXgiLCJpbWFnZUxpc3QiLCJ0ZW1wRmlsZUxpc3QiLCJpc1BhaW50aW5nIiwiY3R4IiwiY2FjaGUiLCJ3YXRjaCIsIm5ld1ZhbCIsIm9sZFZhbCIsIkpTT04iLCJzdHJpbmdpZnkiLCIkYXBwbHkiLCJyZWFkeVBpZ21lbnQiLCJtb2RlIiwiJGVtaXQiLCJlcnJNc2ciLCJtZXRob2RzIiwidmlld3MiLCJpbnRlciIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsImNsZWFyQWN0aW9ucyIsInNhdmUiLCJnZXRJbWFnZUxpc3QiLCJkb3duTG9hZEltYWdlcyIsImkiLCJsZW5ndGgiLCJwdXNoIiwidXJsIiwiZ2V0SW1hZ2VJbmZvIiwidGhlbiIsImZpbGUiLCJzdGFydFBhaW50aW5nIiwiaW1hZ2VJbmRleCIsImRyYXdJbWFnZSIsIm1lYXN1cmVUZXh0Iiwid2VweSIsInNob3dNb2RhbCIsInRpdGxlIiwiY29udGVudCIsImRyYXdUZXh0IiwiZHJhd1JlY3QiLCJkcmF3Iiwic2V0U3RvcmFnZVN5bmMiLCJzYXZlSW1hZ2VUb0xvY2FsIiwicGFyYW1zIiwidG9wIiwibGVmdCIsImJvcmRlclJhZGl1cyIsInJlc3RvcmUiLCJNYXhMaW5lTnVtYmVyIiwiYnJlYWtXb3JkIiwiY29sb3IiLCJmb250U2l6ZSIsImxpbmVIZWlnaHQiLCJ0ZXh0QWxpZ24iLCJib2xkZXIiLCJ0ZXh0RGVjb3JhdGlvbiIsImJlZ2luUGF0aCIsInNldFRleHRCYXNlbGluZSIsInNldFRleHRBbGlnbiIsInNldEZpbGxTdHlsZSIsInNldEZvbnRTaXplIiwiZmlsbFRleHQiLCJkcmF3VGV4dExpbmUiLCJmaWxsVG9wIiwibGluZU51bSIsInN1YnN0cmluZyIsImJhY2tncm91bmQiLCJmaWxsUmVjdCIsImNvbnNvbGUiLCJsb2ciLCJvYmpFeHAiLCJSZWdFeHAiLCJ0ZXN0Iiwic3JjIiwicmVzIiwicGF0aCIsIkVycm9yIiwiY2FudmFzVG9UZW1wRmlsZVBhdGgiLCJ4IiwieSIsImNhbnZhc0lkIiwidGVtcEZpbGVQYXRoIiwicmVtb3ZlU3RvcmFnZVN5bmMiLCJnZXRTdG9yYWdlU3luYyIsImNyZWF0ZUNhbnZhc0NvbnRleHQiLCJjb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0lBRXFCQSxNOzs7Ozs7Ozs7Ozs7OzswTEFPakJDLEssR0FBUTtBQUNKQyxzQkFBVTtBQUNOQyxzQkFBTUMsTUFEQTtBQUVOQyx5QkFBUztBQUZIO0FBRE4sUyxRQU9SQyxJLEdBQU87QUFDSEMsd0JBQVksS0FEVDs7QUFHSEMsbUJBQU8sR0FISjtBQUlIQyxvQkFBUSxHQUpMOztBQU1IQyxtQkFBTyxDQU5KO0FBT0hDLHVCQUFXLEVBUFI7QUFRSEMsMEJBQWMsRUFSWDs7QUFVSEMsd0JBQVksS0FWVDtBQVdIQyxpQkFBSyxJQVhGO0FBWUhDLG1CQUFPO0FBWkosUyxRQWVQQyxLLEdBQVE7QUFDSmQsb0JBREksb0JBQ0tlLE1BREwsRUFDYUMsTUFEYixFQUNxQjtBQUNyQixvQkFBSSxDQUFDLEtBQUtMLFVBQVYsRUFBc0I7QUFDbEIsd0JBQUlNLEtBQUtDLFNBQUwsQ0FBZUgsTUFBZixNQUEyQkUsS0FBS0MsU0FBTCxDQUFlRixNQUFmLENBQS9CLEVBQXVEO0FBQ25ELDRCQUFJRCxVQUFVQSxPQUFPVCxLQUFqQixJQUEwQlMsT0FBT1IsTUFBckMsRUFBNkM7QUFDekMsaUNBQUtGLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxpQ0FBS00sVUFBTCxHQUFrQixJQUFsQjtBQUNBLGlDQUFLUSxNQUFMO0FBQ0EsaUNBQUtDLFlBQUw7QUFDSDtBQUNKLHFCQVBELE1BT087QUFDSCw0QkFBSUwsVUFBVUEsT0FBT00sSUFBUCxLQUFnQixNQUE5QixFQUFz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LCJmaWxlIjoiY2FudmFzZHJhd2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcmF3ZXIgZXh0ZW5kcyB3ZXB5LmNvbXBvbmVudCB7XHJcbiAgICAgIC8qKlxyXG4gICAgKiBAYXJndW1lbnRcclxuICAgICogcGFpbnRpbmcgLS0ganNvbuaVsOaNrlxyXG4gICAgKiBAZXZlbnRcclxuICAgICogZ2V0SW1hZ2Ug5riy5p+T5Zu+54mH5a6M5oiQ5ZCO55qE5Zue6LCDXHJcbiAgICAgICoqL1xyXG4gICAgcHJvcHMgPSB7XHJcbiAgICAgICAgcGFpbnRpbmc6IHtcclxuICAgICAgICAgICAgdHlwZTogT2JqZWN0LFxyXG4gICAgICAgICAgICBkZWZhdWx0OiB7fVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZGF0YSA9IHtcclxuICAgICAgICBzaG93Q2FudmFzOiBmYWxzZSxcclxuXHJcbiAgICAgICAgd2lkdGg6IDEwMCxcclxuICAgICAgICBoZWlnaHQ6IDEwMCxcclxuXHJcbiAgICAgICAgaW5kZXg6IDAsXHJcbiAgICAgICAgaW1hZ2VMaXN0OiBbXSxcclxuICAgICAgICB0ZW1wRmlsZUxpc3Q6IFtdLFxyXG5cclxuICAgICAgICBpc1BhaW50aW5nOiBmYWxzZSxcclxuICAgICAgICBjdHg6IG51bGwsXHJcbiAgICAgICAgY2FjaGU6IHt9XHJcbiAgICB9O1xyXG5cclxuICAgIHdhdGNoID0ge1xyXG4gICAgICAgIHBhaW50aW5nKG5ld1ZhbCwgb2xkVmFsKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1BhaW50aW5nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoSlNPTi5zdHJpbmdpZnkobmV3VmFsKSAhPT0gSlNPTi5zdHJpbmdpZnkob2xkVmFsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWwgJiYgbmV3VmFsLndpZHRoICYmIG5ld1ZhbC5oZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93Q2FudmFzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1BhaW50aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWFkeVBpZ21lbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWwgJiYgbmV3VmFsLm1vZGUgIT09IFwic2FtZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJGVtaXQoXCJnZXRJbWFnZVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJNc2c6IFwiY2FudmFzZHJhd2VyOnNhbW1lIHBhcmFtc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbWV0aG9kcyA9IHt9O1xyXG4gICAgcmVhZHlQaWdtZW50KCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgdmlld3NcclxuICAgICAgICB9ID0gdGhpcy5wYWludGluZztcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblxyXG4gICAgICAgIGNvbnN0IGludGVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdHgpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguY2xlYXJBY3Rpb25zKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldEltYWdlTGlzdCh2aWV3cyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvd25Mb2FkSW1hZ2VzKDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgIH1cclxuICAgIGdldEltYWdlTGlzdCh2aWV3cykge1xyXG4gICAgICAgIGNvbnN0IGltYWdlTGlzdCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHZpZXdzW2ldLnR5cGUgPT09IFwiaW1hZ2VcIikge1xyXG4gICAgICAgICAgICAgICAgaW1hZ2VMaXN0LnB1c2godmlld3NbaV0udXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmltYWdlTGlzdCA9IGltYWdlTGlzdDtcclxuICAgIH1cclxuICAgIGRvd25Mb2FkSW1hZ2VzKGluZGV4KSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBpbWFnZUxpc3QsXHJcbiAgICAgICAgICAgIHRlbXBGaWxlTGlzdFxyXG4gICAgICAgIH0gPSB0aGlzO1xyXG4gICAgICAgIGlmIChpbmRleCA8IGltYWdlTGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5nZXRJbWFnZUluZm8oaW1hZ2VMaXN0W2luZGV4XSkudGhlbihmaWxlID0+IHtcclxuICAgICAgICAgICAgICAgIHRlbXBGaWxlTGlzdC5wdXNoKGZpbGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZW1wRmlsZUxpc3QgPSB0ZW1wRmlsZUxpc3Q7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvd25Mb2FkSW1hZ2VzKGluZGV4ICsgMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnRQYWludGluZygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXJ0UGFpbnRpbmcoKSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICB0ZW1wRmlsZUxpc3QsXHJcbiAgICAgICAgICAgIHBhaW50aW5nOiB7XHJcbiAgICAgICAgICAgICAgICB2aWV3c1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSA9IHRoaXM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGltYWdlSW5kZXggPSAwOyBpIDwgdmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHZpZXdzW2ldLnR5cGUgPT09IFwiaW1hZ2VcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3SW1hZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLnZpZXdzW2ldLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogdGVtcEZpbGVMaXN0W2ltYWdlSW5kZXhdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGltYWdlSW5kZXgrKztcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh2aWV3c1tpXS50eXBlID09PSBcInRleHRcIikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmN0eC5tZWFzdXJlVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdlcHkuc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwi5o+Q56S6XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwi5b2T5YmN5b6u5L+h54mI5pys6L+H5L2O77yM5peg5rOV5L2/55SoIG1lYXN1cmVUZXh0IOWKn+iDve+8jOivt+WNh+e6p+WIsOacgOaWsOW+ruS/oeeJiOacrOWQjumHjeivleOAglwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kZW1pdChcImdldEltYWdlXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyTXNnOiBcImNhbnZhc2RyYXdlcjp2ZXJzaW9uIHRvbyBsb3dcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3VGV4dCh2aWV3c1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmlld3NbaV0udHlwZSA9PT0gXCJyZWN0XCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1JlY3Qodmlld3NbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3R4LmRyYXcoZmFsc2UsICgpID0+IHtcclxuICAgICAgICAgICAgd2VweS5zZXRTdG9yYWdlU3luYyhcImNhbnZhc2RyYXdlcl9waWNfY2FjaGVcIiwgdGhpcy5jYWNoZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZUltYWdlVG9Mb2NhbCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZHJhd0ltYWdlKHBhcmFtcykge1xyXG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHVybCxcclxuICAgICAgICAgICAgdG9wID0gMCxcclxuICAgICAgICAgICAgbGVmdCA9IDAsXHJcbiAgICAgICAgICAgIHdpZHRoID0gMCxcclxuICAgICAgICAgICAgaGVpZ2h0ID0gMCxcclxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzID0gMFxyXG4gICAgICAgIH0gPSBwYXJhbXM7XHJcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKHVybCwgbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcbiAgICBkcmF3VGV4dChwYXJhbXMpIHtcclxuICAgICAgICB0aGlzLmN0eC5zYXZlKCk7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBNYXhMaW5lTnVtYmVyID0gMixcclxuICAgICAgICAgICAgYnJlYWtXb3JkID0gZmFsc2UsXHJcbiAgICAgICAgICAgIGNvbG9yID0gXCJibGFja1wiLFxyXG4gICAgICAgICAgICBjb250ZW50ID0gXCJcIixcclxuICAgICAgICAgICAgZm9udFNpemUgPSAxNixcclxuICAgICAgICAgICAgdG9wID0gMCxcclxuICAgICAgICAgICAgbGVmdCA9IDAsXHJcbiAgICAgICAgICAgIGxpbmVIZWlnaHQgPSAyMCxcclxuICAgICAgICAgICAgdGV4dEFsaWduID0gXCJsZWZ0XCIsXHJcbiAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICBib2xkZXIgPSBmYWxzZSxcclxuICAgICAgICAgICAgdGV4dERlY29yYXRpb24gPSBcIm5vbmVcIlxyXG4gICAgICAgIH0gPSBwYXJhbXM7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIHRoaXMuY3R4LnNldFRleHRCYXNlbGluZShcInRvcFwiKTtcclxuICAgICAgICB0aGlzLmN0eC5zZXRUZXh0QWxpZ24odGV4dEFsaWduKTtcclxuICAgICAgICB0aGlzLmN0eC5zZXRGaWxsU3R5bGUoY29sb3IpO1xyXG4gICAgICAgIHRoaXMuY3R4LnNldEZvbnRTaXplKGZvbnRTaXplKTtcclxuXHJcbiAgICAgICAgaWYgKCFicmVha1dvcmQpIHtcclxuICAgICAgICAgICAgdGhpcy5jdHguZmlsbFRleHQoY29udGVudCwgbGVmdCwgdG9wKTtcclxuICAgICAgICAgICAgdGhpcy5kcmF3VGV4dExpbmUobGVmdCwgdG9wLCB0ZXh0RGVjb3JhdGlvbiwgY29sb3IsIGZvbnRTaXplLCBjb250ZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgZmlsbFRleHQgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgZmlsbFRvcCA9IHRvcDtcclxuICAgICAgICAgICAgbGV0IGxpbmVOdW0gPSAxO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRlbnQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZpbGxUZXh0ICs9IFtjb250ZW50W2ldXTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN0eC5tZWFzdXJlVGV4dChmaWxsVGV4dCkud2lkdGggPiB3aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lTnVtID09PSBNYXhMaW5lTnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpICE9PSBjb250ZW50Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbFRleHQgPSBgJHtmaWxsVGV4dC5zdWJzdHJpbmcoMCwgZmlsbFRleHQubGVuZ3RoIC0gMSl9Li4uYDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxUZXh0KGZpbGxUZXh0LCBsZWZ0LCBmaWxsVG9wKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd1RleHRMaW5lKGxlZnQsIGZpbGxUb3AsIHRleHREZWNvcmF0aW9uLCBjb2xvciwgZm9udFNpemUsIGZpbGxUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxUZXh0ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxUZXh0KGZpbGxUZXh0LCBsZWZ0LCBmaWxsVG9wKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdUZXh0TGluZShsZWZ0LCBmaWxsVG9wLCB0ZXh0RGVjb3JhdGlvbiwgY29sb3IsIGZvbnRTaXplLCBmaWxsVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbFRleHQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGxUb3AgKz0gbGluZUhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lTnVtKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jdHguZmlsbFRleHQoZmlsbFRleHQsIGxlZnQsIGZpbGxUb3ApO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdUZXh0TGluZShsZWZ0LCBmaWxsVG9wLCB0ZXh0RGVjb3JhdGlvbiwgY29sb3IsIGZvbnRTaXplLCBmaWxsVGV4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIGlmIChib2xkZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3VGV4dCh7XHJcbiAgICAgICAgICAgICAgICAuLi5wYXJhbXMsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiBsZWZ0ICsgMC4zLFxyXG4gICAgICAgICAgICAgICAgdG9wOiB0b3AgKyAwLjMsXHJcbiAgICAgICAgICAgICAgICBib2xkZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdGV4dERlY29yYXRpb246IFwibm9uZVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRyYXdUZXh0TGluZShsZWZ0LCB0b3AsIHRleHREZWNvcmF0aW9uLCBjb2xvciwgZm9udFNpemUsIGNvbnRlbnQpIHtcclxuICAgICAgICBpZiAodGV4dERlY29yYXRpb24gPT09IFwidW5kZXJsaW5lXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3UmVjdCh7XHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBjb2xvcixcclxuICAgICAgICAgICAgICAgIHRvcDogdG9wICsgZm9udFNpemUgKiAxLjIsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiBsZWZ0IC0gMSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmN0eC5tZWFzdXJlVGV4dChjb250ZW50KS53aWR0aCArIDMsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0ZXh0RGVjb3JhdGlvbiA9PT0gXCJsaW5lLXRocm91Z2hcIikge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdSZWN0KHtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgdG9wOiB0b3AgKyBmb250U2l6ZSAqIDAuNixcclxuICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnQgLSAxLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuY3R4Lm1lYXN1cmVUZXh0KGNvbnRlbnQpLndpZHRoICsgMyxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogMVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBkcmF3UmVjdChwYXJhbXMpIHtcclxuICAgICAgICB0aGlzLmN0eC5zYXZlKCk7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLFxyXG4gICAgICAgICAgICB0b3AgPSAwLFxyXG4gICAgICAgICAgICBsZWZ0ID0gMCxcclxuICAgICAgICAgICAgd2lkdGggPSAwLFxyXG4gICAgICAgICAgICBoZWlnaHQgPSAwXHJcbiAgICAgICAgfSA9IHBhcmFtcztcclxuICAgICAgICB0aGlzLmN0eC5zZXRGaWxsU3R5bGUoYmFja2dyb3VuZCk7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QobGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBnZXRJbWFnZUluZm8odXJsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FjaGVbdXJsXSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInVybFwiLCB1cmwpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRoaXMuY2FjaGVcIiwgdGhpcy5jYWNoZSk7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiB1cmw7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhY2hlW3VybF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgb2JqRXhwID0gbmV3IFJlZ0V4cCgvXmh0dHAocyk/OlxcL1xcLyhbXFx3LV0rXFwuKStbXFx3LV0rKFxcL1tcXHctIC5cXC8/JSY9XSopPy8pO1xyXG4gICAgICAgICAgICBpZiAob2JqRXhwLnRlc3QodXJsKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgd2VweS5nZXRJbWFnZUluZm8oe1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYzogdXJsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMuZXJyTXNnID09PSBcImdldEltYWdlSW5mbzpva1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZVt1cmxdID0gcmVzLnBhdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5wYXRoO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRlbWl0KFwiZ2V0SW1hZ2VcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJNc2c6IFwiY2FudmFzZHJhd2VyOmRvd25sb2FkIGZhaWxcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJnZXRJbWFnZUluZm8gZmFpbFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGVbdXJsXSA9IHVybDtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1cmw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhc3luYyBzYXZlSW1hZ2VUb0xvY2FsKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodFxyXG4gICAgICAgIH0gPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHdlcHkuY2FudmFzVG9UZW1wRmlsZVBhdGgoe1xyXG4gICAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgICB5OiAwLFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICBjYW52YXNJZDogXCJjYW52YXNkcmF3ZXJcIlxyXG4gICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgIGlmIChyZXMuZXJyTXNnID09PSBcImNhbnZhc1RvVGVtcEZpbGVQYXRoOm9rXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zaG93Q2FudmFzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuaXNQYWludGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLnRlbXBGaWxlTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgICAgICB0aGlzLiRlbWl0KFwiZ2V0SW1hZ2VcIiwge1xyXG4gICAgICAgICAgICAgICAgdGVtcEZpbGVQYXRoOiByZXMudGVtcEZpbGVQYXRoLFxyXG4gICAgICAgICAgICAgICAgZXJyTXNnOiBcImNhbnZhc2RyYXdlcjpva1wiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoXCJnZXRJbWFnZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBlcnJNc2c6IFwiY2FudmFzZHJhd2VyOmZhaWxcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgd2VweS5yZW1vdmVTdG9yYWdlU3luYyhcImNhbnZhc2RyYXdlcl9waWNfY2FjaGVcIik7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IHdlcHkuZ2V0U3RvcmFnZVN5bmMoXCJjYW52YXNkcmF3ZXJfcGljX2NhY2hlXCIpIHx8IHt9O1xyXG4gICAgICAgIHRoaXMuY3R4ID0gd2VweS5jcmVhdGVDYW52YXNDb250ZXh0KFwiY2FudmFzZHJhd2VyXCIsIHRoaXMpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==