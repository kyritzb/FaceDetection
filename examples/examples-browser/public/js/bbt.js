//const classes = [ 'amy', 'bernadette', 'howard', 'leonard', 'penny', 'raj', 'sheldon', 'stuart']
const classes = ['bryan', 'adam', 'danny', 'nick', 'mark', 'fab', "quinn"]

function getFaceImageUri(className, idx) {
  let link = "https://raw.githubusercontent.com/kyritzb/FaceDetection/master/examples/images/"
  let yeah = link+className+"/"+className+idx+".png"
  return yeah
}

function renderFaceImageSelectList(selectListId, onChange, initialValue) {
  const indices = [1, 2, 3, 4, 5]
  function renderChildren(select) {
    classes.forEach(className => {
      const optgroup = document.createElement('optgroup')
      optgroup.label = className
      select.appendChild(optgroup)
      indices.forEach(imageIdx =>
        renderOption(
          optgroup,
          `${className} ${imageIdx}`,
          getFaceImageUri(className, imageIdx)
        )
      )
    })
  }

  renderSelectList(
    selectListId,
    onChange,
    getFaceImageUri(initialValue.className, initialValue.imageIdx),
    renderChildren
  )
}

// fetch first image of each class and compute their descriptors
async function createBbtFaceMatcher(numImagesForTraining = 1) {
  const maxAvailableImagesPerClass = 5
  numImagesForTraining = Math.min(numImagesForTraining, maxAvailableImagesPerClass)

  console.log("Training...")
  const labeledFaceDescriptors = await Promise.all(classes.map(
    async className => {
      const descriptors = []
      
      for (let i = 1; i < (numImagesForTraining + 1); i++) {
        const img = await faceapi.fetchImage(getFaceImageUri(className, i))
        console.log(getFaceImageUri(className, i))
        let detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptors.push(detection.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(
        className,
        descriptors
      )
    }
  ))

  return new faceapi.FaceMatcher(labeledFaceDescriptors)
}