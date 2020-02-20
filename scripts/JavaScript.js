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
    $carousel.find("img[data-src]").each(function () {
        images.push($(this));
        $(this).remove();
    });
    
    var amtOfThumbs = $carousel.data('size');
    // Ensure size doesn't exceed the total amount of images
    if (amtOfThumbs > images.length) {
        amtOfThumbs = images.length;
    }
    $carousel.find('.slideshow').data({
        images: images,
        currentIndex: 0,
        amtOfThumbs: amtOfThumbs,
        slideshowIter: 0
    });
    //showArrow($carousel, "left");
    // Add thumbnail sidescroll to #slideShow
    updateSlideshow($carousel);   
    //showArrow($carousel, "right");
    /*for (img of images) {
        var carouselThumb = carousel.find(".thumb[src='']").clone();
        carouselThumb.attr({
            src: img.attr("data-src"),
            "data-link": img.attr("data-link"),
            "data-thumb-text": img.attr("data-txt")
        });
        carouselThumb.appendTo(carousel.find(".slideshow"));
    }*/
    // Add first thumbnail to .bigImg
    // Add left and right arrows
    // Show carousel
    //carousel.attr("id", "carousel");
    
    
    //bindBigImg(images[bigImgId - 1]);
    //bindClicksToThumbnails(images);
    $carousel.show();
}

function updateSlideshow(el) {
    // console.log($('.slideshow').data());
    var $slideshow = el.find('.slideshow');
    removeVisibleThumbs($slideshow);
    var amtOfSlideshowThumbs = $slideshow.data('amtOfThumbs');
    var slideShowIter = $slideshow.data('slideshowIter');
    var images = $slideshow.data('images');
    for (var i = slideShowIter; i < amtOfSlideshowThumbs + slideShowIter; i++) {
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
        if (i == slideShowIter) {
            el.find('.bigimg').attr("style", "background-image: url(" + img.data('src') + ")");
            bindBigImg(thumb);
        }
    }
    if (slideShowIter + amtOfSlideshowThumbs <= images.length) {
        $slideshow.data('slideshowIter', slideShowIter + amtOfSlideshowThumbs);
        console.log(slideShowIter + amtOfSlideshowThumbs);
    }
    if (slideShowIter != 0) {
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
    var slideShowIter = $slideshow.data('slideshowIter');
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
        var img = images[slideShowIter - i];
        var thumb = el.find(".thumb:hidden").clone();
        thumb.attr({
            alt: img.data('txt'),
            src: img.data('src')
        });
        thumb.data('link', img.data('link'))
        thumb.appendTo($slideshow).show();
        bindSetAsBigImg(thumb);
        if (i == slideShowIter) {
            el.find('.bigimg').attr("style", "background-image: url(" + img.data('src') + ")");
            bindBigImg(thumb);
        }
        console.log(slideShowIter - i);
    }
    $slideshow.data('slideshowIter', slideShowIter - amtOfSlideshowThumbs);
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
