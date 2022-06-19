// 'Status' means 8*8 array which is by default all zeros.
// Getting the indexes of elemnets that are equal to 1.
export const getActiveIndexes = (status) => {
    // combine all elements into one array
    let allStatus = []
    status.forEach(row => {
        row.forEach(item => {
            allStatus.push(item)
        })
    })

    // Get the index of elements that are equal to 1
    // So we know the index of active cell
    let indexes = []
    for(let i = 0; i < allStatus.length; i++){
      if(allStatus[i] === 1){
        allStatus.indexOf(i)
        indexes.push(i)
      }
    }
    return indexes
}

// Generate 8*8 array with zeros and replace active indexes with 1
export const getStatusFromIndexes = (activeIndexes) => {

    // defaultStatus means all elements are zero. (empty cells 8*8)
    let defaultStatus = [];
    for(let j = 0; j < 64; j++){
        defaultStatus.push(0)
    }
    
    // Replace active indexes with number 1
    activeIndexes.forEach(index => defaultStatus.splice(index, 1, 1))


    // Convert defaultStatus into 8*8 array
    let updatedArray = []
    for(let x = 0; x < 8; x++){
        updatedArray.push(...[defaultStatus.slice(x * 8, (8*x) + 8)])
    }
    return updatedArray
}

// Get mouse position in canvas
export const getMousePosition = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }

}