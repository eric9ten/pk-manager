import { Component } from '@angular/core';
import { ButtonStandardComponent } from "../buttons/button-standard/button-standard.component";
import { InputStandardComponent } from "../inputs/input-standard/input-standard.component";

@Component({
  selector: 'pkm-newsletter-signup',
  imports: [ButtonStandardComponent, InputStandardComponent],
  templateUrl: './newsletter-signup.component.html',
  styleUrl: './newsletter-signup.component.scss'
})
export class NewsletterSignupComponent {

}
