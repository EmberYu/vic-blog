const arr = [2,4,5,6,1,3,7,0,9,8];
insertionSort(arr);
console.log(arr);
function insertionSort (arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && key > arr[j]) {
            arr[j + 1] = arr[j];
            arr[j] = key;
            j--;
        }
    }
}
