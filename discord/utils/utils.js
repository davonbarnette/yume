export class BaseUtils {
    static pickRandomElement(array) {
        const randomIndex = Math.floor(Math.random() * array.length)
        return array[randomIndex]
    }

    static stringToMaxSize(string, maxSize) {
        let curString = string;
        if (string.length < maxSize) {
            let diff = maxSize - string.length;
            for (let i = 0; i < diff; i++) {
                curString += " ";
            }
        } else {
            curString = curString.slice(0, maxSize);
        }
        return curString;
    }

    static getRandom(arr, n) {
        let result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }

    static sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms)
        });
    }

    static numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    static nounToPlural(str, quantity, pluralOverride) {
        if (quantity === 1) {
            return str
        } else {
            if (pluralOverride) {
                return pluralOverride
            } else {
                return str + "s"
            }
        }
    }

    static counter(str) {
        let spar = str.split('')
        let cnt = {}
        spar.forEach(function (x) {
            cnt[x] = (cnt[x] || 0) + 1
        });
        return cnt
    }
}
