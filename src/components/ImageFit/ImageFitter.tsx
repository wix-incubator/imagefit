import { fromEvent, merge, Subscription } from 'rxjs';
import { filter, finalize, map, mergeMap, takeUntil } from 'rxjs/operators';

interface ClientEvent {
  clientY: number;
}

export class ImageFitter {
  private positionY: number = 50;
  private subscription: Subscription | undefined;
  private dragging: boolean = false;

  unsetDragging(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setupDragging(current: HTMLElement) {
    this.unsetDragging();
    this.updatePositionY(current);

    const touch = map((e: TouchEvent) => {
      return { clientY: e.touches[0].clientY } as ClientEvent;
    });
    const mouseDown = fromEvent<MouseEvent>(current, 'mousedown');
    const mouseMove = fromEvent<MouseEvent>(document, 'mousemove');
    const mouseUp = fromEvent<MouseEvent>(document, 'mouseup');
    const touchStart = fromEvent<TouchEvent>(current, 'touchstart').pipe(touch);
    const touchMove = fromEvent<TouchEvent>(document, 'touchmove').pipe(touch);
    const touchEnd = fromEvent<TouchEvent>(document, 'touchend');
    const onDown = merge(mouseDown, touchStart);
    const onMove = merge(mouseMove, touchMove);
    const onUp = merge(mouseUp, touchEnd).pipe(
      finalize(() => {
        this.updatePositionY(current);
      }),
    );

    const onMoveTillUp = (md: ClientEvent) => {
      const { clientY: mdY } = md;
      return onMove.pipe(
        map(mm => {
          const { clientY: mmY } = mm;
          const percent = 100 - (mmY / mdY) * 100;
          return percent;
        }),
        takeUntil(onUp),
      );
    };
    const drag = onDown
      .pipe(mergeMap(onMoveTillUp))
      .pipe(filter(() => this.dragging));

    this.subscription = drag.subscribe(x => {
      const newY = Math.max(Math.min(this.positionY + x, 100), 0);
      current.style.backgroundPositionY = `${newY}%`;
    });
  }

  setDragging(dragging: boolean) {
    this.dragging = dragging;
  }

  private updatePositionY(current: HTMLElement) {
    this.positionY = parseFloat(current.style.backgroundPositionY || '');
  }
}
