$().ready(function () {
    initCarousel(".carousel");
});

// TODO: Find a way to send the current carousel with the binding of the arrows so that the correct
//  carousel gets changed when they get clicked.

function initCarousel(selector) {
    var $carousel = $(selector);
    $("#carousel-template").children().appendTo($carousel);

    // Add all images in list to array
    var images = [];
    var imgId = 1;
    $carousel.find("img[data-src]").each(function () {
        var img = $(this);
        images.push({
            id: imgId,
            src: img.data('src'),
            alt: img.data('txt'),
            href: img.data('link')
        });
       $(this).remove();
        imgId++;
    });
    var size = $carousel.data('size');
    // Ensure size doesn't exceed the total amount of images
    if (size > images.length) {
        size = images.length;
    }
    $carousel.find('.slideshow').data({
        images: images,
        currentIndex: 0,
        size: size,
        startIndex: 0
    });
    // updateSlideshow($carousel);   
    $carousel.show();
    /* Bind clicks to elements:
     * - Arrows
     * - Visible(?) thumbnails
     */
    doIets();
}

function doIets() {

    bind();
    
    showThumbnails();

    showBigImage();
  
    showArrows();
}

function showThumbnails() {
    removeVisibleThumbs($('.carousel'));
    // Loop through images, show from and to based on index
    var images = $('.slideshow').data('images');
    var index = $('.slideshow').data('startIndex');
    var loopTimes = $('.slideshow').data('size');
    for (var i = 0; i < loopTimes; i++) {
        if (index >= images.length) {
            break;
        }
        var img = images[index];
        var thumb = $('.thumb:hidden').clone();
        thumb.attr({
            src: img['src'],
            alt: img['alt']
        });
        thumb.appendTo('.slideshow').show();
        console.log('Showing thumbnail: ' + index);
        index++;
    }
}

function bind() {
    bindArrowClicks();
    bindThumbClicks();
    bindBigImageClick();
}

function bindThumbClicks() {
    $('.thumb').on('click', function() {
        showBigImage(this);
    });
}

function bindBigImageClick() {

}

function showBigImage(image) {
    //set background
    var url = $(image).data('src');
    var bigimg = $('.bigimg');
    bigimg.css('background-image', 'url(' + src + ')');
    console.log(url);
    //set click href
}

function bindArrowClicks() {
    //zoek arrow links en bind clickArrow('links')
    $('.arrow-left').on('click', function() {
        clickArrow('left');
    });
    
    //zoek arrow rechts en bind clickArrow('rechts')
    $('.arrow-right').on('click', function() {
        clickArrow('right');
    });
}

function clickArrow(direction) {
    var startIndex = $('.slideshow').data('startIndex');
    var size = $('.slideshow').data('size');
    var maxLength = $('.slideshow').data('images').length;
    if (direction == "left") {
        // Set startIndex to startIndex - size
        startIndex -= size;
        if (startIndex < 0) {
            startIndex = 0;
        }
    }
    else if (direction == "right") {
        // Set startIndex to startIndex + size
        startIndex += size;
        if (startIndex >= maxLength) {
            startIndex = maxLength - size + 1;
        }
    }
    $('.slideshow').data('startIndex', startIndex); // Set new start index
    showThumbnails();
    // Aan het einde, update visiibilty van arrows
    showArrows();
}

function showArrows() {
    var maxLength = $('.slideshow').data('images').length;
    var startIndex = $('.slideshow').data('startIndex');
    var size = $('.slideshow').data('size');
    var visibleThumbs = $('.slideshow').find('.thumb:not(:hidden)').length;

    // showLeft is false if id 1 is not visible
    var showLeft = startIndex != 0;
    // showRight is false if visible thumbs are less than images.length - size
    var showRight = startIndex != maxLength - size;
    if (visibleThumbs < size) {
        showRight = false;
    }
    var leftArrow = $('.arrow-left');
    var rightArrow = $('.arrow-right');

    if (showLeft) {
        console.log('showing left arrow');
        leftArrow.show(); 
    }
    else {
        console.log('hiding left arrow');
        leftArrow.hide();
    }

    if (showRight) {
        console.log('showing right arrow');
        rightArrow.show();
    }
    else {
        console.log('hiding right arrow');
        rightArrow.hide();
    }
}





















