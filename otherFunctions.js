/** this function deletes object value from array
 * @param arr, the array which contains the object
 * @param key, the name of key whose value we want to use when deleting the object
 * @param value, the key value which helps identify an object
 * @returns new updated arr
 */
function delObjInArr(arr,key,value){
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] === value) {
          arr.splice(i, 1);
          break;
        }
      }
      return arr;
}

module.exports = { delObjInArr }