/**
 * It is possible write four as a sum in exactly four different ways:
 *
 *  3 + 1
 *  2 + 2
 *  2 + 1 + 1
 *  1 + 1 + 1 + 1
 *
 * How many different distinct ways can the number 36 be written as a sum of at least two positive integers?
 * 
 * @param {number} n 
 * @returns result
 */
function partition(n) {
    let p = new Array(n + 1).fill(0);
    p[0] = 1;
    for (let i = 1; i <= n; i++) {
        for (let j = i; j <= n; j++) {
            p[j] += p[j - i];
        }
    }
    return p[n] - 1;
}
//works!!!

//---------------------------------------------------------------------------------------------------------






const encodedBinaryString = '0110001010000000100000000101000011000111001100001100011010100100';

// Function to calculate parity bit
const parityBit = (data, position) => {
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] === '1') {
      count++;
    }
  }
  return count % 2 === 0 ? '0' : '1';
}

// Function to check and correct the possible error
const checkAndCorrect = (data) => {
    let position = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] === '1' && (i+1 & (i+1) -1) !== i) {
        position += Math.pow(2, i);
      }
    }
  
    if (position === 0) {
      return data;
    } else {
      let newData = data.split('');
      newData[position - 1] = newData[position - 1] === '0' ? '1' : '0';
      return newData.join('');
    }
}



// Extract decimal value from fixed binary string
const extractDecimal = (data) => {
  let decimal = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] === '1') {
      decimal += Math.pow(2, data.length - i - 1);
    }
  }
  return decimal;
}

// Main function
const extractDecimalValue = (binaryString) => {
    let data = binaryString.slice(1);
    let parity = parityBit(binaryString, 0);
    if (parity !== binaryString[0]) {
      data = checkAndCorrect(data);
    }
    data = data.split("").reverse().join("")
    return extractDecimal(data);
}
  
//console.log(extractDecimalValue(encodedBinaryString).toString()) //result is wrong


////////////////////////////////////////////////////////////////////////////////
/*
Sanitize Parentheses in Expression <--- WORKS!!!!

Given the following string:

()()a)(a)a)((

remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal ways to validate the string, provide all of the possible results. The answer should be provided as an array of strings. If it is impossible to validate the string the result should be an array with only an empty string.

IMPORTANT: The string may contain letters, not just parentheses. Examples:
"()())()" -> [()()(), (())()]
"(a)())()" -> [(a)()(), (a())()]
")(" -> [""]
*/
function removeInvalidParentheses(s) {
    const results = new Set();
    const visited = new Set();
    const queue = [s];
    visited.add(s);

    let found = false;
    while (queue.length) {
        const current = queue.shift();
        if (isValid(current)) {
            results.add(current);
            found = true;
        }
        if (found) continue;
        for (let i = 0; i < current.length; i++) {
            if (current[i] !== '(' && current[i] !== ')') continue;
            const next = current.substring(0, i) + current.substring(i + 1);
            if (!visited.has(next)) {
                queue.push(next);
                visited.add(next);
            }
        }
    }

    return `[${Array.from(results).toString().replace (/,/g,", ")}]`;
}

function isValid(s) {
    let count = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') count++;
        if (s[i] === ')') count--;
        if (count < 0) return false;
    }
    return count === 0;
}
//console.log(removeInvalidParentheses("()()a)(a)a)((")); /// <----- works!!!




