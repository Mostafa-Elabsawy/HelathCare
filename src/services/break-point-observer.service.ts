import { Injectable, computed, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private breakpointObserver = inject(BreakpointObserver);

  private breakpoints = {
    xs: '(max-width: 639px)',
    sm: '(min-width: 640px) and (max-width: 767px)',
    md: '(min-width: 768px) and (max-width: 1023px)',
    lg: '(min-width: 1024px) and (max-width: 1279px)',
    xl: '(min-width: 1280px)',
  };

  private breakpointState = toSignal(
    this.breakpointObserver
      .observe(Object.values(this.breakpoints))
      .pipe(map((state) => state.breakpoints)),
    { initialValue: {} },
  );

  current = computed<Breakpoint>(() => {
    const bp:any= this.breakpointState();

    if (bp[this.breakpoints.xs]) return 'xs';
    if (bp[this.breakpoints.sm]) return 'sm';
    if (bp[this.breakpoints.md]) return 'md';
    if (bp[this.breakpoints.lg]) return 'lg';

    return 'xl';
  });

  isMobile = computed(() => ['xs', 'sm'].includes(this.current()));

  isTablet = computed(() => this.current() === 'md');

  isDesktop = computed(() => ['lg', 'xl'].includes(this.current()));
}
