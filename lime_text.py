import tqdm
import numpy as np
import matplotlib.pyplot as plt
import keras_metrics # for recall and precision metrics
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.layers import Embedding, LSTM, Dropout, Dense
from tensorflow.keras.models import Sequential
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import ModelCheckpoint, TensorBoard
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import load_model
import time
import numpy as np
import pickle

#LIME
import lime
from lime.lime_text import LimeTextExplainer
print("imports complete")

#Initialise paramameters
text_length = 100
tokenizer = Tokenizer()

# to convert labels to integers and vice-versa
label2int = {"ham": 0, "spam": 1}
int2label = {0: "ham", 1: "spam"}

#load model
text_model = load_model('backend/spam_model')

def get_predictions(text):
    if(type(text) is str):
        sequence = tokenizer.texts_to_sequences(text.split())
    else:
        sequence = tokenizer.texts_to_sequences(text)
    # pad the sequence
    sequence = pad_sequences(sequence, maxlen=text_length)
    # get the prediction
    prediction = text_model.predict(sequence)
    return prediction

def main(text):
    #input into lime
    explainer = LimeTextExplainer(class_names=['ham','spam'])
    exp = explainer.explain_instance(text, get_predictions, num_features=text_length, top_labels=1)

    #save label
    label_idx = exp.available_labels()[0]
    print(label_idx)
    label = int2label[label_idx]

    #save results
    exp.as_pyplot_figure(label=label_idx)
    plt.savefig('public/images/lime_output_images/lime_text.png')
