import os
import joblib


def save_users_js_to_py():
    path_atual = os.path.abspath(os.path.dirname(__file__))
    if os.name == 'nt':  # Verifica se está no Windows
        path_atual = path_atual + "\\"
    else:
        path_atual = path_atual + "/"
    arq_nomes_js = path_atual + "nomes.txt"
    arq_nomes_python = path_atual + "names.txt"

    with open(arq_nomes_js, "r") as arquivo:
        conteudo = arquivo.read()
    nomes = conteudo.split(",")
    nomes = [nome.strip() for nome in nomes]

    if os.path.exists(arq_nomes_python):
        os.remove(arq_nomes_python)
    if os.path.exists(arq_nomes_js):
        os.remove(arq_nomes_js)

    joblib.dump(nomes, arq_nomes_python)

    def buscar_usuarios():
        names = joblib.load(arq_nomes_python)
        for name in names:
            if name != names[0]:
                print(name)
        return 0

    buscar_usuarios()


save_users_js_to_py()
