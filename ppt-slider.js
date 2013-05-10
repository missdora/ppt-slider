(function ($) {
  function PPTSlider (ele) {

    this.slider = ele;
    this.curIndex = 0;
    this.curScale = 1;
    this.timer = null;
    this.sliderContainer = this.slider.find('.slider-container');
    this.pages = this.slider.find('div.section');
    this.pageCount = this.pages.length;
    this.windowSize = {
      width: $(window).width(),
      height: $(window).height()
    };

    if ($.browser.msie && $.browser.version < 9) {
      this.noCss3 = true;
    }

    this.init();
  }

  PPTSlider.prototype.init = function () {
    var windowSize = this.windowSize;
    var pageWidth = windowSize.width * 0.6;
    var pageHeight = windowSize.height * 0.8;

    this.pages.width(pageWidth);
    this.pages.height(pageHeight);
    this.slider.append('<div class="nav"><span class="page-no"></span>' +  (this.noCss3 ? '' :  '&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" class="preview">Show Preview</a>') + '</div>');
    this.nav = this.slider.find('.nav');
    this.setNav();
    this.showSlider();

    var self = this;
    $(document).bind('keydown', function (event) {
      if (event.keyCode === 39) {
        self.next();
      } else if (event.keyCode === 37) {
        self.previous();
      }
    });
    $(window).resize(function () {
      self.resize();
    });
    this.slider.delegate('a.preview', 'click', function () {
      self.showPreview();
    }).delegate('.section', 'click', function () {
      var index = $(this).data('page');
      if (self.slider.hasClass('preview')) {
        self.showSlider();
      }
      self.slideTo(index);
    });

    var curIndex = location.hash.substring(1) ? parseInt(location.hash.substring(1))  : 0;
    this.slideTo(isNaN(curIndex) ? 0 : curIndex - 1);
  };

  PPTSlider.prototype.setNav = function () {
    var windowSize = this.windowSize;
    var pos = ($(window).height() - 40 * this.curScale);
    if (this.noCss3) {
      this.nav.css({
        left: 10,
        top: pos
      });
    } else {
      this.setCSS3(this.nav, 'transform', 'rotateZ(0deg) rotateY(0deg) rotateX(0deg) translate3d(10px, ' + pos + 'px, 0px) scale(1)');
    }
  };

  PPTSlider.prototype.showSlider = function () {
    this.slider.removeClass('preview');
    var windowSize = this.windowSize;
    var posLeft = windowSize.width * 0.2;
    var posTop = windowSize.height * 0.1;
    for (var i = 0; i < this.pages.length; i++) {
      var posPages =  (windowSize.width * i + posLeft);
      if (this.noCss3) {
        this.pages.eq(i).css({
          left: posPages,
          top: posTop
        });
      } else {
        this.setCSS3(this.pages.eq(i), 'transform', 'rotateZ(0deg) rotateY(0deg) rotateX(0deg) translate3d(' + posPages + 'px, ' + posTop + 'px, 0px) scale(1)');
      }
      this.pages.eq(i).data('page', i);
    }
  };

  PPTSlider.prototype.showPreview = function () {
    this.setCSS3(this.sliderContainer, 'transform', 'rotateZ(0deg) rotateY(0deg) rotateX(0deg) translate3d(0px, 0px, 0px)');
    this.slider.addClass('preview');
    var windowSize = this.windowSize;
    var width = windowSize.width;
    var height = windowSize.height;
    var posLeft = 0.05 * width;
    for (var i = 0; i < this.pages.length; i++) {
      var rIndex = Math.floor(i / 3);
      var cIndex = i % 3;
      var posX = (cIndex * width * (0.07 + 0.24) + width * 0.07);
      var posY =  (height * 0.01 + rIndex * height * (0.8 * 0.4 + 0.01));
      this.setCSS3(this.pages.eq(i), 'transform', 'rotateZ(0deg) rotateY(0deg) rotateX(0deg) translate3d(' + posX + 'px, ' + posY + 'px, 0px) scale(0.4)');
    }
  };

  PPTSlider.prototype.setCSS3 = function (ele, key, value) {
    var css = {};
    css['-webkit-' + key] = value;
    css['-o-' + key] = value;
    css['-ms-' + key] = value;
    css[key] = value;
    ele.css(css);
  };

  PPTSlider.prototype.next = function () {
    this.slideTo(Math.min(this.curIndex + 1, this.pageCount - 1));
  };
  PPTSlider.prototype.previous = function () {
    this.slideTo(Math.max(this.curIndex - 1, 0));
  };
  PPTSlider.prototype.slideTo = function (index) {
    var width = this.windowSize.width;//$(window).width();
    index = Math.max(index, 0);
    index = Math.min(index, this.pageCount - 1);
    this.curIndex = index;
    this.nav.find('span').text((index + 1) + ' / ' + this.pageCount);
    var pos =  (0 - width * index);
    if (this.noCss3) {
      this.sliderContainer.animate({
        left: pos
      });
    } else {
      this.setCSS3(this.sliderContainer, 'transform', 'rotateZ(0deg) rotateY(0deg) rotateX(0deg) translate3d(' + pos + 'px, 0px, 0px)');
    }
    this.pages.removeClass('current');
    this.pages.eq(index).addClass('current');
    location.hash = '#' + (index + 1);
  };
  PPTSlider.prototype.updatePageNo = function () {};
  PPTSlider.prototype.resize = function () {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(function () {
      location.reload();
    }, 100);
  };
  window.PPTSlider = PPTSlider;
})($);