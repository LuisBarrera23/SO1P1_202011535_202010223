import json
from random import randrange
from locust import HttpUser, between, task

class readFile():
    def __init__(self):
        self.data = []

    def getData(self): #Metodo donde se obtiene un elemento de la lista de registros
        size = len(self.data) #Tamaño de los datos
        if size > 0:
            index = randrange(0, size - 1) if size > 1 else 0
            return self.data.pop(index)
        else:
            print("size -> 0")
            return None
    
    def loadFile(self):
        print("LOADING ...")
        try:
            with open("datos.json", 'r') as file:
                self.data = json.loads(file.read())
        except Exception:
            print(f'Error : {Exception}')

class trafficData(HttpUser):
    wait_time = between(0.1, 0.9) #Tiempo de espera entre registros
    reader = readFile()
    reader.loadFile()
    endpoint_index = 0 # Variable de control para alternar entre endpoints

    def on_start(self):
        print("On Start")
    
    @task
    def sendMessage(self):
        data = self.reader.getData() #Registro obtenido de la lista
        if data is not None:
            if self.endpoint_index == 0:
                res = self.client.post("/grpc/agregarCaso", json=data)
                print(res)
                self.endpoint_index = 1
            else:
                res = self.client.post("/redis/agregarCaso", json=data)
                print(res)
                self.endpoint_index = 0
        else:
            print("Empty") #No hay mas datos por enviar
            self.stop(True)
