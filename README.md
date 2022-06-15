# KnowAI
KnowAI is an educational web interface aimed to enlighten individuals on the need of trustworthy AI by providing them with an opportunity to try interactive tutorials. The website mainly focuses on explaining image and text classification models with the help of Local Interpretable Model-Agnostic Explanations (LIME) an Explainable AI algorithm.

### Setup
-------

#### Frontend

`npm install`

1. Clone the repository
2. Navigate to the cloned repository folder in terminal.
3. Run 'npm install' in terminal (node_modules folder is created)

`npm start`
- To start the React App run 'npm start'.

#### Backend

1. Download the zipped folder containing backend codes (3.5GB) from this [link](https://drive.google.com/drive/folders/1JV3CmWSfJdhXxUFju_Up5qUm3F2a48B5?usp=sharing).
2. Place the backend folder into the cloned repository folder.

```
knowAI_fyp22
└───backend
└───node_modules
└───public
│   └───fonts
|   └───images
└───src
```

### Run
-------

1. Open 2 tabs of terminals (navigated to the project folder).
2. Run the codes below in the 2 terminals respectively.
```
npm start
```
```
uvicorn main:app --reload --host localhost
```
3. Wait for the website to load as shown in the image below.
![img](/readme_images/frontpage.png)

4. All tutorials are available if folders are placed in the right order.

### Citations

1. Original Backend codes for Object Detection can be found [here](https://github.com/shijx12/XNM-Net) - eXplainable and eXplicit Neural Modules

2. Explainable AI packages explored
- [LIME](https://github.com/marcotcr/lime)
- [LRP](https://github.com/sebastian-lapuschkin/lrp_toolbox)
