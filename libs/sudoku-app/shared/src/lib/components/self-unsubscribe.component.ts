import { Component, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Component({ template: '' })
export class SelfUnsubscribeComponent implements OnDestroy {
  protected ngUnsubscribe: Subject<any> = new Subject();
  protected subscriptions = new Array<Subscription>();

  ngOnDestroy(): void {
    if (!!this.subscriptions && this.subscriptions.length > 0) {
      for (const sub of this.subscriptions) {
        if (!sub.closed) {
          sub.unsubscribe();
        }
      }
    }
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
