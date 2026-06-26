import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, MatIcon, ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {}
