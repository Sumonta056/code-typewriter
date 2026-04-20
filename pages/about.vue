<template>
  <div class="flex-1 min-h-0 overflow-y-auto max-w-[720px] mx-auto px-0 pt-[24px] pb-[48px] w-full">
    <header class="mb-[40px]">
      <h1
        class="font-code text-[2rem] font-bold text-c-text m-0 mb-[10px] max-[768px]:text-[1.5rem]"
      >
        About <span class="text-c-accent">Code Typewriter</span>
      </h1>
      <p class="text-[0.9rem] text-c-text-dim m-0">
        A typing tutor built for developers, by developers
      </p>
    </header>

    <div class="flex flex-col gap-[16px]">
      <section
        class="bg-bg-surface border border-c-border rounded-[12px] px-[32px] py-[28px] flex flex-col gap-[10px] transition-colors duration-200 hover:border-c-border-lit max-[768px]:px-[20px] max-[768px]:py-[20px]"
      >
        <div class="text-[1.6rem] leading-none">&#128187;</div>
        <h2 class="font-code text-[1rem] font-semibold text-c-text m-0">What is it?</h2>
        <p class="text-[0.85rem] text-c-text-dim leading-[1.7] m-0">
          Code Typewriter is a browser-based typing practice tool that lets you type real source
          code fetched directly from GitHub. Instead of lorem ipsum, you practice with actual
          production code — improving both your typing speed and your familiarity with real
          codebases.
        </p>
      </section>

      <section
        class="bg-bg-surface border border-c-border rounded-[12px] px-[32px] py-[28px] flex flex-col gap-[10px] transition-colors duration-200 hover:border-c-border-lit max-[768px]:px-[20px] max-[768px]:py-[20px]"
      >
        <div class="text-[1.6rem] leading-none">&#128640;</div>
        <h2 class="font-code text-[1rem] font-semibold text-c-text m-0">How it works</h2>
        <p class="text-[0.85rem] text-c-text-dim leading-[1.7] m-0">
          Select a language, load a random file from a curated list of open-source repositories, and
          start typing. The editor highlights syntax in real time, tracks your WPM, raw WPM, CPM,
          and accuracy, and saves every session to your local history so you can monitor your
          progress over time.
        </p>
      </section>

      <section
        class="bg-bg-surface border border-c-border rounded-[12px] px-[32px] py-[28px] flex flex-col gap-[10px] transition-colors duration-200 hover:border-c-border-lit max-[768px]:px-[20px] max-[768px]:py-[20px]"
      >
        <div class="text-[1.6rem] leading-none">&#128274;</div>
        <h2 class="font-code text-[1rem] font-semibold text-c-text m-0">Privacy</h2>
        <p class="text-[0.85rem] text-c-text-dim leading-[1.7] m-0">
          Everything runs in your browser. No account, no server, no tracking. Your session history
          and settings are stored exclusively in your browser's
          <code
            class="font-code text-[0.8rem] text-c-accent bg-[rgba(var(--accent-rgb),0.1)] px-[5px] py-[1px] rounded-[4px]"
            >localStorage</code
          >
          and never leave your device.
        </p>
      </section>

      <section
        class="bg-bg-surface border border-c-border rounded-[12px] px-[32px] py-[28px] flex flex-col gap-[10px] transition-colors duration-200 hover:border-c-border-lit max-[768px]:px-[20px] max-[768px]:py-[20px]"
      >
        <div class="text-[1.6rem] leading-none">&#10084;</div>
        <h2 class="font-code text-[1rem] font-semibold text-c-text m-0">Support the project</h2>
        <p class="text-[0.85rem] text-c-text-dim leading-[1.7] m-0">
          Code Typewriter is free and open source. If it has helped you level up your typing speed,
          consider buying me a coffee — it keeps the project alive and motivates new features.
        </p>
        <a
          href="https://buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-[6px] mt-[6px] self-start font-code text-[0.78rem] font-semibold text-c-yellow no-underline px-[20px] py-[8px] rounded-[8px] border border-[rgba(210,153,34,0.35)] bg-[rgba(210,153,34,0.08)] transition-all duration-200 hover:bg-[rgba(210,153,34,0.16)] hover:border-[rgba(210,153,34,0.5)]"
        >
          Donate
        </a>
      </section>
    </div>
  </div>
</template>
