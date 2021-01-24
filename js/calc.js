const validateInputs = function() {
	let result = {success: true, errors: [], params: {}};

	let level = parseInt($('#lv-atk').val());
	if (isNaN(level) || level < 1 || level > 100) {
		result.success = false;
		result.errors.push("Level must be a number between 1 and 100!");
	} else {
		result.params.level = level;
	}

	let isSpecial = $('#special').html() === 'Yes';
	result.params.isSpecial = isSpecial;

	let attack = null;
	if (isSpecial) {
		attack = parseInt($('#satk-atk').val());
	} else {
		attack = parseInt($('#atk-atk').val());
	}
	if (isNaN(attack) || attack < 0) {
		result.success = false;
		result.errors.push("Attacking stat must be a positive number");
	} else {
		result.params.attack = attack;
	}

	let defense = null;
	if (isSpecial) {
		defense = parseInt($('#sdef-def').val());
	} else {
		defense = parseInt($('#def-def').val());
	}
	if (isNaN(defense) || defense < 0) {
		result.success = false;
		result.errors.push("Defending stat must be a positive number");
	} else {
		result.params.defense = defense;
	}

	let hp = parseInt($('#hp-def').val());
	result.params.hp = hp;

	let modifierAtk = parseInt($('#modifier-atk').html());
	result.params.modifierAtk = modifierAtk;

	let modifierDef = parseInt($('#modifier-def').html());
	result.params.modifierDef = modifierDef;

	let burned = $('#burned').html() === 'Yes';
	result.params.burned = burned;

	let reflect = $('#reflect').html() === 'Yes';
	result.params.reflect = reflect;

	let power = parseInt($('#power').val());
	if (isNaN(power) || power < 1) {
		result.success = false;
		result.errors.push("Base power must be a positive number");
	} else {
		result.params.power = power;
	}

	let type = parseFloat($('#type').html());
	result.params.type = type;

	let stab = ($('#stab').html() === 'Yes') ? 1.5 : 1;
	result.params.stab = stab;

	let weather = parseFloat($('#weather').html());
	result.params.weather = weather;

	let critical = ($('#critical').html() === 'Yes') ? 2 : 1;
	result.params.critical = critical;

	return result;
};

const renderErrors = function(errors) {
	$('#result').hide();
	let errorsText = '';
	errors.forEach((error)=>{
		errorsText += '<span>'+error+'</span><br>';
	});
	$('#errors').html(errorsText);
	$('#errors').show();
};

const doCalc = function() {
	let result = validateInputs();
	if (!result.success) return renderErrors(result.errors);
	$('#errors').hide();
	let params = result.params;
	if (params.critical===1 && params.burned) {
		params.attack = parseInt(params.attack/2);
	}
	if (params.critical===1 && params.reflect) {
		params.defense = parseInt(params.defense*2);
	}
	if (params.critical===1 && params.modifierAtk !== 0) {
		let mod = 100;
		if (params.modifierAtk > 0) {
			mod = 100 + (50*params.modifierAtk);
		} else {
			mod = [66, 50, 40, 33, 28, 25][Math.abs(params.modifierAtk)-1];
		}
		params.attack = parseInt(params.attack*mod/100);
	}
	if (params.critical===1 && params.modifierDef !== 0) {
		let mod = 100;
		if (params.modifierDef > 0) {
			mod = 100 + (50*params.modifierDef);
		} else {
			mod = [66, 50, 40, 33, 28, 25][Math.abs(params.modifierDef)-1];
		}
		params.defense = parseInt(params.defense*mod/100);
	}
	let ratio = params.attack/params.defense;
	let base = 2*params.level/5
	let damage = parseInt((base+2)*params.power*ratio/50)
	let modifier = params.weather*params.critical*params.stab*params.type;
	let final = parseInt((damage+2)*modifier);
	let range = [];
	for (let r = 217; r < 256; r++) {
		range.push(parseInt(final*r/255));
	}
	let text = '';
	let diagnostic = '';
	let rangeText = range[0]+' to '+range[range.length-1];
	if (!isNaN(params.hp) && params.hp > 0) {
		let min = (100*range[0]/params.hp).toFixed(2);
		let max = (100*range[range.length-1]/params.hp).toFixed(2);
		rangeText += ' ('+min+'% to '+max+'%)';
		let kos = 0;
		if (min >= 100) {
			diagnostic = 'Guaranteed OHKO';
		} else if (max >= 100) {
			kos = range.filter((r)=>r>=params.hp).length;
			diagnostic = 'OHKO range: '+kos+'/39 ('+(100*kos/39).toFixed(2)+'%)';
		} else if (min >= 50) {
			diagnostic = 'Guaranteed 2HKO';
		} else if (max >= 50) {
			kos = 0;
			range.forEach((value)=>{
				kos += range.filter((r)=>(r+value)>=params.hp).length;
			});
			diagnostic = '2HKO range: '+kos+'/1521 ('+(100*kos/1521).toFixed(2)+'%)';
		} else {
			diagnostic = 'Impossible to 2HKO';
		}
	}
	text += '<strong>Possible damage: '+rangeText+'</strong>';
	text += '<p>Spread: ['+range.join(', ')+']';
	if (diagnostic !== '') {
		text += '<br><strong>'+diagnostic+'</strong>';
	}
	$('#result').html(text);
	$('#result').show();
};
