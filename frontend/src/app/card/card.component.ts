import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {TrainComponent} from '../train/train.component';
import {MatDialog} from '@angular/material/dialog';
import {HttpService, Pokemon} from "../httpService/http.service";
import {ReturnComponent} from "../return/return.component";

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css'],
    animations: [
        trigger('cardFlip', [
            state('default', style({
                transform: 'none'
            })),
            state('flipped', style({
                transform: 'rotateY(180deg)'
            })),
            transition('default => flipped', [
                animate('400ms')
            ]),
            transition('flipped => default', [
                animate('200ms')
            ])
        ])
    ]
})

export class CardComponent implements OnInit {
    @Input() index: string;
    @Output() currentPosition: EventEmitter<number> = new EventEmitter<number>();
    @Input() position: number;
    @Input() poke: Pokemon;

    cardName: string;
    //this is the name that defines what 3D model is returned.
    pokeName: string;
    errorHandled: number = 0;

    constructor(private dialog: MatDialog) {
    }

    ngOnInit() {
        this.cardName = 'Title ' + this.index;
        this.pokeName = this.poke.data.name;
    }

    get cardPosition() {
        return this.position;
    }

    //if the 3D model for the pokemon does not exist; we change the source to a static img.
    errHandler(error) {

        if (this.errorHandled == 1) {
            error.target.src = "https://www.pkparaiso.com/imagenes/xy/sprites/animados/" + this.pokeName + ".gif"
            this.errorHandled++;
        } else if (this.errorHandled == 0) {
            error.target.src = "https://www.pkparaiso.com/imagenes/ultra_sol_ultra_luna/sprites/animados-sinbordes-gigante/" + this.pokeName + ".gif"
            this.errorHandled++;
        } else if (this.errorHandled == 2) {
            error.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6at7RwZOM_yVpsUZWimO0o75bYbKAE1DaTg&usqp=CAU";
            this.errorHandled = 0;
        }
        //error.target.src = "https://www.pkparaiso.com/imagenes/xy/sprites/animados/" + this.pokeName + ".gif"
        //If the above fails I need to use the below url. but I don't know how to tell typescript the above also failed
        // "https://www.pkparaiso.com/imagenes/ultra_sol_ultra_luna/sprites/animados-sinbordes-gigante/" + this.pokeName + ".gif"
        // error.target.src = "https://www.pkparaiso.com/imagenes/xy/sprites/animados/" + this.pokeName + ".gif";
        // error.target.style = "height:auto; width: 40%; top: 3rem"
    }

    positionChange(position) {
        this.position = position;
        let positionsToMove = 0;

        switch (position) {
            case 1:
                positionsToMove = 1;
                break;
            case 4:
                positionsToMove = -2;
                break;
            case 0:
                positionsToMove = 2;
                break;
            case 3:
                positionsToMove = -1;
                break;
        }

        if (positionsToMove !== 0) {
            this.currentPosition.emit(positionsToMove);
        }
    }

    openTraining() {
        const dialogRef = this.dialog.open(TrainComponent, {
            data: {pokeName: this.pokeName}
        });
    }

    returnPokemon() {
        this.dialog.open(ReturnComponent, {
            data: {pokemon: this.poke}
        });
    }
}