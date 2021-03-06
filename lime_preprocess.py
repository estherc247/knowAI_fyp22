#imports
import matplotlib.pyplot as plt
from PIL import Image
import torch.nn as nn
import numpy as np
import os, json
import io

import torch
from torchvision import models, transforms
from torch.autograd import Variable
import torch.nn.functional as F
from skimage.segmentation import mark_boundaries

#lime
import lime
from lime import lime_image

#define model
model = models.inception_v3(pretrained=True)

#Get user image
def get_image(img_path):
    img = Image.open(io.BytesIO(img_path))
    #img = Image.open(img_path)
    img = img.convert('RGB')
    return img

# resize and take the center part of image to what our model expects
def get_input_transform():
    transf = t= transforms.Compose([
        transforms.Resize(299),
        transforms.CenterCrop(299),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])

    return transf

def get_input_tensors(img):
    transf = get_input_transform()
    # unsqeeze converts single image to batch of 1
    return transf(img).unsqueeze(0)


idx2label, cls2label, cls2idx = [], {}, {}
with open(os.path.abspath('imagenet_class_index.json'), 'r') as read_file:
    class_idx = json.load(read_file)
    idx2label = [class_idx[str(k)][1] for k in range(len(class_idx))]
    cls2label = {class_idx[str(k)][0]: class_idx[str(k)][1] for k in range(len(class_idx))}
    cls2idx = {class_idx[str(k)][0]: k for k in range(len(class_idx))}


def get_pred(img_t):
    model.eval()
    logits = model(img_t)
    probs = F.softmax(logits, dim=1)
    probs5 = probs.topk(5)
    preds = tuple((p,c, idx2label[c]) for p, c in zip(probs5[0][0].detach().numpy(), probs5[1][0].detach().numpy()))
    return preds

#---------- Set up image for pytorch

def get_pil_transform():
    transf = transforms.Compose([
        transforms.Resize(299),
        transforms.CenterCrop(299),
    ])
    return transf

def get_preprocess_transform():
    normalize = transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                    std=[0.229, 0.224, 0.225])
    transf = transforms.Compose([
        transforms.ToTensor(),
        normalize
    ])
    return transf

pill_transf = get_pil_transform()
preprocess_transform = get_preprocess_transform()

#Change image to lime format
def batch_predict(images):
    model.eval()
    batch = torch.stack(tuple(preprocess_transform(i) for i in images), dim=0)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    batch = batch.to(device)

    logits = model(batch)
    probs = F.softmax(logits, dim=1)
    return probs.detach().cpu().numpy()

#---------- LIME ----------
def get_lime(img):
    print("--- Getting LIME explanations ---")
    explainer = lime_image.LimeImageExplainer()
    explanation = explainer.explain_instance(np.array(pill_transf(img)),
                                             batch_predict, # classification function
                                             top_labels=5,
                                             hide_color=0,
                                             num_samples=1000) # number of images that will be sent to classification function
    return explanation

def positive_contributions(explanation):
    temp, mask = explanation.get_image_and_mask(explanation.top_labels[0], positive_only=True, num_features=5, hide_rest=False)
    img_boundry1 = mark_boundaries(temp/255.0, mask)
    # Save image only
    plt.imsave("public/images/lime_output_images/positive.jpg", img_boundry1)

def negative_contributions(explanation):
    temp, mask = explanation.get_image_and_mask(explanation.top_labels[0], positive_only=False, num_features=10, hide_rest=False)
    img_boundry2 = mark_boundaries(temp/255.0, mask)
    # Save image only
    plt.imsave("public/images/lime_output_images/negative.jpg", img_boundry2)

def main(img_path):
    img = get_image(img_path)
    img_t = get_input_tensors(img)

    print("debug")
    preds = get_pred(img_t)
    #format results
    arr =[]
    result =[]
    for i in range(len(preds)):
        #category
        result.append(preds[i][2])
        #Probability
        result.append("{:.2f}".format(preds[i][0]*100))
        arr.append(result)
        result = []

    explanation = get_lime(img)

    positive_contributions(explanation)
    negative_contributions(explanation)

    return arr
