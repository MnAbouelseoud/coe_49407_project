import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as $ from 'jquery';
import {New} from '../new/new';
import { Shop } from '../shop/shop';
import { URLSearchParams } from "@angular/http"



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  newPage = New;
  user:any;

  pass:any;


  constructor(public  navCtrl: NavController) {

    /*
    this.user = 'fdef';
    this.passw = '';

   // var index, login_page_html_contents = document.getElementById ('User Authentication Form').innerHTML, registration_page_html_contents = 'Username: <Input Type = "Text" ID = "Username">' + '<Br>' + 'Password: <Input Type = "Password" ID = "Password">' + '<Br>' + 'Repeat Password: <Input Type = "Password" ID = "Password_Repetition">' + '<Br>' + '<Input Type = "Button" ID = "Register" Value = "Register">' + '<Br>' + '<A HRef = "#Login_Link" Class = "Login_Link">Already have an account? Log In!</A>';
    console.log("hi");

    $(document).ready (function ()

    {


      $(document).on ('click', 'A.Registration_Link', function ()
      {
        document.title = 'Registration Page';
        /* document.getElementById ('User Authentication Form').innerHTML = "<h1>Hii</h1>";
      });
      $(document).on ('click', 'A.Login_Link', function ()
      {
        document.title = 'Login Page';
        //document.getElementById ('User Authentication Form').innerHTML = login_page_html_contents;
      });
      $(document).on ('click', '#Log_In', function ()
      {
        console.log($('.uu').val ());
        console.log("df" + this.HomePage);

        $.post ('http://localhost:8080/login', {Username: this.user, Password: this.pass}, function (data)
        {
          console.log(data);
          if(data == "../Mall%20Administrator%20Page"){
            this.navCtrl.push(Shop);
          }

        });
      });
      $(document).on ('click', '#Register', function ()
      {
        if ($('#Password').val () == $('#Password_Repetition').val ())
        {
          $.post ('../Register', {Username: $('#Username').val (), Password: $('#Password').val ()}, function (data)
          {
            window.location.href = data;
          });
        }
      });
    });


*/
  }


  login(){

    // let data = new URLSearchParams();
    // data.append('Username', this.user);
    // data.append('Password', this.pass});
    //
    // this.http
    //   .post('http://localhost:8080/login', data)
    //   .subscribe(data => {
    //     alert('ok');
    //   }, error => {
    //     console.log(error.json());
    //   });
    localStorage.setItem('user', this.user);
    console.log(this.user);
    console.log($('#passwordd').val ());
    var me = this;
    $.post ('http://localhost:8080/login', {Username: this.user, Password: this.pass}, function (data) {
      console.log(data);
      if(data !=null && data != ""){

        console.log("--->"+data);
        me.navCtrl.push(Shop);

      }

    });


  }




}
