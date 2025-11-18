(function() {
	"use strict";
    
    window.onload = function(){

        //Header Sticky
        const getHeaderId = document.querySelector(".navbar-area");
        if (getHeaderId) {
            window.addEventListener('scroll', event => {
                const height = 150;
                const { scrollTop } = event.target.scrollingElement;
                document.querySelector('#navbar').classList.toggle('sticky', scrollTop >= height);
            });
        }

        // Back to Top
        let progressPath = document.getElementById("progress-path");
        let progressWrap = document.getElementById("progress-wrap");
        let pathLength = progressPath.getTotalLength();
        progressPath.style.transition = progressPath.style.webkitTransition = "none";
        progressPath.style.strokeDasharray = pathLength + " " + pathLength;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.webkitTransition =
        "stroke-dashoffset 10ms linear";
        
        const onScollEvent = function (event) {
            let scroll = window.scrollY;
            let height = document.body.scrollHeight - window.innerHeight;
            let progress = pathLength - (scroll * pathLength) / height;
            progressPath.style.strokeDashoffset = progress;

            let offset = 50;
                if (window.scrollY > offset) {
                progressWrap.classList.add("active-progress");
                } else {
                progressWrap.classList.remove("active-progress");
            }
        };

        onScollEvent();
            window.onscroll = onScollEvent;
            progressWrap.onclick = function (event) {
            window.scroll({ top: 0, behavior: "smooth" });
            return false;
        };
        
        // Preloader
        const getPreloaderId = document.getElementById('preloader');
        if (getPreloaderId) {
            getPreloaderId.style.display = 'none';
        }

    };

    //Hero Slider
    var hero_sliderOne = new Swiper(".hero-slider-one", {
		loop: true,
		speed: 1500,
		spaceBetween: 0,
        slidesPerView: 1,
        fadeEffect: { crossFade: true },
        effect: "fade",
        autoHeight: true,
        pagination: {
            el: ".hero-pagination",
            clickable: true,
            renderBullet: function (index, className) {
            let number = (index + 1).toString().padStart(2, '0');
            return '<span class="' + className + '">' + number + "</span>";
            },
        },
	});

     //Serice Slider
    var service_sliderOne = new Swiper(".service-slider-one", {
		loop: true,
		speed: 1500,
		spaceBetween: 25,
        slidesPerView: 1,
        autoHeight: true,
        navigation: {
            nextEl: ".service-next",
            prevEl: ".service-prev",
        },
        breakpoints:{
            0: {
                slidesPerView:1
            },
            576: {
                slidesPerView: 2
            },
            768: {
                slidesPerView: 2
            },
            992: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 4
            },
            1400: {
                slidesPerView: 4,
                spaceBetween: 55,
            }
        }
	});

    //Hero Slider
    var hero_slider_one = new Swiper(".hero-img-slider", {
		loop: true,
		speed: 1500,
		spaceBetween: 25,
        slidesPerView: 1,
        autoHeight: true,
        navigation: {
            nextEl: ".hero-next",
            prevEl: ".hero-prev",
        },
        breakpoints:{
            0: {
                slidesPerView: 1
            },
            576: {
                slidesPerView: 1.5
            },
            768: {
                slidesPerView: 2
            },
            992: {
                slidesPerView: 2.5
            },
            1200: {
                slidesPerView: 3
            }
        }
	});

    //Team Slider
    var team_sliderOne = new Swiper(".team-slider-one", {
		loop: true,
		speed: 1500,
		spaceBetween: 25,
        slidesPerView: 1,
        autoHeight: true,
        navigation: {
            nextEl: ".team-next",
            prevEl: ".team-prev",
        },
        breakpoints:{
            0: {
                slidesPerView:1
            },
            768: {
                slidesPerView: 2
            },
            992: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 4
            }
        }
	});

    //Project Slider
    var project_sliderOne = new Swiper(".project-slider-one", {
		loop: true,
		speed: 1500,
		spaceBetween: 25,
        slidesPerView: 1,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false
        },
        breakpoints:{
            0: {
                slidesPerView: 1
            },
            768: {
                slidesPerView:1.1,
                spaceBetween: 25
            },
            992: {
                slidesPerView:1.4,
                spaceBetween: 25
            },
            1200: {
                slidesPerView: 1.5,
                spaceBetween: 25
            },
            1300: {
                slidesPerView: 1.9,
                spaceBetween: 25
            },
            1400: {
                slidesPerView: 1.8,
                spaceBetween: 25
            },
            1600: {
                slidesPerView: 2.2,
                spaceBetween: 30
            },
            1920: {
                slidesPerView: 1.98,
                spaceBetween: 35
            }
        }
	});
    var project_sliderTwo = new Swiper(".project-slider-two", {
		loop: true,
		speed: 1500,
		spaceBetween: 25,
        slidesPerView: 1,
        autoHeight: true,
        // autoplay: {
        //     delay: 4500,
        //     disableOnInteraction: false
        // },
        breakpoints:{
            0: {
                slidesPerView: 1
            },
            768: {
                slidesPerView: 1.5
            },
            992: {
                slidesPerView: 2.1
            },
            1200: {
                slidesPerView: 2.2
            },
            1300: {
                slidesPerView: 2.5,
                spaceBetween: 30
            },
            1400: {
                slidesPerView: 2.85,
                spaceBetween: 50
            }
        }
	});
    var project_sliderTwo = new Swiper(".project-slider-three", {
		loop: true,
		speed: 1500,
		spaceBetween: 25,
        slidesPerView: 1,
        autoHeight: true,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false
        },
        breakpoints:{
            0: {
                slidesPerView: 1
            },
            768: {
                slidesPerView: 1.4
            },
            992: {
                slidesPerView: 1.7
            },
            1200: {
                slidesPerView: 2.2
            },
            1300: {
                slidesPerView: 1.9,
                spaceBetween: 30
            },
            1400: {
                slidesPerView: 1.8,
                spaceBetween: 42
            },
            1600: {
                slidesPerView: 2.18,
                spaceBetween: 42
            }
        }
	});

    //Testimonial Slider
    var testimonial_sliderOne = new Swiper(".testimonial-slider-one", {
		loop: true,
		speed: 1500,
		spaceBetween: 25,
        slidesPerView: 1,
        fadeEffect: { crossFade: true },
        effect: "fade",
        autoHeight: true,
        navigation: {
            nextEl: ".testimonial-next",
            prevEl: ".testimonial-prev",
        },
	});

     //Brand Slider
	var brand_slider = new Swiper(".brand-slider", {
        loop: false,
        speed: 15000,
        freemode: false,
        spaceBetween: 45,
        simulateTouch: false,
        autoplay: {
            delay: 1,
            disableOnInteraction: false
        },
        breakpoints: {
            0: {
                slidesPerView: 2
            },
            576: {
                slidesPerView: 2.5
            },
            768: {
                slidesPerView: 3.5
            },
            992: {
                slidesPerView: 4.5
            },
            1200: {
                slidesPerView: 5.2
            },
            1400: {
                slidesPerView: 6.5
            }
        }
    });

    // Pause autoplay on hover, resume on mouse leave
    // const brandSliderEl = document.querySelector('.brand-slider .swiper-wrapper');
    // brandSliderEl.addEventListener('mouseenter', () => {
    //     brand_slider.autoplay.stop();
    // });
    // brandSliderEl.addEventListener('mouseleave', () => {
    //     brand_slider.autoplay.start();
    // });


    // Counter Js
    if ("IntersectionObserver" in window) {
        let counterObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                let counter = entry.target;
                let target = parseInt(counter.innerText);
                let step = target / 200;
                let current = 0;
                let timer = setInterval(function () {
                    current += step;
                    counter.innerText = Math.floor(current);
                    if (parseInt(counter.innerText) >= target) {
                    clearInterval(timer);
                    }
                }, 10);
                counterObserver.unobserve(counter);
                }
            });
        });
        let counters = document.querySelectorAll(".counter");
            counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }

    //Gsap Mousemove Animation
    document.addEventListener("mousemove", mouseMoveFunc);
    let moveonmouse = gsap.utils.toArray(".moveContent");

    function mouseMoveFunc(e) {
        moveonmouse.forEach((circle, index) => {
            const depth = 65;
            const moveX = (e.pageX - window.innerWidth / 2) / depth;
            const moveY = (e.pageY - window.innerHeight / 2) / depth;
            index ++

            gsap.to(circle, {
            x: moveX * index,
            y: moveY * index,
            });
        });
    }

    //Title Animation With SplitText 
    let splitTitleLines = gsap.utils.toArray(".title-anim");

    splitTitleLines.forEach(splitTextLine => {
        const tl = gsap.timeline({
            scrollTrigger: {
            trigger: splitTextLine,
            start: 'top 90%',
            end: 'bottom 60%',
            scrub: false,
            markers: false,
            toggleActions: 'play none none none'
        }
    });

    const itemSplitted = new SplitText(splitTextLine, { type: "words, lines" });
    gsap.set(splitTextLine, { perspective: 400 });
    itemSplitted.split({ type: "lines" })
    tl.from(itemSplitted.lines, { duration: 1, delay: 0.3, opacity: 0, rotationX: -80, force3D: true, transformOrigin: "top center -50", stagger: 0.1 });
    });

    //Text Reveal Animation
    window.addEventListener("load", function() {
        gsap.registerPlugin(CustomEase);
    
        // Wrap every letter
        const textRevealElements = document.querySelectorAll(".reveal-text");
    
        textRevealElements.forEach((element) => {
            element.innerHTML = element.textContent.replace(
                /([-A-Za-z0-9!$#%^&*@()_+|~=`{}\[\]:";'<>?,.\/]+)/g,
                '<div class="word">$1</div>'
            );
    
            let words = element.querySelectorAll(".word");
            words.forEach((word) => {
                word.innerHTML = word.textContent.replace(
                    /[-A-Za-z0-9!$#%^&*@()_+|~=`{}\[\]:";'<>?,.\/]/g,
                    "<div class='perspective'><div class='letter'><div>$&</div></div></div>"
                );
            });
    
            const letters = element.querySelectorAll(".letter");
    
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: element,
                    toggleActions: "restart none none reset"
                }
            });
            tl.set(element, { autoAlpha: 1 });
            tl.fromTo(
                letters,
                0.6, {
                    transformOrigin: "center",
                    rotationY: 90,
                    x: 30
                }, {
                    rotationY: 0.1,
                    x: 0,
                    stagger: 0.025,
                    ease: CustomEase.create("custom", "M0,0 C0.425,0.005 0,1 1,1 ")
                }
            );
        });
    });
    
    //Gsap Image Tilt Effect
    document.addEventListener("DOMContentLoaded", () => {
        const images = document.querySelectorAll(".tilt-img"); // Select all images

        images.forEach((img) => {
            img.addEventListener("mousemove", (e) => {
                const { width, height, left, top } = img.getBoundingClientRect();
                const x = (e.clientX - left - width / 2) / width * 2;
                const y = (e.clientY - top - height / 2) / height * 2;

                gsap.to(img, {
                    rotateY: x * 15, 
                    rotateX: y * -15, 
                    transformPerspective: 2000,
                    ease: "power2.out",
                    duration: 0.3,
                });
            });

            img.addEventListener("mouseleave", () => {
                gsap.to(img, {
                    rotateY: 0,
                    rotateX: 0,
                    duration: 0.5,
                    ease: "power2.out",
                });
            });
        });
    });

    //Gsap Reveal Shape Animation
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis
    const lenis = new Lenis({
        duration: 1.8,       // Increase for more inertia
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom ease
        smooth: true
    });

    // Animate scroll with requestAnimationFrame
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // ScrollTrigger setup
    ScrollTrigger.scrollerProxy("#smooth-content", {
        scrollTop(value) {
            return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        pinType: document.querySelector("#smooth-content").style.transform ? "transform" : "fixed"
    });

    // Refresh on load
    ScrollTrigger.refresh();

     //Move Element On Scroll
    if (document.querySelector(".move-left")) {
        gsap.to('.move-left', {
            xPercent: -70,
            ease: "none",
            scrollTrigger: {
                trigger: ".move-left",
                start: "top center",
                end: "bottom top",
                scrub: true
            }
        });
    }
    if (document.querySelector(".move-right")) {
        gsap.to('.move-right', {
            xPercent: 70,
            ease: "none",
            scrollTrigger: {
                trigger: ".move-right",
                start: "top center",
                end: "bottom top",
                scrub: true
            }
        });
    }
    if (document.querySelector(".move-top")) {
        gsap.to('.move-top', {
            yPercent: -110,
            ease: "none",
            scrollTrigger: {
                trigger: ".move-top",
                start: "0% 85%",
                end: "100% 10%",
                scrub: true
            }
        });
    }
    if (document.querySelector(".move-bottom")) {
        gsap.to('.move-bottom', {
            yPercent: 110,
            ease: "none",
            scrollTrigger: {
                trigger: ".move-bottom",
                start: "0% 85%",
                end: "100% 0%",
                scrub: true
            }
        });
    }
    
    //Quantity Counter
    var resultEl = document.querySelector(".resultSet"),
    plusMinusWidgets = document.querySelectorAll(".v-counter");

    // Adding event listeners to all plus and minus buttons
    for (var i = 0; i < plusMinusWidgets.length; i++) {
        plusMinusWidgets[i].querySelector(".minusBtn").addEventListener("click", clickHandler);
        plusMinusWidgets[i].querySelector(".plusBtn").addEventListener("click", clickHandler);
    }

    function clickHandler(event) {
        var countEl = event.target.parentNode.querySelector(".count");
        if (event.target.className.match(/\bminusBtn\b/)) {
            countEl.value = Math.max(0, Number(countEl.value) - 1); // Prevents going below zero
        } 
        else if (event.target.className.match(/\bplusBtn\b/)) {
            countEl.value = Number(countEl.value) + 1;
        }
        triggerEvent(countEl, "change");
    }
    function triggerEvent(el, type) {
        if ('createEvent' in document) {
            // Modern browsers (IE9+)
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);
            el.dispatchEvent(e);
        } else {
            // IE 8
            var e = document.createEventObject();
            e.eventType = type;
            el.fireEvent('on' + e.eventType, e);
        }
    }
    
    // Scrollcue
    scrollCue.init();


})();
    
