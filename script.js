/* ============================================================
   SCRIPT.JS — Your Portfolio Website JavaScript
   ============================================================
   This file handles the interactive parts of your website.
   It's intentionally short and simple — most of the site
   works with just HTML and CSS.

   WHAT THIS FILE DOES:
   1. Adds a shadow to the navigation bar when you scroll down
   2. Opens and closes the mobile hamburger menu
   3. Closes the mobile menu when a nav link is clicked
   4. Automatically puts the current year in the footer copyright
   5. Shows a success message after the contact form is submitted
============================================================ */


/* ============================================================
   HERO ENTRANCE ANIMATIONS
   Fires immediately on page load — no scroll trigger.
   Each hero element animates in sequence via delayed classes.
============================================================ */

(function () {
  var heroGreeting = document.querySelector('.hero-greeting');
  var heroName     = document.querySelector('.hero-name');
  var heroTitle    = document.querySelector('.hero-title');
  var heroTagline  = document.querySelector('.hero-tagline');
  var heroBtns     = document.querySelector('.hero-buttons');
  var heroScroll   = document.getElementById('heroScrollIndicator');

  var items = [
    { el: heroGreeting, delay: 0    },
    { el: heroName,     delay: 300  },
    { el: heroTitle,    delay: 600  },
    { el: heroTagline,  delay: 850  },
    { el: heroBtns,     delay: 1100 },
    { el: heroScroll,   delay: 1400 }
  ];

  items.forEach(function (item) {
    if (!item.el) return;
    setTimeout(function () {
      item.el.classList.add('hero-anim-in');
    }, item.delay);
  });

  // Hide scroll indicator once user scrolls past the hero section
  var heroSection = document.getElementById('hero');
  if (heroScroll && heroSection) {
    window.addEventListener('scroll', function () {
      if (heroSection.getBoundingClientRect().bottom < 0) {
        heroScroll.classList.add('hero-scroll-hide');
      } else {
        heroScroll.classList.remove('hero-scroll-hide');
      }
    }, { passive: true });
  }
}());


/* ============================================================
   1. NAVBAR SCROLL EFFECT
   Adds a border + shadow to the navbar once the user
   scrolls more than 20px down the page.
============================================================ */

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function () {
  if (window.scrollY > 20) {
    // User has scrolled down — add the "scrolled" class
    navbar.classList.add('scrolled');
  } else {
    // User is back at the top — remove the class
    navbar.classList.remove('scrolled');
  }
});


/* ============================================================
   2. MOBILE HAMBURGER MENU
   When the three-line button is clicked on mobile,
   it opens or closes the navigation menu.
============================================================ */

const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', function () {
  // Toggle means: add the class if it's not there, remove it if it is
  navToggle.classList.toggle('active');  // Animates the icon into an X
  navLinks.classList.toggle('open');     // Shows or hides the menu
});


/* ============================================================
   3. CLOSE MOBILE MENU WHEN A LINK IS CLICKED
   After the user taps a nav link on mobile, the menu
   automatically closes so the page content is visible.
============================================================ */

// Get all links inside the navigation menu
const allNavLinks = navLinks.querySelectorAll('a');

allNavLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    // Close the menu by removing both classes
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});


/* ============================================================
   4. AUTOMATIC COPYRIGHT YEAR IN FOOTER
   Automatically shows the current year so you never have
   to manually update it.
============================================================ */

const footerYear = document.getElementById('footerYear');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}


/* ============================================================
   5. LEAD QUALIFICATION FORM — Web3Forms + Calendly
   Submits the form to Web3Forms via fetch (no page reload).
   On success: hides the form and shows a thank-you message
   with an embedded Calendly booking widget.
============================================================ */

const contactForm  = document.getElementById('contactForm');
const formThankYou = document.getElementById('formThankYou');

