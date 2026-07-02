"use client";

export default function ScrollButtons() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  return (
    <div className="scroll-buttons-fixed pointer-events-none fixed right-4 z-[60] flex flex-col gap-3 sm:right-[calc(50%-17rem)]">
      <button type="button" onClick={scrollToTop} className="scroll-jump-button pointer-events-auto" aria-label="上へ移動">↑</button>
      <button type="button" onClick={scrollToBottom} className="scroll-jump-button pointer-events-auto" aria-label="下へ移動">↓</button>
    </div>
  );
}
