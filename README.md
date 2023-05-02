# Proyecto 1 :pencil:

UNIVERSIDAD DE SAN CARLOS DE GUATEMALA  
FACULTAD DE INGENIERÍA  
ESCUELA DE CIENCIAS Y SISTEMAS    
SISTEMAS OPERATIVOS 1 - SECCIÓN N

**Autor: Esteban Humberto Valdez Ennati          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;        Carné: 202011535**

# gRPC

gRPC (gRPC Remote Procedure Call) es un sistema de llamadas a procedimientos remotos (RPC) de alta velocidad y eficiente desarrollado por Google. Se basa en Protocol Buffers (protobuf) como formato de serialización de datos y admite varios lenguajes de programación en esta caso fue desarrollado por medio de Node.js.

### gRPC Client

El cliente gRPC es responsable de establecer una conexión con el servidor gRPC y enviar solicitudes de llamada a procedimientos remotos (RPC) utilizando el protocolo de comunicación gRPC. Para realizar esto, el cliente gRPC debe conocer la definición de los servicios y los mensajes del servidor gRPC.

Esto se realizo por medio de una API la cual realiza la importacion del modulo gRPC_client que contiene la definición del cliente gRPC que se utilizará para enviar solicitudes al servidor gRPC.

Luego, en el endpoint `/grpc/agregarCaso`, se define una ruta POST que recibe datos de un caso mediante un objeto JSON en el cuerpo de la solicitud. Este objeto se envía al cliente gRPC, específicamente a la función addData(), que a su vez envía una solicitud al servidor gRPC para agregar el caso a un sistema de registro de casos.

Dentro de la definicion de gRPC_client se establece el camino del archivo de definición de Protocol Buffers que define el servicio gRPC que se utilizará. Este archivo se encuentra en la ruta `./proto/demo.proto`.

Luego, se utilizan las bibliotecas 

```
minimist 
@grpc/proto-loader
```
 para cargar el archivo de definición de Protocol Buffers y definir las opciones de carga, como mantener los nombres en minúsculas y manejar los valores de enumeración como cadenas. Estas opciones se utilizan para generar una definición de paquete que se cargará en el cliente gRPC.

### gRPC Server

Un servidor gRPC es un proceso que escucha las solicitudes de los clientes y proporciona una respuesta utilizando el protocolo de comunicación de gRPC. El servidor se puede implementar en una variedad de entornos, incluyendo contenedores Docker.

Utiliza un archivo de definición de Protocol Buffers para definir el servicio que se proporcionará a los clientes. Luego, el servidor agrega el servicio definido en el archivo de definición y se inicia en el puerto 50051. Una vez que el servidor está en ejecución, puede recibir solicitudes de clientes gRPC.

El servidor gRPC definido en este código tiene una función que maneja las solicitudes de los clientes. La función, llamada addData, toma un objeto de solicitud del cliente y lo usa para insertar datos en una base de datos MySQL. Cuando se completa la inserción de datos, la función devuelve una respuesta al cliente.


# Kubernetes 

Kubernetes es una plataforma de orquestación de contenedores de código abierto desarrollada por Google que se utiliza para automatizar y gestionar el despliegue, escala y gestión de aplicaciones en contenedores. Kubernetes ofrece un entorno para automatizar la implementación, el escalado y la gestión de aplicaciones en contenedores en múltiples nodos. Esto permite a los desarrolladores y administradores de sistemas implementar y administrar aplicaciones de manera eficiente y consistente en diferentes entornos, desde servidores locales hasta la nube pública.

Para ello se empezó con la creacion de un cluster con las siguientes especificaciones: 

Nombre del cluster: k8s-demo <br>
Numero de nodos(1): --num-nodes=1 <br>
Tipo de VM (2 CPUs, 8GB RAM): --machine-type=n1-standard-2 <br>
Nota: Requerimientos minimos 2 CPUs y 4GB RAM, y 3 nodos <br>
Networks rules (allin, allout): --tags=allin,allout <br>
Autenticacion con certificado: --enable-legacy-authorization --issue-client-certificate <br> 
Habilitar el escalado automatico (Minimo de nodos 1 y maximo 3): --enable-autoscaling --min-nodes=1 --max-nodes=3 <br>

Se creó aplicando el siguiente comando: 

```
gcloud container clusters create k8s-demo --num-nodes=1 --tags=allin,allout --enable-legacy-authorization --issue-client-certificate --preemptible --machine-type=n1-standard-2
```

Posteriormente obteniendo las credenciales para poder realizar la conexion se procedio a crear cada uno de los deployments.

## Namespace 
Un Namespace es una forma de agrupar y aislar recursos en un clúster de Kubernetes. Cada objeto en Kubernetes pertenece a un Namespace, a menos que se indique lo contrario.

La definicion de esta dentro del archivo `grpc.yml` contiene tres campos principales:

- apiVersion: especifica la versión de la API de Kubernetes que se utilizará para crear el objeto.
- kind: especifica el tipo de objeto que se creará. En este caso, es un Namespace.
- metadata: contiene información adicional sobre el objeto, como su nombre.

## Deployments 

Un Deployment es un objeto que proporciona declaraciones para definir el estado deseado de una aplicación en un clúster. Un Deployment se encarga de crear y actualizar los recursos necesarios (como los pods) para que la aplicación funcione correctamente en el clúster.

