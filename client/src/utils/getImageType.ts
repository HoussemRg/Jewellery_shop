export default function getImageType(imageData: Uint8Array):string | undefined {
    const CHUNK_SIZE = 8192; // Define a chunk size to process the data

    let imageString = '';
    for (let i = 0; i < imageData.length; i += CHUNK_SIZE) {
        const chunk = imageData.slice(i, i + CHUNK_SIZE);
        imageString += String.fromCharCode(...chunk);
    }

    if (imageData[0] === 0x89 && imageData[1] === 0x50 && imageData[2] === 0x4e && imageData[3] === 0x47) {
        return(`data:image/png;base64,${btoa(imageString)}`);
        
    } else if (imageData[0] === 0xff && imageData[1] === 0xd8 && imageData[2] === 0xff) {
        return(`data:image/jpeg;base64,${btoa(imageString)}`);
        
    }
    return undefined;
}