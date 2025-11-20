 
'use strict';

const app = angular.module('hotFinder', ['ngRoute'
                , 'ui.bootstrap'
                , "ui.grid"
                , "ui.grid.resizeColumns"
                , "ui.grid.moveColumns"
                , "ui.grid.exporter"
				, 'ui.grid.pagination'
				, 'ui.grid.selection'])

  .controller('IndexController', [
    '$scope',
    function($scope) {

      /*************************** DEFAULT INFO SETUP ***************************/
      const vm = this;

  	  let today = new Date();
  	  let year = today.getFullYear(); // 년도
  	  let month = today.getMonth() + 1; // 월 (0부터 시작하므로 1 더함)
  	  let day = today.getDate(); // 일

  	  const today_MMdd = String(month).padStart(2, '0') + String(day).padStart(2, '0');

      const USER_ID = 'gw' + today_MMdd;
      const USER_PW = 1203;

      /*************************** FUNCTION LIST ***************************/
      this.login = () => {

        const id = document.getElementById("id");
        const pw = document.getElementById("pw");

        if (String(id.value) === null || String(id.value).trim() === '') {
          alert("Please Enter ID");
          return;
        } else if (String(pw.value) === null || String(pw.value).trim() === '') {
          alert("Please Enter Password");
          return;
        } else if (String(id.value).toLowerCase() !== USER_ID || Number(pw.value) !== USER_PW) {

          alert("Login Failed");
          return;

        } else {
          location.href = "main.html";
        }
      };

    }
  ])















































































































