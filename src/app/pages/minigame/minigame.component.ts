import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-minigame',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule],
  templateUrl: './minigame.component.html',
  styleUrl: './minigame.component.css'
})
export class MinigameComponent {
  score = signal(0);
  increment() {
    this.score.update(v => v + 1);
  }
}
