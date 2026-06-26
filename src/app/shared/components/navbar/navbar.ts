import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { MatAnchor } from "@angular/material/button";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, MatIcon, MatAnchor],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {}
