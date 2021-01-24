const updateDropdown = function(event, targetId) {
	let selected = $(event.target).html();
	$('#'+targetId).html(selected);
}

$(document).ready(function(){
	$('.modifier-atk-drop a').click((event)=>updateDropdown(event, 'modifier-atk'));
	$('.modifier-def-drop a').click((event)=>updateDropdown(event, 'modifier-def'));
	$('.type-drop a').click((event)=>updateDropdown(event, 'type'));
	$('.stab-drop a').click((event)=>updateDropdown(event, 'stab'));
	$('.special-drop a').click((event)=>updateDropdown(event, 'special'));
	$('.weather-drop a').click((event)=>updateDropdown(event, 'weather'));
	$('.critical-drop a').click((event)=>updateDropdown(event, 'critical'));
	$('.burned-drop a').click((event)=>updateDropdown(event, 'burned'));
	$('.reflect-drop a').click((event)=>updateDropdown(event, 'reflect'));

	$('#beginCalc').click(doCalc);
});
