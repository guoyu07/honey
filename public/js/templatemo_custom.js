"use strict";

jQuery(document).ready(function($) {

	/************** Menu Content Opening *********************/
	$(".main_menu a, .responsive_menu a").click(function() {
		var id = $(this).attr('class');
		id = id.split('-');
		$("#menu-container .content").hide();
		$("#menu-container #menu-" + id[1]).addClass("animated fadeInDown").show();
		$("#menu-container .homepage").hide();
		$(".support").hide();
		$(".testimonials").hide();
		return false;
	});

	$(window).load(function() {
		$("#menu-container .products").hide();
	});

	$(".main_menu a.templatemo_home").addClass('active');

	$(".main_menu a.templatemo_home, .responsive_menu a.templatemo_home").click(function() {
		$("#menu-container .homepage").addClass("animated fadeInDown").show();
		$(this).addClass('active');
		$(".main_menu a.templatemo_page2, .responsive_menu a.templatemo_page2").removeClass('active');
		return false;
	});

	$(".main_menu a.templatemo_page2, .responsive_menu a.templatemo_page2").click(function() {
		$("#menu-container .upload").addClass("animated fadeInDown").show();
		$(this).addClass('active');
		$(".main_menu a.templatemo_home, .responsive_menu a.templatemo_home").removeClass('active');
		return false;
	});

	/************** Gallery Hover Effect *********************/
	$(".overlay").hide();

	$('.gallery-item').hover(
		function() {
			$(this).find('.overlay').addClass('animated fadeIn').show();
		},
		function() {
			$(this).find('.overlay').removeClass('animated fadeIn').hide();
		}
	);


	/************** LightBox *********************/
	$(function() {
		$('[data-rel="lightbox"]').lightbox();
	});


	$("a.menu-toggle-btn").click(function() {
		$(".responsive_menu").stop(true, true).slideToggle();
		return false;
	});

	$(".responsive_menu a").click(function() {
		$('.responsive_menu').hide();
	});

	/************** load more ********************/
	
});