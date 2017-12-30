/**
 * fsyms param can only be 300 characters long in the https://min-api.cryptocompare.com/data/pricemultifull end point:
 * fsyms param is invalid. (fsyms length is higher than maxlength: 300
 * This method will produce an two-dimensional array of coin lists.
 * Each array has a maximum length of 300 characters when using join(',').
 * @param {Array.<String>} coinList array of coins
 * @return {Array.<Array.<String>>} Two dimensional array [['ETH', 'BTC'], ['DASH', 'XRP']]
 */
module.exports = (coinList) => {
  const result = [];
  let paramArray = [];
  let paramArrayTest = [];

  coinList.forEach((value, index) => {
    // clone current paramArray
    paramArrayTest = paramArray.slice(0);
    paramArrayTest.push(value);

    if (paramArrayTest.join(',').length > 300) {
      // param will be to big!
      result.push(paramArray);
      paramArray = [];
    }

    paramArray.push(value);

    if (index === coinList.length - 1) {
      result.push(paramArray);
    }
  });

  return result;
};
