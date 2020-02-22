$().ready(function () {
    initCarousel(".carousel");
});

function initCarousel(selector) {
    var $carousel = $(selector);
    $("#carousel-template").children().appendTo($carousel);
    setInitImages($carousel);
    setInitData($carousel);
    updateSlideshowElements()
    bind();
}

function setInitImages(el) {
    var images = [];
    var imgId = 0;
    el.find("img[data-src]").each(function () {
        var img = $(this);
        images.push({
            id: imgId,
            src: img.data('src'),
            desc: img.data('desc'),
            href: img.data('link')
        });
       $(this).remove();
        imgId++;
    });
    el.find('.slideshow').data('images', images);
}

function setInitData(el) {
    var imagesLen = getImages().length;
    var size = el.data('size');
    // Ensure size doesn't exceed the total amount of images
    if (size > imagesLen) {
        size = imagesLen;
    }
    // Default value
    if (size <= 0 || size == null) {
        size = 4;
    }
    el.find('.slideshow').data({
        selectedIndex: 0,
        size: size,
        startIndex: 0
    });
}

function setSelectedIndex(id) {
    $('.slideshow').data('selectedIndex', id);
}

function setStartIndex(index) {
    $('.slideshow').data('startIndex', index);
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

function bind() {
    bindArrowClicks();
    bindThumbClicks();
    bindBigImageClick();
    bindArrowKeys()
}

function bindThumbClicks() {
    $('.thumb-wrapper').on('click', function() {
        var imgId = $(this).find('.thumb').data('id');
        // Prevent thumbnail from fading if it's already selected
        if (getSelectedIndex() == imgId) {
            return;
        }
        setSelectedIndex(imgId);
        setSelectedThumb()
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
                selectNextThumb('left');
                break;
            case 39:
                selectNextThumb('right');
                break;
        }
    });
}

function updateSlideshowElements() {
    showThumbnails();
    showArrows();
    setSelectedThumb();
    showBigImage();
}

function removeVisibleThumbs() {
    var visibleThumbs = $('.thumb-wrapper:not(:hidden)');
    visibleThumbs.each(function() {
        $(this).remove();
    });
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
        var thumbWrapper = $('.thumb-wrapper:hidden').clone();
        var thumb = thumbWrapper.find('.thumb');
        thumb.attr({
            src: img['src'],
            alt: img['desc']
        });
        // Set href for bigImg
        $(thumb).data({
            'href': img['href'],
            'id': img['id']
        });
        // Set text under thumb
        $(thumbWrapper).find('span').text(img['desc']);
        thumbWrapper.appendTo('.slideshow').show();
        index++;
    }
}

function showArrows() {
    var maxLength = getImages().length;
    var startIndex = getStartIndex();
    var size = getSize();
    var visibleThumbs = $('.slideshow').find('.thumb:not(:hidden)').length;
    var leftArrow = $('.arrow-left');
    var rightArrow = $('.arrow-right');
    var placeholderLeft = $('.arrow-left-placeholder');
    var placeholderRight = $('.arrow-right-placeholder');
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
        placeholderLeft.hide();
    }
    else {
        leftArrow.hide();
        placeholderLeft.show();
    }

    if (showRightArrow) {
        rightArrow.show();
        placeholderRight.hide();
    }
    else {
        rightArrow.hide();
        placeholderRight.show();
    }
}

function setSelectedThumb() {
    var selectedIndex = getSelectedIndex();
    // Remove selected tag from thumbnails
    $('.thumb-wrapper').removeClass('selected-thumb');
    // Restore opacities back to initial values
    $('.thumb-wrapper:not(:hidden)').each(function() {
        $(this).fadeTo(1, 0.5);
    });
    // Find corresponding thumbnail and set it as selected by fading to max opacity
    $('.thumb-wrapper:not(:hidden)').filter(function() {
        return $(this).find('.thumb').data('id') == selectedIndex
    }).fadeTo(175, 1);
    showBigImage();
}

function clickArrow(direction) {
    var startIndex = getStartIndex();
    var selectedIndex;
    var size = getSize();
    var maxLength = getImages().length;
    if (direction == "left") {
        startIndex -= size;
        if (startIndex < 0) {
            startIndex = 0;
        }
        selectedIndex = startIndex + size - 1;
    }
    else if (direction == "right") {
        startIndex += size;
        if (startIndex >= maxLength) {
            startIndex = maxLength - size;
        }
        selectedIndex = startIndex;
    }
    setStartIndex(startIndex);
    setSelectedIndex(selectedIndex);
    updateSlideshowElements()
    // Bind click events to new thumbs - This is necessary as the thumbs get removed
    //  on each showThumbnails() call
    bindThumbClicks();
}

function selectNextThumb(direction) {
    var selectedIndex = getSelectedIndex();
    var size = getSize();
    var maxLength = getImages().length;
    var visibleThumbs = $('.slideshow').find('.thumb-wrapper:not(:hidden)').length;
    var clickDir;
    if (direction == 'left') {
        if (selectedIndex > 0 && selectedIndex % size == 0) {
            clickDir = 'left';
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
        if (selectedIndex % size == 0 && visibleThumbs == size) {
            clickDir = 'right';
        }
    }
    // One of the ends has been reached.
    if (getSelectedIndex() == selectedIndex) {
        return;
    }
    setSelectedIndex(selectedIndex);
    if (clickDir != "") { 
        // This gets called here instead of in the above expressions to avoid double
        // fading
        clickArrow(clickDir);
    }
    else {
        setSelectedThumb();
    }
}

function showBigImage() {
    // Find image to set as bigImg
    var selectedIndex = getSelectedIndex();
    var image = $('.thumb').filter(function() {
        return $(this).data('id') == selectedIndex;
    });
    // Set background
    var url = $(image).attr('src');
    var bigimg = $('.bigimg');
    $(bigimg).css('background-image', 'url(' + url + ')');
    // Set click href
    var href = $(image).data('href');
    bigimg.data('href', href);
}
