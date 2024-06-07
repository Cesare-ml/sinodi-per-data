import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import moment from 'moment-timezone';
moment.locale('it');

import sinodiSaturno from '../assets/json/sinodi-saturno.json';
import sinodiGiove from '../assets/json/sinodi-giove.json';
import sinodiMarte from '../assets/json/sinodi-marte.json';
import sinodiVenere from '../assets/json/sinodi-venere.json';
import sinodiMercurio from '../assets/json/sinodi-mercurio.json';

class Tempo {
  static addUtcOffs(dataora,hOffs) {
    var m = moment(dataora);
    m.add(hOffs,'hour');
    var s = m.format("YYYY-MM-DD HH:mm:ss");
    return s;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'sinodi-finder';

  dt;
  sinodoGiove;
  timezoneGuess;

  elCelestiOrdine = ["Saturno","Giove","Marte","Venere","Mercurio","Luna","nodo Sud","nodo Nord"];
  elCelesti = {
    "Saturno": {"db":sinodiSaturno,"sinodo":[]},
    "Giove": {"db":sinodiGiove,"sinodo":[]},
    "Marte": {"db":sinodiMarte,"sinodo":[]},
    "Venere": {"db":sinodiVenere,"sinodo":[]},
    "Mercurio": {"db":sinodiMercurio,"sinodo":[]},
    "Luna": {"db":undefined,"sinodo":[]},
    "nodo Sud": {"db":undefined,"sinodo":[]},
    "nodo Nord": {"db":undefined,"sinodo":[]}
  };

  ngOnInit() {
    this.timezoneGuess = moment.tz.guess();
    console.log(this.timezoneGuess);
    this.dt = moment().format('YYYY-MM-DD');
    this.onDataInputChange();
  }

  onDataInputChange() {
    var dataRef = this.dt;
    console.log(dataRef);

    for(var nomeElCeleste in this.elCelesti) {
      if(this.elCelesti[nomeElCeleste].db){
        var db = this.elCelesti[nomeElCeleste].db;
        var date = Object.keys(db);
        var dataSinodo;
        for(var i=0; i<date.length; i++) {
          if(
            i+1<date.length &&
            date[i]<dataRef && dataRef<date[i+1]
          ) {
            dataSinodo = date[i];
            break;
          }
        }

        if(dataSinodo) {
          var a = JSON.parse(JSON.stringify(db[dataSinodo]));
          a.unshift(dataSinodo);
          for(var i=0; i<a.length; i++) {
            //console.log(a[i]);
            /*
            console.log(
              a[i],
              moment.tz(a[i], 'YYYY-MM-DD HH:mm:ss', 'UTC').format('YYYY-MM-DD HH:mm:ss'),
              moment.utc(a[i]).tz(this.timezoneGuess).format('YYYY-MM-DD HH:mm:ss')
            );*/
            a[i] = moment.utc(a[i]).tz(this.timezoneGuess).format('D MMMM YYYY, H:mm:ss');
            //console.log(a[i]);
          }
          this.elCelesti[nomeElCeleste].sinodo = a;
          console.log(dataSinodo);
        } else {
          this.elCelesti[nomeElCeleste].sinodo = [];
        }
      }
    }
  }
}
