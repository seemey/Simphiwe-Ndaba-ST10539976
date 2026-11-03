

// ======================================================
// CATED CLOTHING WEBSITE
// MAIN JAVASCRIPT FILE
//
// 1. Mobile navigation
// 2. Automatic copyright year
// 3. Scroll reveal animations
// 4. Gallery search
// 5. Product price filters
// 6. Gallery image preview
// 7. Keyboard controls
// ======================================================



// ======================================================
// 1. MOBILE NAVIGATION
// ======================================================

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

if (menuToggle && navigation) {

    // OPEN AND CLOSE MOBILE MENU
    menuToggle.addEventListener("click", function () {

        const isOpen = navigation.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

    });


    // CLOSE MENU AFTER CLICKING A LINK
    navigation.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            navigation.classList.remove("open");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation"
            );

        });

    });

}



// ======================================================
// 2. AUTOMATIC COPYRIGHT YEAR
// ======================================================

const currentYear = document.getElementById("currentYear");

if (currentYear) {

    currentYear.textContent = new Date().getFullYear();

}



// ======================================================
// 3. SCROLL REVEAL ANIMATIONS
// ======================================================

// GET ELEMENTS THAT SHOULD APPEAR WHEN SCROLLING

const revealElements = document.querySelectorAll(
    ".introduction, " +
    ".feature-content, " +
    ".value-card, " +
    ".closing-section, " +
    ".about-hero-content, " +
    ".about-story-content, " +
    ".mission-card, " +
    ".vision-card, " +
    ".target-heading, " +
    ".target-content, " +
    ".lookbook-item, " +
    ".clothing-card, " +
    ".gallery-hero-content, " +
    ".collection-heading"
);


// CHECK IF THE BROWSER SUPPORTS INTERSECTION OBSERVER

if ("IntersectionObserver" in window && revealElements.length > 0) {

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.15
        }
    );


    // APPLY REVEAL EFFECT TO EACH ELEMENT

    revealElements.forEach(function (element) {

        element.classList.add("reveal");

        revealObserver.observe(element);

    });

} else {

    // SHOW ELEMENTS IF OBSERVER IS NOT SUPPORTED

    revealElements.forEach(function (element) {

        element.classList.add("show");

    });

}



// ======================================================
// 4. GALLERY ELEMENTS
// ======================================================

// SEARCH INPUT

const gallerySearchInput =
    document.getElementById("gallerySearch");


// PRODUCT CARDS

const clothingCards = Array.from(
    document.querySelectorAll(".clothing-card")
);


// NO RESULTS MESSAGE

const galleryNoResults =
    document.getElementById("galleryNoResults");


// PRICE FILTER BUTTONS

const priceFilterButtons = document.querySelectorAll(
    "[data-price-filter]"
);


// CURRENT PRICE FILTER

let selectedPriceFilter = "all";



// ======================================================
// 5. FILTER AND SEARCH PRODUCTS
// ======================================================

function filterClothing() {

    // GET SEARCH TEXT

    const searchText = gallerySearchInput
        ? gallerySearchInput.value.trim().toLowerCase()
        : "";

    let visibleProducts = 0;


    // CHECK EACH PRODUCT

    clothingCards.forEach(function (card) {

        const productName = (
            card.dataset.search || ""
        ).toLowerCase();

        const productPrice = Number(
            card.dataset.price
        );


        // CHECK SEARCH MATCH

        const matchesSearch =
            productName.includes(searchText);


        // CHECK SELECTED PRICE FILTER

        let matchesPrice = true;


        if (selectedPriceFilter === "below") {

            matchesPrice = productPrice < 1000;

        }

        else if (selectedPriceFilter === "above") {

            matchesPrice = productPrice >= 1000;

        }


        // DISPLAY OR HIDE PRODUCT

        const shouldDisplay =
            matchesSearch && matchesPrice;

        card.hidden = !shouldDisplay;


        if (shouldDisplay) {

            visibleProducts++;

        }

    });


    // DISPLAY NO RESULTS MESSAGE

    if (galleryNoResults) {

        galleryNoResults.hidden =
            visibleProducts !== 0;

    }

}



// SEARCH WHEN CUSTOMER TYPES

if (gallerySearchInput) {

    gallerySearchInput.addEventListener(
        "input",
        filterClothing
    );

}



// ======================================================
// 6. PRICE FILTER BUTTONS
// ======================================================

priceFilterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // GET SELECTED FILTER

        selectedPriceFilter =
            button.dataset.priceFilter;


        // REMOVE ACTIVE CLASS FROM ALL BUTTONS

        priceFilterButtons.forEach(function (item) {

            item.classList.remove("active");

        });


        // ACTIVATE SELECTED BUTTON

        button.classList.add("active");


        // UPDATE PRODUCT DISPLAY

        filterClothing();

    });

});



// ======================================================
// 7. GALLERY IMAGE PREVIEW ELEMENTS
// ======================================================

// IMAGE PREVIEW CONTAINER

const galleryLightbox =
    document.getElementById("galleryLightbox");


// LARGE PREVIEW IMAGE

const galleryPreviewImage =
    document.getElementById("lightboxImage");


// IMAGE CAPTION

const galleryPreviewCaption =
    document.getElementById("lightboxCaption");