////////////////////////////////////////////////////////////////////////////////
//  NOT WORKING
function caesarCipher(plaintext, shift) {
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  for (let i = 0; i < plaintext.length; i++) {
    let char = plaintext[i];
    if (char === " ") {
      result += " ";
    } else {
      let index = alphabet.indexOf(char.toUpperCase());
      result += alphabet[mod((index-shift),alphabet.length)+1];
    }
  }
  return result;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

////////////////////////////////////////////////////////////////////////////////
//Encryption II: Vigenère Cipher -- WORKS!!!!!!
function vigenereCipher(plaintextKeyword) {
  const plaintext = plaintextKeyword[0].toUpperCase();
  const keyword = plaintextKeyword[1].toUpperCase();
  let ciphertext = "";
  
  for (let i = 0; i < plaintext.length; i++) {
    const plainCharCode = plaintext.charCodeAt(i) - 65; // A = 0, B = 1, ...
    const keywordCharCode = keyword.charCodeAt(i % keyword.length) - 65;
    const cipherCharCode = (plainCharCode + keywordCharCode) % 26;
    ciphertext += String.fromCharCode(cipherCharCode + 65);
  }
  
  return ciphertext;
}
//ns.tprint(vigenereCipher(["SHELLFLASHFRAMEPRINTMACRO", "DASHBOARD"]));



///////////////////////////////////////////////////////////////////////////////
//WORKS!!!!!!
function runLengthEncode(input) {
  let output = "";
  let currentChar = input[0];
  let currentCount = 1;

  for (let i = 1; i < input.length; i++) {
      if (input[i] === currentChar) {
          currentCount++;
      } else {
          if (currentCount > 9) {
              while (currentCount > 0) {
                  let count = currentCount > 9 ? 9 : currentCount;
                  output += count + currentChar;
                  currentCount -= count;
              }
          } else {
              output += currentCount + currentChar;
          }
          currentChar = input[i];
          currentCount = 1;
      }
  }
  if (currentCount > 9) {
      while (currentCount > 0) {
          let count = currentCount > 9 ? 9 : currentCount;
          output += count + currentChar;
          currentCount -= count;
      }
  } else {
      output += currentCount + currentChar;
  }

  return output;
}
//const input = "tttttttttttttt116666666666666EETTkDDKKZZMMzzcLLccccllhheeeeeeeeee2GGGGGGGGGi1s0000000000000";
//ns.tprint(runLengthEncode(input));





///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Subarray with Maximum Sum <------------ WORKS!!!
function maxSubArraySum(arr) {
  let maxSum = arr[0];
  let currentSum = arr[0];

  for (let i = 1; i < arr.length; i++) {
    currentSum = Math.max(arr[i], currentSum + arr[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}
//ns.tprint(maxSubArraySum([0, 0, 6, 10, 5, 4, -1, 3, -6, 3, 0, -8, 1, -9, -10, -3, 2, 5, 10, 6, 3, 3, -3, 7]));


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//WORKS!!!
function countWays(n) {
  let dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= n; i++) {
      for (let j = i; j <= n; j++) {
          dp[j] += dp[j - i];
      }
  }
  return dp[n] - 1;
}
//console.log(countWays(55));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Total Ways to Sum II <---- WORKS!!!
function countWays2(target, set, index) {
  if (target === 0) {
      return 1;
  }
  if (target < 0 || index >= set.length) {
      return 0;
  }
  let count = 0;
  for (let i = 0; i * set[index] <= target; i++) {
      count += countWays2(target - i * set[index], set, index + 1);
  }
  return count;
}

//const set = [1, 2, 3, 4, 5, 8, 9, 10, 12, 13, 16];
//const target = 29;
//console.log(countWays2(target, set, 0));



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Unique Paths in a Grid I <----- WORKS!!!!
function uniquePaths(grid) {
  let rows = grid[0];
  let cols = grid[1];
  let dp = new Array(rows + 1);
  for (let i = 0; i <= rows; i++) {
      dp[i] = new Array(cols + 1).fill(0);
  }
  dp[1][1] = 1;
  for (let i = 1; i <= rows; i++) {
      for (let j = 1; j <= cols; j++) {
          dp[i][j] += dp[i - 1][j] + dp[i][j - 1];
      }
  }
  return dp[rows][cols];
}
//console.log(uniquePaths([11, 10]));


//////-----------------------------------------------------------------------------------------------
// WORKS!!!
//chatGPT description of the code:
//This code calculates the maximum profit that can be made by buying and selling a stock at most "k" times,
//given an array "prices" representing the price of the stock on each day.
//The function uses a dynamic programming approach to solve the problem, where "dp" is a 2-dimensional array used to store intermediate results.
//If "k >= prices.length / 2", the function returns the maximum profit that can be made by performing unlimited transactions.

function maxProfit(k, prices) {
  if (prices.length === 0) return 0;
  if (k >= prices.length / 2) {
      let maxProfit = 0;
      for (let i = 1; i < prices.length; i++) {
          if (prices[i] > prices[i - 1]) {
              maxProfit += prices[i] - prices[i - 1];
          }
      }
      return maxProfit;
  }
  let dp = new Array(k + 1).fill(0).map(() => new Array(prices.length).fill(0));
  for (let i = 1; i <= k; i++) {
      let maxDiff = -prices[0];
      for (let j = 1; j < prices.length; j++) {
          dp[i][j] = Math.max(dp[i][j - 1], prices[j] + maxDiff);
          maxDiff = Math.max(maxDiff, dp[i - 1][j] - prices[j]);
      }
  }
  return dp[k][prices.length - 1];
}

//const [k, prices] = [10, [156,40,127,198,63,93,109,190,48]];
//ns.tprint(maxProfit(k, prices));


//-------------------------------------------------------------------------------------
//Algorithmic Stock Trader II //WORKS!! 
function maxProfit2(prices) {
  return maxProfit(prices.length, prices); //by setting "k" with the prices lenght, the function returns the maximum profit that can be made by performing unlimited transactions.
}




////////----------------------------------------------------------------------------------------
//Array Jumping Game
//WORKS!!
function canReachEnd(jumpLengths) {
  let maxReach = 0;
  let steps = 0;
  for (let i = 0; i < jumpLengths.length; i++) {
      if (i > maxReach) {
          return 0;
      }
      maxReach = Math.max(maxReach, i + jumpLengths[i]);
      if (maxReach >= jumpLengths.length - 1) {
          return 1;
      }
  }
  return 0;
}
//canReachEnd([4,0,0,0,8])
//console.log(canReachEnd([0,9,7,10,0,4,2,9,10]));


//---------------------------------------------------------------------------------------------
function hammingCode(value) {
  // Convert decimal to binary representation
  let binary = value.toString(2);
  
  // Pad binary representation with leading zeros if needed
  while (binary.length % 4 !== 0) {
    binary = '0' + binary;
  }
  
  // Reverse binary representation
  binary = binary.split('').reverse().join('');
  
  // Initialize result with empty string
  let result = '';
  
  // Calculate parity bits
  for (let i = 0; i < binary.length; i += 4) {
    let p1 = 0, p2 = 0, p3 = 0;
    
    for (let j = 0; j < 4; j++) {
      let bit = binary.charAt(i + j);
      if (j === 0 || j === 2) {
        p1 ^= Number(bit);
      }
      if (j === 1 || j === 3) {
        p2 ^= Number(bit);
      }
      p3 ^= Number(bit);
    }
    
    // Add parity bits to result
    result = p1 + result + p2 + result + p3 + result + binary.substr(i, 4);
  }
  
  // Calculate overall parity bit
  let overallParity = 0;
  for (let i = 0; i < result.length; i++) {
    overallParity ^= Number(result.charAt(i));
  }
  
  // Add overall parity bit to result
  result = overallParity + result;
  
  return result;
}

// Test with example value
//console.log(hammingCode(27396192));
// Output: '10101111011111000011101101000000'



//--------------------------------------------------------------------------------
//WORKS!!!
function mergeIntervals(intervals) {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  let result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    let current = intervals[i];
    let last = result[result.length - 1];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      result.push(current);
    }
  }
  return result;
}
/// ns.tprint(mergeIntervals([[5,9],[1,4],[14,15],[4,9],[17,19],[17,18],[6,10],[12,20],[17,18],[16,26],[16,17],[16,21],[23,27],[4,12],[11,13],[6,12]]));


//-------------------------------------------------------------------------------------
//Find All Valid Math Expressions <---- WORKS!!
const addOperators = (digits, target) => {
  const results = [];

  const dfs = (index, prev, curr, expression) => {
      if (index === digits.length) {
          if (curr === target) {
              results.push(expression);
          }
          return;
      }

      for (let i = index; i < digits.length; i++) {
          if (i !== index && digits[index] === '0') {
              break;
          }

          const num = parseInt(digits.substring(index, i + 1));

          if (index === 0) {
              dfs(i + 1, num, num, `${num}`);
          } else {
              dfs(i + 1, num, curr + num, `${expression}+${num}`);
              dfs(i + 1, -num, curr - num, `${expression}-${num}`);
              dfs(i + 1, prev * num, curr - prev + prev * num, `${expression}*${num}`);
          }
      }
  };

  dfs(0, 0, 0, '');

  return "["+results.toString().replace(/\"/g,"").replace(/,/g,", ")+"]";
};



//-------------------------------------------------------------------------------------
//Minimum Path Sum in a Triangle <--- WORKS!!
function minimumTotal(triangle) {
  const n = triangle.length;
  for (let i = n - 2; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      triangle[i][j] += Math.min(triangle[i + 1][j], triangle[i + 1][j + 1]);
    }
  }
  return triangle[0][0];
}








