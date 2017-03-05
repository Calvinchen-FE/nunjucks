'use strict';
var $ = require('jquery');
var dropdown = function(){
  $('#dropdownMenu1').on('click',function(){
	$('.dropdown-menu').toggle();
  })
};
module.exports = {
	dropdown : dropdown
};