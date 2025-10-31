export function initCustomArrowScroll(scrollStep = 50, throttleMs = 50) {
  // Derive a smooth continuous speed from original step/throttle
  const pxPerSecond = Math.max(10, (scrollStep / Math.max(throttleMs, 1)) * 1000);
  let targetDir = 0; // -1 up, 1 down, 0 idle
  let velocity = 0;  // px / s
  let rafId: number | null = null;
  let lastTs = 0;
  const accel = pxPerSecond * 4; // reach speed in ~250ms
  const decel = pxPerSecond * 6; // stop a bit quicker

  function shouldIgnore(e: KeyboardEvent) {
    if (e.defaultPrevented) return true;
    if (e.ctrlKey || e.metaKey || e.altKey) return true;
    const target = e.target as HTMLElement | null;
    if (!target) return false;
    const tag = target.tagName;
    const interactiveTags = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'];
    if (interactiveTags.includes(tag)) return true;
    if (target.isContentEditable) return true;
    const role = target.getAttribute('role');
    if (role && ['menu', 'listbox', 'combobox', 'textbox'].includes(role)) return true;
    return false;
  }

  function startLoop(ts: number) {
    if (!lastTs) lastTs = ts;
    const dt = Math.min(0.05, (ts - lastTs) / 1000); // cap 50ms
    lastTs = ts;

    // Move velocity toward target using accel/decel
    const targetVel = targetDir * pxPerSecond;
    const rate = Math.abs(targetVel) > Math.abs(velocity) ? accel : decel;
    const deltaV = rate * dt;

    if (velocity < targetVel) {
      velocity = Math.min(velocity + deltaV, targetVel);
    } else if (velocity > targetVel) {
      velocity = Math.max(velocity - deltaV, targetVel);
    }

    // Apply scroll using 'auto' to avoid CSS smooth stacking
    const dy = velocity * dt;
    if (dy !== 0) {
      window.scrollBy({ top: dy, left: 0, behavior: 'auto' });
    }

    // Continue while moving or input active
    if (Math.abs(velocity) > 0.5 || targetDir !== 0) {
      rafId = requestAnimationFrame(startLoop);
    } else {
      rafId = null;
      lastTs = 0;
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    const key = e.code || (e as any).key;
    if (key !== 'ArrowDown' && key !== 'ArrowUp') return;
    if (shouldIgnore(e)) return;

    e.preventDefault();

    targetDir = key === 'ArrowDown' ? 1 : -1;
    if (rafId == null) rafId = requestAnimationFrame(startLoop);
  }

  function onKeyUp(e: KeyboardEvent) {
    const key = e.code || (e as any).key;
    if (key !== 'ArrowDown' && key !== 'ArrowUp') return;
    // Only stop if the released key matches current direction
    if ((key === 'ArrowDown' && targetDir === 1) || (key === 'ArrowUp' && targetDir === -1)) {
      targetDir = 0;
    }
  }

  // Capture phase to reliably intercept before default action
  window.addEventListener('keydown', onKeyDown, { capture: true });
  window.addEventListener('keyup', onKeyUp, { capture: true });

  const cleanup = () => {
    window.removeEventListener('keydown', onKeyDown, { capture: true } as EventListenerOptions);
    window.removeEventListener('keyup', onKeyUp, { capture: true } as EventListenerOptions);
    if (rafId != null) cancelAnimationFrame(rafId);
  };

  return cleanup;
}