Para el proyecto se implementaron los siguientes: 

- __grpc__: se asigna al namespace "proyecto1-so1". El objeto tiene dos contenedores, "gclient" y "gserver", que se ejecutan en diferentes puertos. Cada uno de los contenedores usa la imagen respectiva subida a DockerHub y se definen las variables de entorno.

- __api__: se crea la API por la cual se obtienen los datos que recibe el frontend, es expuesta en el puerto 8080 y recibe la configurazion de Time Zone `America/Guatemala`.

- __db__: Se despliega la base de datos creada en Mysql a partir de la imagen `mysql:5.7`, a su vez se definen los valores como contraseñas y databases. Esportada en el puerto 3306 y crea sus volumenes.

- __redis__: El objeto tiene dos contenedores, "redispub" y "redissub" de los cuales unicamente se confirgura el puerto 8082 para redispub.

- __redisdb__: Se crea la base de datos de redis, a partir de la imagen `redis:alpine` y expuesta en el puerto 6379.


## Services 
 Es un objeto de recursos que se utiliza para proporcionar conectividad de red a una aplicación que se ejecuta en un clúster. En términos simples, un Service actúa como un balanceador de carga virtual que se encarga de enrutar el tráfico de red entre un conjunto de pods, que representan las instancias de una aplicación, y los clientes que solicitan el acceso a ellas.

 Dentro del proyecto se creo un service para cada uno de los contenedores, de tipo LoadBalancer y con los puertos que se querian exponer.

## Ingress 
Un Ingress es un recurso de Kubernetes que permite exponer servicios HTTP y HTTPS a través de reglas de enrutamiento. En este caso, este Ingress tiene cuatro reglas:

- La primera regla enruta cualquier solicitud que llegue a /redis a un servicio llamado "redis" en el puerto 8082, en esta unicamente se comprueba el correcto funcionamiento de redis.
- La segunda regla enruta cualquier solicitud que llegue a /redis/agregarCaso a ese mismo servicio "redis", por esta se añaden los datos a traves de redis.
- La tercera y cuarta regla enrutan las solicitudes a la raíz del sitio (/) y a /grpc/agregarCaso a un servicio llamado "grpc" en el puerto 7070, comprueban el funcionameinto de gRPC y la forma de agregarr los datos.

Cada regla también especifica el tipo de coincidencia de ruta (Exact o Prefix) y el puerto en el que se encuentra el servicio al que se debe enrutar la solicitud.

Este Ingress se ha definido en un namespace específico (proyecto1-so1), lo que significa que solo se aplicará a los recursos en ese namespace.


### Configuracion

Los archivos de configuracion .yaml fueron cargados uno a uno con el comando 
```
kubectl apply -f archivo.yaml.
```

 Una vez cargados los archivos se obtienen las ips por medio del siguiente comando: 

 ```
kubectl get services -n proyecto1-so1
 ```

 ### Base de Datos :file_folder:
La base de datos creada en uno de los pods dentro del cluster de kubernetes, contiene la database db_so1, en la que se se crea la tabla Votos_data que contiene los siguientes encabezados: 

| sede | municipio|departamento| papeleta | partido |
|----|-----|------|-----------|-----------|

y es creada por medio del sigueitne script: 

```
CREATE TABLE Votos_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sede INT NOT NULL,
    municipio VARCHAR(255) NOT NULL,
    departamento VARCHAR(255) NOT NULL,
    papeleta VARCHAR(255) NOT NULL,
    partido VARCHAR(255) NOT NULL
);
```

## Cloud Run
Cloud Run es un servicio de Google Cloud que permite ejecutar contenedores Docker de forma serverless y escalable, lo que significa que los contenedores se ejecutan solo cuando hay una solicitud y se detienen automáticamente cuando la solicitud se completa.

Para ello se realizaron los siguientes pasos: 

1. Hacer pull de la imagen creada a partir del frontend.

2. Tegear la imagen con el nombre `gcr.io/[PROJECT_ID]/[IMAGE_NAME]`.

3. Subir la imagen a Google Cloud Container Registry usando el comando `docker push`. Esto hará que la imagen esté disponible en la nube para que puedas usarla en Cloud Run.

4. Crear un nuevo servicio en Cloud Run a través de la interfaz de Google Cloud. Seleccionar la imagen subida y la configuracion de los puertos y permitir invocaciones para darle el acceso a todos los usuarios.


## Docker
La implementación del uso de Docker fue fundamental para la creación de cada una de las imágenes que conforman el sistema. En primer lugar, se crearon las imágenes de Redis, gRPC y la API que se encarga de la comunicación con el frontend. Para ello, se definieron los respectivos Dockerfiles, en los cuales se especificaron las instrucciones para la creación de cada imagen, incluyendo las dependencias necesarias y las configuraciones específicas de cada componente.

Además, se desarrolló una imagen para el frontend de React. Esta imagen fue posteriormente retageada para ser subida a Google Cloud Registry, lo que permitió su acceso y despliegue en la plataforma de Google Cloud.

Finalmente, todas las imágenes creadas, tanto para los componentes del backend como para el frontend, fueron subidas y gestionadas en la plataforma de Docker Hub permitiendo la descarga de los recursos en Google Cloud.



