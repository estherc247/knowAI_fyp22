#---IMPORTS 
from pathlib import Path
import os, sys
sys.path.append('..')
import torch
import numpy as np
from matplotlib.patches import Circle
#!pip install scikit-image
from skimage.transform import resize
import copy
import json
import matplotlib.pyplot as plt
from PIL import Image
import cv2
import datetime
import random
#%matplotlib inline
from IPython.display import clear_output
#!pip install ipywidgets
from ipywidgets import *

from backend.exp_clevr_gt_softmax.model.net import XNMNet
from backend.utils.generate_programs import generate_single_program, load_program_generator
from backend.utils.misc import convert_david_program_to_mine, invert_dict, todevice
from backend.exp_clevr_gt_softmax.DataLoader import ClevrDataLoader

device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(device)
print("Import completed")

#---- Load Model details

#Initialise parameters
ckpt = 'backend/exp_clevr_gt_softmax/checkpoint/model.pt' # checkpoint
input_dir = 'backend/exp_clevr_gt_softmax/preprocess/' # folder that contains your preprocessed question and feature files
val_question_pt = os.path.join(input_dir, 'generated/val_questions.pt') # val question file
val_scene_pt = os.path.join(input_dir, 'generated/val_scenes.pt') # val feature file
vocab_json = os.path.join(input_dir, 'generated/vocab.json') # vocab file
annotation_json = 'backend/exp_clevr_gt_softmax/preprocess/scenes/CLEVR_val_scenes.json' # CLEVR_val_scenes.json
image_dir = 'backend/val/' # folder that contains CLEVR val images
pretrained_dir = 'backend/pretrained/' # should contain david's program generator and vocab, don't change it

#Load questions 
val_loader_kwargs = {
    'question_pt': val_question_pt,
    'scene_pt': val_scene_pt,
    'vocab_json': vocab_json,
    'annotation_json': annotation_json,
    'batch_size': 1,
    'shuffle': False
}

#load parameters into ClevrDataLoader
val_loader = ClevrDataLoader(**val_loader_kwargs)
vocab = val_loader.vocab

#Load pretrained model
loaded = torch.load(ckpt, map_location={'cuda:0': 'cpu'})
model_kwargs = loaded['model_kwargs']
model_kwargs.update({'vocab': val_loader.vocab})
model = XNMNet(**model_kwargs).to(device)
model.load_state_dict(loaded['state_dict'])
model.eval()

#Load David Program 
program_generator = load_program_generator(os.path.join(pretrained_dir, 'program_generator.pt')).to(device)
david_vocab = json.load(open(os.path.join(pretrained_dir, 'david_vocab.json')))
david_vocab['program_idx_to_token'] = invert_dict(david_vocab['program_token_to_idx'])

#Process question
def question_to_str(question, vocab):
    question_str = ' '.join(list(filter(
        lambda x: x not in {'<NULL>','<START>','<END>'}, 
        [vocab['question_idx_to_token'][q.item()] for q in question.squeeze()]
    )))
    return question_str

#David program
def predict_david_program(questions, data):
    programs, program_inputs = [], []
    # generate program using david model for each question
    for i in range(questions.size(0)):
        question_str = []
        for j in range(questions.size(1)):
            word = data.vocab['question_idx_to_token'][questions[i,j].item()]
            if word == '<START>': continue
            if word == '<END>': break
            question_str.append(word)
        question_str = ' '.join(question_str) # question string
        david_program = generate_single_program(question_str, program_generator, david_vocab, device)
        david_program = [david_vocab['program_idx_to_token'][i.item()] for i in david_program.squeeze()]
        # convert david program to ours. return two index lists
        program, program_input = convert_david_program_to_mine(david_program, data.vocab)
        programs.append(program)
        program_inputs.append(program_input)
    # padding
    max_len = max(len(p) for p in programs)
    for i in range(len(programs)):
        while len(programs[i]) < max_len:
            programs[i].append(vocab['program_token_to_idx']['<NULL>'])
            program_inputs[i].append(vocab['question_token_to_idx']['<NULL>'])
    # to tensor
    programs = torch.LongTensor(programs).to(device)
    program_inputs = torch.LongTensor(program_inputs).to(device)
    return programs, program_inputs

