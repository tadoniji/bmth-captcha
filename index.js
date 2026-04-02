
// make the checkbox div focusable
const captchaCheckbox = document.getElementById("captcha-checkbox")
const checkboxSpinner = document.getElementById("captcha-checkbox-spinner")
const solveBox = document.getElementById("solve-box")
const captchaMainDiv = document.getElementById("captcha-main-div")
const captchaErrorMsg = document.getElementById("captcha-error-msg")
const solveImageErrorMsg = document.getElementById("solve-image-error-msg")
const solveImageContainer = document.getElementById("solve-image-main-container")

const imageCount = 28
const nonOliImages = [2, 4, 5, 6, 7, 8, 9, 11]
let isVerified = false
let errorCount = 0
let isLocked = false

captchaCheckbox.addEventListener("click",()=> {
    if (isVerified || isLocked) return
    
    checkboxSpinner.style.display = "block"
    captchaCheckbox.style.display = "none"
    
    setTimeout(()=>{
        captchaCheckbox.style.display = "block"
        checkboxSpinner.style.display = "none"

        if (solveBox.style.display == "block") {
            solveBox.style.display = "none"
        }
        else {
            solveBox.style.display = "block"
            initGrid() 
        }
    },Math.floor(Math.random()*600)+200)
})

document.getElementById("submit").addEventListener("click",()=>{
    if (isVerified) {
        window.location.href = "https://listen.tadoniji.fr";
        return
    }
    captchaMainDiv.classList.add("error")
    captchaErrorMsg.style.display = "block"
})

const refreshImage = (container, oldId) => {
    const image = container.querySelector("img")
    image.classList.add("fade-out")
    container.style.pointerEvents = "none"
    
    setTimeout(()=>{
        const newId = Math.floor(Math.random()*imageCount)+1
        image.setAttribute("src",`./images/img${newId}.jpg`)
        image.classList.remove("fade-out")
        container.style.pointerEvents = "auto"
        
        // Update the click listener with the new ID
        const newHandler = () => handleImageClick(container, newId)
        container.onclick = newHandler 
    },800)
}

const handleImageClick = (container, imageId) => {
    if (isVerified || isLocked) return

    const isOli = !nonOliImages.includes(imageId)

    if (isOli) {
        // Correct: it's Oli, so refresh/replace the image
        refreshImage(container, imageId)
        solveImageErrorMsg.style.display = "none"
    } else {
        // Wrong: it's not Oli
        errorCount++
        container.classList.add("error-shake")
        solveImageErrorMsg.innerText = `Erreur (${errorCount}/4). Ne cliquez pas sur cette image !`
        solveImageErrorMsg.style.display = "block"
        
        setTimeout(() => container.classList.remove("error-shake"), 300)

        if (errorCount >= 4) {
            failCaptcha()
        }
    }
}

const failCaptcha = () => {
    isLocked = true
    solveBox.style.display = "none"
    captchaCheckbox.innerHTML = '<div class="captcha-error-cross"><i class="fa-solid fa-xmark"></i></div>'
    captchaCheckbox.style.borderColor = "#d93025"
    
    setTimeout(() => {
        isLocked = false
        errorCount = 0
        captchaCheckbox.innerHTML = ""
        captchaCheckbox.style.borderColor = "rgb(193,193,193)"
        solveImageErrorMsg.style.display = "none"
    }, 3000)
}

const initGrid = () => {
    solveImageContainer.innerHTML = ""
    errorCount = 0
    let pool = []
    for(let i=1; i<=imageCount; i++) pool.push(i)
    pool.sort(() => Math.random() - 0.5)

    for (let i=0; i<9; i++) {
        const imageId = pool[i]
        const imageContainer = document.createElement("div")
        imageContainer.classList.add("solve-image-container")

        const image = document.createElement("img")
        image.setAttribute("src",`./images/img${imageId}.jpg`)
        image.classList.add("solve-image")
        
        imageContainer.onclick = () => handleImageClick(imageContainer, imageId)

        imageContainer.appendChild(image)
        solveImageContainer.appendChild(imageContainer)
    }
}

document.getElementById("verify").addEventListener("click",()=> {
    const images = solveImageContainer.querySelectorAll("img")
    let oliRemaining = false

    images.forEach(img => {
        const src = img.getAttribute("src")
        const id = parseInt(src.match(/img(\d+)\.jpg/)[1])
        if (!nonOliImages.includes(id)) {
            oliRemaining = true
        }
    })

    if (!oliRemaining) {
        isVerified = true
        solveBox.style.display = "none"
        captchaCheckbox.innerHTML = '<i class="fa-solid fa-check" style="color: #2c8a3c; font-size: 20px; display: flex; align-items: center; justify-content: center; height: 100%;"></i>'
        captchaCheckbox.style.border = "none"
        captchaCheckbox.style.cursor = "default"
        captchaMainDiv.classList.remove("error")
        captchaErrorMsg.style.display = "none"
    } else {
        solveImageErrorMsg.innerText = "Il reste encore des photos d'Oli Sykes !"
        solveImageErrorMsg.style.display = "block"
    }
})

document.getElementById("refresh").addEventListener("click", () => {
    initGrid()
})

document.getElementById("information").addEventListener("click",() =>{
    const information = document.getElementById("information-text")
    information.style.display = (information.style.display == "block") ? "none" : "block"
})

document.getElementById("audio").addEventListener("click",()=> {
    alert("Le défi audio n'est pas disponible !")
})
