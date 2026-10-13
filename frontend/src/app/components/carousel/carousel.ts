import { Component, DestroyRef, inject, input, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-carousel',
  templateUrl: './carousel.html',
  host: {
    '(mouseenter)': 'stopAutoSlide()',
    '(mouseleave)': 'startAutoSlide()',
    class: 'relative block h-full w-full',
  },
})
export class Carousel {
  destroyref = inject(DestroyRef);

  images = input.required<string[]>();
  alt = input.required<string>();
  interval = input(2000);
  activeImage = signal(0);

  intervalId: number | undefined;

  changeImage(e: Event, index: number) {
    e.stopPropagation();
    this.activeImage.set(index);
  }

  ngAfterViewInit() {
    this.startAutoSlide();

    this.destroyref.onDestroy(() => this.stopAutoSlide());
  }

  startAutoSlide() {
    if (this.intervalId !== undefined || this.images().length <= 1) {
      return;
    }

    this.intervalId = window.setInterval(() => {
      this.activeImage.update((prev) => (prev + 1) % this.images().length);
    }, this.interval());
  }

  stopAutoSlide() {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
