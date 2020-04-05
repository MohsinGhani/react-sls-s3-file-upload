const AWS = require('aws-sdk');
const s3 = new AWS.S3()
const Busboy = require('busboy');

const upload = (event, context) => {
    // console.info("event.body", JSON.stringify(event.body))
    return parser(event)
        .then((data) => {
            // console.log('parser then -> event.body.file', JSON.stringify(event.body.file))
            return uploadFile(data.body)
        })
        .then(() => {
            console.log('success')
            
            const response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    message: 'your file has been successfully uploaded'
                }),
            };

            return context.succeed(response)
        })
        .catch((error) => {
            console.log('error', JSON.stringify(error))
            return context.fail(error)
        })
}

const uploadFile = (file) => {
    const bucketName = "demo-bucket";
    const fileName = "example-file";
    // if you want to use user uploaded file name {file.filename} then you don't need to use getFileExtension method.
    const data = {
        Bucket: bucketName,
        Key: `${fileName + getFileExtension(file.contentType)}`,
        Body: file.file
    };
    return s3.putObject(data).promise()
};

const parser = (event) => new Promise((resolve, reject) => {
    const busboy = new Busboy({
        headers: {
            'content-type': getContentType(event)
        }
    });

    const result = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        file.on('data', data => {
            result.file = data;
        });

        file.on('end', () => {
            result.filename = filename;
            result.contentType = mimetype;
        });
    });

    busboy.on('field', (fieldname, value) => {

        result[fieldname] = value;
    });

    busboy.on('error', error => reject(error));
    busboy.on('finish', () => {
        event.body = result;
        resolve(event);
    });

    busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
    busboy.end();
});

const getContentType = (event) => {
    const contentType = event.headers['content-type']
    if (!contentType) {
        return event.headers['Content-Type'];
    }
    return contentType;
};

const getFileExtension = (type) => {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    switch (type) {
        case 'application/msword':
            return '.doc'

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return '.docx'

        case 'application/vnd.ms-powerpoint':
            return '.ppt'

        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return '.pptx'

        case 'application/vnd.ms-excel':
            return '.xls'

        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return '.xlsx'

        case 'image/gif':
            return '.gif'

        case 'image/jpeg':
            return '.jpeg'

        case 'image/jpg':
            return '.jpg'

        case 'image/png':
            return '.png'

        case 'image/svg+xml':
            return '.svg'

        case 'application/pdf':
            return '.pdf'

        case 'application/json':
            return '.json'

        case 'audio/mpeg':
            return '.mp3'

        case 'video/mpeg':
            return '.mpeg'

        case 'video/mp4':
            return '.mp4'

        case 'application/vnd.rar':
            return '.rar'

        case 'application/rtf':
            return '.rtf'

        case 'text/plain':
            return '.txt'

        case 'application/zip':
            return '.zip'
        default:
            return ''
    }
}

module.exports = { upload }