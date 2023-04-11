import json
import random

# Definir listas de valores posibles para cada campo
partidos = ["UNE", "VAMOS", "FCN", "UNIONISTA", "VALOR"]
papeletas = ["Blanca", "Verde", "Rosada"]
departamentos = ["Guatemala", "Chimaltenango", "Suchitepequez", "Escuintla"]
municipios = {
    "Guatemala": ["Guatemala", "Mixco", "San Miguel Petapa", "Villa Nueva"],
    "Chimaltenango": ["Chimaltenango", "El Tejar", "San Andres Itzapa", "Patzicia"],
    "Suchitepequez": ["San Francisco Zapotitlan", "Chicacao", "San Antonio Suchitepequez"],
    "Escuintla": ["Siquinala", "Tiquisate"]
}

# Crear diccionario de ids de municipios
ids_municipios = {}
contador=1
for departamento, lista_municipios in municipios.items():
    for municipio in lista_municipios:
        ids_municipios[municipio] = contador
        contador+=1

# Definir función para generar un elemento aleatorio
def generar_elemento():
    departamento = random.choice(departamentos)
    municipio = random.choice(municipios[departamento])
    papeleta = random.choice(papeletas)
    partido = random.choice(partidos)
    sede = ids_municipios[municipio]  # Obtener id de municipio
    return {
        "sede": sede,
        "municipio": municipio,
        "departamento": departamento,
        "papeleta": papeleta,
        "partido": partido
    }

# Generar lista de 15 elementos aleatorios
elementos = [generar_elemento() for _ in range(100)]

# Escribir lista de elementos en archivo JSON
with open("ejemplo.json", "w") as archivo:
    json.dump(elementos, archivo)
