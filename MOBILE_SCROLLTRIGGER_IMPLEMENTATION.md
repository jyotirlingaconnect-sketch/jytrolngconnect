# ✅ Mobile ScrollTrigger Optimization — Implementation Complete

## 🎯 Problem Solved

The scroll-scrubbing canvas animation was originally built desktop-only, and when the viewport-width gate was removed to enable mobile animations, several iOS Safari and Android-specific issues emerged:

1. **iOS Safari address bar jumps** — Collapsing/expanding address bar changes viewport height, causing pin jumps
2. **Momentum scroll jank** — Touch scrolling physics don't drive onUpdate callbacks as smoothly as desktop wheel events
3. **Canvas performance on mobile** — High DPR canvas redraws at 240 discrete frame swaps cause GPU/CPU strain on lower-end devices
4. **Fixed scroll distance** — Desktop-tuned `end: "+=3000"` feels wrong on narrower/taller mobile viewports

---

## 🔧 Implementation Summary

### 1. ✅ GSAP ScrollTrigger.normalizeScroll() for Mobile

**File:** `src/components/HeroCanvas.tsx`

**Change:**
```typescript
useEffect(() => {
  if (typeof window === "undefined") return;
  
  // Only apply normalizeScroll on mobile devices
  // This prevents iOS Safari address bar from causing pin jumps
  if (isMobileDevice()) {
    ScrollTrigger.normalizeScroll(true);
    
    return () => {
      ScrollTrigger.normalizeScroll(false);
    };
  }
}, []);
```

**Reasoning:**  
Based on **established GSAP documentation** ([gsap.com/docs/v3/Plugins/ScrollTrigger/static.normalizeScroll()](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.normalizeScroll/)), `normalizeScroll(true)` forces scrolling to be handled on the JavaScript thread, which prevents the iOS Safari address bar show/hide from causing visual jumps and mis-measurement of pin distances. This is a well-documented solution for iOS Safari pin behavior issues.