// ALL PRODUCT IMAGE BUTTONS

const galleryProductButtons = Array.from(
    document.querySelectorAll(".clothing-image")
);


// CURRENT IMAGE POSITION

let currentGalleryImage = 0;



// GET VISIBLE PRODUCTS FOR IMAGE NAVIGATION

function getVisibleGalleryButtons() {

    return galleryProductButtons.filter(function (button) {

        const card = button.closest(".clothing-card");

        return card && !card.hidden;

    });

}



// ======================================================
// 8. DISPLAY SELECTED GALLERY IMAGE
// ======================================================

function displayGalleryImage(index) {

    if (
        !galleryLightbox ||
        !galleryPreviewImage
    ) {
        return;
    }


    // ONLY USE PRODUCTS CURRENTLY VISIBLE

    const visibleButtons = getVisibleGalleryButtons();


    if (visibleButtons.length === 0) {

        return;

    }


    // KEEP IMAGE INDEX WITHIN THE VALID RANGE

    currentGalleryImage =
        (index + visibleButtons.length)
        % visibleButtons.length;


    const selectedButton =
        visibleButtons[currentGalleryImage];


    const productCard =
        selectedButton.closest(".clothing-card");


    const productTitle =
        productCard.querySelector("h3");


    const productPrice =
        productCard.querySelector(".product-price");


    // GET IMAGE DETAILS

    galleryPreviewImage.src =
        selectedButton.dataset.image;

    galleryPreviewImage.alt =
        productTitle
            ? productTitle.textContent
            : "Cated Clothing product";


    // UPDATE IMAGE CAPTION

    if (galleryPreviewCaption) {

        const title = productTitle
            ? productTitle.textContent
            : "Cated Clothing";

        const price = productPrice
            ? productPrice.textContent
            : "";

        galleryPreviewCaption.textContent =
            title + (price ? " | " + price : "");

    }

}



// ======================================================
// 9. OPEN IMAGE PREVIEW
// ======================================================

function openGalleryPreview(index) {

    if (!galleryLightbox) {

        return;

    }


    // DISPLAY SELECTED IMAGE

    displayGalleryImage(index);


    // OPEN PREVIEW

    galleryLightbox.classList.add("open");

    galleryLightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    // PREVENT BACKGROUND SCROLLING

    document.body.style.overflow = "hidden";

}



// ======================================================
// 10. CLOSE IMAGE PREVIEW
// ======================================================

function closeGalleryPreview() {

    if (!galleryLightbox) {

        return;

    }


    // CLOSE PREVIEW

    galleryLightbox.classList.remove("open");

    galleryLightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    // RESTORE PAGE SCROLLING

    document.body.style.overflow = "";

}



// ======================================================
// 11. CLICK PRODUCT IMAGE TO OPEN PREVIEW
// ======================================================

galleryProductButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // GET ALL CURRENTLY VISIBLE PRODUCT IMAGES

        const visibleButtons =
            getVisibleGalleryButtons();


        // FIND SELECTED IMAGE

        const selectedIndex =
            visibleButtons.indexOf(button);


        if (selectedIndex !== -1) {

            openGalleryPreview(selectedIndex);

        }

    });

});



// ======================================================
// 12. PREVIOUS IMAGE BUTTON
// ======================================================

const galleryPrevious =
    document.getElementById("lightboxPrevious");


if (galleryPrevious) {

    galleryPrevious.addEventListener("click", function () {

        displayGalleryImage(
            currentGalleryImage - 1
        );

    });

}



// ======================================================
// 13. NEXT IMAGE BUTTON
// ======================================================

const galleryNext =
    document.getElementById("lightboxNext");


if (galleryNext) {

    galleryNext.addEventListener("click", function () {

        displayGalleryImage(
            currentGalleryImage + 1
        );

    });

}



// ======================================================
// 14. CLOSE PREVIEW BUTTON
// ======================================================

const galleryClose =
    document.getElementById("lightboxClose");


if (galleryClose) {

    galleryClose.addEventListener(
        "click",
        closeGalleryPreview
    );

}



// ======================================================
// 15. CLOSE PREVIEW WHEN CLICKING OUTSIDE IMAGE
// ======================================================

if (galleryLightbox) {

    galleryLightbox.addEventListener(
        "click",
        function (event) {

            if (event.target === galleryLightbox) {

                closeGalleryPreview();

            }

        }
    );

}



// ======================================================
// 16. KEYBOARD CONTROLS
// ======================================================

document.addEventListener(
    "keydown",
    function (event) {

        // CHECK IF IMAGE PREVIEW IS OPEN

        if (
            !galleryLightbox ||
            !galleryLightbox.classList.contains("open")
        ) {

            return;

        }


        // ESCAPE = CLOSE IMAGE PREVIEW

        if (event.key === "Escape") {

            closeGalleryPreview();

        }


        // RIGHT ARROW = NEXT IMAGE

        if (event.key === "ArrowRight") {

            displayGalleryImage(
                currentGalleryImage + 1
            );

        }


        // LEFT ARROW = PREVIOUS IMAGE

        if (event.key === "ArrowLeft") {

            displayGalleryImage(
                currentGalleryImage - 1
            );

        }

    }
);



// ======================================================
// END OF CATED CLOTHING JAVASCRIPT
// ======================================================
