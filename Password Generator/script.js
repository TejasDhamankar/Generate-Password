const inputSlider = document.querySelector("[data-lengthSlider]")

const lengthDisplay = document.querySelector("[data-lengthNumber]")

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider()

//ste strength circle color to grey

// set Password length
function handleSlider()
{
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;
    
    // to fill the background color in correspondense to slider thumb
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

// settiing indicator color
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

function getRndInteger(min, max) {
   return Math.floor( Math.random()*(max-min)) +min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123)) 
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol()
{
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);

}


function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8)
    {
      setIndicator("#0f0");
    } 

    else if ((hasLower || hasUpper) &&  (hasNum || hasSym) && passwordLength >= 60 ) 
    {
      setIndicator("#ff0");
    } 
    else
    {
      setIndicator("#f00");
    }
}

async function copyContent ()
{
    try
    {
        navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerHTML ="Copied"
    }
    catch(e)
    {
        copyMsg.innerHTML ="Failed"
    
    }

    // to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(function()
    {
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array)
{
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function handleCheckBoxChange()
{
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
    {
        copyContent();
    }
       
})

generateBtn.addEventListener("click",()=>
{

        if(checkCount <=0)
        {
            return;
        }

        if(passwordLength < checkCount )
         {
            passwordLength = checkCount;
            handleSlider();
         }

        //  let's start a new to find new password

        // when you click generate button remove old password

        password ="";

        // 
        // if(uppercaseCheck.checked)
        // {
        //     password += generateUpperCase();
        // }

        // if(lowercaseCheck.checked) 
        // {
        //     password += generateLowerCase();
        // }

        // if(numbersCheck.checked)
        // {
        //     password += generateRandomNumber();
        // }

        // if(symbolsCheck.checked) 
        // {
        //     password += generateSymbol();
        // }

        let funcArr =[];

        if(uppercaseCheck.checked)
        {
            funcArr.push(generateUpperCase);
        }

        if(lowercaseCheck.checked)
        {
            funcArr.push(generateLowerCase);
        }

        if(numbersCheck.checked)
        {
            funcArr.push(generateRandomNumber);
        }
    
        if(symbolsCheck.checked)
        {
            funcArr.push(generateSymbol);
        }

        //compulsory addition
        for(let i=0;i<funcArr.length;i++)
            {
                password += funcArr[i]();
            }   
            
            
        // remaining addition
        for(i=0;i< passwordLength-funcArr.length;i++)
            {
                let randIndex = getRndInteger(0,funcArr.length)
                password += funcArr[randIndex]();
            } 

        // shuffel the password
        password = shufflePassword(Array.from(password));

        // Display password on UI
        passwordDisplay.value =password;

        // calculate strength
        calcStrength();

        


});