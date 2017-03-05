'use strict';
var $ = require('jquery');
var footer = function(){
  $('footer').on('click',function(){
	alert('footer');
  })
};
module.exports = {
	footer : footer
};