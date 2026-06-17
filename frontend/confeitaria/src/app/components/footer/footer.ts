import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './footer.html',
    styleUrl: './footer.css'
})
export class Footer {
    anoAtual = new Date().getFullYear();
    whatsapp = 'https://wa.me/5511958908798';
    instagram = 'https://www.instagram.com/adriananovaisconfeitaria?igsh=MWZxeG56eDRvY3NrcQ==';
}