function updateSlideshow(el) {
    // console.log($('.slideshow').data());
    var $slideshow = el.find('.slideshow');
    removeVisibleThumbs($slideshow);
    var amtOfSlideshowThumbs = $slideshow.data('amtOfThumbs');
    var startIndex = $slideshow.data('startIndex');
    var images = $slideshow.data('images');
    for (var i = startIndex; i < amtOfSlideshowThumbs + startIndex; i++) {
        if (i >= images.length) {
            break;
        }
        var img = images[i];
        var thumb = el.find(".thumb:hidden").clone();
        thumb.attr({
            alt: img.data('txt'),
            src: img.data('src')
        });
        thumb.data('link', img.data('link'))
        thumb.appendTo($slideshow).show();
        bindSetAsBigImg(thumb);
        if (i == startIndex) {
            el.find('.bigimg').attr("style", "background-image: url(" + img.data('src') + ")");
            bindBigImg(thumb);
        }
    }
    if (startIndex + amtOfSlideshowThumbs <= images.length) {  
        $slideshow.data('startIndex', startIndex + amtOfSlideshowThumbs);
        console.log(startIndex + amtOfSlideshowThumbs);
    }
    if (startIndex != 0) {
        showArrow(el, "left");
    }
    if (el.find('.thumb:not(:hidden)').length >= amtOfSlideshowThumbs) {
        showArrow(el, "right");
    }
}

function removeVisibleThumbs(el) {
    var visibleThumbs = el.find('.thumb:not(:hidden)');
    if (visibleThumbs.length < el.data('amtOfThumbs')) {
        return
    }
    visibleThumbs.each(function() {
        $(this).remove();
    });
}

function bindClicksToThumbnails(images) {
    $(images).each(function () {
        $(this).on("click", function () {
            bindBigImg(this);
            window.location.href = $(this).data("link");
        });
    });
}

function bindSetAsBigImg(img) {
    var imgUrl = $(img).attr("src");
    $(img).on("click", function() {
        $(".bigimg").attr("style", "background-image: url(" + imgUrl + ")");
        bindBigImg(this);  // This should be placed elsewhere
    });
}

function scrollThumbsLeft(el) {
    var $slideshow = el.find('.slideshow');
    removeVisibleThumbs($slideshow);
    var amtOfSlideshowThumbs = $slideshow.data('amtOfThumbs');
    var startIndex = $slideshow.data('startIndex');
    var images = $slideshow.data('images');
    // Get current iteration of pages shown
    // Show the currentIter - amtOfThumbs
    // slideSIter = 8
    // amtOfThumbs = 4
    // 8 - 9 - 10 - 11
    // 7 - 6 - 5 - 4
    for (var i = 1; i <= amtOfSlideshowThumbs; i++) {
        if (i >= images.length || i <= 0) {
            break;
        }
        var img = images[startIndex - i];
        var thumb = el.find(".thumb:hidden").clone();
        thumb.attr({
            alt: img.data('txt'),
            src: img.data('src')
        });
        thumb.data('link', img.data('link'))
        thumb.appendTo($slideshow).show();
        bindSetAsBigImg(thumb);
        if (i == startIndex) {
            el.find('.bigimg').attr("style", "background-image: url(" + img.data('src') + ")");
            bindBigImg(thumb);
        }
        console.log(startIndex - i);
    }
    $slideshow.data('startIndex', startIndex - amtOfSlideshowThumbs);
}

function scrollThumbsRight() {

}

function showArrow($el, direction) {
    var $arrow = $el.find(".arrow-" + direction);
    $arrow.attr("style", "background-image: url(img/4.png)");
    $el.find(".arrow-" + direction).replaceWith($arrow);
    if (direction == "left") {
        $($arrow).on("click", function() {
            scrollThumbsLeft($el);    
        });
    }
    else {
        $($arrow).on("click", function() {
            updateSlideshow($('.carousel'));
        });
    }
}

function bindBigImg(img) {
    // TODO: if bound > return
    var dest = $(img).data("link");
    var src = $(img).attr("src");
    $(".carousel .bigimg[style='background-image: url(" + src + ")']").on("click", function () {
        window.location.href = dest;
    });
}
