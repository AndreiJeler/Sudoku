import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BoardComponent } from '@sudoku/board';

@Component({
  selector: 'sudoku-home-page',
  standalone: true,
  imports: [CommonModule, BoardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {}
