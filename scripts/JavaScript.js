$().ready(function () {
    initCarousel();
});

function initCarousel() {
    var carousel = $(".carousel");
    $("#carousel-template").children().appendTo(carousel);

    // Add all images in list to array
    var images = [];
    $("img[data-src]").each(function () {
        images.push($(this));
        $(this).remove();
    });
    
    // Get size of thumbnail sidescroll size
    if ($(carousel).data('size') > images.length) {
        $(carousel).data('size', images.length);
    }
    $(carousel).removeAttr('data-size');
    carousel.data("data-images", images);
    carousel.find('.slideshow').data('data-');
    //showArrow(carousel, "left");
    
    // Add thumbnail sidescroll to #slideShow
    //showSlideshowPage();   
    //showArrow(carousel, "right");
    /*for (img of images) {
        var carouselThumb = carousel.find(".thumb[src='']").clone();
        carouselThumb.attr({
            src: img.attr("data-src"),
            "data-link": img.attr("data-img-link"),
            "data-thumb-text": img.attr("data-txt")
        });
        carouselThumb.appendTo(carousel.find(".slideshow"));
    }*/
    // Add first thumbnail to #bigImg
    // Add left and right arrows
    // Show carousel
    //carousel.attr("id", "carousel");
    
    
    //bindBigImg(images[bigImgId - 1]);
    //bindClicksToThumbnails(images);
    carousel.show();
}

function showSlideshowPage() {
    // TODO: Set first image in slideshow to bigimg
    var amtOfSlideshowThumbs = $(".carousel").data('size');
    var slideShowIter = 9;
    for (var i = slideShowIter; i < amtOfSlideshowThumbs + slideShowIter; i++) {
        if (i >= images.length) {
            break;
        }
        var img = images[i];
        var carouselThumb = carousel.find(".thumb[src='']").clone();
        carouselThumb.attr({
            src: img.attr("data-src"),
            "data-link": img.attr("data-img-link"),
            "data-thumb-text": img.attr("data-txt")
        });
        carouselThumb.appendTo(carousel.find(".slideshow")).show();
        bindSetAsBigImg(carouselThumb);
    }
}

function bindClicksToThumbnails(images) {
    $(images).each(function () {
        //console.log(this);
        $(this).on("click", function () {
            alert("HEY");
            setBigImg(this);
            window.location.href = $(this).data("img-link");
        });
    });
}

function bindSetAsBigImg(img) {
    var imgUrl = $(img).attr("src");
    $(img).on("click", function() {
        $("#bigimg").attr("style", "background-image: url(" + imgUrl + ")");
    });
}

function showArrow(el, direction) {
    var elname = el.attr('id').split('-')[0];
    // TODO: Remove 'carousel-' from element
    var carouselArrow = el.find("." + elname + "-arrow-" + direction).clone();
    carouselArrow.attr("style", "background-image: url(img/4.png)");
    el.find("." + elname + "-arrow-" + direction).replaceWith(carouselArrow);
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
    //             "data-link": images[i + iter].attr("data-img-link"),
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
    console.log(img);
    var dest = $(img).data("img-link");
    var id = $(img).data("src");
    $("#bigimg[style='background-image: url(" + id + ")']").on("click", function () {
        window.location.href = dest;
    });
}
