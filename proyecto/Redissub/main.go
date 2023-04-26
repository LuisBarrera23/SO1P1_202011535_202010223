package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/go-redis/redis/v8"
	_ "github.com/go-sql-driver/mysql"
)

type Data struct {
	Sede         int    `json:"sede"`
	Municipio    string `json:"municipio"`
	Departamento string `json:"departamento"`
	Papeleta     string `json:"papeleta"`
	Partido      string `json:"partido"`
}

func conectarBaseDeDatos() (conexion *sql.DB) {
	nombreContenedor := "base_datos"
	nombreDB := "db_so1"
	driver := "mysql"
	usuario := "root"
	contrasena := "1234"
	puerto := "3306"

	conexion, err := sql.Open(driver, usuario+":"+contrasena+"@tcp("+nombreContenedor+":"+puerto+")/"+nombreDB)
	if err != nil {
		panic(err.Error())
	}
	return conexion
}

func main() {
	rdb := redis.NewClient(&redis.Options{
		Addr: "rediscontenedor:6379",
	})

	ctx := context.Background()
	pubsub := rdb.Subscribe(ctx, "subir_votos")
	defer pubsub.Close()

	ch := pubsub.Channel()

	for msg := range ch {
		// fmt.Println(msg.Payload)
		var data Data
		err := json.Unmarshal([]byte(msg.Payload), &data)
		if err != nil {
			fmt.Printf("Error al decodificar mensaje: %v\n", err)
			continue
		}
		DBconexion := conectarBaseDeDatos()

		datalogs, err := DBconexion.Prepare("INSERT INTO Votos_data (sede, municipio, departamento, papeleta, partido) VALUES('" + strconv.Itoa(data.Sede) + "','" + data.Municipio + "','" + data.Departamento + "','" + data.Papeleta + "','" + data.Partido + "');")
		if err != nil {
			panic(err.Error())
		}
		datalogs.Exec()
		DBconexion.Close()

		fmt.Println("Mensaje recibido: %v \n", data)
	}
}
