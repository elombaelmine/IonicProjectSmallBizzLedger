import { NgStyle } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import  { IonButton, IonContent, IonFooter, IonicSlides, IonText, IonToolbar, } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonButton,IonContent, IonFooter, IonText, IonToolbar, RouterLink, NgStyle],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WelcomePage implements OnInit {

   images = [
    { image: '1.jpg'},
    { image: '3.jpg'},
    { image: '2.jpg'},
   ];
    swiperModules = [IonicSlides]
  constructor() { }

  ngOnInit() {
  }

}
