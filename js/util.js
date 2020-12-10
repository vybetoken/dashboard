function handleAmount(amount) {
	if (amount.indexOf(".") != -1) {
		return false;
	}
	for (var i = 0; i < 18; i++) {
		amount += "0";
	}
	return amount;
}

function formatAtomic(value, decimals) {
    if (value == "0x") {
        value = "0x0";
    }

    value = (ethers.BigNumber.from(value)).toString(10, 19);
    let left = "";
    while (value.length > 18) {
        left += value[0];
        value = value.substr(1);
    }
    value = value.substr(0, decimals);

    if (left.length == 0) {
        left = "0";
    }
    result = left;
    if (value.length != 0) {
        result += "." + value;
    }
    return result;
}

async function formatValue(value) {
	return currency(value, {
		separator: ','
	}).format().replace('$', '');
}

async function formatUSD(value) {
	return currency(value, {
		separator: ','
	}).format();
}

async function successAlert(text) {
    Toastify({
        text: text,
        gravity: "top",
        destination: `${contractData.explorer}/txsPending?a=${ethereum.selectedAddress}`,
        newWindow: true,
        position: "left",
        backgroundColor: "#fe7c96",
        duration: 3000
    }).showToast();
}

async function errorAlert(text) {
    Toastify({
        text: text,
        gravity: "top",
        position: "left",
        backgroundColor: "#fe7c96",
        duration: 3000
    }).showToast();
}

async function onlyNumbers(num){
   if ( /[^0-9]+/.test(num.value) ){
      num.value = num.value.replace(/[^0-9]*/g,"")
   }
}

async function isValidURL(string) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(string);
};