function getLogo1():string {
    let output:string = getLogoPoweredBy();
    output+=" ________  ___  ___  ________  _________  ________  ________  _________   \n";
    output+="|\\   ____\\|\\  \\|\\  \\|\\   __  \\|\\___   ___\\\\   ____\\|\\   __  \\|\\___   ___\\ \n";
    output+="\\ \\  \\___|\\ \\  \\\\\\  \\ \\  \\|\\  \\|___ \\  \\_\\ \\  \\___|\\ \\  \\|\\  \\|___ \\  \\_| \n";
    output+=" \\ \\  \\    \\ \\   __  \\ \\   __  \\   \\ \\  \\ \\ \\  \\  __\\ \\   ____\\   \\ \\  \\  \n";
    output+="  \\ \\  \\____\\ \\  \\ \\  \\ \\  \\ \\  \\   \\ \\  \\ \\ \\  \\|\\  \\ \\  \\___|    \\ \\  \\ \n";
    output+="   \\ \\_______\\ \\__\\ \\__\\ \\__\\ \\__\\   \\ \\__\\ \\ \\_______\\ \\__\\        \\ \\__\\\n";
    output+="    \\|_______|\\|__|\\|__|\\|__|\\|__|    \\|__|  \\|_______|\\|__|         \\|__|\n";
    output+="\n\n";
    return output;
}

