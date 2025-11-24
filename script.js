(function () {
  "use strict";

  var effectStylesLoaded = false;

  function ensureEffectStyles() {
    if (effectStylesLoaded) return;
    effectStylesLoaded = true;
    var head = document.head || document.getElementsByTagName("head")[0];
    if (!head) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "style.css";
    head.appendChild(link);
  }

  // Easter egg: Console messages
  console.log("%cHold up!", "color: red; font-size: 20px; font-weight: bold;");
  console.log(
    "%cDid you just open the console? Nice! 👋",
    "color: blue; font-size: 14px;"
  );
  console.log(
    "%cYou found an Easter egg! Try clicking the button multiple times...",
    "color: green; font-size: 12px;"
  );
  console.log("Or try: UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A");

  // Track button clicks for Easter egg
  var clickCount = 0;
  var konamiCode = [];
  var konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];

  // Konami code listener
  document.addEventListener("keydown", function (e) {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
      konamiCode.shift();
    }
    if (
      konamiCode.length === konamiSequence.length &&
      konamiCode.every((code, i) => code === konamiSequence[i])
    ) {
      console.log(
        "%c🎉 KONAMI CODE ACTIVATED! 🎉",
        "color: gold; font-size: 24px; font-weight: bold;"
      );
      alert(
        "🎉 Konami Code Activated! You've unlocked developer mode! (Not really, but nice try!)"
      );
    }
  });

  function rafSleep(ms) {
    return new Promise(function (resolve) {
      var start = performance.now();
      function tick(now) {
        now - start >= ms ? resolve() : requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  var addBtn = document.getElementById("addCssBtn");

  if (addBtn) {
    addBtn.addEventListener("click", function handleClick() {
      clickCount++;
      if (clickCount === 1) {
        addBtn.removeEventListener("click", handleClick);
        ensureEffectStyles();
        startAnimation();
      } else if (clickCount === 2) {
        console.log("Haha, nice try! Already processing...");
        addBtn.style.animation = "shake 0.5s";
        setTimeout(() => {
          addBtn.style.animation = "";
        }, 500);
      }
    });
  }

  // Blackhole navigation effect
  var globalClickCount = 0;
  var blackholeActive = false;

  document.addEventListener("click", function (e) {
    // Don't count button clicks for blackhole
    if (e.target === addBtn || (addBtn && addBtn.contains(e.target))) {
      return;
    }

    globalClickCount++;

    // Trigger blackhole on third click
    if (globalClickCount === 3 && !blackholeActive) {
      blackholeActive = true;
      ensureEffectStyles();
      startBlackholeEffect();
    }
  });

  // Collect all text-containing elements
  function collectTextElements() {
    var selectors = [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "li",
      "strong",
      "a",
      "button",
      "span",
      "div",
      "label",
      "td",
      "th",
    ];
    var elements = [];
    var processed = [];

    function isProcessed(el) {
      return processed.indexOf(el) !== -1;
    }

    function markProcessed(el) {
      if (processed.indexOf(el) === -1) {
        processed.push(el);
      }
    }

    for (var i = 0; i < selectors.length; i++) {
      var nodes = document.querySelectorAll(selectors[i]);
      for (var j = 0; j < nodes.length; j++) {
        var el = nodes[j];

        // Skip if already processed or if part of another collected element
        if (isProcessed(el)) continue;

        // Skip if element is hidden or has no text content
        var rect = el.getBoundingClientRect();
        var computedStyle = window.getComputedStyle(el);
        if (
          computedStyle.display === "none" ||
          computedStyle.visibility === "hidden" ||
          computedStyle.opacity === "0" ||
          rect.width === 0 ||
          rect.height === 0
        ) {
          continue;
        }

        // Get text content
        var text = el.textContent ? el.textContent.trim() : "";
        if (text.length === 0) continue;

        // Skip if parent is already collected (to avoid duplicates)
        var parentCollected = false;
        var parent = el.parentElement;
        while (parent && parent !== document.body) {
          if (isProcessed(parent)) {
            parentCollected = true;
            break;
          }
          parent = parent.parentElement;
        }
        if (parentCollected) continue;

        // Store element info (account for scroll position)
        var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        var centerX = rect.left + rect.width / 2 + scrollX;
        var centerY = rect.top + rect.height / 2 + scrollY;

        elements.push({
          element: el,
          originalX: centerX,
          originalY: centerY,
          originalRect: rect,
          text: text,
          consumed: false,
          distance: 0,
        });

        markProcessed(el);
      }
    }

    return elements;
  }

  // Calculate distance from blackhole center
  function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  // Animate text element being pulled into blackhole
  function pullTextElement(
    textData,
    blackholeCenterX,
    blackholeCenterY,
    duration
  ) {
    return new Promise(function (resolve) {
      var el = textData.element;
      var startX = textData.originalX;
      var startY = textData.originalY;

      // Calculate angle to blackhole
      var angle = Math.atan2(
        blackholeCenterY - startY,
        blackholeCenterX - startX
      );

      // Store original styles
      var originalPosition = window.getComputedStyle(el).position;
      var originalZIndex = window.getComputedStyle(el).zIndex;
      var originalTransform = window.getComputedStyle(el).transform;

      // Make element position relative to viewport
      if (originalPosition === "static") {
        el.style.position = "fixed";
      } else {
        el.style.position = originalPosition;
      }

      el.style.zIndex = "9999";
      // Convert to viewport coordinates (fixed positioning uses viewport, not document)
      var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      el.style.left = startX - scrollX - textData.originalRect.width / 2 + "px";
      el.style.top = startY - scrollY - textData.originalRect.height / 2 + "px";
      el.style.width = textData.originalRect.width + "px";
      el.style.height = textData.originalRect.height + "px";

      var startTime = performance.now();
      var startRotation = Math.random() * 20 - 10; // Random rotation between -10 and 10 degrees

      function animate(now) {
        var t = Math.min(1, (now - startTime) / duration);

        // Easing function (ease-in)
        var eased = t * t;

        // Calculate position (convert to viewport coordinates)
        var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        var currentX = startX + (blackholeCenterX - startX) * eased;
        var currentY = startY + (blackholeCenterY - startY) * eased;
        var viewportX = currentX - scrollX;
        var viewportY = currentY - scrollY;
        var startViewportX = startX - scrollX;
        var startViewportY = startY - scrollY;

        // Update fixed position
        el.style.left = viewportX - textData.originalRect.width / 2 + "px";
        el.style.top = viewportY - textData.originalRect.height / 2 + "px";

        // Rotation (slight rotation as it's pulled)
        var rotation = startRotation + eased * 15;

        // Scale down
        var scale = 1 - eased * 0.7;

        // Opacity fade
        var opacity = 1 - eased;

        // Apply transforms
        el.style.transform = "rotate(" + rotation + "deg) scale(" + scale + ")";
        el.style.opacity = opacity;

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          // Remove element when fully consumed
          if (el.parentNode) {
            el.style.display = "none";
          }
          resolve();
        }
      }

      requestAnimationFrame(animate);
    });
  }

  // Main blackhole effect
  async function startBlackholeEffect() {
    ensureEffectStyles();
    var reduceMotion = false;
    try {
      reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {}

    if (reduceMotion) {
      // Skip to redirect for reduced motion
      window.location.href = "https://www.anshkumartripathi.space";
      return;
    }

    // Collect all text elements
    var textElements = collectTextElements();
    if (textElements.length === 0) {
      // No text to consume, just redirect
      window.location.href = "https://www.anshkumartripathi.space";
      return;
    }

    // Get viewport center (fixed positioning is relative to viewport)
    var viewportCenterX = window.innerWidth / 2;
    var viewportCenterY = window.innerHeight / 2;

    // Also get document center for distance calculations
    var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var documentCenterX = viewportCenterX + scrollX;
    var documentCenterY = viewportCenterY + scrollY;

    // Create blackhole element
    var blackhole = document.createElement("div");
    blackhole.style.position = "fixed";
    blackhole.style.left = viewportCenterX + "px";
    blackhole.style.top = viewportCenterY + "px";
    blackhole.style.width = "0px";
    blackhole.style.height = "0px";
    blackhole.style.borderRadius = "50%";
    blackhole.style.backgroundColor = "#000000";
    blackhole.style.background =
      "radial-gradient(circle, #000000 0%, #1a1a1a 50%, #000000 100%)";
    blackhole.style.transform = "translate(-50%, -50%)";
    blackhole.style.transformOrigin = "center center";
    blackhole.style.zIndex = "10000";
    blackhole.style.pointerEvents = "none";
    blackhole.style.boxShadow =
      "0 0 20px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba(0, 0, 0, 0.9)";
    document.body.appendChild(blackhole);

    // Phase 1: Spawn blackhole (0.3s)
    var initialRadius = 30;
    blackhole.style.width = initialRadius * 2 + "px";
    blackhole.style.height = initialRadius * 2 + "px";
    blackhole.style.transition =
      "width 0.6s cubic-bezier(0.4, 0, 0.2, 1), height 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    blackhole.style.animation = "blackholeSpawn 0.3s ease-out forwards";
    await rafSleep(300);

    // Add spinning animation (manually rotate while maintaining translate)
    var spinAngle = 0;
    var spinStart = performance.now();
    var spinning = true;
    function spin() {
      if (!spinning || !blackhole.parentNode) return;
      var elapsed = (performance.now() - spinStart) / 1000;
      spinAngle = (elapsed * 60) % 360; // 60 degrees per second
      blackhole.style.transform =
        "translate(-50%, -50%) rotate(" + spinAngle + "deg)";
      requestAnimationFrame(spin);
    }
    requestAnimationFrame(spin);

    var currentRadius = initialRadius;
    var consumedCount = 0;
    var proximityThreshold = 150;
    // Calculate maxRadius to cover more than half the viewport (using diagonal to ensure coverage)
    var maxDimension = Math.max(window.innerWidth, window.innerHeight);
    var diagonal = Math.sqrt(
      window.innerWidth * window.innerWidth +
        window.innerHeight * window.innerHeight
    );
    var maxRadius = diagonal * 1.4; // Grow far beyond viewport to ensure everything is consumed

    // Phase 2: Text consumption - Section-wise (top and bottom sections simultaneously)
    var consuming = false;
    var consumptionInterval = setInterval(function () {
      if (consuming) return;

      // Divide elements into top and bottom sections based on Y position
      var topSection = [];
      var bottomSection = [];
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var viewportHeight = window.innerHeight;
      var centerYViewport = viewportHeight / 2 + scrollY;

      for (var i = 0; i < textElements.length; i++) {
        if (textElements[i].consumed) continue;

        // Calculate distance using document coordinates
        var distance = getDistance(
          textElements[i].originalX,
          textElements[i].originalY,
          documentCenterX,
          documentCenterY
        );
        textElements[i].distance = distance;

        if (distance <= currentRadius + proximityThreshold) {
          // Categorize by vertical position
          if (textElements[i].originalY < centerYViewport) {
            topSection.push(textElements[i]);
          } else {
            bottomSection.push(textElements[i]);
          }
        }
      }

      // Sort sections by distance (closest first)
      topSection.sort(function (a, b) {
        return a.distance - b.distance;
      });
      bottomSection.sort(function (a, b) {
        return a.distance - b.distance;
      });

      var acceleration = consumedCount / textElements.length; // 0 to 1

      // Process one from top and one from bottom simultaneously for realism
      var hasElements = topSection.length > 0 || bottomSection.length > 0;

      if (hasElements) {
        consuming = true;

        // Determine animation duration based on progress and blackhole size
        // Larger blackhole = faster consumption (inverse relationship)
        var sizeFactor = Math.min(1, currentRadius / (maxRadius * 0.5)); // 0 to 1 as blackhole grows
        var baseDuration = acceleration < 0.8 ? 1000 : 500; // Faster near the end
        var duration =
          baseDuration * (1 - acceleration * 0.5) * (1 - sizeFactor * 0.6); // Up to 60% faster with larger size
        if (currentRadius >= maxRadius * 0.98) {
          duration = Math.max(120, duration / 5);
        }

        var promises = [];
        var consumedThisBatch = 0;

        // Process top section element
        if (topSection.length > 0) {
          var topElement = topSection[0];
          topElement.consumed = true;
          promises.push(
            pullTextElement(
              topElement,
              documentCenterX,
              documentCenterY,
              duration
            )
          );
          consumedCount++;
          consumedThisBatch++;
        }

        // Process bottom section element
        if (bottomSection.length > 0) {
          var bottomElement = bottomSection[0];
          bottomElement.consumed = true;
          promises.push(
            pullTextElement(
              bottomElement,
              documentCenterX,
              documentCenterY,
              duration
            )
          );
          consumedCount++;
          consumedThisBatch++;
        }

        // Grow blackhole continuously based on progress
        var progress =
          Math.min(1, consumedCount / Math.max(1, textElements.length));
        var targetRadius =
          initialRadius + progress * (maxRadius - initialRadius);
        if (targetRadius > currentRadius) {
          currentRadius = targetRadius;
          blackhole.style.width = currentRadius * 2 + "px";
          blackhole.style.height = currentRadius * 2 + "px";
        }

        // Wait for batch to complete
        Promise.all(promises).then(function () {
          consuming = false;

          // Check if all consumed
          if (consumedCount >= textElements.length) {
            clearInterval(consumptionInterval);
          }
        });
      } else if (consumedCount >= textElements.length) {
        clearInterval(consumptionInterval);
      } else {
        // Passive growth so the blackhole keeps expanding even between batches
        if (currentRadius < maxRadius) {
          currentRadius = Math.min(maxRadius, currentRadius + 8);
          blackhole.style.width = currentRadius * 2 + "px";
          blackhole.style.height = currentRadius * 2 + "px";
        }
      }
    }, 50);

    // Wait for all text to be consumed (increased timeout to allow full animation)
    var maxWaitTime = 10000; // 30 seconds max (increased from 15)
    var waitStart = performance.now();
    while (
      consumedCount < textElements.length &&
      performance.now() - waitStart < maxWaitTime
    ) {
      await rafSleep(100);
    }
    clearInterval(consumptionInterval);

    // Ensure all remaining elements are consumed quickly (halved for 2x speed)
    for (var k = 0; k < textElements.length; k++) {
      if (!textElements[k].consumed) {
        textElements[k].consumed = true;
        await pullTextElement(
          textElements[k],
          documentCenterX,
          documentCenterY,
          150
        );
        consumedCount++;
      }
    }

    await rafSleep(200);

    // Phase 4: Shrink and explosion (0.7-0.8s)
    // Stop spinning
    spinning = false;
    blackhole.style.transform = "translate(-50%, -50%)";

    // Shrink animation (0.5s)
    blackhole.style.transition = "width 0.5s ease-in, height 0.5s ease-in";
    blackhole.style.width = "0px";
    blackhole.style.height = "0px";
    await rafSleep(500);

    // Phase 4.5: Gravitational ripple effect (expands to full screen)
    var maxDimension = Math.max(window.innerWidth, window.innerHeight);
    var rippleSize = Math.sqrt(maxDimension * maxDimension * 2); // Diagonal to cover full screen

    var ripple1 = document.createElement("div");
    ripple1.style.position = "fixed";
    ripple1.style.left = viewportCenterX + "px";
    ripple1.style.top = viewportCenterY + "px";
    ripple1.style.width = "100px";
    ripple1.style.height = "100px";
    ripple1.style.borderRadius = "50%";
    ripple1.style.border = "3px solid #87CEEB";
    ripple1.style.backgroundColor = "transparent";
    ripple1.style.transform = "translate(-50%, -50%)";
    ripple1.style.transformOrigin = "center center";
    ripple1.style.zIndex = "10001";
    ripple1.style.pointerEvents = "none";
    ripple1.style.animation = "gravitationalRipple 2s ease-out forwards";
    document.body.appendChild(ripple1);

    // Second ripple with slight delay for layered effect
    await rafSleep(200);
    var ripple2 = document.createElement("div");
    ripple2.style.position = "fixed";
    ripple2.style.left = viewportCenterX + "px";
    ripple2.style.top = viewportCenterY + "px";
    ripple2.style.width = "100px";
    ripple2.style.height = "100px";
    ripple2.style.borderRadius = "50%";
    ripple2.style.border = "3px solid #87CEEB";
    ripple2.style.backgroundColor = "transparent";
    ripple2.style.transform = "translate(-50%, -50%)";
    ripple2.style.transformOrigin = "center center";
    ripple2.style.zIndex = "10001";
    ripple2.style.pointerEvents = "none";
    ripple2.style.animation = "gravitationalRipple 2s ease-out forwards";
    document.body.appendChild(ripple2);

    // Monitor ripple expansion and trigger explosion when it reaches edge
    var explosionTriggered = false;
    var rippleStartSize = 100; // Starting size of ripple
    var maxRippleScale = 50; // From CSS animation scale(50)
    var rippleFinalSize = rippleStartSize * maxRippleScale; // Final size when fully scaled

    // Monitor ripple until it reaches the edge
    function monitorRipple() {
      if (explosionTriggered) return;

      var rect1 = ripple1.getBoundingClientRect();
      var ripple1Top = rect1.top;
      var ripple1Bottom = rect1.bottom;
      var ripple1Left = rect1.left;
      var ripple1Right = rect1.right;

      // Check if ripple reached y=0 (top edge) or any screen edge
      // Since ripple is centered with translate(-50%, -50%), we check if edges hit screen boundaries
      if (
        ripple1Top <= 0 || // Reached top edge (y=0)
        ripple1Bottom >= window.innerHeight || // Reached bottom edge
        ripple1Left <= 0 || // Reached left edge (x=0)
        ripple1Right >= window.innerWidth // Reached right edge
      ) {
        explosionTriggered = true;
        triggerExplosion();
        return;
      }

      requestAnimationFrame(monitorRipple);
    }
    requestAnimationFrame(monitorRipple);

    // Fallback: if ripple doesn't reach edge within 3 seconds, trigger anyway
    setTimeout(function () {
      if (!explosionTriggered) {
        explosionTriggered = true;
        triggerExplosion();
      }
    }, 3000);

    // Phase 5: Explosion function (called when ripple reaches edge)
    async function triggerExplosion() {
      // Note: Ripples continue their animation - we don't remove them
      // They'll complete their 2s animation naturally

      // Calculate final size needed to cover entire viewport (diagonal distance from center to corner)
      var viewportDiagonal = Math.sqrt(
        window.innerWidth * window.innerWidth +
          window.innerHeight * window.innerHeight
      );
      var explosionStartSize = 60; // Starting size in pixels
      var voidStartSize = 40; // Starting size in pixels
      var explosionEndSize = viewportDiagonal * 1.2; // Cover diagonal + 20% margin
      var voidEndSize = viewportDiagonal * 1.2; // Cover diagonal + 20% margin

      // Outer circle: Explosion (white → orange → red)
      var explosionOuter = document.createElement("div");
      explosionOuter.style.position = "fixed";
      explosionOuter.style.left = viewportCenterX + "px";
      explosionOuter.style.top = viewportCenterY + "px";
      explosionOuter.style.width = explosionStartSize + "px";
      explosionOuter.style.height = explosionStartSize + "px";
      explosionOuter.style.borderRadius = "50%";
      explosionOuter.style.backgroundColor = "rgba(255, 255, 255, 1)";
      explosionOuter.style.transform = "translate(-50%, -50%)";
      explosionOuter.style.transformOrigin = "center center";
      explosionOuter.style.zIndex = "10002";
      explosionOuter.style.pointerEvents = "none";
      explosionOuter.style.transition =
        "width 2.5s ease-out, height 2.5s ease-out, background-color 2.5s ease-out, opacity 2.5s ease-out";
      document.body.appendChild(explosionOuter);

      // Trigger expansion by setting final size
      setTimeout(function () {
        explosionOuter.style.width = explosionEndSize + "px";
        explosionOuter.style.height = explosionEndSize + "px";
        // Color transitions
        setTimeout(function () {
          explosionOuter.style.backgroundColor = "rgba(255, 200, 100, 1)";
        }, 375); // 15% of 2.5s
        setTimeout(function () {
          explosionOuter.style.backgroundColor = "rgba(255, 150, 0, 1)";
        }, 750); // 30% of 2.5s
        setTimeout(function () {
          explosionOuter.style.backgroundColor = "rgba(255, 100, 0, 1)";
          explosionOuter.style.opacity = "0.9";
        }, 1250); // 50% of 2.5s
        setTimeout(function () {
          explosionOuter.style.backgroundColor = "rgba(255, 50, 0, 0.8)";
          explosionOuter.style.opacity = "0.85";
        }, 1750); // 70% of 2.5s
      }, 10);

      // Inner circle: Black void (starts slightly after outer, expands outward)
      await rafSleep(100); // Delay inner circle by 100ms
      var voidInner = document.createElement("div");
      voidInner.style.position = "fixed";
      voidInner.style.left = viewportCenterX + "px";
      voidInner.style.top = viewportCenterY + "px";
      voidInner.style.width = voidStartSize + "px";
      voidInner.style.height = voidStartSize + "px";
      voidInner.style.borderRadius = "50%";
      voidInner.style.backgroundColor = "rgba(0, 0, 0, 1)";
      voidInner.style.transform = "translate(-50%, -50%)";
      voidInner.style.transformOrigin = "center center";
      voidInner.style.zIndex = "10003"; // Above outer explosion
      voidInner.style.pointerEvents = "none";
      voidInner.style.transition = "width 2.5s ease-out, height 2.5s ease-out";
      document.body.appendChild(voidInner);

      // Trigger expansion by setting final size
      setTimeout(function () {
        voidInner.style.width = voidEndSize + "px";
        voidInner.style.height = voidEndSize + "px";
      }, 10);

      await rafSleep(2600); // Wait for both circles to fully expand

      // Continue with final black screen and redirect
      continueAfterExplosion();
    }

    // Function to continue after explosion completes
    async function continueAfterExplosion() {
      // Ensure screen is fully black after explosion
      var finalBlack = document.createElement("div");
      finalBlack.style.position = "fixed";
      finalBlack.style.left = "0";
      finalBlack.style.top = "0";
      finalBlack.style.width = "100vw";
      finalBlack.style.height = "100vh";
      finalBlack.style.backgroundColor = "rgba(0, 0, 0, 1)";
      finalBlack.style.zIndex = "10004";
      finalBlack.style.pointerEvents = "none";
      document.body.appendChild(finalBlack);
      await rafSleep(200);

      // Phase 5: Redirect
      window.location.href = "https://www.anshkumartripathi.space";
    }
  }

  // Mouse trail effect (subtle)
  var trailElements = [];
  document.addEventListener("mousemove", function (e) {
    if (clickCount > 0) {
      var trail = document.createElement("div");
      trail.style.position = "fixed";
      trail.style.left = e.clientX + "px";
      trail.style.top = e.clientY + "px";
      trail.style.width = "4px";
      trail.style.height = "4px";
      trail.style.backgroundColor =
        "#" + Math.floor(Math.random() * 16777215).toString(16);
      trail.style.pointerEvents = "none";
      trail.style.zIndex = "9998";
      trail.style.borderRadius = "50%";
      document.body.appendChild(trail);
      trailElements.push(trail);
      setTimeout(function () {
        trail.style.opacity = "0";
        trail.style.transition = "opacity 0.3s";
        setTimeout(function () {
          if (trail.parentNode) trail.parentNode.removeChild(trail);
          var idx = trailElements.indexOf(trail);
          if (idx > -1) trailElements.splice(idx, 1);
        }, 300);
      }, 100);
      if (trailElements.length > 20) {
        var old = trailElements.shift();
        if (old && old.parentNode) old.parentNode.removeChild(old);
      }
    }
  });

  async function typeText(el, text, delay, glitchChance) {
    el.textContent = "";
    for (var i = 0; i < text.length; i++) {
      var char = text.charAt(i);
      // Glitch effect
      if (glitchChance && Math.random() < glitchChance) {
        var glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        el.textContent +=
          glitchChars[Math.floor(Math.random() * glitchChars.length)];
        await rafSleep(delay);
        el.textContent = el.textContent.slice(0, -1) + char;
      } else {
        el.textContent += char;
      }
      await rafSleep(delay);
    }
  }

  function makeLine(parent) {
    var line = document.createElement("div");
    parent.appendChild(line);
    return line;
  }

  async function typeColorLine(
    container,
    labelText,
    colorName,
    colorHex,
    delayPerChar
  ) {
    var line = document.createElement("div");
    container.appendChild(line);
    var prefix = document.createElement("span");
    var nameSpan = document.createElement("span");
    var suffix = document.createElement("span");
    nameSpan.style.color = colorHex;
    line.appendChild(prefix);
    line.appendChild(nameSpan);
    line.appendChild(suffix);

    prefix.textContent = "";
    for (var i = 0; i < labelText.length; i++) {
      prefix.textContent += labelText.charAt(i);
      await rafSleep(delayPerChar);
    }
    nameSpan.textContent = "";
    for (var j = 0; j < colorName.length; j++) {
      nameSpan.textContent += colorName.charAt(j);
      await rafSleep(delayPerChar);
    }
    var dots = "...";
    suffix.textContent = "";
    for (var k = 0; k < dots.length; k++) {
      suffix.textContent += dots.charAt(k);
      await rafSleep(delayPerChar);
    }
  }

  async function fadeToBlack(overlay, duration) {
    var start = performance.now();
    function step(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = t * t * (3 - 2 * t);
      overlay.style.backgroundColor = "rgba(0,0,0," + eased + ")";
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    await rafSleep(duration + 30);
  }

  // ASCII art generator
  function showASCIIArt(container, art) {
    var artLine = makeLine(container);
    artLine.style.fontFamily = "Courier New, monospace";
    artLine.style.fontSize = "10px";
    artLine.style.lineHeight = "1";
    artLine.textContent = art;
    return artLine;
  }

  async function startAnimation() {
    var reduceMotion = false;
    try {
      reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {}

    // Update page title during animation
    var titles = [
      "Loading...",
      "Initializing...",
      "Cooking...",
      "Applying colors...",
      "Almost done!",
      "Final touches...",
    ];
    var titleIdx = 0;
    var titleInterval = setInterval(function () {
      document.title = titles[titleIdx % titles.length];
      titleIdx++;
    }, 2000);

    addBtn.disabled = true;
    addBtn.style.opacity = "0.6";

    var overlay = document.createElement("div");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Adding CSS animation");
    overlay.style.position = "fixed";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.right = "0";
    overlay.style.bottom = "0";
    overlay.style.backgroundColor = "rgba(0,0,0,0)";
    overlay.style.zIndex = "9999";
    overlay.style.color = "#ffffff";
    overlay.style.fontFamily = "Courier New, monospace";
    document.body.appendChild(overlay);

    var center = document.createElement("div");
    center.style.position = "absolute";
    center.style.left = "50%";
    center.style.top = "50%";
    center.style.transform = "translate(-50%, -50%)";
    center.style.textAlign = "left";
    center.style.whiteSpace = "pre";
    center.style.maxWidth = "90vw";
    center.style.fontSize = "16px";
    overlay.appendChild(center);
    center.style.zIndex = "3";

    // Step 1: type "Adding CSS..." with glitch
    var lineAdding = document.createElement("div");
    center.appendChild(lineAdding);
    await typeText(lineAdding, "Adding CSS...", reduceMotion ? 10 : 40, 0.05);

    // Fake error that resolves
    var errorLine = makeLine(center);
    await typeText(errorLine, "ERROR 404: Style not found...", 15);
    await rafSleep(300);
    errorLine.textContent = "ERROR 404: Style not found... just kidding";
    await rafSleep(200);
    errorLine.textContent = "[ok] Error resolved (it was never real)";

    await fadeToBlack(overlay, reduceMotion ? 150 : 600);

    var colors = [
      { name: "red", value: "#ff0000" },
      { name: "orange", value: "#ff7f00" },
      { name: "yellow", value: "#ffff00" },
      { name: "green", value: "#00ff00" },
      { name: "blue", value: "#0000ff" },
      { name: "indigo", value: "#4b0082" },
      { name: "violet", value: "#8f00ff" },
      { name: "white", value: "#ffffff" },
      { name: "black", value: "#000000" },
    ];

    // Enhanced boot messages with version numbers
    var version = "v0.0.1";
    var fun1 = [
      "[init] starting style engine " + version,
      "[ok] text renderer online",
      "[warn] gradients disabled… just kidding",
      "fetching color modules…",
      "[info] Checking if fonts exist...",
      "[info] Verifying color permissions...",
      "[info] Running anti-boring.exe...",
      "[ok] Anti-boring protocol activated",
    ];
    for (var f1 = 0; f1 < fun1.length; f1++) {
      var ln = makeLine(center);
      await typeText(ln, fun1[f1], reduceMotion ? 10 : 18, 0.02);
      await rafSleep(reduceMotion ? 40 : 80);
      // Increment version sometimes
      if (f1 === 0 && Math.random() > 0.7) {
        version = "v0.0." + Math.floor(Math.random() * 10);
      }
    }

    // Show ASCII art briefly
    var asciiArt = "   ___   \n  /   \\  \n |  O  | \n  \\___/  ";
    var artLine = showASCIIArt(center, asciiArt);
    await rafSleep(500);
    center.removeChild(artLine);

    // Fake restart sequence
    var restartLine = makeLine(center);
    await typeText(restartLine, "wait, let me restart...", 18);
    await rafSleep(300);
    restartLine.textContent = "[ok] Just kidding, continuing...";
    await rafSleep(400);

    for (var i = 0; i < colors.length; i++) {
      var d = reduceMotion ? 12 : 40;
      await typeColorLine(
        center,
        "Applying color: ",
        colors[i].name,
        colors[i].value,
        d
      );
      await rafSleep(reduceMotion ? 50 : 150);
    }

    // More absurd dependency messages
    var fun2 = [
      'installing "boldness" v1.2.3',
      "caching vibes… done",
      "white balance: 6500K-ish",
      "negotiating with fonts… agreed to render",
      "detangling CSS specificity… tangled again",
      "compiling rainbow… ok",
      "color wheel engaged",
      "permission to spin: granted",
      "[info] Initializing color quantum entanglement...",
      "[info] Resolving CSS black holes...",
      "[warn] Font negotiations complete (fonts won)",
      "[ok] Chroma fusion reactor online",
      'installing "aesthetic" v42.0.0-beta',
      'downloading "cool-factor" package...',
      "[ok] Cool factor: MAXIMUM",
    ];
    for (var f2 = 0; f2 < fun2.length; f2++) {
      var ln2 = makeLine(center);
      await typeText(ln2, fun2[f2], reduceMotion ? 10 : 18, 0.01);
      await rafSleep(reduceMotion ? 50 : 90);
    }

    var funAssets = [
      "loading fonts: Inter, system-ui…",
      "fallback fonts ready",
      "preloading hero image… ok",
      "compressing thumbnails… 6 files",
      "lazy loading armed",
      "[info] Optimizing for dial-up... just kidding",
      "[ok] All assets secured",
    ];
    for (var fa = 0; fa < funAssets.length; fa++) {
      var lnA = makeLine(center);
      await typeText(lnA, funAssets[fa], reduceMotion ? 10 : 18);
      await rafSleep(reduceMotion ? 50 : 90);
    }

    await rafSleep(1200);

    // Grid with enhanced effects
    var gridWrap = document.createElement("div");
    gridWrap.style.position = "absolute";
    gridWrap.style.left = "50%";
    gridWrap.style.top = "50%";
    gridWrap.style.transform = "translate(-50%, -50%)";
    gridWrap.style.width =
      Math.min(window.innerWidth, window.innerHeight) + "px";
    gridWrap.style.height =
      Math.min(window.innerWidth, window.innerHeight) + "px";
    gridWrap.style.zIndex = "0";
    overlay.appendChild(gridWrap);

    var size = Math.min(window.innerWidth, window.innerHeight);
    var cols = 12,
      rows = 12,
      total = cols * rows;
    var cellSize = Math.floor(size / Math.max(cols, rows));
    var table = document.createElement("table");
    table.setAttribute("cellspacing", "0");
    table.setAttribute("cellpadding", "0");
    table.style.borderCollapse = "collapse";
    table.style.transformOrigin = "50% 50%";
    gridWrap.appendChild(table);

    var fadePlane = document.createElement("div");
    fadePlane.style.position = "absolute";
    fadePlane.style.left = "0";
    fadePlane.style.top = "0";
    fadePlane.style.right = "0";
    fadePlane.style.bottom = "0";
    fadePlane.style.backgroundColor = "#ffffff";
    fadePlane.style.opacity = "0";
    fadePlane.style.pointerEvents = "none";
    fadePlane.style.zIndex = "1";
    overlay.appendChild(fadePlane);

    // Blue screen flash effect
    var bsodFlash = document.createElement("div");
    bsodFlash.style.position = "absolute";
    bsodFlash.style.left = "0";
    bsodFlash.style.top = "0";
    bsodFlash.style.right = "0";
    bsodFlash.style.bottom = "0";
    bsodFlash.style.backgroundColor = "#0000ff";
    bsodFlash.style.opacity = "0";
    bsodFlash.style.pointerEvents = "none";
    bsodFlash.style.zIndex = "2";
    overlay.appendChild(bsodFlash);

    var cells = [];
    for (var r = 0; r < rows; r++) {
      var tr = document.createElement("tr");
      table.appendChild(tr);
      for (var c = 0; c < cols; c++) {
        var td = document.createElement("td");
        td.style.width = cellSize + "px";
        td.style.height = cellSize + "px";
        td.style.backgroundColor = "#000000";
        tr.appendChild(td);
        cells.push(td);
      }
    }

    var spinPrep1 = makeLine(center);
    await typeText(spinPrep1, "blending wavelengths…", 18);
    var spinPrep2 = makeLine(center);
    await typeText(spinPrep2, "chroma fusion at 88%…", 18);

    center.style.display = "none";

    // Fill cells in the same order the colors were listed (cycling)
    var idx = 0;
    for (var k = 0; k < total; k++) {
      var color = colors[idx % colors.length].value;
      cells[k].style.backgroundColor = color;
      idx++;
      await rafSleep(reduceMotion ? 1 : 8);
    }

    // Step 5: "Let me cook." (big) then accelerating spin to white
    center.style.display = "block";
    center.textContent = "Let me cook.";
    center.style.color = "#ffffff";
    center.style.fontSize = "clamp(32px, 6vw, 72px)";
    await rafSleep(reduceMotion ? 150 : 500);

    // Precompute starting RGB for each cell for smooth fade-to-white
    function hexToRgb(hex) {
      var h = hex.replace("#", "");
      var r = parseInt(h.substring(0, 2), 16);
      var g = parseInt(h.substring(2, 4), 16);
      var b = parseInt(h.substring(4, 6), 16);
      return { r: r, g: g, b: b };
    }
    var startColors = cells.map(function (td) {
      var cs = window.getComputedStyle(td).backgroundColor; // rgb(r,g,b)
      var m = cs.match(/rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/);
      if (m) return { r: +m[1], g: +m[2], b: +m[3] };
      // fallback parse hex if any
      return { r: 0, g: 0, b: 0 };
    });

    if (!reduceMotion) {
      var start = performance.now();
      var duration = 8000; // longer spin for interstellar vibe
      var angle = 0;
      function spin(now) {
        var t = Math.min(1, (now - start) / duration);
        // accelerate spin
        var speed = (0.5 + t * t) * 1200; // deg/s ramps up
        angle += speed * (1 / 60);
        table.style.transform = "rotate(" + angle + "deg)";
        // fade cells toward white with smooth easing
        var mix = t * t * (3 - 2 * t);
        // also brighten overall with a white fade plane
        fadePlane.style.opacity = String(mix);
        for (var n = 0; n < cells.length; n++) {
          var sc = startColors[n];
          var r = Math.round(sc.r + (255 - sc.r) * mix);
          var g = Math.round(sc.g + (255 - sc.g) * mix);
          var b = Math.round(sc.b + (255 - sc.b) * mix);
          cells[n].style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
        }
        if (t < 1) requestAnimationFrame(spin);
      }
      requestAnimationFrame(spin);
      await rafSleep(duration + 60);
    }

    // Set to full white backdrop at the end
    overlay.style.backgroundColor = "#ffffff";
    center.style.color = "#000000";
    center.textContent = "";

    // CRITICAL: Hide the grid elements completely
    gridWrap.style.display = "none";
    table.style.display = "none";
    center.style.display = "none";
    fadePlane.style.display = "none";
    bsodFlash.style.display = "none";

    // Multiple ending messages
    var endingMessages = [
      "Now your cursor holds colors",
      "The transformation is complete",
      "Welcome to the colorful side",
      "Colors have been successfully applied",
      "Your cursor is now RGB-enabled",
      "Transmission complete",
    ];
    var msgIdx = 0;
    var msg = document.createElement("div");
    msg.style.position = "fixed";
    msg.style.left = "50%";
    msg.style.top = "50%";
    msg.style.transform = "translate(-50%, -50%)";
    msg.style.fontFamily = "Courier New, monospace";
    msg.style.fontSize = "clamp(18px, 4.5vw, 36px)";
    msg.style.color = "#000000";
    msg.style.opacity = "0";
    msg.style.whiteSpace = "pre";
    msg.style.zIndex = "10000";
    msg.style.fontWeight = "600";
    msg.style.textAlign = "center";
    overlay.appendChild(msg);

    // Matrix code rain effect (brief)
    var matrixCanvas = document.createElement("canvas");
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    matrixCanvas.style.position = "fixed";
    matrixCanvas.style.top = "0";
    matrixCanvas.style.left = "0";
    matrixCanvas.style.zIndex = "9997";
    matrixCanvas.style.opacity = "0.3";
    document.body.appendChild(matrixCanvas);
    var ctx = matrixCanvas.getContext("2d");
    ctx.fillStyle = "#00ff00";
    ctx.font = "14px Courier New";
    var chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    var columns = Math.floor(matrixCanvas.width / 14);
    var drops = Array(columns).fill(1);

    function drawMatrix() {
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      ctx.fillStyle = "#00ff00";
      for (var i = 0; i < drops.length; i++) {
        var text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 14, drops[i] * 14);
        if (drops[i] * 14 > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }
    var matrixInterval = setInterval(drawMatrix, 50);
    await rafSleep(1000);
    clearInterval(matrixInterval);
    matrixCanvas.style.transition = "opacity 0.5s";
    matrixCanvas.style.opacity = "0";
    setTimeout(function () {
      if (matrixCanvas.parentNode)
        matrixCanvas.parentNode.removeChild(matrixCanvas);
    }, 500);

    // Show cycling ending messages
    function updateMessage() {
      if (msgIdx < endingMessages.length) {
        var before = document.createTextNode("Now your ");
        var colorSpan = document.createElement("span");
        colorSpan.textContent = "cursor";
        var after = document.createTextNode(" holds colors");

        if (msgIdx > 0) {
          msg.innerHTML = "";
        }
        msg.appendChild(before);
        msg.appendChild(colorSpan);
        msg.appendChild(after);

        var cyclePalette = [
          "#ff0000",
          "#ff7f00",
          "#ffff00",
          "#00ff00",
          "#00ffff",
          "#0000ff",
          "#4b0082",
          "#8f00ff",
          "#ff1493",
          "#000000",
        ];
        var cycleIdx = 0;
        var colorTimer = setInterval(function () {
          if (msg.querySelector("span")) {
            msg.querySelector("span").style.color =
              cyclePalette[cycleIdx % cyclePalette.length];
            cycleIdx++;
          }
        }, 100);

        setTimeout(function () {
          clearInterval(colorTimer);
          msgIdx++;
          if (msgIdx < endingMessages.length) {
            updateMessage();
          }
        }, 800);
      }
    }

    await rafSleep(100);
    msg.style.transition = "opacity " + 400 + "ms ease";
    void msg.offsetHeight;
    msg.style.opacity = "1";

    updateMessage();
    await rafSleep(endingMessages.length * 800);

    // Connection message
    msg.textContent = "Establishing connection...";
    await rafSleep(800);
    msg.textContent = "Connection established!";
    await rafSleep(500);

    msg.style.transition = "opacity " + 400 + "ms ease";
    msg.style.opacity = "0";
    await rafSleep(400);

    window.location.href = "https://www.anshkumartripathi.space";
  }
})();