#Image displaying functions
def draw_at_coords(count, ax, coords, attn, img, title, radius=10, target_size=360):
    h, w = img.shape[:2]
    coords = copy.deepcopy(coords)
    for i in range(len(coords)):
        coords[i] = coords[i][:2]
        coords[i][0] = coords[i][0] / w * target_size
        coords[i][1] = coords[i][1] / h * target_size
    attn = attn[:len(coords)]
    ax.imshow(resize(img, (target_size, target_size)))
    ax.axis('off')
    ax.set_title(title, fontsize=20)
    for coord, a in zip(coords, attn):
        a = min(max(a, 0), 1)
        patch = Circle(coord, radius, color=(1,1-a,1-a))
        ax.add_patch(patch)
    #save explanation as PNG file
    fig=ax.figure
    fig.savefig('public/images/clevr_img/image_explanation_'+str(count-1)+'.png')
    
def display_helper(ax, attn, title='', target_size=360):
    ax.imshow(resize(attn, (target_size, target_size)))
    ax.axis('off')
    ax.set_title(title, fontsize=20)
    

def input_score(prompt):
    while True:
        try:
            score = int(input(prompt))
        except (KeyboardInterrupt, SystemExit):
            raise
        except:
            print("Input must be integer")
            continue
        if score in {1,2,3,4}:
            break
        else:
            print("Input must be one of (1,2,3,4)")
    return score
        

def T(x, y, flag=True): # transpose or not
    return y, x

#-------------------------------------------------------------------------------

#Explanations are separated into a function to uncouple the code
def print_exp(count, img, intermediates, objects_coord, sz):
    # =============== split into branches ================
    branches = []
    branch = []
    intermediates.append(None)
    for i in range(len(intermediates)):
        if intermediates[i] is None:
            if branch:
                branches.append(branch)
            branch = []
        else:
            branch.append(intermediates[i])
    # ---------------------------------
    if len(branches) == 3:
        branches[1], branches[2] = branches[2], branches[1]
        leg_len = max(len(branches[0]), len(branches[2]))
        l = leg_len+len(branches[1])
        fig, axs = plt.subplots(*T(3, l), squeeze=False, figsize=T(sz*l, sz*3))
        for i in range(3):
            for j in range(len(branches[i])):
                title, attn = branches[i][j]
                c = leg_len+j if i==1 else leg_len-len(branches[i])+j
                draw_at_coords(count, axs[T(i, c)], objects_coord, attn, img, title)
            for j in range(l):
                if (i!=1 and leg_len-len(branches[i])<=j<leg_len) or\
                    (i==1 and leg_len<=j<leg_len+len(branches[i])):
                    continue
                axs[T(i,j)].remove()
    # ---------------------------------
    else:
        l = max(len(b) for b in branches)
        fig, axs = plt.subplots(*T(len(branches), l), squeeze=False, figsize=T(sz*l, sz*len(branches)))
        for i in range(len(branches)):
            for j in range(len(branches[i])):
                title, attn = branches[i][j]
                draw_at_coords(count, axs[T(i, l-len(branches[i])+j)], objects_coord, attn, img, title)
            for j in range(l-len(branches[i])):
                axs[T(i,j)].remove()
    # ======================================================

def run_clevr(no_instances):
    #scores = []
    print("debug")
    total = no_instances # how many instances will be visualized
    cnt = 0
    sz=3 # size of displayed images
    store_images = []
    store_q = []
    store_pred = []
    store_exp = []

    #user para
    img_idx = []
    game_score = 0 #10 questions max score = 100
    pred_diff = False
    

    for batch in val_loader.generator():
        clear_output()
        
        answers, questions, gt_programs, gt_program_inputs, *batch_input = [todevice(x, device) for x in batch]
        image_idx = val_loader.idx_cache[0]
        annotation = val_loader.orig_annotations[image_idx]
        objects_coord = [obj['pixel_coords'] for obj in annotation['objects']]
        image_file = os.path.join(image_dir, annotation['image_filename'])
        img = plt.imread(image_file)
        plt.imsave('public/images/clevr_img/image_original_'+str(cnt)+'.png', img)
        #store_images.append(image_file)
        programs, program_inputs = predict_david_program(questions, val_loader)
        predict_str, intermediates = model.forward_and_return_intermediates(programs, program_inputs, *batch_input)
        if not intermediates:
            continue
            
        cnt += 1

        #store questions
        store_q.append(question_to_str(questions, vocab))
        print("Question: %s" % (question_to_str(questions, vocab)))
        
        #store predictions
        store_pred.append(predict_str)
        
        print_exp(cnt, img, intermediates, objects_coord, sz)
        
        if cnt>total:
            return store_q, store_pred
