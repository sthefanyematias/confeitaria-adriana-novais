
import { Component } from '@angular/core';

@Component({
    selector: 'app-sobre',
    standalone: true,
    imports: [],
    templateUrl: './sobre.html',
    styleUrl: './sobre.css'
})
export class Sobre {
    readonly whatsapp = 'https://wa.me/5511958908798';
    readonly instagram = 'https://www.instagram.com/adriananovaisconfeitaria?igsh=MWZxeG56eDRvY3NrcQ==';

    readonly valores = [
        {
            icone: '✦',
            titulo: 'Artesanal',
            descricao: 'Cada peça é produzida à mão, com técnica e dedicação, desde o primeiro passo até a decoração final.'
        },
        {
            icone: '✦',
            titulo: 'Qualidade',
            descricao: 'Utilizamos apenas ingredientes de primeira linha, selecionados com cuidado para garantir o melhor sabor.'
        },
        {
            icone: '✦',
            titulo: 'Amor',
            descricao: 'A confeitaria e muito mais do que uma profissão. É uma vocação que Adriana exerce com paixão e alegria.'
        },
        {
            icone: '✦',
            titulo: 'Personalizado',
            descricao: 'Cada pedido é único. adaptamos sabores, tamanhos e decorações para tornar seu momento ainda mais especial.'
        }
    ];
}
