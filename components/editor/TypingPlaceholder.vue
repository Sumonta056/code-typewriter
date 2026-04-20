<template>
  <div class="typing-placeholder">
    <div class="placeholder-hero">
      <div class="placeholder-hero-icon">⌨</div>
      <h2 class="placeholder-title">Level up your coding speed</h2>
      <p class="placeholder-desc">
        Type through real source files — build muscle memory for the syntax you use every day
      </p>
    </div>

    <div class="placeholder-steps">
      <div class="placeholder-step">
        <span class="placeholder-step-num">1</span>
        <div class="placeholder-step-body">
          <span class="placeholder-step-pointer" aria-hidden="true" />
          <span>
            Choose a <strong>language</strong> from the sidebar, then press <kbd>Start</kbd> to load
            a random file
          </span>
        </div>
      </div>

      <div class="placeholder-step">
        <span class="placeholder-step-num">2</span>
        <div class="placeholder-step-body">
          <span class="placeholder-step-pointer" aria-hidden="true" />
          <span>
            Want to type your own code? Click the
            <span class="placeholder-inline-btn" title="GitHub URL button">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </span>
            <strong>GitHub URL</strong> button and paste any public file link
          </span>
        </div>
      </div>

      <div class="placeholder-step">
        <span class="placeholder-step-num">3</span>
        <div class="placeholder-step-body">
          <span>
            Prefer a different look? Click the
            <span class="placeholder-inline-btn" title="Settings button">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path
                  d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                />
              </svg>
            </span>
            <strong>Settings</strong> button to change font, theme &amp; colors
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
