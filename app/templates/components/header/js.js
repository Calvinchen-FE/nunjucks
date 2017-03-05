'use strict';

var $ = require('jquery');
var header = function(){
  $('header').on('click',function(){
	alert('header');
  })
};
module.exports = {
	header : header
};