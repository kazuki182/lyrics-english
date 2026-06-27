"use client";

export default function ScrollButtons() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  return (
    <div className="fixed bottom-16 right-4 z-40 flex flex-col gap-2 sm:right-[calc(50%-17rem)]">
      <button type="button" onClick={scrollToTop} className="scroll-jump-button" aria-label="上へ移動">↑</button>
      <button type="button" onClick={scrollToBottom} className="scroll-jump-button" aria-label="下へ移動">↓</button>
    </div>
  );
}
