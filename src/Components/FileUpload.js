import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null)
    const handleFileUpload = (event) => {
        setSelectedFile(event.target.files);
    };
    const url = 'https://xxx.execute-api.us-east-1.amazonaws.com/dev/api/upload'
    const submitFile = (event) => {
        event.preventDefault();
        if (selectedFile && selectedFile[0]) {
            const formData = new FormData();
            formData.append('file', selectedFile[0]);

            axios
                .post(
                    url,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                )
                .then((response) => {
                    alert("your file has been successfully uploaded")
                })
                .catch((error) => {
                    console.log("Error in File uploading", error);
                    alert("Error in File uploading");
                });
        }

    };

    return (
        <div>
            <center>
                <h1>Upload binary files to S3 using React, AWS Lambda, and NodeJS</h1>
                <a
                    href="https://medium.com/@flpdniel/how-to-upload-binary-files-to-s3-using-react-aws-lambda-and-nodejs-2183c6a748d1"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="How to upload binary files to S3 using React, AWS Lambda, and NodeJS"
                >
                    medium article
                </a>
            </center>
            <form onSubmit={submitFile} style={{ width: '100%', maxWidth: '1080px', margin: '20px auto', background: '#eaeaea', padding: '50px', display: 'flex', justifyContent: 'center', borderRadius: '10px' }}>
                <input
                    label="Upload file"
                    type="file"
                    onChange={handleFileUpload}
                />
                <button type="submit">Upload</button>
            </form>
        </div>
    )
}

export default FileUpload;