import { Component } from '@angular/core';
import { NewsletterSignupComponent } from "../../newsletter-signup/newsletter-signup.component";

@Component({
  selector: 'pkm-footer',
  imports: [NewsletterSignupComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
