<template>
  <div
    class="flex flex-col items-center justify-center flex-1 min-h-[280px] gap-[40px] select-none px-[32px] py-[40px]"
  >
    <div class="text-center">
      <div
        class="inline-flex items-center gap-[8px] font-code text-[0.75rem] text-c-text-faint bg-bg-raised border border-c-border rounded-[6px] px-[14px] py-[4px] mb-[20px] tracking-[0.05em]"
      >
        <span class="text-c-green font-bold">$</span> code-typewriter
      </div>
      <h2 class="font-code text-[1.9rem] font-bold text-c-text mb-[12px] tracking-[-0.03em]">
        Level up your coding speed
      </h2>
      <p class="text-[0.9rem] text-c-text-dim leading-[1.65] max-w-[440px] mx-auto">
        Type through real source files — build muscle memory for the syntax you use every day
      </p>
    </div>

    <div class="grid grid-cols-3 gap-[12px] w-full max-w-[720px] max-[700px]:grid-cols-1">
      <div
        class="flex flex-col gap-[10px] bg-bg-surface border border-c-border border-t-2 border-t-c-green rounded-[10px] px-[18px] py-[16px] transition-all duration-200 hover:bg-bg-raised hover:border-c-border-lit"
      >
        <span class="font-code text-[0.6rem] font-bold tracking-[0.1em] text-c-green">01</span>
        <div>
          <div class="font-code text-[0.82rem] font-bold text-c-text tracking-[0.01em]">
            Pick a Language
          </div>
          <div class="text-[0.8rem] text-c-text-dim leading-[1.6] mt-[10px]">
            Choose a <strong class="text-c-text font-semibold">language</strong> from the sidebar,
            then press
            <kbd
              class="font-code text-[0.72rem] bg-[rgba(var(--accent-rgb),0.1)] text-c-accent px-[8px] py-[2px] rounded-[4px] border border-[rgba(var(--accent-rgb),0.2)]"
              >Start</kbd
            >
            to load a random real file from GitHub
          </div>
        </div>
      </div>

      <div
        class="flex flex-col gap-[10px] bg-bg-surface border border-c-border border-t-2 border-t-c-yellow rounded-[10px] px-[18px] py-[16px] transition-all duration-200 hover:bg-bg-raised hover:border-c-border-lit"
      >
        <span class="font-code text-[0.6rem] font-bold tracking-[0.1em] text-c-yellow">02</span>
        <div>
          <div class="font-code text-[0.82rem] font-bold text-c-text tracking-[0.01em]">
            Use Your Own File
          </div>
          <div class="text-[0.8rem] text-c-text-dim leading-[1.6] mt-[10px]">
            Click the
            <span
              class="inline-flex items-center justify-center w-[20px] h-[20px] rounded-[4px] border border-c-border-lit bg-bg-raised text-c-text-dim align-middle mx-[1px]"
              title="GitHub URL button"
            >
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
            <strong class="text-c-text font-semibold">URL</strong> button and paste any public
            GitHub file link
          </div>
        </div>
      </div>

      <div
        class="flex flex-col gap-[10px] bg-bg-surface border border-c-border border-t-2 border-t-c-red rounded-[10px] px-[18px] py-[16px] transition-all duration-200 hover:bg-bg-raised hover:border-c-border-lit"
      >
        <span class="font-code text-[0.6rem] font-bold tracking-[0.1em] text-c-red">03</span>
        <div>
          <div class="font-code text-[0.82rem] font-bold text-c-text tracking-[0.01em]">
            Customize
          </div>
          <div class="text-[0.8rem] text-c-text-dim leading-[1.6] mt-[10px]">
            Click the
            <span
              class="inline-flex items-center justify-center w-[20px] h-[20px] rounded-[4px] border border-c-border-lit bg-bg-raised text-c-text-dim align-middle mx-[1px]"
              title="Settings button"
            >
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
            <strong class="text-c-text font-semibold">Settings</strong> to change theme, font size
            &amp; line count
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
