import cv2
import numpy as np
from PIL import Image
from pathlib import Path
# Função que treina a IA para assimilar um rosto com uma das amostras
def FaceTrainer():
# Caminho para diretório de armazenamento de amostras
    path_atual = Path(__file__).resolve().parent
    dataset_path = path_atual.joinpath("dataset")
    cascade_path = path_atual.joinpath("haarcascade_frontalface_alt.xml")
    trainer_path = path_atual.joinpath("trainer")

    recognizer = cv2.face.LBPHFaceRecognizer_create()
    if not cascade_path.exists():
        print("O arquivo 'haarcascade_frontalface_alt.xml' não foi encontrado.")
        return
    detector = cv2.CascadeClassifier(str(cascade_path))

    # Função que pega as imagens e o endereço das imagens
    def getImagesAndLabels(path):
        imagePaths = list(path.glob("*"))     
        faceSamples=[]
        ids = []

        for imagePath in imagePaths:
            PIL_img = Image.open(imagePath).convert('L') # grayscale
            img_numpy = np.array(PIL_img,'uint8')
            id = int(imagePath.stem.split(".")[1])
            faces = detector.detectMultiScale(img_numpy)
            for (x,y,w,h) in faces:
                faceSamples.append(img_numpy[y:y+h,x:x+w])
                ids.append(id)
        return faceSamples,ids

    print ("\n Treinando Reconhecimento Facial. Espere...")
    faces,ids = getImagesAndLabels(dataset_path)
    recognizer.train(faces, np.array(ids))

    # Salva o modelo treinado como o arquivo abaixo
    trainer_file_path = trainer_path.joinpath("trainer.yml")
    recognizer.write(str(trainer_file_path)) 

    print("\n {0} Rostos Treinados. Saindo...".format(len(np.unique(ids))))

FaceTrainer()