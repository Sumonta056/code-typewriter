<template>
  <div class="typing-placeholder">
    <div class="placeholder-hero">
      <div class="placeholder-prompt"><span class="prompt-caret">$</span> code-typewriter</div>
      <h2 class="placeholder-title">Level up your coding speed</h2>
      <p class="placeholder-desc">
        Type through real source files — build muscle memory for the syntax you use every day
      </p>
    </div>

    <div class="placeholder-steps">
      <div class="placeholder-step placeholder-step--1">
        <span class="placeholder-step-num">01</span>
        <div class="placeholder-step-body">
          <div class="placeholder-step-title">Pick a Language</div>
          <div class="placeholder-step-desc">
            Choose a <strong>language</strong> from the sidebar, then press <kbd>Start</kbd> to load
            a random real file from GitHub
          </div>
        </div>
      </div>

      <div class="placeholder-step placeholder-step--2">
        <span class="placeholder-step-num">02</span>
        <div class="placeholder-step-body">
          <div class="placeholder-step-title">Use Your Own File</div>
          <div class="placeholder-step-desc">
            Click the
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
            <strong>URL</strong> button and paste any public GitHub file link
          </div>
        </div>
      </div>

      <div class="placeholder-step placeholder-step--3">
        <span class="placeholder-step-num">03</span>
        <div class="placeholder-step-body">
          <div class="placeholder-step-title">Customize</div>
          <div class="placeholder-step-desc">
            Click the
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
            <strong>Settings</strong> to change theme, font size &amp; line count
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
