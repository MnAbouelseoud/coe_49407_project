import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import * as $ from 'jquery';


/**
 * Generated class for the Shop page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class Shop {

  constructor(public navCtrl: NavController, public navParams: NavParams) {



    $(document).ready(function () {
      var index;
      localStorage.getItem('user')
      $.get('http://localhost:8080/Get%20Name%20of%20the%20Shop?Shop%20Owner=' + localStorage.getItem('user').replace(' ', '+'), function (name_of_the_shop) {
        document.getElementById('Shop').innerHTML = name_of_the_shop;
        $.get('http://localhost:8080/Get%20Items?Shop=' + name_of_the_shop.replace(/ /g, '%20'), function (data) {
          console.log("--->" + data);
          var temp = $(document.getElementById('Shop')).text().replace(/ /g, '%20');
          for (index = 0; index < data.length; index = index + 1) {
            $(document.getElementById('Items')).append('<Option>' + data [index] ['Name'] + '</Option>');
          }
        });
      });

      $(document.getElementById('Item Addition Button')).on('click', function () {
        $.post('http://localhost:8080/Add%20an%20Item', {Name: $('#Name').val(), Shop: $('#Shop').text()});
        $(document.getElementById('Items')).append('<Option>' + $('#Name').val() + '</Option>');
      });

      $(document.getElementById('Items')).on('change', function () {

      });


      function Calculate_Sum(sum, rating) {
        return (sum + rating);
      }

      function Calculate_Average_Rating(ratings) {
        return ratings.reduce(Calculate_Sum) / ratings.length;
      }

      function Calculare_Median_Rating(ratings) {
        if (ratings.length == 0) {
          return 0;
        }
        else if (ratings.length % 2 == 0) {
          return (0.5 * (ratings.sort() [(ratings.length) / 2] + ratings.sort() [((ratings.length) / 2) - 1]));
        }
        else {
          return ratings.sort() [(ratings.length - 1) / 2]
        }
      }

      function Calculate_The_Difference_Between_A_Rating_And_An_Average_Rating(average_rating) {
        return function (rating) {
          return Math.pow(rating - average_rating, 2);
        };
      }

      function Calculate_Standard_Deviation(ratings) {
        ratings = ratings.map(Calculate_The_Difference_Between_A_Rating_And_An_Average_Rating(Calculate_Average_Rating(ratings)));
        return Math.sqrt(ratings.reduce(Calculate_Sum) / ratings.length);
      }


    });

  }
}