//Custom Cursor
    var cursor = document.querySelector('.cursor');
    var cursorinner = document.querySelector('.cursor-inner');
    var a = document.querySelectorAll('a');

    document.addEventListener('mousemove', function(e){
        var x = e.clientX;
        var y = e.clientY;
        cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
    });

    document.addEventListener('mousemove', function(e){
        var x = e.clientX;
        var y = e.clientY;
        cursorinner.style.left = x + 'px';
        cursorinner.style.top = y + 'px';
    });

    document.addEventListener('mousedown', function(){
        cursor.classList.add('click');
        cursorinner.classList.add('cursorinnerhover')
    });

    document.addEventListener('mouseup', function(){
        cursor.classList.remove('click')
        cursorinner.classList.remove('cursorinnerhover')
    });

    a.forEach(item => {
        item.addEventListener('mouseover', () => {
            cursor.classList.add('hover');
        });
        item.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    })
try {

    // function to set a given theme/color-scheme
    function setTheme(themeName) {
        localStorage.setItem('renius_theme', themeName);
        document.documentElement.className = themeName;
    }
    // function to toggle between light and dark theme
    function toggleTheme() {
        if (localStorage.getItem('renius_theme') === 'theme-dark') {
            setTheme('theme-light');
        } else {
            setTheme('theme-dark');
        }
    }
    // Immediately invoked function to set the theme on initial load
    (function () {
        if (localStorage.getItem('renius_theme') === 'theme-dark') {
            setTheme('theme-dark');
            document.querySelector('.slider-btn').checked = false;
        } else {
            setTheme('theme-light');
        document.querySelector('.slider-btn').checked = true;
        }
    })();

} catch (err) {}