if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Collect all checked platform checkboxes into one string
    var platforms = Array.from(
      contactForm.querySelectorAll('input[name="platforms"]:checked')
    ).map(function (cb) { return cb.value; }).join(', ');

    // Build the JSON payload for Web3Forms
    var payload = {
      access_key:     '2c8d09cf-34b6-4b15-ac9b-3cec39bbf220',
      subject:        'New Lead Inquiry from Portfolio',
      name:           contactForm.querySelector('[name="name"]').value,
      email:          contactForm.querySelector('[name="email"]').value,
      brand:          contactForm.querySelector('[name="brand"]').value,
      social_profile: contactForm.querySelector('[name="social_profile"]').value,
      client_type:    contactForm.querySelector('[name="client_type"]').value,
      platforms:      platforms || 'None selected',
      challenge:      contactForm.querySelector('[name="challenge"]').value,
      budget:         contactForm.querySelector('[name="budget"]').value,
      timeline:       contactForm.querySelector('[name="timeline"]').value
    };

    fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(payload)
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.success) {
        // Hide the form, reveal the thank-you + Calendly section
        contactForm.hidden = true;
        formThankYou.removeAttribute('hidden');

        // Dynamically load the Calendly embed script only now
        var script = document.createElement('script');
        script.src   = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.onload = function () {
          Calendly.initInlineWidget({
            url:           'https://calendly.com/nisahcamal24/30min',
            parentElement: document.getElementById('calendlyWidget'),
            prefill:       {},
            utm:           {}
          });
        };
        document.head.appendChild(script);
      } else {
        // Submission failed — re-enable the button so they can retry
        submitBtn.textContent = 'Submit Application';
        submitBtn.disabled    = false;
        alert('Something went wrong. Please try again.');
      }
    })
    .catch(function () {
      submitBtn.textContent = 'Submit Application';
      submitBtn.disabled    = false;
      alert('Something went wrong. Please check your connection and try again.');
    });
  });
}


/* ============================================================
   6. PRICING BILLING TOGGLE
   Switches price display between monthly and yearly billing.
   Uses data-monthly / data-yearly attributes on each element
   so no amounts are hardcoded in JavaScript.
============================================================ */

const pricingToggle       = document.getElementById('pricingToggle');
const pricingLabelMonthly = document.getElementById('pricingLabelMonthly');
const pricingLabelYearly  = document.getElementById('pricingLabelYearly');

if (pricingToggle) {
  let isYearly = false;

  // Set initial active label
  pricingLabelMonthly.classList.add('active');

  pricingToggle.addEventListener('click', function () {
    isYearly = !isYearly;
    pricingToggle.setAttribute('aria-pressed', isYearly);
    pricingToggle.classList.toggle('is-yearly', isYearly);

    // Highlight the active period label
    pricingLabelMonthly.classList.toggle('active', !isYearly);
    pricingLabelYearly.classList.toggle('active', isYearly);

    // Swap price amounts
    document.querySelectorAll('.js-price-amount').forEach(function (el) {
      el.textContent = isYearly ? el.dataset.yearly : el.dataset.monthly;
    });

    // Swap period text (/month ↔ /year)
    document.querySelectorAll('.js-price-period').forEach(function (el) {
      el.textContent = isYearly ? el.dataset.yearly : el.dataset.monthly;
    });

    // Swap prefix text (only Operations card uses this)
    document.querySelectorAll('.js-price-prefix').forEach(function (el) {
      el.textContent = isYearly ? el.dataset.yearly : el.dataset.monthly;
    });

    // Animate savings callout in/out
    document.querySelectorAll('.js-savings').forEach(function (el) {
      if (isYearly) {
        el.innerHTML = el.dataset.yearly;
        el.classList.add('visible');
      } else {
        el.innerHTML = '\u00a0'; // non-breaking space preserves height
        el.classList.remove('visible');
      }
    });
  });
}


/* ============================================================
   9. TESTIMONIALS FADE ROTATOR
   One card shown at a time. Auto-advances every 5 seconds.
   Pauses on hover / touch. Supports dots, arrows, and swipe.
============================================================ */

