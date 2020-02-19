$().ready(function () {
    initCarousel(".carousel");
});

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
        slideshowIter: 5
    });
    showArrow($carousel, "left");
    // Add thumbnail sidescroll to #slideShow
    showSlideshowPage($carousel);   
    showArrow($carousel, "right");
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

function showSlideshowPage(el) {
    console.log($('.slideshow').data());
    // TODO: Set first image in slideshow to bigimg
    var $slideshow = el.find('.slideshow');
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
