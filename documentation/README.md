
# Documentation

## Firestore data structure
Collection: 'poi'
- Document: random id
    - Name: "Barry J Marshall"
    - Description: "Commonly known as the science library."
    - Location: [31.9830624 S, 115.8162723 E]
    - last_modified: date last modified
    - date_created: date created
    - imageList: array of download url of images
    - audioList: array of download url of audios
    - **Collection: 'files'**
        - Document: random id
            - Name: "Kookaburra"
            - Description: "A description"
            - url: 'download url'
            - filepath: 'filepath in firebase storage'
    
*More data structures can be found in the documentation file that allows name,description,other to the image/audio*

**Documentation file:**
https://docs.google.com/document/d/1KBm7-WoN9Ej_YCd167hBMFTxSYeOZo-kPdkqS3dOfWc/edit?usp=sharing
