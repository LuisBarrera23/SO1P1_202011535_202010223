package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/redis/go-redis/v9"
)

type Data struct {
	Sede         int    `json:"sede"`
	Municipio    string `json:"municipio"`
	Departamento string `json:"departamento"`
	Papeleta     string `json:"papeleta"`
	Partido      string `json:"partido"`
}

func main() {
	rdb := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	// Endpoint para almacenar los datos en Redis
	http.HandleFunc("/caso/agregarCaso", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			var data Data
			err := json.NewDecoder(r.Body).Decode(&data)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			message, err := json.Marshal(data)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// Almacenar en Redis
			if err := rdb.Publish(r.Context(), "subir_votos", message).Err(); err != nil {
				panic(err)
			}

			fmt.Println(string(message))

			// Agregar el JSON a la lista "last_five"
			err = rdb.LPush(r.Context(), "last_five", string(message)).Err()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// Mantener solo los últimos 5 elementos en la lista "last_five"
			err = rdb.LTrim(r.Context(), "last_five", 0, 4).Err()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// Incrementar el contador de sedes
			sede := data.Departamento + "_" + data.Municipio + "_" + strconv.Itoa(data.Sede)
			_, err = rdb.HIncrBy(r.Context(), "sede_counters", sede, 1).Result()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		} else {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/last_five", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			result, err := rdb.LRange(r.Context(), "last_five", 0, 4).Result()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(result)
		} else {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/sede_counters", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			// Obtener todos los contadores de sedes
			counters, err := rdb.HGetAll(r.Context(), "sede_counters").Result()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// Convertir los valores del hash a un JSON y enviar la respuesta
			response, err := json.Marshal(counters)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.Write(response)
		} else {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/delete", func(w http.ResponseWriter, r *http.Request) {
		_, err := rdb.FlushAll(r.Context()).Result()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		fmt.Fprintf(w, "All data deleted from Redis")
	})

	fmt.Println("Listening on :8082")
	http.ListenAndServe(":8082", nil)
}
