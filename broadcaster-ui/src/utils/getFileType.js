
export default function getFileType(mimeType, language){
    if(images.includes(mimeType)){
        return language ? 'תמונה' : 'Picture';
    }else if(video.includes(mimeType)){
        return language ? 'סרטון' : 'Video';
    }else if(audio.includes(mimeType)){
        return language ? 'שמע' : 'Audio';
    }else if(documents.includes(mimeType)){
        return language ? 'מסמך' : 'Document';
    }else{
        return '-';
    }
}

const images = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/svg+xml',
    'image/gif',
    'image/vnd.microsoft.icon'
]

const video = [
    'video/mp4',
    'video/x-ms-wmv',
    'video/x-msvideo',
    'video/quicktime'
]

const audio = [
    'audio/x-wav',
    'audio/mpeg',
    'audio/mp4'
]

const documents = [
    'application/pdf'
]