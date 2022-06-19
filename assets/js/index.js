import {q, colRef} from "./firebase"
import { onSnapshot, addDoc, serverTimestamp } from "firebase/firestore"
import {getMousePosition, getActiveIndexes, getStatusFromIndexes } from "./utils"
const saveBtn = document.querySelector("#save")


// Initial rendering
const createEmptyCanvas = () => {
    document.querySelector(".convas-container").innerHTML = "";
    let activeIndexes = []
    const mainCanvas = createCanvas(activeIndexes, true)
    document.querySelector(".convas-container").appendChild(mainCanvas)
}

const createCanvas = (activeIndexes, isClickble = true) => {

    // Declaring variables, we need to use them later again.
    const CANVAS_WIDTH = 320;
    const CANVAS_HEIGHT = 320;
    const CELL_WIDTH = 40;
    const CELL_HEIGHT = 40;
    const CELL_BORDER_WIDTH = 1;
    const CELL_BORDER_COLOR = "#303F12";
    const CELL_BACKGROUND = "#1A0A26";
    const CELL_ACTIVE_BACKGROUND = "#15E1FF"

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    let generatedStatus = getStatusFromIndexes(activeIndexes)

    // Canvas size 
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const renderCells = (generatedStatus) => {
        // Looping to generate cells
        for(let x = 0; x < CANVAS_WIDTH / CELL_WIDTH; x++){
            for(let y = 0; y < CANVAS_HEIGHT / CELL_HEIGHT; y++){

                // Give border to each cell
                ctx.strokeStyle= CELL_BORDER_COLOR;
                ctx.lineWidth = CELL_BORDER_WIDTH;
                ctx.strokeRect(CELL_WIDTH*x, CELL_HEIGHT*y, CELL_WIDTH, CELL_HEIGHT)
        
                // if cell is 1, give active background
                if(generatedStatus[y][x] === 1){
                    ctx.fillStyle = CELL_ACTIVE_BACKGROUND
                }else{
                    ctx.fillStyle = CELL_BACKGROUND
                }
                // fill the cell
                ctx.fillRect(CELL_WIDTH*x, CELL_HEIGHT*y, CELL_WIDTH, CELL_HEIGHT)

            }
        }
        

    }

    renderCells(generatedStatus)


    const clickHandler = (event, generatedStatus) => {
        // Get mouse position
        const pos = getMousePosition(canvas, event)
    
        // Get position on canvas
        const posX = pos.x;
        const posY = pos.y
    
        // Calculate what cell is the target
        const xCellNumber = Math.floor(posX / CELL_WIDTH)
        const yCellNumber = Math.floor(posY / CELL_HEIGHT)
        
        // Border for cells
        ctx.strokeStyle= CELL_BORDER_COLOR;
        ctx.lineWidth = CELL_BORDER_WIDTH;
        ctx.strokeRect(xCellNumber * CELL_WIDTH, yCellNumber * CELL_HEIGHT, CELL_WIDTH,  CELL_HEIGHT)
    
        // update the status
        const updatedStatus = updateStatus(generatedStatus, xCellNumber, yCellNumber)
    
        // Render cells with given active indexes
        renderCells(updatedStatus)
    }
    const saveCanvas = () => {
        const input = document.querySelector("#emoji")
        if(input.value === ""){
            return alert("Type emoji name")
        }
        const activeIndexes = getActiveIndexes(generatedStatus)
        const emojiData = {
            cells: activeIndexes,
            name: input.value,
        }
        // save into firebase
        addDoc(colRef, {
            cells: emojiData.cells,
            name: emojiData.name,
            createdAt: serverTimestamp()
        })


        // Show empty canvas after adding
        let status = []
        const emptyStatusGenerated = getStatusFromIndexes(status)
        generatedStatus = emptyStatusGenerated
        renderCells(emptyStatusGenerated)
        document.querySelector("#emoji").value = "";


    }
    // Update status array (8*8), switch off and on the selected cell.
    const updateStatus = (generatedStatus, xCellNumber, yCellNumber) => {
        const statusRow = [...generatedStatus[yCellNumber]]
       statusRow[xCellNumber] = statusRow[xCellNumber] === 1 ? 0 : 1
       generatedStatus[yCellNumber] = statusRow
       return generatedStatus
   }
       // if canvas is clickble, add Eventlistener and click handler
       if(isClickble){
        canvas.onclick = (e) => clickHandler(e, generatedStatus)
        saveBtn.addEventListener("click", () => saveCanvas(generatedStatus))
    }
    
   return canvas  
}

// Renders as soon as data changes (real time) and loads on screen
onSnapshot(q, (snapsoht) => {
    let emojis = []
    snapsoht.docs.forEach(doc => {
        emojis.push({...doc.data(), id: doc.id})
    })

    // Load all saved emojis from database
    document.querySelector(".saved-canvas-container").innerHTML = ""
    emojis.reverse().forEach(emoji => {
        const canvas = createCanvas(emoji.cells, false)

        const div = document.createElement("div")
        div.className = "single-saved-canvas savedCanvas";
        
        const canvasTitle = document.createElement("div")
        canvasTitle.className = "single-saved-canvas__title"
        canvasTitle.innerText = emoji.name


        div.appendChild(canvas)
        div.appendChild(canvasTitle)

        document.querySelector(".saved-canvas-container").appendChild(div)

    })
})

// initial loading
createEmptyCanvas()

