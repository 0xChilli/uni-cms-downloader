const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js';
script.onload = function () {
    downloadFilesByWeek();
};
document.head.appendChild(script);

async function downloadFilesByWeek() {
    zip = new JSZip();
    const weeksDivs = document.getElementsByClassName("p-3");

    for (let i = 0; i < weeksDivs.length; i++) {
        const children = weeksDivs[i].children;
        const week = children[1].children[1].textContent;
        const contentCards = children[2].children;
        const weekFolder = zip.folder(weeksDivs.length - i + " - " + week);

        for (let j = 1; j < contentCards.length; j++) {
            const contentNameAndType = contentCards[j].children[0].children[0].textContent.substring(4);
            const downloadButton = contentCards[j].children[0].children[contentCards[j].children[0].children.length - 2].children[0].children[0];
            const hrefSplited = downloadButton.href.split(".")
            const fileName = contentNameAndType + "." + hrefSplited[hrefSplited.length-1];

            downloadButton.download = fileName;

            // Fetch content asynchronously and add it to the subfolder
            await fetch(downloadButton.href)
                .then(async function(response){
                    const obj = await response.blob();
		    return obj;
                })
                .then(async function(blob){
                    const file = await weekFolder.file(fileName, blob);
                });
            console.log(fileName);
        }
        
    }

    downloadZip(zip);
}

function downloadZip(zip) {
    zip.generateAsync({ type: 'blob' })
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = document.getElementById("ContentPlaceHolderright_ContentPlaceHoldercontent_LabelCourseName").textContent + " - " + document.getElementById("ContentPlaceHolderright_ContentPlaceHoldercontent_LabelseasonName").textContent + ".zip";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => console.error('Error generating zip file:', error));
}