function getLogo2():string {
  let output:string = getLogoPoweredBy();
  output+="   ██████╗██╗  ██╗ █████╗ ████████╗ ██████╗ ██████╗ ████████╗\n";
  output+="  ██╔════╝██║  ██║██╔══██╗╚══██╔══╝██╔════╝ ██╔══██╗╚══██╔══╝\n";
  output+="  ██║     ███████║███████║   ██║   ██║  ███╗██████╔╝   ██║   \n";
  output+="  ██║     ██╔══██║██╔══██║   ██║   ██║   ██║██╔═══╝    ██║   \n";
  output+="  ╚██████╗██║  ██║██║  ██║   ██║   ╚██████╔╝██║        ██║   \n";
  output+="   ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝        ╚═╝   \n";
  output+="\n\n";
  return output;
}

function getLogo3():string {
  let output:string = getLogoPoweredBy();
  output+="_________ .__            __     _____________________________\n";
  output+="\\_   ___ \\|  |__ _____ _/  |_  /  _____/\\______   \\__    ___/\n";
  output+="/    \\  \\/|  |  \\\\__  \\\\   __\\/   \\  ___ |     ___/ |    |   \n";
  output+="\\     \\___|   Y  \\/ __ \\|  |  \\    \\_\\  \\|    |     |    |   \n";
  output+=" \\______  /___|  (____  /__|   \\______  /|____|     |____|   \n";
  output+="        \\/     \\/     \\/              \\/                     \n";
  output+="\n\n";
  return output;
}

function getLogo4():string {
  let output:string = getLogoPoweredBy();
  output+="▄████████    ▄█    █▄       ▄████████     ███        ▄██████▄     ▄███████▄     ███     \n";
  output+="███    ███   ███    ███     ███    ███ ▀█████████▄   ███    ███   ███    ███ ▀█████████▄ \n";
  output+="███    █▀    ███    ███     ███    ███    ▀███▀▀██   ███    █▀    ███    ███    ▀███▀▀██ \n";
  output+="███         ▄███▄▄▄▄███▄▄   ███    ███     ███   ▀  ▄███          ███    ███     ███   ▀ \n";
  output+="███        ▀▀███▀▀▀▀███▀  ▀███████████     ███     ▀▀███ ████▄  ▀█████████▀      ███     \n";
  output+="███    █▄    ███    ███     ███    ███     ███       ███    ███   ███            ███     \n";
  output+="███    ███   ███    ███     ███    ███     ███       ███    ███   ███            ███     \n";
  output+="████████▀    ███    █▀      ███    █▀     ▄████▀     ████████▀   ▄████▀         ▄████▀   \n";
  output+="\n\n";
  return output;
}
                                                                                         
function getLogoPoweredBy():string {
  let output:string = "\n";
  output+="\t\t     ╰( ͡° ͜ʖ ͡°)つ──☆*:・ﾟ\n"
  output+="\t\t ..:: ☠️ Powered by ☠️ ::..\n";
  output+="\n";
  return output;
}



/** @param {NS} ns */
export async function main(ns) {
  //All these solutions are powered by chatGPT.
  let logos:(()=>string)[] = [getLogo1, getLogo2, getLogo3, getLogo4];
  ns.tprint(logos[((min, max)=> Math.floor(Math.random() * (max - min + 1) + min))(0,logos.length-1)]());
  //---------------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------


  ns.tprint(maxProfit2([151,34,77,76,118,145,5,172,18,152,134,199,92,137,164,86,167,188,27,163,31,88,182,36,160,154,51,88,132,89,150,110]));
}