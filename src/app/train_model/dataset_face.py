from pathlib import Path
import cv2
import os


def CadastrarRosto():
    path_atual = Path(__file__).resolve().parent
    dataset_path = path_atual.joinpath("dataset")
    cascade_path = path_atual.joinpath("haarcascade_frontalface_alt.xml")
    faces_raw_path = path_atual.joinpath("dataraw")
    if not cascade_path.exists():
        print("O arquivo 'haarcascade_frontalface_alt.xml' não foi encontrado.")
        return

    face_detector = cv2.CascadeClassifier(str(cascade_path))

    image_files = os.listdir(faces_raw_path)

    for image_file in image_files:
        image_path = faces_raw_path.joinpath(image_file) 
        # print(image_path)
        img = cv2.imread(str(image_path))
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_detector.detectMultiScale(gray, 1.3, 5)
        for (x,y,w,h) in faces:
            face_image_path = dataset_path.joinpath(image_file)
            cv2.imwrite(str(face_image_path), gray[y:y+h, x:x+w])

CadastrarRosto()
