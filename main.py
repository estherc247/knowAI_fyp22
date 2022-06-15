from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
import uvicorn
import logging
import shutil
import sys
import json

#import python scripts
import lime_preprocess as lp
import lime_text as lt
import objdetect as od
import clevrexp as ce

app = FastAPI(debug=True)

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#1. ------ OBJECT DETECTION

#Get image UploadFile
@app.post('/objectD/upload_img')
async def upload_img(img: UploadFile = File(...)):
    print("inside upload image")
    image = await img.read()
    od.run_main(image)
    return FileResponse(path="./public/images/objd_output/object_d.png", media_type="image/png", filename="object_d.png")


# Return Object Detection result negative image
@app.get("/objectD/imgoutput")
async def resultlimeimagenegative():
    print("inside get image")
    image_path = f"./public/images/objd_output/object_d.png"

    return FileResponse(path=image_path)



#2. ------ CLEVR DATA EXPLANATION

@app.post('/objectD/clevr_img/{no_instances}')
async def run_main(no_instances: int):
    ori_q, pred = ce.run_clevr(no_instances)

    details = {}
    sub_details = []
    details['Details'] = []

    for i in range(no_instances):
        sub_details.append({'questions': ori_q[i],
                            'predictions':pred[i],
                            'original image': 'images/clevr_img/image_original_'+str(i)+'.png',
                            'image explanation':'images/clevr_img/image_explanation_'+str(i)+'.png' })
    details['Details'].append(sub_details)

    with open(r"./public/images/clevr_img/clevr_response_file.txt", "w") as response_file:
        json.dump(details, response_file)
        print("Write Successful!")

    print(details)

    return details

# Return Clevr details
@app.get("/objectD/clevrdetails")
async def resultlime():
    print("inside details")
    with open(r"./public/images/clevr_img/clevr_response_file.txt", "r") as response_file:
        details = json.load(response_file)
    return details


#3. ------ IMAGE CLASSIFICATION

@app.post('/imageC/predict')
async def predict(img: UploadFile = File(...)):
    contents = await img.read()
    preds = lp.main(contents)
    response = {
    "image_name": img.filename,
    "prediction_results": [
            {
                "item_class_1": preds[0][0],
                "item_value_1": preds[0][1]
            },
            {
                "item_class_2": preds[1][0],
                "item_value_2": preds[1][1]
            },
            {
                "item_class_3": preds[2][0],
                "item_value_3": preds[2][1]
            },
            {
                "item_class_4": preds[3][0],
                "item_value_4": preds[3][1]
            },
            {
                "item_class_5": preds[4][0],
                "item_value_5": preds[4][1]
            }
        ]
    }
    with open(r"./public/images/lime_output_images/lime_response_file.txt", "w") as response_file:
        json.dump(response, response_file)
        print("Write Successful!")

    return [response, FileResponse(path="./public/images/lime_output_images/positive.jpg", media_type="image/jpg", filename="positive.jpg"),
            FileResponse(path="./public/images/lime_output_images/negative.jpg", media_type="image/jpg", filename="negative.jpg")]


# Return LIME predictions
@app.get("/imageC/resultlime")
async def resultlime():
    with open(r"./public/images/lime_output_images/lime_response_file.txt", "r") as response_file:
        response = json.load(response_file)
    return [response]

# Return LIME result positive image
@app.get("/imageC/resultlimeimagepositive")
async def resultlimeimagepositive():
    image_path = f"./public/images/lime_output_images/positive.jpg"

    return FileResponse(path=image_path)

# Return LIME result negative image
@app.get("/imageC/resultlimeimagenegative")
async def resultlimeimagenegative():
    image_path = f"./public/images/lime_output_images/negative.jpg"

    return FileResponse(path=image_path)


#4. ------ TEXT CLASSIFICATION

# Get text from user
@app.post('/textC/usertext')
async def get_text(user_text: str = Form(...)):
    print("enter usetext")
    if len(user_text) > 100:
        return {'ErrorMessage': 'Exceeded text length'}
    else:
        label = lt.main(user_text)
        return [label, FileResponse(path="./public/images/lime_output_images/lime_text.png", media_type="image/png", filename="lime_text.png")]

@app.get('/textC/resulttext')
async def result_text():
    print("enter resulttext")
    image_path = f"./public/images/lime_output_images/lime_text.png"

    return FileResponse(path=image_path)


if __name__ == '__main__':
    uvicorn.run(app, port=8000, host='localhost')
