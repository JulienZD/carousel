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
    $slideshow.data('slideshowIter', slideShowIter + amtOfSlideshowThumbs);
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

function showArrow(el, direction) {
    var carouselArrow = el.find(".arrow-" + direction);
    carouselArrow.attr("style", "background-image: url(img/4.png)");
    el.find(".arrow-" + direction).replaceWith(carouselArrow);
    $(carouselArrow).on("click", function() {
        updateSlideshow($('.carousel'));
        showNextThumbnails(direction);
    });
}

function showNextThumbnails(direction) {
    var carouselSlideshow = $(".slideshow");
    var thumbAmount = carouselSlideshow.find(".thumb").length - 1;
    var iter = carouselSlideshow.attr("data-iter");
    console.log(iter);
    console.log(thumbAmount);
    iter += thumbAmount;
    // if (direction == "left") {
    //     for (var i = 0; i < thumbAmount; i++) {
    //         var carouselThumb = carousel.find(".thumb[src='']").clone();
    //         carouselThumb.attr({
    //             src: images[i + iter].attr("data-src"),
    //             "data-link": images[i + iter].attr("data-link"),
    //             "data-thumb-text": images[i + iter].attr("data-txt")
    //         });
    //         carouselThumb.appendTo(carousel.find(".slideshow")).show();
    //         bindSetAsBigImg(carouselThumb);
    //     }
    // }
    // else {

    // }
}

function bindBigImg(img) {
    // TODO: if bound > return
    var dest = $(img).data("link");
    var src = $(img).attr("src");
    $(".carousel .bigimg[style='background-image: url(" + src + ")']").on("click", function () {
        window.location.href = dest;
    });
}
