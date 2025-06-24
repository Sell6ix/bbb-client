import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: `<img [src]="avatarUrl" [alt]="username" class="avatar" />`
})
export class AvatarComponent {
  @Input() username = '';
  get avatarUrl() {
    return `https://avatars.dicebear.com/api/bottts/${this.username}.svg`;
  }
}