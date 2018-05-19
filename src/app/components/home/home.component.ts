import { Component, OnInit } from '@angular/core';
import { MockService, Puzzle } from '../../services/mock-service';
declare var $:any;
const letters = /^[A-Za-z]+$/;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  // mockData: Array<Puzzle>=[];
  // count: number = 0;
  // currentElementIndex:number;
  //question:HTMLElement = new HTMLElement;
  /*<div class="question" data-toggle="tooltip" data-placement="top" title="Lorem ipsum dolor sit, amet.">
            <p>Lorem ipsum dolor sit, amet.</p>
          </div> */

  state = {
    index: null,
    clue: null,
    cursor: 0,
    answers: {},
    count: 16,
    dir: null,
    length: null
  };
  index: any;
  clues: any;

  constructor(/*public mock: MockService*/) { }

  ngOnInit() {
    this.index = Array.from(document.querySelector('main').children);
    this.clues = Array.from(document.querySelectorAll('li[data-clue]'));
    // this.mock.getPeople().subscribe(r=>{
    //   this.mockData = r;
    // });

    // $(document).ready(function(){
    //   $('[data-toggle="tooltip"]').tooltip();   
    // });
    let that = this;
    this.clues.forEach(function (clue) {
      ['mouseover', 'mouseout'].map(function (e) {
        clue.addEventListener(e, (el)=>{
          that.toggleClue(el);
        });
      });
      clue.addEventListener('click', (el)=>{
        that.editClue(el, that, false);
      });
    });
    document.addEventListener('keydown', function (e) {
      e.preventDefault();
      switch (e.key) {
        case "Shift":
        case "Space":
        case "Enter":
          return;
        case "Tab":
          var cli = document.querySelector('li[data-clue="' + that.state.clue + '"][data-dir="' + that.state.dir + '"]');
          var c = that.clues.indexOf(cli);
          let nc;
    
          if (e.shiftKey === true) {
            nc = c - 1;
          } else {
            nc = c + 1;
          }
    
          if (nc === that.clues.length) {
            nc = 0;
          } else if (nc === -1) {
            nc = that.clues.length - 1;
          }
    
          that.editClue.bind(that.clues[nc])();
          return;
          //break;
        case "Backspace":
          if (!that.state.clue) return;
          that.state.answers[that.state.clue + '-' + that.state.dir] = that.state.answers[that.state.clue + '-' + that.state.dir].substr(0, that.state.answers[that.state.clue + '-' + that.state.dir].length - 1);
          break;
        default:
          if (!that.state.clue) return;
          if (e.key.length > 1) return;
          if (that.state.answers[that.state.clue + '-' + that.state.dir].length < that.state.length) {
            that.state.answers[that.state.clue + '-' + that.state.dir] += e.key;
          }
          break;
      }
    
      if (that.state.dir === "across") {
        that.index[that.state.index + that.state.cursor].classList.remove("cursor");
      } else {
        that.index[that.state.index + that.state.cursor * 12].classList.remove("cursor");
      }
      that.state.cursor = that.state.answers[that.state.clue + '-' + that.state.dir].length;
      if (that.state.cursor < 0) {
        that.state.cursor = 0;
      } else if (that.state.cursor > that.state.length - 1) {
        that.state.cursor = that.state.length - 1;
      }
      if (that.state.dir === "across") {
        that.index[that.state.index + that.state.cursor].classList.add("cursor");
      } else {
        that.index[that.state.index + that.state.cursor * 12].classList.add("cursor");
      }
    
      for (var x = 0; x < that.state.length; x++) {
        if (that.state.dir === "across") {
          that.index[that.state.index + x].textContent = that.state.answers[that.state.clue + '-' + that.state.dir][x];
        } else {
          that.index[that.state.index + x * 12].textContent = that.state.answers[that.state.clue + '-' + that.state.dir][x];
        }
      }
    
    }, false);

    Array.from(document.querySelectorAll('ins[data-clue]')).map(function (el) {
      el.addEventListener('click', (el)=>{
        that.selectClue(el);
      });
    });
  }

  selectClue(el) {
    let that = this;
    (function() {
      var c = parseInt(el.srcElement.getAttribute('data-clue'));
      var li = Array.from(document.querySelectorAll('li[data-clue="' + c + '"]'));
      if (li.length === 1) {
        that.editClue.bind(li[0])(el, that, true);
      } else {
        if (that.state.dir === "across") {
          that.editClue.bind(li[1])(el, that, true);
        } else {
          that.editClue.bind(li[0])(el, that, true);
        }
      }
    })();
  }
  editClue(elm, ths, isSelected) {
    let that = ths;
    let trial = this;
    (function() {
      Array.from(document.querySelectorAll('.cursor,.editting,.current')).map(function (el) {
        return el.classList.remove("cursor", "editting", "current");
      });
      let c, l, d;
      if(isSelected){ 
        c = parseInt(trial.getAttribute("data-clue"));
        l = parseInt(trial.getAttribute("data-length"));
        d = trial.getAttribute("data-dir");
      } else {
        c = parseInt(elm.srcElement.getAttribute("data-clue"));
        l = parseInt(elm.srcElement.getAttribute("data-length"));
        d = elm.srcElement.getAttribute("data-dir");
      }
      var s = that.index.indexOf(document.querySelector('ins[data-clue="' + c + '"]'));
      for (var x = 0; x < l; x++) {
        if (d === "across") {
          that.index[s + x].classList.add("editting");
        } else {
          that.index[s + x * 12].classList.add("editting");
        }
      }
    
      that.state.index = s;
      that.state.clue = c;
      that.state.dir = d;
      that.state.length = l;
      if (that.state.answers[c + '-' + d] === undefined) {
        that.state.answers[c + '-' + d] = '';
        that.state.cursor = 0;
      } else {
        if (that.state.length === that.state.answers[c + '-' + d].length) {
          that.state.cursor = that.state.answers[c + '-' + d].length - 1;
        } else {
          that.state.cursor = that.state.answers[c + '-' + d].length;
        }
      }
    
      if (that.state.dir === "across") {
        that.index[s + that.state.cursor].classList.add("cursor");
      } else {
        that.index[s + that.state.cursor * 12].classList.add("cursor");
      }
    
      document.querySelector('li[data-clue="' + c + '"][data-dir="' + d + '"]').classList.add("current");
    })();
  }
  toggleClue(elm) {
    let that = this;
    (function() {
      var c = elm.srcElement.getAttribute("data-clue");
      var d = elm.srcElement.getAttribute("data-dir");
      var l = elm.srcElement.getAttribute("data-length");
      var s = that.index.indexOf(document.querySelector('ins[data-clue="' + c + '"]'));
      for (var x = 0; x < l; x++) {
        if (d === "across") {
          that.index[s + x].classList.toggle("highlight");
        } else {
          that.index[s + x * 12].classList.toggle("highlight");
        }
      }
    })();
  }
  getAttribute(str){
    return str;
  }
  
  /*maximize() {
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

  autofocus($event) {
    if(letters.test($event.key) && $event.key.length === 1) {
      setTimeout(()=>{
        if($event.srcElement.nextElementSibling !== null){
          $event.srcElement.nextElementSibling.focus();
        }
        $event.srcElement.value = $event.srcElement.value.toUpperCase();
      }, 20);
    } else if($event.keyCode === 8 || $event.key === 'Backspace') {
      setTimeout(()=>{
        if($event.srcElement.previousElementSibling !== null){
          $event.srcElement.previousElementSibling.focus();
        }
      }, 20);
    }
    else {
      $event.preventDefault();
    }
  }

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++) {
       items.push(i);
    }
    return items;
  }*/
}