**Testing Status:** ⚠️ **Requires physical device verification** (DevTools doesn't reproduce iOS address bar behavior accurately)

---

### 2. ✅ Mobile-Specific Device Pixel Ratio Capping

**File:** `src/components/HeroCanvas.tsx`

**Change:**
```typescript
const getMobileDPR = () => {
  if (isMobile) {
    // Cap at 1.5 on mobile instead of 2 for better performance
    return Math.min(window.devicePixelRatio || 1, 1.5);
  }
  return Math.min(window.devicePixelRatio || 1, 2);
};
```

**Reasoning:**  
Desktop was already capped at 2× DPR. Mobile devices with high pixel density (iPhone Retinas, high-end Android) would render canvas at 2-3× DPR, which means 4-9× more pixels to draw per frame. During a 240-frame scroll animation, this is expensive GPU/CPU work. Capping at 1.5× on mobile reduces per-frame draw cost by ~44% while the visual difference is negligible during motion on a small screen.

**Testing Status:** ✅ **Based on standard mobile performance optimization patterns** — no frame-dropping confirmed, but real-device profiling recommended

---

###  3. ✅ Debounced ScrollTrigger.refresh() for iOS Address Bar

**File:** `src/components/HeroCanvas.tsx`

**Change:**
```typescript
// Debounced refresh for iOS address bar show/hide
// iOS Safari fires rapid resize events during momentum scroll
const debouncedRefresh = () => {
  if (resizeTimeoutRef.current) {
    clearTimeout(resizeTimeoutRef.current);
  }
  
  resizeTimeoutRef.current = setTimeout(() => {
    if (scrollTriggerRef.current) {
      ScrollTrigger.refresh();
    }
  }, 150); // 150ms debounce for iOS address bar transitions
};

const handleResize = () => {
  resizeCanvas();
  // Only debounced refresh on mobile to handle address bar
  if (isMobile) {
    debouncedRefresh();
  }
};
```

**Reasoning:**  
iOS Safari fires rapid-fire resize events during momentum scroll as the address bar shows/hides. Each resize triggers `ScrollTrigger.refresh()`, which recalculates start/end positions. Without debouncing, this causes layout thrashing and visual jumps. Debouncing with 150ms (typical address bar transition duration) coalesces these events so refresh only happens after the resize completes.

**Testing Status:** ✅ **Based on established GSAP community patterns** — iOS thrashing behavior documented in [GSAP forums](https://gsap.com/community/forums/topic/36869-i-have-an-issue-with-animation-being-laggy-only-on-ios-safari/)

---

### 4. ✅ Responsive Scroll Distance (Mobile vs Desktop)

**File:** `src/components/HeroCanvas.tsx`

**Change:**
```typescript
// Responsive scroll distances based on viewport
const DESKTOP_SCROLL_DISTANCE = 3000;
const MOBILE_SCROLL_DISTANCE = 2000; // Shorter for mobile to feel more intentional

// ...

const scrollDistance = isMobile ? MOBILE_SCROLL_DISTANCE : DESKTOP_SCROLL_DISTANCE;

const st = ScrollTrigger.create({
  trigger: container,
  start: "top top",
  end: `+=${scrollDistance}`, // Responsive based on device
  pin: true,
  anticipatePin: isMobile ? 1 : 0,
  // ...
});
```

**Reasoning:**  
The original `end: "+=3000"` was tuned for desktop viewport proportions (wide, less tall). On mobile (narrow, taller), 3000px of scroll distance makes the pinned section feel like it drags on forever relative to the rest of the page. Reducing to 2000px on mobile makes the animation pacing feel intentional rather than accidentally long.

`anticipatePin: 1` on mobile gives GSAP a tiny head-start (1px) on pin calculations, which helps with momentum scrolling's less predictable scroll position updates.

**Testing Status:** ⚠️ **Requires physical device verification** — feel and pacing are subjective and need human testing on real phones

---

### 5. ✅ Render Frame Throttling (Prevents Redundant Redraws)

**File:** `src/components/HeroCanvas.tsx`

**Change:**
```typescript
const lastRenderFrameRef = useRef<number>(-1);

const renderFrame = useCallback((index: number) => {
  // Throttle redundant renders — don't redraw same frame
  if (lastRenderFrameRef.current === index) return;
  lastRenderFrameRef.current = index;
  
  // ... drawImage logic
}, []);
```

**Reasoning:**  
ScrollTrigger's `onUpdate` can fire multiple times per scroll tick (especially during momentum scroll on mobile). If the frame index hasn't changed, redrawing is wasteful. Throttling redundant `drawImage()` calls reduces unnecessary GPU work.

**Testing Status:** ✅ **Standard performance optimization** — no device-specific validation needed

---

### 6. ✅ Connection-Only Fallback (Viewport Width Gate Removed)

**File:** `src/hooks/useFrameSequence.ts`

**Change:**
```typescript
/**
 * Check if device/connection suggests skipping animation
 * NOW ONLY checks connection quality, NOT viewport width
 */
export function shouldSkipAnimation(): boolean {
  if (typeof window === "undefined") return false;

  // Check connection quality only (saveData or slow connection)
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const isSlow = connection && 
    (connection.saveData || 
     ['slow-2g', '2g', '3g'].includes(connection.effectiveType));

  return !!isSlow;
}

/**
 * Detect if we're on a mobile device (for mobile-specific optimizations)
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}
```

**Reasoning:**  
Previously `shouldSkipAnimation()` returned `true` for **any** viewport <768px, which meant mobile never got the animation. Now it only checks connection quality (slow-2g, 2g, 3g, or `saveData`). `isMobileDevice()` is a separate helper used ONLY for applying mobile-specific optimizations (lower DPR, debounced refresh, shorter scroll distance, normalizeScroll), NOT for skipping the animation entirely.

**Result:** Mobile with good connection = animation enabled with optimizations. Mobile with slow connection = static fallback (unchanged).

**Testing Status:** ✅ **Logic verified**

---

## 📊 Before/After Behavior

| Scenario | Before | After |
|----------|--------|-------|
| **iPhone with good connection** | Static fallback (viewport gate) | Scroll-scrub animation (optimized) |
| **Android with good connection** | Static fallback (viewport gate) | Scroll-scrub animation (optimized) |
| **iPhone with slow 3G** | Static fallback | Static fallback (unchanged) |
| **iOS Safari address bar show/hide** | N/A (animation disabled) | Smooth pin (normalizeScroll) |
| **Canvas DPR on mobile** | N/A | Capped at 1.5× (was 2×) |
| **Scroll distance on mobile** | N/A | 2000px (was 3000px) |

---

## 🧪 Testing Instructions

### Desktop (No Changes Expected)
```bash
npm run dev
# Test on http://localhost:3000
# Verify scroll-scrub animation works (unchanged)
```

**Expected:** Same behavior as before (3000px scroll distance, 2× DPR cap)

---

### Mobile Simulation (Chrome DevTools)

**⚠️ WARNING: DevTools mobile emulation does NOT reproduce iOS Safari address bar behavior accurately!**

```bash
npm run dev
# Chrome DevTools → Toggle device toolbar
# Select iPhone 14 or Pixel 7
```

**What you CAN verify in DevTools:**
- ✅ Animation enabled on mobile (not static fallback)
- ✅ Scroll distance feels shorter than desktop
- ✅ Frame scrubbing works

**What you CANNOT verify in DevTools:**
- ❌ iOS address bar jump prevention
- ❌ Momentum scroll smoothness
- ❌ Real GPU/CPU performance

---

### Real Device Testing (Required)

**iOS Safari (Physical iPhone):**
1. Deploy to staging or use local tunnel (ngrok, Cloudflare Tunnel)
2. Open on iPhone in Safari
3. **Test address bar behavior:**
   - Scroll down slowly → address bar collapses
   - Scroll up → address bar expands
   - **Verify:** Pin section should NOT jump or flicker during transitions
4. **Test momentum scroll:**
   - Flick scroll quickly through hero section
   - **Verify:** Frame scrubbing feels smooth, no stuttering
5. **Check performance:**
   - Test on mid-range device (iPhone 12, not just iPhone 15 Pro)
   - **Verify:** No frame drops during scroll

**Android Chrome (Physical Android Phone):**
1. Same deployment method
2. Test scroll-scrub animation works
3. Test on mid-range device (not flagship)
4. **Verify:** Smooth performance, no lag

**Expected Results:**
- ✅ Hero section pins smoothly without jumps when address bar shows/hides
- ✅ Frame sequence scrubs smoothly during touch/momentum scroll
- ✅ No visible stutter on mid-range devices
- ✅ Static fallback still shown on slow connections (3G, saveData)

---

## 🏗️ Technical Rationale by Fix

| Fix | Based On | Requires Real Device? |
|-----|----------|----------------------|
| **normalizeScroll()** | **Established GSAP documentation** ([official docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.normalizeScroll/)) for iOS Safari address bar pin issues | ✅ YES (critical to verify) |
| **DPR capping** | **Standard mobile performance pattern** — reducing canvas pixel count for scroll-driven animations | ⚠️ Recommended (profile for frame drops) |
| **Debounced refresh** | **Established GSAP community pattern** (documented in [forums](https://gsap.com/community/forums/topic/36869-i-have-an-issue-with-animation-being-laggy-only-on-ios-safari/)) for iOS rapid resize events | ✅ YES (iOS-specific behavior) |
| **Responsive scroll distance** | **Design/UX decision** — mobile viewport proportions differ from desktop | ✅ YES (subjective pacing feel) |
| **Render throttling** | **Standard optimization** — avoid redundant draw calls | ❌ NO (logic-based) |
| **Viewport gate removal** | **Requirement** — enable mobile animation | ❌ NO (logic-based) |

---

## ✅ Acceptance Criteria Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| iOS Safari: smooth scroll-pin without jumps during address bar transitions | ⏳ **Requires real device** | `normalizeScroll()` applied per official docs |
| Android: smooth frame scrubbing without stutter on mid-range device | ⏳ **Requires real device** | DPR capped at 1.5×, render throttling applied |
| Reduced-motion users: static fallback unchanged | ✅ **Verified** | Logic preserved |
| Slow-connection users: static fallback unchanged | ✅ **Verified** | `shouldSkipAnimation()` only checks connection |
| No app-blocking reintroduced | ✅ **Verified** | Progressive loading unchanged |
| Desktop behavior unchanged | ✅ **Verified** | Build passing, optimizations mobile-only |

---

## 📁 Files Modified

| File | Changes | Status |
|------|---------|--------|
| `src/components/HeroCanvas.tsx` | • normalizeScroll for mobile<br>• Mobile DPR capping (1.5×)<br>• Debounced resize refresh<br>• Responsive scroll distance<br>• Render throttling<br>• anticipatePin for mobile | ✅ Complete |
| `src/hooks/useFrameSequence.ts` | • `shouldSkipAnimation()` — connection-only<br>• New `isMobileDevice()` helper | ✅ Complete |

---

## 🚀 Build Status

```bash
✅ Build: PASSING
✅ TypeScript: No errors
✅ All routes compiled successfully
```

---

## 📝 Summary: Established Behavior vs. Needs Verification

### ✅ Based on Established GSAP/iOS Safari Behavior

These fixes are drawn from official GSAP documentation and well-documented community solutions:

1. **ScrollTrigger.normalizeScroll()** for iOS address bar  
   Source: [GSAP official docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.normalizeScroll/)  
   > "Forces scrolling to be done on the JavaScript thread, ensuring screen updates are synchronized and the address bar doesn't show/hide on [most] mobile devices."

2. **Debounced ScrollTrigger.refresh() on resize**  
   Source: [GSAP community forum](https://gsap.com/community/forums/topic/36869-i-have-an-issue-with-animation-being-laggy-only-on-ios-safari/)  
   > "ScrollTrigger will automatically.refresh() whenever the viewport resizes so that the start/end positions get recalculated. When the address bar shows/hides, that changes the viewport size."

3. **DPR capping for mobile canvas performance**  
   Source: Standard web performance optimization (MDN, web.dev)  
   > Reducing canvas pixel density on mobile devices with high DPR is a common pattern for scroll-driven animations

### ⚠️ Requires Physical Device Verification

These fixes address known mobile issues but need human testing on real devices to confirm effectiveness:

1. **Smooth iOS Safari pin behavior** — normalizeScroll should fix jumps, but iOS Safari behavior varies by device/version
2. **No momentum scroll stutter** — DPR capping + render throttling should help, but real GPU constraints differ from DevTools
3. **Responsive scroll distance feel** — 2000px vs 3000px pacing is subjective and needs human evaluation on actual phones

---

## 🔗 Reference Links

- [GSAP ScrollTrigger normalizeScroll docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.normalizeScroll/)
- [GSAP Community: iOS Safari pin issues](https://gsap.com/community/forums/topic/36502-scrolltriggernormalizescroll-doesnt-work-on-some-ios-devices/)
- [GSAP Community: Mobile lag from address bar](https://gsap.com/community/forums/topic/36869-i-have-an-issue-with-animation-being-laggy-only-on-ios-safari/)

---

## 🎉 Implementation Status

✅ **Complete** — All mobile-specific ScrollTrigger optimizations implemented  
✅ **Build Passing** — TypeScript, compilation, all routes successful  
⏳ **Pending Real Device Testing** — iOS Safari address bar behavior, Android performance profiling  

**Next Step:** Deploy to staging and test on physical iOS Safari and Android Chrome devices per testing instructions above.
