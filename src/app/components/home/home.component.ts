import { Component, OnInit } from '@angular/core';
import { MockService, Puzzle } from '../../services/mock-service';
declare var $:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  mockData: Array<Puzzle>=[];
  count: number = 0;

  constructor(public mock: MockService) { }

  ngOnInit() {
    this.mock.getPeople().subscribe(r=>{
      this.mockData = r;
    });
  }

  maximize() {
    this.count++;
    if(this.count>1){
      if(!$('#puzzle-container').hasClass('full-screen')){
        $('#puzzle-container').addClass('full-screen');
      } else {
        $('#puzzle-container').removeClass('full-screen');
      }
    }
    setTimeout(()=>{    
      this.count = 0;
    }, 1200);
  }
}
