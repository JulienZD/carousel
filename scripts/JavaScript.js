﻿$().ready(function () {
    initCarousel(".carousel");
});

// TODO: Add arrow key events

function initCarousel(selector) {
    var $carousel = $(selector);
    $("#carousel-template").children().appendTo($carousel);

    // Add all images in list to array
    var images = [];
    var imgId = 0;
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
    // Default value
    if (size <= 0 || size == null) {
        size = 4;
    }
    $carousel.find('.slideshow').data({
        images: images,
        selectedIndex: 0,
        size: size,
        startIndex: 0
    });
    showThumbnails();
    showBigImage();
    showArrows();
    setSelectedThumb();
    bind();
}

function getStartIndex() {
    return $('.slideshow').data('startIndex');
}

function getImages() {
    return $('.slideshow').data('images');
}

function getSize() {
    return $('.slideshow').data('size');
}

function getSelectedIndex() {
    return $('.slideshow').data('selectedIndex');
}

function setSelectedIndex(id) {
    $('.slideshow').data('selectedIndex', id);
}

function setStartIndex(index) {
    $('.slideshow').data('startIndex', index);
}

function showThumbnails() {
    removeVisibleThumbs($('.carousel'));
    var images = getImages();
    var index = getStartIndex();
    var size = getSize();
    // Display thumbnails based on the current start index
    for (var i = 0; i < size; i++) {
        // Prevent indexOutOfBounds
        if (index >= images.length) {
           break;
        }
        var img = images[index];
        var thumb = $('.thumb:hidden').clone();
        thumb.attr({
            src: img['src'],
            alt: img['alt']
        });
        // Set href for bigImg
        $(thumb).data({
            'href': img['href'],
            'id': img['id']
        });
        thumb.appendTo('.slideshow').show();
        index++;
    }
}

function bind() {
    bindArrowClicks();
    bindThumbClicks();
    bindBigImageClick();
    bindArrowKeys()
}

function bindThumbClicks() {
    $('.thumb').on('click', function() {
        var imgId = $(this).data('id');
        setSelectedIndex(imgId);
        setSelectedThumb()
        showBigImage();
    });
}

function bindBigImageClick() {
    $('.bigimg').on('click', function() {
        window.location.href = $(this).data('href');
    });
}

function bindArrowClicks() {
    $('.arrow-left').on('click', function() {
        clickArrow('left');
    });
    
    $('.arrow-right').on('click', function() {
        clickArrow('right');
    });
}

function bindArrowKeys() {
    $(document).keydown(function(e) {
        switch(e.which) {
            case 37:
                // console.log('left ' + getSelectedIndex());
                selectNextThumb('left');
                break;
            case 39:
                // console.log('right ' + getSelectedIndex());
                selectNextThumb('right');
                break;
        }
    });
}

function clickArrow(direction) {
    var startIndex = getStartIndex();
    var size = getSize();
    var maxLength = getImages().length;
    if (direction == "left") {
        startIndex -= size;
        if (startIndex < 0) {
            startIndex = 0;
        }
    }
    else if (direction == "right") {
        startIndex += size;
        if (startIndex >= maxLength) {
            startIndex = maxLength - size;
        }
    }
    // Set new start index
    setStartIndex(startIndex);
    showThumbnails();
    showArrows();
    // Bind click events to new thumbs
    bindThumbClicks();
}

function showArrows() {
    var maxLength = getImages().length;
    var startIndex = getStartIndex();
    var size = getSize();
    var visibleThumbs = $('.slideshow').find('.thumb:not(:hidden)').length;
    var leftArrow = $('.arrow-left');
    var rightArrow = $('.arrow-right');
    // False when id 0 is not visible
    var showLeftArrow = startIndex != 0;
    // False when the amt of visible thumbs is less than images.length - size
    var showRightArrow = startIndex != maxLength - size;
    if (visibleThumbs < size) {
        // Last page has been reached
        showRightArrow = false;
    }
    
    if (showLeftArrow) {
        leftArrow.show(); 
    }
    else {
        leftArrow.hide();
    }

    if (showRightArrow) {
        rightArrow.show();
    }
    else {
        rightArrow.hide();
    }
}

function removeVisibleThumbs() {
    var visibleThumbs = $('.thumb:not(:hidden)');
    visibleThumbs.each(function() {
        $(this).remove();
    });
}

function setSelectedThumb() {
    var selectedIndex = getSelectedIndex();
    // Remove selected tag from thumbnails
    $('.thumb').removeClass('selected-thumb');
    // Find corresponding thumbnail and set it as selected
    $('.thumb').filter(function() {
        return $(this).data('id') == selectedIndex
    }).addClass('selected-thumb');
}

function selectNextThumb(direction) {
    var selectedIndex = getSelectedIndex();
    var size = getSize();
    var maxLength = getImages().length;
    if (direction == 'left') {
        if (selectedIndex > 0 && selectedIndex % size == 0) {
            clickArrow('left');
        }
        selectedIndex -= 1;
        if (selectedIndex < 0) {
            selectedIndex = 0;
        }
    }
    else if (direction == 'right') {
        selectedIndex += 1;
        if (selectedIndex >= maxLength) {
            selectedIndex = maxLength - 1;
        }
        if (selectedIndex % size == 0) {
            clickArrow('right');
        }
    }
    setSelectedIndex(selectedIndex);
    setSelectedThumb();
    showBigImage()
}

function showBigImage() {
    // Find selected image to set as bigImg
    var selectedIndex = getSelectedIndex();
    var image = $('.thumb').filter(function() {
        return $(this).data('id') == selectedIndex
    });
    // Set background
    var url = $(image).attr('src');
    var bigimg = $('.bigimg');
    $(bigimg).css('background-image', 'url(' + url + ')');
    // Set click href
    var href = $(image).data('href');
    bigimg.data('href', href);
}