(function () {
  var stage = document.getElementById('testimonialStage');
  if (!stage) return;

  var cards   = Array.from(stage.querySelectorAll('.testimonial-card'));
  var dots    = Array.from(document.querySelectorAll('.testimonial-dot'));
  var prevBtn = document.querySelector('.testimonial-arrow--prev');
  var nextBtn = document.querySelector('.testimonial-arrow--next');
  var total   = cards.length;
  var current = 0;
  var timer   = null;
  var isAnimating = false;

  /* -- Measure all cards and set stage min-height to tallest -- */
  function setStageHeight() {
    var maxH = 0;
    cards.forEach(function (card) {
      // Temporarily pull the card into flow to measure it
      var prevPosition   = card.style.position;
      var prevOpacity    = card.style.opacity;
      var prevVisibility = card.style.visibility;
      card.style.position   = 'relative';
      card.style.opacity    = '0';
      card.style.visibility = 'hidden';
      var h = card.offsetHeight;
      card.style.position   = prevPosition;
      card.style.opacity    = prevOpacity;
      card.style.visibility = prevVisibility;
      if (h > maxH) maxH = h;
    });
    stage.style.minHeight = maxH + 'px';
  }

  /* -- Start the gold progress bar on the given card -- */
  function startProgress(card) {
    var bar = card.querySelector('.testimonial-progress-bar');
    if (!bar) return;
    bar.classList.remove('tc-progress-run');
    void bar.offsetWidth; // force reflow so animation restarts cleanly
    bar.classList.add('tc-progress-run');
  }

  /* -- Stop all progress bars -- */
  function stopProgress() {
    cards.forEach(function (card) {
      var bar = card.querySelector('.testimonial-progress-bar');
      if (bar) bar.classList.remove('tc-progress-run');
    });
  }

  /* -- Transition to a specific card index -- */
  function goTo(nextIndex) {
    if (isAnimating || nextIndex === current) return;
    isAnimating = true;

    var outCard = cards[current];
    var inCard  = cards[nextIndex];

    stopProgress();

    // Update dots
    dots[current].classList.remove('tc-dot-active');
    dots[nextIndex].classList.add('tc-dot-active');

    // Fade out the current card (0.4s ease-in)
    outCard.classList.remove('tc-active');
    outCard.classList.add('tc-exiting');

    // After fade-out (400ms) + gap (100ms) = 500ms, fade in next card
    setTimeout(function () {
      outCard.classList.remove('tc-exiting');

      inCard.classList.add('tc-active'); // transition: 0.5s ease-out

      setTimeout(function () {
        current = nextIndex;
        isAnimating = false;
        startProgress(inCard);
      }, 500); // wait for fade-in to finish

    }, 500);
  }

  function next() { goTo((current + 1) % total); }
  function prev() { goTo((current - 1 + total) % total); }

  /* -- Auto-rotation timer -- */
  function startTimer() {
    stopTimer();
    timer = setInterval(next, 5000);
  }

  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  /* -- Hover: pause rotation and progress -- */
  stage.addEventListener('mouseenter', function () {
    stopTimer();
    stopProgress();
  });
  stage.addEventListener('mouseleave', function () {
    startTimer();
    startProgress(cards[current]);
  });

  /* -- Touch: freeze while user is reading -- */
  stage.addEventListener('touchstart', function () {
    stopTimer();
    stopProgress();
  }, { passive: true });
  stage.addEventListener('touchend', function () {
    startTimer();
    startProgress(cards[current]);
  }, { passive: true });

  /* -- Arrow buttons -- */
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      if (isAnimating) return;
      stopTimer(); prev(); startTimer();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (isAnimating) return;
      stopTimer(); next(); startTimer();
    });
  }

  /* -- Dot navigation -- */
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      if (isAnimating) return;
      var idx = parseInt(dot.dataset.index, 10);
      stopTimer(); goTo(idx); startTimer();
    });
  });

  /* -- Swipe support -- */
  var touchStartX = 0;
  stage.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (isAnimating) return;
      stopTimer();
      if (dx < 0) next(); else prev();
      startTimer();
    }
  }, { passive: true });

  /* -- IntersectionObserver: animate section header on scroll -- */
  var header = document.querySelector('.testimonials-header');
  if (header && window.IntersectionObserver) {
    var headerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          header.classList.add('in-view');
          headerObserver.unobserve(header);
        }
      });
    }, { threshold: 0.2 });
    headerObserver.observe(header);
  }

  /* -- Initialize -- */
  // Set stage height once layout is ready, and again on resize
  setTimeout(setStageHeight, 150);
  window.addEventListener('resize', setStageHeight);

  // Kick off progress bar on first card and start auto-rotation
  startProgress(cards[0]);
  startTimer();

}());


/* ============================================================
   10. SMOOTH SCROLL OFFSET FIX
============================================================ */

/* ============================================================
   11. ABOUT SECTION — Scroll-triggered entrance animations
============================================================ */

(function () {
  if (!window.IntersectionObserver) return;

  var delays = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  var elements = document.querySelectorAll('[data-about-anim]');

  if (!elements.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var idx = parseInt(el.getAttribute('data-about-anim'), 10);
      var delay = delays[idx] !== undefined ? delays[idx] : 0;
      setTimeout(function () {
        el.classList.add('about-anim-in');
      }, delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.15 });

  elements.forEach(function (el) {
    observer.observe(el);
  });
}());


document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (event) {
    const targetId = this.getAttribute('href');

    // Don't do anything for bare # links (like social media placeholders)
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    event.preventDefault();

    // How tall is the navbar? Scroll to that distance above the section
    const navbarHeight = navbar.offsetHeight;
    const targetPosition = targetElement.getBoundingClientRect().top
                           + window.pageYOffset
                           - navbarHeight
                           - 16; // Extra 16px breathing room

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});
