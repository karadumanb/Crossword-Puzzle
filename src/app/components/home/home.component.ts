import { Component, OnInit } from '@angular/core';
import { MockService, Puzzle } from '../../services/mock-service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

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
  isMenuOpen: boolean = false;

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
        clue.addEventListener(e, (el) => {
          that.toggleClue(el);
        });
      });
      clue.addEventListener('click', (el) => {
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

          if(e.shiftKey === true) {
            nc = c - 1;
          } else {
            nc = c + 1;
          }

          if(nc === that.clues.length) {
            nc = 0;
          } else if(nc === -1) {
            nc = that.clues.length - 1;
          }

          that.editClue.bind(that.clues[nc])(cli, that, true);
          return;
        //break;
        case "Backspace":
          if(!that.state.clue) return;
          that.state.answers[that.state.clue + '-' + that.state.dir] = that.state.answers[that.state.clue + '-' + that.state.dir].substr(0, that.state.answers[that.state.clue + '-' + that.state.dir].length - 1);
          break;
        default:
          if(!that.state.clue) return;
          if(e.key.length > 1 || e.key === " ") return;
          if(that.state.answers[that.state.clue + '-' + that.state.dir].length < that.state.length) {
            that.state.answers[that.state.clue + '-' + that.state.dir] += e.key;
          } else {
            return;
          }
        break;
      }
      that.skipCursor(e.key, 0);

      that.getAllLetters(e.key);

    }, false);

    Array.from(document.querySelectorAll('ins[data-clue]')).map(function (el) {
      el.addEventListener('click', (el) => {
        that.selectClue(el);
      });
    });
  }

  selectClue(el) {
    let that = this;
    (function () {
      var c = parseInt(el.srcElement.getAttribute('data-clue'));
      var li = Array.from(document.querySelectorAll('li[data-clue="' + c + '"]'));
      if(li.length === 1) {
        that.editClue.bind(li[0])(el, that, true);
      } else {
        if(that.state.dir === "across") {
          that.editClue.bind(li[1])(el, that, true);
        } else {
          that.editClue.bind(li[0])(el, that, true);
        }
      }
    })();
  }
  editClue(elm, ths, isSelected) {
    if(this.isMenuOpen) {
      this.toggleMenu();
    }
    let that = ths;
    let trial = this;
    (function () {
      Array.from(document.querySelectorAll('.cursor,.editting,.current')).map(function (el) {
        return el.classList.remove("cursor", "editting", "current");
      });
      let c, l, d;
      if(isSelected) {
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
        if(d === "across") {
          that.index[s + x].classList.add("editting");
        } else {
          that.index[s + x * 12].classList.add("editting");
        }
      }

      that.state.index = s;
      that.state.clue = c;
      that.state.dir = d;
      that.state.length = l;
      if(that.state.answers[c + '-' + d] === undefined) {
        that.state.answers[c + '-' + d] = '';
        that.state.cursor = 0;
      } else {
        if(that.state.length === that.state.answers[c + '-' + d].length) {
          that.state.cursor = that.state.answers[c + '-' + d].length - 1;
        } else {
          that.state.cursor = that.state.answers[c + '-' + d].length;
        }
      }

      if(that.state.dir === "across") {
        that.index[s + that.state.cursor].classList.add("cursor");
      } else {
        that.index[s + that.state.cursor * 12].classList.add("cursor");
      }

      let currentEl = document.querySelector('li[data-clue="' + c + '"][data-dir="' + d + '"]');
      currentEl.classList.add("current");
      document.getElementById('current-question').innerHTML = currentEl['textContent'];
      that.skipCursor('', 0);
      that.getAllLetters('');
    })();
  }
  toggleClue(elm) {
    let that = this;
    (function () {
      var c = elm.srcElement.getAttribute("data-clue");
      var d = elm.srcElement.getAttribute("data-dir");
      var l = elm.srcElement.getAttribute("data-length");
      var s = that.index.indexOf(document.querySelector('ins[data-clue="' + c + '"]'));
      for (var x = 0; x < l; x++) {
        if(d === "across") {
          that.index[s + x].classList.toggle("highlight");
        } else {
          that.index[s + x * 12].classList.toggle("highlight");
        }
      }
    })();
  }
  getAttribute(str) {
    return str;
  }

  toggleMenu() {
    let el = document.getElementById('toggleMenu');
    if(el.style.left === '0px') {
      el.style.left = '100vh';
      this.isMenuOpen = false;
    } else {
      el.style.left = '0px';
      this.isMenuOpen = true;
    }
  }

  skipCursor(key, count) {
    count++;
      if(this.state.dir === "across") {
        this.index[this.state.index + this.state.cursor].classList.remove("cursor");
      } else {
        this.index[this.state.index + this.state.cursor * 12].classList.remove("cursor");
      }
      this.state.cursor = this.state.answers[this.state.clue + '-' + this.state.dir].length;
      if(this.state.cursor < 0) {
        this.state.cursor = 0;
      } else if(this.state.cursor > this.state.length - 1) {
        this.state.cursor = this.state.length - 1;
      }
      if(this.state.dir === "across") {
        this.index[this.state.index + this.state.cursor].classList.add("cursor");
      } else {
        this.index[this.state.index + this.state.cursor * 12].classList.add("cursor");
      }
    if(key ==='Backspace' || count > 8 || this.state.answers[this.state.clue + '-' + this.state.dir].length >= this.state.length) {
      //do nothing
      return;
    } else if(this.state.dir === "across") {
      if(this.index[this.state.index + this.state.cursor].textContent.length > 0) {
        this.state.answers[this.state.clue + '-' + this.state.dir] += this.index[this.state.index + this.state.cursor].textContent;
        return this.skipCursor(key, count);
      }
    } else if(this.state.dir === "down") {
      if(this.index[this.state.index + this.state.cursor * 12].textContent.length > 0) {
        this.state.answers[this.state.clue + '-' + this.state.dir] += this.index[this.state.index + this.state.cursor * 12].textContent;
        return this.skipCursor(key, count);
      }
    }
     else {
      return;
    }
  }

  getAllLetters(key) {
    for (var x = 0; x < this.state.length; x++) {
      let theValue = this.state.answers[this.state.clue + '-' + this.state.dir][x];
      if(theValue === undefined && key !== "Backspace" || this.state.cursor < x) {
        //do nothing
      } else {
        if(this.state.dir === "across") {
          this.index[this.state.index + x].textContent = this.state.answers[this.state.clue + '-' + this.state.dir][x];
        } else {
          this.index[this.state.index + x * 12].textContent = this.state.answers[this.state.clue + '-' + this.state.dir][x];
        }
      }
    }
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

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++) {
       items.push(i);
    }
    return items;
  }*/
}
